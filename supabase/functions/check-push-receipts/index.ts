import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";

const EXPO_RECEIPT_URL = "https://exp.host/--/api/v2/push/getReceipts";

type NotificationLog = {
  id: string;
  expo_ticket_ids: string[] | null;
  expo_ticket_token_map: Record<string, string> | null;
};

type ExpoReceipt = {
  status: "ok" | "error";
  message?: string;
  details?: { error?: string };
};

type ReceiptStatus = ExpoReceipt["status"] | "pending";

type TicketRef = {
  logId: string;
  ticketId: string;
};

const getEnv = (key: string) => {
  const value = Deno.env.get(key);
  if (!value) throw new Error(`${key} is required`);
  return value;
};

const getSupabaseServiceKey = () => {
  const legacyServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (legacyServiceRoleKey) return legacyServiceRoleKey;

  const secretKeys = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (!secretKeys) throw new Error("SUPABASE_SECRET_KEYS is required");

  const parsed = JSON.parse(secretKeys) as Record<string, string>;
  const defaultSecretKey = parsed.default;
  if (!defaultSecretKey) {
    throw new Error("SUPABASE_SECRET_KEYS.default is required");
  }

  return defaultSecretKey;
};

const authorize = (request: Request) => {
  const cronSecret = getEnv("CRON_SECRET");
  const schedulerSecret = request.headers.get("x-cron-secret");
  if (schedulerSecret) return schedulerSecret === cronSecret;

  return request.headers.get("authorization") === `Bearer ${cronSecret}`;
};

const chunk = <T>(items: T[], size: number) => {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
};

serve(async (request: Request) => {
  try {
    if (!authorize(request)) {
      return new Response("Unauthorized", { status: 401 });
    }

    const supabase = createClient(
      getEnv("SUPABASE_URL"),
      getSupabaseServiceKey(),
      { auth: { persistSession: false } },
    );

    const cutoff = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const { data: logs, error: logError } = await supabase
      .from("notification_logs")
      .select("id, expo_ticket_ids, expo_ticket_token_map")
      .eq("channel", "push")
      .not("expo_ticket_ids", "is", null)
      .is("expo_receipt_checked_at", null)
      .lte("created_at", cutoff)
      .order("created_at", { ascending: true })
      .limit(100);

    if (logError) throw logError;

    const invalidTokens = new Set<string>();
    const receiptsById = new Map<string, ExpoReceipt>();
    const ticketRefs: TicketRef[] = [];

    for (const log of (logs ?? []) as NotificationLog[]) {
      for (const ticketId of log.expo_ticket_ids ?? []) {
        ticketRefs.push({ logId: log.id, ticketId });
      }
    }

    for (const ticketChunk of chunk(ticketRefs, 100)) {
      const response = await fetch(EXPO_RECEIPT_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ids: ticketChunk.map(({ ticketId }) => ticketId),
        }),
      });

      if (!response.ok) {
        console.error("Expo receipt request failed", {
          status: response.status,
          ticketCount: ticketChunk.length,
        });
        continue;
      }

      const payload = (await response.json()) as {
        data?: Record<string, ExpoReceipt>;
      };
      for (const [ticketId, receipt] of Object.entries(payload.data ?? {})) {
        receiptsById.set(ticketId, receipt);
      }
    }

    let checkedLogs = 0;
    let stillPendingLogs = 0;

    for (const log of (logs ?? []) as NotificationLog[]) {
      const ids = log.expo_ticket_ids ?? [];
      if (ids.length === 0) continue;

      const statuses: ReceiptStatus[] = ids.map(
        (id) => receiptsById.get(id)?.status ?? "pending",
      );
      const errors: string[] = [];

      for (const id of ids) {
        const receipt = receiptsById.get(id);
        if (!receipt || receipt.status !== "error") continue;

        errors.push(receipt.message ?? receipt.details?.error ?? "error");
        if (receipt.details?.error === "DeviceNotRegistered") {
          const token = log.expo_ticket_token_map?.[id];
          if (token) invalidTokens.add(token);
        }
      }

      const finalStatus = statuses.includes("pending")
        ? "pending"
        : statuses.includes("error")
          ? "error"
          : "ok";

      if (finalStatus === "pending") {
        stillPendingLogs += 1;
        continue;
      }

      await supabase
        .from("notification_logs")
        .update({
          expo_receipt_status: finalStatus,
          expo_receipt_checked_at: new Date().toISOString(),
          expo_error: errors.length > 0 ? errors.join("\n") : null,
        })
        .eq("id", log.id);

      checkedLogs += 1;
    }

    if (invalidTokens.size > 0) {
      await supabase
        .from("devices")
        .update({ push_token: null, push_enabled: false })
        .in("push_token", [...invalidTokens]);
    }

    const summary = {
      ok: true,
      fetchedLogs: logs?.length ?? 0,
      pendingLogs: stillPendingLogs,
      checkedTickets: receiptsById.size,
      checkedLogs,
      invalidTokens: invalidTokens.size,
    };

    console.info("check-push-receipts summary", summary);

    return Response.json(summary);
  } catch (error) {
    console.error("check-push-receipts failed", error);

    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : error },
      { status: 500 },
    );
  }
});

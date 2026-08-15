import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
const MESSAGE_TRIGGER = "evening_reminder";
const MESSAGE_TYPE = "whale_message";
const PUSH_TYPE = "daily_reminder";
const MESSAGE_TITLE = "웨일던";
const MESSAGE_BODY =
  "오늘 하루도 얼마 남지 않았어요. 1분만 투자해서 습관을 지켜볼까요?";

type ReminderPolicy = "custom_time" | "fixed_21";

type ExpoTicket = {
  status: "ok" | "error";
  id?: string;
  message?: string;
  details?: { error?: string };
};

type ClaimedReminder = {
  notification_log_id: string;
  profile_id: string;
  local_date: string;
  local_time: string;
  push_tokens: string[] | null;
};

type PushMessage = {
  logId: string;
  token: string;
};

const CLAIM_RPC_BY_POLICY = {
  custom_time: "claim_due_push_reminders",
  fixed_21: "claim_fixed_21_push_reminders",
} as const satisfies Record<ReminderPolicy, string>;

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

    const requestBody = (await request.json().catch(() => ({}))) as {
      policy?: unknown;
    };
    const policy = requestBody.policy ?? "custom_time";
    if (policy !== "custom_time" && policy !== "fixed_21") {
      return Response.json(
        { ok: false, error: "Invalid reminder policy" },
        { status: 400 },
      );
    }

    const supabase = createClient(
      getEnv("SUPABASE_URL"),
      getSupabaseServiceKey(),
      { auth: { persistSession: false } },
    );

    const { data: claimedReminders, error: claimError } = await supabase.rpc(
      CLAIM_RPC_BY_POLICY[policy],
      {
        p_limit: 1000,
        p_message_type: MESSAGE_TYPE,
        p_message_trigger: MESSAGE_TRIGGER,
        p_message_body: MESSAGE_BODY,
      },
    );

    if (claimError) throw claimError;

    const reminders = (claimedReminders ?? []) as ClaimedReminder[];
    const deliveryState = new Map<
      string,
      {
        ticketIds: string[];
        ticketTokenMap: Record<string, string>;
        errors: string[];
      }
    >();
    const messages: PushMessage[] = [];

    for (const reminder of reminders) {
      deliveryState.set(reminder.notification_log_id, {
        ticketIds: [],
        ticketTokenMap: {},
        errors: [],
      });

      for (const token of new Set(reminder.push_tokens ?? [])) {
        messages.push({
          logId: reminder.notification_log_id,
          token,
        });
      }
    }

    let sentTokenCount = 0;
    const invalidTokens = new Set<string>();
    const allErrors: string[] = [];

    for (const messageChunk of chunk(messages, 100)) {
      const response = await fetch(EXPO_PUSH_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(
          messageChunk.map(({ token, logId }) => ({
            to: token,
            title: MESSAGE_TITLE,
            body: MESSAGE_BODY,
            sound: "default",
            channelId: "remind.v1",
            data: {
              trigger: MESSAGE_TRIGGER,
              push_type: PUSH_TYPE,
              push_id: logId,
            },
          })),
        ),
      });

      if (!response.ok) {
        const errorMessage = `Expo push request failed: ${response.status}`;
        allErrors.push(errorMessage);
        for (const message of messageChunk) {
          deliveryState.get(message.logId)?.errors.push(errorMessage);
        }
        continue;
      }

      const payload = (await response.json()) as { data?: ExpoTicket[] };
      if (!payload.data) {
        const errorMessage = "Expo push response missing data";
        allErrors.push(errorMessage);
        for (const message of messageChunk) {
          deliveryState.get(message.logId)?.errors.push(errorMessage);
        }
        continue;
      }

      payload.data.forEach((ticket, index) => {
        const message = messageChunk[index];
        const state = deliveryState.get(message.logId);
        if (!state) return;

        if (ticket.status === "ok" && ticket.id) {
          state.ticketIds.push(ticket.id);
          state.ticketTokenMap[ticket.id] = message.token;
          sentTokenCount += 1;
          return;
        }

        const errorMessage = ticket.message ?? "Expo push ticket failed";
        state.errors.push(errorMessage);
        allErrors.push(errorMessage);
        if (ticket.details?.error === "DeviceNotRegistered") {
          invalidTokens.add(message.token);
        }
      });
    }

    for (const [logId, state] of deliveryState.entries()) {
      const { error: updateError } = await supabase
        .from("notification_logs")
        .update({
          expo_ticket_ids:
            state.ticketIds.length > 0 ? state.ticketIds : null,
          expo_ticket_token_map:
            Object.keys(state.ticketTokenMap).length > 0
              ? state.ticketTokenMap
              : null,
          expo_error:
            state.errors.length > 0 ? state.errors.slice(-5).join("\n") : null,
        })
        .eq("id", logId);

      if (updateError) {
        console.error("Failed to update notification log", {
          logId,
          error: updateError,
        });
      }
    }

    if (invalidTokens.size > 0) {
      await supabase
        .from("devices")
        .update({ push_token: null, push_enabled: false })
        .in("push_token", [...invalidTokens]);
    }

    const summary = {
      ok: true,
      policy,
      claimedProfiles: reminders.length,
      queuedTokens: messages.length,
      sentTokens: sentTokenCount,
      invalidTokens: invalidTokens.size,
      errors: allErrors,
    };

    console.info("send-reminder-push summary", summary);

    return Response.json(summary);
  } catch (error) {
    console.error("send-reminder-push failed", error);

    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : error },
      { status: 500 },
    );
  }
});

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
const MESSAGE_TYPE = "debug";
const MESSAGE_TRIGGER = "qa_manual";
const MESSAGE_TITLE = "[테스트] 웨일던";
const MESSAGE_BODY = "푸시 알림 전송 테스트가 정상적으로 도착했어요.";
const COOLDOWN_MS = 10_000;

type ExpoTicket = {
  status: "ok" | "error";
  id?: string;
  message?: string;
  details?: { error?: string };
};

type RequestBody = {
  profileId?: unknown;
  deviceId?: unknown;
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

const respond = (body: Record<string, unknown>, status = 200) =>
  Response.json(body, { status });

const getAccessToken = (request: Request) => {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;
  return authorization.slice("Bearer ".length);
};

const parseRequestBody = async (request: Request) => {
  const body = (await request.json()) as RequestBody;
  if (
    typeof body.profileId !== "string" ||
    body.profileId.length === 0 ||
    typeof body.deviceId !== "string" ||
    body.deviceId.length === 0
  ) {
    return null;
  }

  return {
    profileId: body.profileId,
    deviceId: body.deviceId,
  };
};

serve(async (request: Request) => {
  if (request.method !== "POST") {
    return respond({ ok: false, error: "Method not allowed" }, 405);
  }

  try {
    const accessToken = getAccessToken(request);
    if (!accessToken) {
      return respond({ ok: false, error: "Unauthorized" }, 401);
    }

    const input = await parseRequestBody(request).catch(() => null);
    if (!input) {
      return respond({ ok: false, error: "Invalid request body" }, 400);
    }

    const supabase = createClient(
      getEnv("SUPABASE_URL"),
      getSupabaseServiceKey(),
      { auth: { persistSession: false } },
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      return respond({ ok: false, error: "Unauthorized" }, 401);
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", input.profileId)
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (profileError) throw profileError;
    if (!profile) {
      return respond({ ok: false, error: "Profile not found" }, 403);
    }

    const { data: device, error: deviceError } = await supabase
      .from("devices")
      .select("push_token, push_enabled, push_permission_status")
      .eq("profile_id", input.profileId)
      .eq("device_id", input.deviceId)
      .maybeSingle();

    if (deviceError) throw deviceError;
    if (!device) {
      return respond({ ok: false, error: "Device not found" }, 404);
    }
    if (
      !device.push_enabled ||
      device.push_permission_status !== "granted" ||
      !device.push_token
    ) {
      return respond({ ok: false, error: "Push is not available" }, 409);
    }

    const cooldownSince = new Date(Date.now() - COOLDOWN_MS).toISOString();
    const { data: recentLog, error: cooldownError } = await supabase
      .from("notification_logs")
      .select("id")
      .eq("profile_id", input.profileId)
      .eq("channel", "push")
      .eq("message_trigger", MESSAGE_TRIGGER)
      .gte("created_at", cooldownSince)
      .limit(1)
      .maybeSingle();

    if (cooldownError) throw cooldownError;
    if (recentLog) {
      return respond(
        { ok: false, error: "Please wait before sending another test push" },
        429,
      );
    }

    const sentAt = new Date().toISOString();
    const { data: log, error: logError } = await supabase
      .from("notification_logs")
      .insert({
        profile_id: input.profileId,
        channel: "push",
        type: MESSAGE_TYPE,
        message_trigger: MESSAGE_TRIGGER,
        message_body: MESSAGE_BODY,
        sent_at: sentAt,
      })
      .select("id")
      .single();

    if (logError) throw logError;

    const response = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        to: device.push_token,
        title: MESSAGE_TITLE,
        body: MESSAGE_BODY,
        sound: "default",
        channelId: "remind.v1",
        data: { trigger: MESSAGE_TRIGGER },
      }),
    });

    if (!response.ok) {
      const errorMessage = `Expo push request failed: ${response.status}`;
      await supabase
        .from("notification_logs")
        .update({ expo_error: errorMessage })
        .eq("id", log.id);
      return respond({ ok: false, error: errorMessage }, 502);
    }

    const payload = (await response.json()) as { data?: ExpoTicket };
    const ticket = payload.data;

    if (!ticket || ticket.status !== "ok" || !ticket.id) {
      const errorMessage =
        ticket?.message ?? ticket?.details?.error ?? "Expo push ticket failed";
      await supabase
        .from("notification_logs")
        .update({ expo_error: errorMessage })
        .eq("id", log.id);

      if (ticket?.details?.error === "DeviceNotRegistered") {
        await supabase
          .from("devices")
          .update({ push_token: null, push_enabled: false })
          .eq("profile_id", input.profileId)
          .eq("device_id", input.deviceId);
      }

      return respond({ ok: false, error: errorMessage }, 502);
    }

    const { error: updateError } = await supabase
      .from("notification_logs")
      .update({
        expo_ticket_ids: [ticket.id],
        expo_ticket_token_map: { [ticket.id]: device.push_token },
        expo_error: null,
      })
      .eq("id", log.id);

    if (updateError) throw updateError;

    return respond({
      ok: true,
      notificationLogId: log.id,
      ticketId: ticket.id,
      sentAt,
    });
  } catch (error) {
    console.error("send-test-push failed", error);
    return respond(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
});

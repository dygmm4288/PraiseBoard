import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
const MESSAGE_TRIGGER = "evening_reminder";
const MESSAGE_TYPE = "whale_message";
const MESSAGE_TITLE = "웨일던";
const MESSAGE_BODY =
  "오늘 하루도 얼마 남지 않았어요. 1분만 투자해서 습관을 지켜볼까요?";

type ProfileRow = {
  id: string;
  nickname: string | null;
  reminder_hour: number;
  reminder_minute: number;
  reminder_times: unknown;
  timezone: string;
};

type DeviceRow = {
  device_id: string;
  profile_id: string;
  push_token: string | null;
  profiles: ProfileRow | ProfileRow[] | null;
};

type ExpoTicket = {
  status: "ok" | "error";
  id?: string;
  message?: string;
  details?: { error?: string };
};

const getEnv = (key: string) => {
  const value = Deno.env.get(key);
  if (!value) throw new Error(`${key} is required`);
  return value;
};

const authorize = (request: Request) => {
  const cronSecret = getEnv("CRON_SECRET");
  return request.headers.get("authorization") === `Bearer ${cronSecret}`;
};

const getProfile = (row: DeviceRow): ProfileRow | null => {
  if (Array.isArray(row.profiles)) return row.profiles[0] ?? null;
  return row.profiles;
};

const getLocalTimeParts = (timeZone: string, now = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const value = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "00";

  return {
    localDate: `${value("year")}-${value("month")}-${value("day")}`,
    hour: Number(value("hour")),
    minute: Number(value("minute")),
  };
};

const isValidReminderTime = (
  value: unknown,
): value is { hour: number; minute: number } => {
  if (typeof value !== "object" || value === null) return false;

  const time = value as { hour?: unknown; minute?: unknown };
  if (typeof time.hour !== "number" || typeof time.minute !== "number") {
    return false;
  }

  return (
    Number.isInteger(time.hour) &&
    Number.isInteger(time.minute) &&
    time.hour >= 0 &&
    time.hour <= 23 &&
    time.minute >= 0 &&
    time.minute <= 59
  );
};

const getReminderTimes = (profile: ProfileRow) => {
  if (Array.isArray(profile.reminder_times)) {
    const times = profile.reminder_times.filter(isValidReminderTime);
    if (times.length > 0) return times;
  }

  return [{ hour: profile.reminder_hour, minute: profile.reminder_minute }];
};

const formatLocalTime = ({ hour, minute }: { hour: number; minute: number }) =>
  `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

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
      getEnv("SUPABASE_SERVICE_ROLE_KEY"),
      { auth: { persistSession: false } },
    );

    const { data: devices, error: deviceError } = await supabase
      .from("devices")
      .select(
        "device_id, profile_id, push_token, profiles!inner(id, nickname, reminder_hour, reminder_minute, reminder_times, timezone)",
      )
      .eq("push_enabled", true)
      .eq("push_permission_status", "granted")
      .not("push_token", "is", null)
      .limit(1000);

    if (deviceError) throw deviceError;

    const grouped = new Map<
      string,
      {
        profile: ProfileRow;
        localDate: string;
        localTime: string;
        tokens: string[];
      }
    >();

    for (const device of (devices ?? []) as DeviceRow[]) {
      const profile = getProfile(device);
      if (!profile || !device.push_token) continue;

      const localTime = getLocalTimeParts(profile.timezone);
      const matchedReminderTime = getReminderTimes(profile).find(
        (reminderTime) =>
          reminderTime.hour === localTime.hour &&
          reminderTime.minute === localTime.minute,
      );

      if (!matchedReminderTime) {
        continue;
      }

      const localTimeKey = formatLocalTime(matchedReminderTime);
      const groupKey = `${profile.id}:${localTime.localDate}:${localTimeKey}`;
      const existing = grouped.get(groupKey);
      if (existing) {
        existing.tokens.push(device.push_token);
      } else {
        grouped.set(groupKey, {
          profile,
          localDate: localTime.localDate,
          localTime: localTimeKey,
          tokens: [device.push_token],
        });
      }
    }

    let sentProfileCount = 0;
    let sentTokenCount = 0;
    const invalidTokens = new Set<string>();
    const errors: string[] = [];

    for (const { profile, localDate, localTime, tokens } of grouped.values()) {
      const { data: log, error: logError } = await supabase
        .from("notification_logs")
        .insert({
          profile_id: profile.id,
          channel: "push",
          type: MESSAGE_TYPE,
          message_trigger: MESSAGE_TRIGGER,
          message_body: MESSAGE_BODY,
          sent_local_date: localDate,
          sent_local_time: localTime,
        })
        .select("id")
        .single();

      if (logError) {
        if (logError.code === "23505") continue;
        throw logError;
      }

      const ticketIds: string[] = [];
      const ticketTokenMap: Record<string, string> = {};

      for (const tokenChunk of chunk([...new Set(tokens)], 100)) {
        const response = await fetch(EXPO_PUSH_URL, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(
            tokenChunk.map((token) => ({
              to: token,
              title: MESSAGE_TITLE,
              body: MESSAGE_BODY,
              sound: "default",
              channelId: "remind.v1",
              data: { trigger: MESSAGE_TRIGGER },
            })),
          ),
        });

        if (!response.ok) {
          errors.push(`Expo push request failed: ${response.status}`);
          continue;
        }

        const payload = (await response.json()) as { data?: ExpoTicket[] };
        payload.data?.forEach((ticket, index) => {
          const token = tokenChunk[index];
          if (ticket.status === "ok" && ticket.id) {
            ticketIds.push(ticket.id);
            ticketTokenMap[ticket.id] = token;
            sentTokenCount += 1;
            return;
          }

          errors.push(ticket.message ?? "Expo push ticket failed");
          if (ticket.details?.error === "DeviceNotRegistered") {
            invalidTokens.add(token);
          }
        });
      }

      await supabase
        .from("notification_logs")
        .update({
          expo_ticket_ids: ticketIds.length > 0 ? ticketIds : null,
          expo_ticket_token_map:
            Object.keys(ticketTokenMap).length > 0 ? ticketTokenMap : null,
          expo_error: errors.length > 0 ? errors.slice(-5).join("\n") : null,
        })
        .eq("id", log.id);

      sentProfileCount += 1;
    }

    if (invalidTokens.size > 0) {
      await supabase
        .from("devices")
        .update({ push_token: null, push_enabled: false })
        .in("push_token", [...invalidTokens]);
    }

    return Response.json({
      ok: true,
      matchedProfiles: grouped.size,
      sentProfiles: sentProfileCount,
      sentTokens: sentTokenCount,
      invalidTokens: invalidTokens.size,
      errors,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : error },
      { status: 500 },
    );
  }
});

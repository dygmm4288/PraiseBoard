


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE TYPE "public"."board_status" AS ENUM (
    'active',
    'completed'
);


ALTER TYPE "public"."board_status" OWNER TO "postgres";


CREATE TYPE "public"."mbti_type" AS ENUM (
    'INTJ',
    'INTP',
    'ENTJ',
    'ENTP',
    'INFJ',
    'INFP',
    'ENFJ',
    'ENFP',
    'ISTJ',
    'ISFJ',
    'ESTJ',
    'ESFJ',
    'ISTP',
    'ISFP',
    'ESTP',
    'ESFP'
);


ALTER TYPE "public"."mbti_type" OWNER TO "postgres";


CREATE TYPE "public"."sticker_source" AS ENUM (
    'app',
    'widget'
);


ALTER TYPE "public"."sticker_source" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."claim_device_push_token"("p_profile_id" "uuid", "p_device_id" "text", "p_push_token" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  if p_push_token is null or length(p_push_token) = 0 then
    return;
  end if;

  if not exists (
    select 1
    from public.devices d
    join public.profiles p on p.id = d.profile_id
    where d.profile_id = p_profile_id
      and d.device_id = p_device_id
      and p.auth_user_id = auth.uid()
  ) then
    raise exception 'profile_id and device_id are not owned by current user'
      using errcode = '42501';
  end if;

  update public.devices
  set push_token = null
  where push_token = p_push_token
    and not (profile_id = p_profile_id and device_id = p_device_id);
end;
$$;


ALTER FUNCTION "public"."claim_device_push_token"("p_profile_id" "uuid", "p_device_id" "text", "p_push_token" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."claim_due_push_reminders"("p_now" timestamp with time zone DEFAULT "now"(), "p_limit" integer DEFAULT 1000, "p_message_type" "text" DEFAULT 'whale_message'::"text", "p_message_trigger" "text" DEFAULT 'evening_reminder'::"text", "p_message_body" "text" DEFAULT '오늘 하루도 얼마 남지 않았어요. 1분만 투자해서 습관을 지켜볼까요?'::"text") RETURNS TABLE("notification_log_id" "uuid", "profile_id" "uuid", "local_date" "date", "local_time" "text", "push_tokens" "text"[])
    LANGUAGE "sql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $_$
  with eligible_devices as (
    select
      d.profile_id,
      d.push_token,
      p.reminder_times,
      (p_now at time zone p.timezone)::date as local_date,
      to_char(p_now at time zone p.timezone, 'HH24:MI') as local_time,
      extract(hour from p_now at time zone p.timezone)::integer as local_hour,
      extract(minute from p_now at time zone p.timezone)::integer as local_minute
    from public.devices d
    join public.profiles p on p.id = d.profile_id
    where d.push_enabled = true
      and d.push_permission_status = 'granted'
      and d.push_token is not null
  ),
  due_groups as (
    select
      e.profile_id,
      e.local_date,
      e.local_time,
      array_agg(distinct e.push_token) as push_tokens
    from eligible_devices e
    where exists (
      select 1
      from jsonb_array_elements(e.reminder_times) reminder_time(value)
      where jsonb_typeof(reminder_time.value) = 'object'
        and reminder_time.value ? 'hour'
        and reminder_time.value ? 'minute'
        and reminder_time.value->>'hour' ~ '^[0-9]+$'
        and reminder_time.value->>'minute' ~ '^[0-9]+$'
        and (reminder_time.value->>'hour')::integer = e.local_hour
        and (reminder_time.value->>'minute')::integer = e.local_minute
    )
    and not exists (
      select 1
      from public.notification_logs nl
      where nl.profile_id = e.profile_id
        and nl.type = p_message_type
        and nl.channel = 'push'
        and nl.message_trigger = p_message_trigger
        and nl.sent_local_date = e.local_date
        and nl.sent_local_time = e.local_time
    )
    group by e.profile_id, e.local_date, e.local_time
    order by e.local_date, e.local_time, e.profile_id
    limit p_limit
  ),
  inserted_logs as (
    insert into public.notification_logs (
      profile_id,
      channel,
      type,
      message_trigger,
      message_body,
      sent_local_date,
      sent_local_time
    )
    select
      profile_id,
      'push',
      p_message_type,
      p_message_trigger,
      p_message_body,
      local_date,
      local_time
    from due_groups
    on conflict (
      profile_id,
      type,
      channel,
      message_trigger,
      sent_local_date,
      sent_local_time
    )
    where channel = 'push'
      and sent_local_date is not null
      and sent_local_time is not null
    do nothing
    returning id, profile_id, sent_local_date, sent_local_time
  )
  select
    il.id,
    il.profile_id,
    il.sent_local_date,
    il.sent_local_time,
    dg.push_tokens
  from inserted_logs il
  join due_groups dg
    on dg.profile_id = il.profile_id
    and dg.local_date = il.sent_local_date
    and dg.local_time = il.sent_local_time;
$_$;


ALTER FUNCTION "public"."claim_due_push_reminders"("p_now" timestamp with time zone, "p_limit" integer, "p_message_type" "text", "p_message_trigger" "text", "p_message_body" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."collect_sticker"("p_board_id" "uuid", "p_source" "public"."sticker_source" DEFAULT 'app'::"public"."sticker_source") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
    v_profile_id uuid;
    v_limit_count int;
    v_current_count int;
    v_today date := (now() at time zone 'Asia/Seoul')::date;
begin
    select b.profile_id, b.limit_count
    into v_profile_id, v_limit_count
    from boards b
    join profiles p on p.id = b.profile_id
    where b.id = p_board_id
      and p.auth_user_id = auth.uid();

    if not found then
        if exists (select 1 from boards where id = p_board_id) then
            return jsonb_build_object(
                'success', false,
                'reason', 'FORBIDDEN'
            );
        end if;

        return jsonb_build_object(
            'success', false,
            'reason', 'BOARD_NOT_FOUND'
        );
    end if;

    insert into sticker_daily (board_id, d, count)
    values (p_board_id, v_today, 0)
    on conflict (board_id, d) do nothing;

    update sticker_daily
    set count = count + 1
    where board_id = p_board_id
      and d = v_today
      and count < v_limit_count
    returning count into v_current_count;

    if not found then
        select count
        into v_current_count
        from sticker_daily
        where board_id = p_board_id
          and d = v_today;

        return jsonb_build_object(
            'success', false,
            'reason', 'DAILY_LIMIT_EXCEEDED',
            'current_count', coalesce(v_current_count, v_limit_count),
            'limit_count', v_limit_count
        );
    end if;

    insert into sticker_logs (board_id, profile_id, source)
    values (p_board_id, v_profile_id, p_source);

    return jsonb_build_object(
        'success', true,
        'current_count', v_current_count,
        'limit_count', v_limit_count
    );
end;
$$;


ALTER FUNCTION "public"."collect_sticker"("p_board_id" "uuid", "p_source" "public"."sticker_source") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."collect_sticker_app"("board_id" "uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$
begin
    return collect_sticker(board_id, 'app');
end;
$$;


ALTER FUNCTION "public"."collect_sticker_app"("board_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."collect_sticker_widget"("board_id" "uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$
begin
    return collect_sticker(board_id, 'widget');
end;
$$;


ALTER FUNCTION "public"."collect_sticker_widget"("board_id" "uuid") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."boards" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "profile_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "target_count" integer NOT NULL,
    "current_count" integer DEFAULT 0 NOT NULL,
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "reward_enabled" boolean DEFAULT false NOT NULL,
    "status" "public"."board_status" DEFAULT 'active'::"public"."board_status" NOT NULL,
    "reward_memo" "text",
    "emoji" "text",
    "limit_count" integer DEFAULT 10 NOT NULL,
    CONSTRAINT "boards_limit_count_check" CHECK (("limit_count" > 0)),
    CONSTRAINT "boards_target_count_check" CHECK (("target_count" > 0))
);


ALTER TABLE "public"."boards" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_board_with_active_limit"("p_profile_id" "uuid", "p_title" "text", "p_emoji" "text", "p_target_count" integer, "p_reward_memo" "text", "p_limit_count" integer) RETURNS "public"."boards"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  created_board public.boards;
begin
  perform 1
  from public.profiles
  where id = p_profile_id
    and auth_user_id = auth.uid()
  for update;

  if not found then
    raise exception 'profile_id is not owned by current user'
      using errcode = '42501';
  end if;

  if (
    select count(*)
    from public.boards
    where profile_id = p_profile_id
      and status = 'active'::board_status
  ) >= 3 then
    raise exception 'ACTIVE_BOARD_LIMIT_REACHED'
      using errcode = 'P0001';
  end if;

  insert into public.boards (
    profile_id,
    title,
    emoji,
    target_count,
    reward_memo,
    limit_count
  )
  values (
    p_profile_id,
    p_title,
    p_emoji,
    p_target_count,
    p_reward_memo,
    p_limit_count
  )
  returning * into created_board;

  return created_board;
end;
$$;


ALTER FUNCTION "public"."create_board_with_active_limit"("p_profile_id" "uuid", "p_title" "text", "p_emoji" "text", "p_target_count" integer, "p_reward_memo" "text", "p_limit_count" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_board_streak"("p_board_id" "uuid") RETURNS json
    LANGUAGE "plpgsql" STABLE
    AS $$
declare
  max_streak int;
  current_streak int;
  today_success boolean;
  today date := (now() at time zone 'Asia/Seoul')::date;
begin
  with ordered_days as (
    select
      d,
      d - (row_number() over (order by d))::int as grp
    from sticker_daily
    where board_id = p_board_id
      and count > 0
  ),

  streaks as (
    select
      grp,
      count(*)::int as streak_len
    from ordered_days
    group by grp
  )

  select coalesce(max(streak_len), 0)
  into max_streak
  from streaks;

  with ordered_days as (
    select
      d,
      d - (row_number() over (order by d))::int as grp
    from sticker_daily
    where board_id = p_board_id
      and count > 0
  ),

  latest_day as (
    select max(d) as d
    from ordered_days
  )

  select
    case
      when latest_day.d is null then 0
      when latest_day.d < today - 1 then 0
      else (
        select count(*)::int
        from ordered_days
        where grp = (
          select grp
          from ordered_days
          where d = latest_day.d
          limit 1
        )
      )
    end
  into current_streak
  from latest_day;

  select exists (
    select 1
    from sticker_daily
    where board_id = p_board_id
      and d = today
      and count > 0
  ) into today_success;

  return json_build_object(
    'maxStreak', coalesce(max_streak, 0),
    'currentStreak', coalesce(current_streak, 0),
    'todaySuccess', coalesce(today_success, false)
  );
end;
$$;


ALTER FUNCTION "public"."get_board_streak"("p_board_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_boards_with_stats"() RETURNS TABLE("id" "uuid", "created_at" timestamp with time zone, "completed_at" timestamp with time zone, "title" "text", "emoji" "text", "target_count" integer, "limit_count" integer, "current_count" integer, "reward_memo" "text", "status" "public"."board_status", "latest_sticker_collected_at" timestamp with time zone, "today_sticker_count" integer, "current_streak" integer, "max_streak" integer, "today_success" boolean, "home_sort_rank" integer)
    LANGUAGE "sql" STABLE
    AS $$
  select
    b.id,
    b.created_at,
    case
      when b.status = 'completed'::board_status then b.completed_at
      else null
    end as completed_at,
    b.title,
    b.emoji,
    b.target_count,
    b.limit_count,
    b.current_count,
    b.reward_memo,
    b.status,
    latest.latest_sticker_collected_at,
    coalesce(today.count, 0)::int as today_sticker_count,
    coalesce((streak.stats ->> 'currentStreak')::int, 0) as current_streak,
    coalesce((streak.stats ->> 'maxStreak')::int, 0) as max_streak,
    coalesce((streak.stats ->> 'todaySuccess')::boolean, false) as today_success,
    case
      when b.status = 'completed'::board_status then 2
      when coalesce(today.count, 0) >= b.limit_count then 1
      else 0
    end as home_sort_rank
  from boards b
  left join lateral (
    select max(sl.created_at) as latest_sticker_collected_at
    from sticker_logs sl
    where sl.board_id = b.id
  ) latest on true
  left join sticker_daily today
    on today.board_id = b.id
   and today.d = (now() at time zone 'Asia/Seoul')::date
  left join lateral get_board_streak(b.id) as streak(stats) on true;
$$;


ALTER FUNCTION "public"."get_boards_with_stats"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."refresh_board_progress"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  if (TG_OP = 'UPDATE') then
    if new.board_id <> old.board_id then
      perform refresh_board_progress_for(old.board_id);
      perform refresh_board_progress_for(new.board_id);
      return null;
    end if;

    perform refresh_board_progress_for(new.board_id);
    return null;
  end if;

  if (TG_OP = 'INSERT') then
    perform refresh_board_progress_for(new.board_id);
    return null;
  end if;

  perform refresh_board_progress_for(old.board_id);
  return null;
end;
$$;


ALTER FUNCTION "public"."refresh_board_progress"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."refresh_board_progress_for"("p_board_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
declare
  v_count int;
begin
  select count(*)::int into v_count
  from sticker_logs
  where board_id = p_board_id;

  update boards
  set current_count = v_count,
      status = case when v_count >= target_count then 'completed'::board_status else 'active'::board_status end,
      completed_at = case
        when v_count >= target_count then coalesce(completed_at, now())
        else null
      end
  where id = p_board_id;
end;
$$;


ALTER FUNCTION "public"."refresh_board_progress_for"("p_board_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."rls_auto_enable"() RETURNS "event_trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."rls_auto_enable"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."app_settings" (
    "id" integer DEFAULT 1 NOT NULL,
    "latest_version" "text" NOT NULL,
    "min_version" "text" NOT NULL,
    "maintenance" boolean DEFAULT false NOT NULL,
    "maintenance_message" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "app_settings_single_row" CHECK (("id" = 1))
);


ALTER TABLE "public"."app_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."devices" (
    "device_id" "text" NOT NULL,
    "profile_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "last_login_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "push_token" "text",
    "push_enabled" boolean DEFAULT false NOT NULL,
    "platform" "text",
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "push_enabled_updated_at" timestamp with time zone,
    "push_permission_status" "text" DEFAULT 'undetermined'::"text",
    "push_permission_granted_at" timestamp with time zone,
    "push_permission_updated_at" timestamp with time zone,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    CONSTRAINT "devices_platform_check" CHECK ((("platform" = ANY (ARRAY['ios'::"text", 'android'::"text", 'web'::"text"])) OR ("platform" IS NULL))),
    CONSTRAINT "devices_push_permission_status_check" CHECK (("push_permission_status" = ANY (ARRAY['undetermined'::"text", 'denied'::"text", 'granted'::"text"])))
);


ALTER TABLE "public"."devices" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notification_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "sent_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "open_at" timestamp with time zone,
    "type" "text" NOT NULL,
    "profile_id" "uuid" NOT NULL,
    "board_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "channel" "text" DEFAULT 'push'::"text" NOT NULL,
    "message_trigger" "text",
    "message_body" "text",
    "sent_local_date" "date",
    "expo_ticket_ids" "text"[],
    "expo_ticket_token_map" "jsonb",
    "expo_receipt_status" "text",
    "expo_receipt_checked_at" timestamp with time zone,
    "expo_error" "text",
    "sent_local_time" "text"
);


ALTER TABLE "public"."notification_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "auth_user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "nickname" "text",
    "mbti" "public"."mbti_type",
    "last_login_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "reminder_hour" integer DEFAULT 21 NOT NULL,
    "reminder_minute" integer DEFAULT 0 NOT NULL,
    "timezone" "text" DEFAULT 'Asia/Seoul'::"text" NOT NULL,
    "reminder_times" "jsonb" DEFAULT '[{"hour": 21, "minute": 0}]'::"jsonb" NOT NULL,
    CONSTRAINT "profiles_nickname_length_check" CHECK ((("nickname" IS NULL) OR (("char_length"("btrim"("nickname")) >= 1) AND ("char_length"("btrim"("nickname")) <= 20)))),
    CONSTRAINT "profiles_reminder_time_check" CHECK (((("reminder_hour" >= 0) AND ("reminder_hour" <= 23)) AND (("reminder_minute" >= 0) AND ("reminder_minute" <= 59)))),
    CONSTRAINT "profiles_reminder_times_check" CHECK (("jsonb_typeof"("reminder_times") = 'array'::"text")),
    CONSTRAINT "profiles_timezone_length_check" CHECK ((("char_length"("btrim"("timezone")) >= 1) AND ("char_length"("btrim"("timezone")) <= 64)))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sticker_daily" (
    "board_id" "uuid" NOT NULL,
    "d" "date" NOT NULL,
    "count" integer DEFAULT 0 NOT NULL,
    CONSTRAINT "sticker_daily_count_check" CHECK (("count" >= 0))
);


ALTER TABLE "public"."sticker_daily" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sticker_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "profile_id" "uuid" NOT NULL,
    "board_id" "uuid" NOT NULL,
    "source" "public"."sticker_source" NOT NULL
);


ALTER TABLE "public"."sticker_logs" OWNER TO "postgres";


ALTER TABLE ONLY "public"."app_settings"
    ADD CONSTRAINT "app_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."boards"
    ADD CONSTRAINT "boards_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notification_logs"
    ADD CONSTRAINT "notification_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_auth_user_id_key" UNIQUE ("auth_user_id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sticker_daily"
    ADD CONSTRAINT "sticker_daily_pkey" PRIMARY KEY ("board_id", "d");



ALTER TABLE ONLY "public"."sticker_logs"
    ADD CONSTRAINT "sticker_logs_pkey" PRIMARY KEY ("id");



CREATE UNIQUE INDEX "idx_devices_profile_device_unique" ON "public"."devices" USING "btree" ("profile_id", "device_id");



CREATE INDEX "idx_devices_profile_id" ON "public"."devices" USING "btree" ("profile_id");



CREATE INDEX "idx_devices_push_reminder_candidates" ON "public"."devices" USING "btree" ("profile_id") WHERE (("push_enabled" = true) AND ("push_permission_status" = 'granted'::"text") AND ("push_token" IS NOT NULL));



CREATE UNIQUE INDEX "idx_devices_push_token_unique" ON "public"."devices" USING "btree" ("push_token") WHERE ("push_token" IS NOT NULL);



CREATE INDEX "idx_notification_logs_expo_receipt_pending" ON "public"."notification_logs" USING "btree" ("created_at") WHERE (("channel" = 'push'::"text") AND ("expo_ticket_ids" IS NOT NULL) AND ("expo_receipt_checked_at" IS NULL));



CREATE UNIQUE INDEX "idx_notification_logs_push_once_per_time" ON "public"."notification_logs" USING "btree" ("profile_id", "type", "channel", "message_trigger", "sent_local_date", "sent_local_time") WHERE (("channel" = 'push'::"text") AND ("sent_local_date" IS NOT NULL) AND ("sent_local_time" IS NOT NULL));



CREATE INDEX "idx_profiles_auth_user_id" ON "public"."profiles" USING "btree" ("auth_user_id");



CREATE INDEX "idx_sticker_logs_board_time" ON "public"."sticker_logs" USING "btree" ("board_id", "created_at");



CREATE INDEX "index_idx_sticker_daily_board_date" ON "public"."sticker_daily" USING "btree" ("board_id", "d");



CREATE OR REPLACE TRIGGER "boards_set_updated_at" BEFORE UPDATE ON "public"."boards" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "devices_set_updated_at" BEFORE UPDATE ON "public"."devices" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "profiles_set_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "sticker_logs_refresh_board" AFTER INSERT OR DELETE OR UPDATE ON "public"."sticker_logs" FOR EACH ROW EXECUTE FUNCTION "public"."refresh_board_progress"();



CREATE OR REPLACE TRIGGER "sticker_logs_set_updated_at" BEFORE UPDATE ON "public"."sticker_logs" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



ALTER TABLE ONLY "public"."boards"
    ADD CONSTRAINT "boards_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."devices"
    ADD CONSTRAINT "devices_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notification_logs"
    ADD CONSTRAINT "notification_logs_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notification_logs"
    ADD CONSTRAINT "notification_logs_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_auth_user_id_fkey" FOREIGN KEY ("auth_user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sticker_daily"
    ADD CONSTRAINT "sticker_daily_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sticker_logs"
    ADD CONSTRAINT "sticker_logs_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sticker_logs"
    ADD CONSTRAINT "sticker_logs_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE "public"."app_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."boards" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "boards delete" ON "public"."boards" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "boards"."profile_id") AND ("p"."auth_user_id" = "auth"."uid"())))));



CREATE POLICY "boards insert" ON "public"."boards" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "boards"."profile_id") AND ("p"."auth_user_id" = "auth"."uid"())))));



CREATE POLICY "boards select" ON "public"."boards" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "boards"."profile_id") AND ("p"."auth_user_id" = "auth"."uid"())))));



CREATE POLICY "boards update" ON "public"."boards" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "boards"."profile_id") AND ("p"."auth_user_id" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "boards"."profile_id") AND ("p"."auth_user_id" = "auth"."uid"())))));



ALTER TABLE "public"."devices" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "devices delete" ON "public"."devices" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "devices"."profile_id") AND ("p"."auth_user_id" = "auth"."uid"())))));



CREATE POLICY "devices insert" ON "public"."devices" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "devices"."profile_id") AND ("p"."auth_user_id" = "auth"."uid"())))));



CREATE POLICY "devices select" ON "public"."devices" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "devices"."profile_id") AND ("p"."auth_user_id" = "auth"."uid"())))));



CREATE POLICY "devices update" ON "public"."devices" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "devices"."profile_id") AND ("p"."auth_user_id" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "devices"."profile_id") AND ("p"."auth_user_id" = "auth"."uid"())))));



CREATE POLICY "no direct insert" ON "public"."sticker_daily" FOR INSERT WITH CHECK (false);



CREATE POLICY "no direct update" ON "public"."sticker_daily" FOR UPDATE USING (false) WITH CHECK (false);



ALTER TABLE "public"."notification_logs" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "notification_logs delete" ON "public"."notification_logs" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "notification_logs"."profile_id") AND ("p"."auth_user_id" = "auth"."uid"())))));



CREATE POLICY "notification_logs insert" ON "public"."notification_logs" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "notification_logs"."profile_id") AND ("p"."auth_user_id" = "auth"."uid"())))));



CREATE POLICY "notification_logs select" ON "public"."notification_logs" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "notification_logs"."profile_id") AND ("p"."auth_user_id" = "auth"."uid"())))));



CREATE POLICY "notification_logs update" ON "public"."notification_logs" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "notification_logs"."profile_id") AND ("p"."auth_user_id" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "notification_logs"."profile_id") AND ("p"."auth_user_id" = "auth"."uid"())))));



ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "profiles delete" ON "public"."profiles" FOR DELETE TO "authenticated" USING (("auth_user_id" = "auth"."uid"()));



CREATE POLICY "profiles insert" ON "public"."profiles" FOR INSERT TO "authenticated" WITH CHECK (("auth_user_id" = "auth"."uid"()));



CREATE POLICY "profiles select" ON "public"."profiles" FOR SELECT TO "authenticated" USING (("auth_user_id" = "auth"."uid"()));



CREATE POLICY "profiles update" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("auth_user_id" = "auth"."uid"())) WITH CHECK (("auth_user_id" = "auth"."uid"()));



CREATE POLICY "public can read app settings" ON "public"."app_settings" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "select own sticker_daily" ON "public"."sticker_daily" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM ("public"."boards"
     JOIN "public"."profiles" ON (("profiles"."id" = "boards"."profile_id")))
  WHERE (("boards"."id" = "sticker_daily"."board_id") AND ("profiles"."auth_user_id" = "auth"."uid"())))));



ALTER TABLE "public"."sticker_daily" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sticker_logs" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "sticker_logs delete" ON "public"."sticker_logs" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("public"."boards" "b"
     JOIN "public"."profiles" "p" ON (("p"."id" = "b"."profile_id")))
  WHERE (("b"."id" = "sticker_logs"."board_id") AND ("b"."profile_id" = "sticker_logs"."profile_id") AND ("p"."auth_user_id" = "auth"."uid"())))));



CREATE POLICY "sticker_logs insert" ON "public"."sticker_logs" FOR INSERT TO "authenticated" WITH CHECK (false);



CREATE POLICY "sticker_logs select" ON "public"."sticker_logs" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("public"."boards" "b"
     JOIN "public"."profiles" "p" ON (("p"."id" = "b"."profile_id")))
  WHERE (("b"."id" = "sticker_logs"."board_id") AND ("b"."profile_id" = "sticker_logs"."profile_id") AND ("p"."auth_user_id" = "auth"."uid"())))));



CREATE POLICY "sticker_logs update" ON "public"."sticker_logs" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("public"."boards" "b"
     JOIN "public"."profiles" "p" ON (("p"."id" = "b"."profile_id")))
  WHERE (("b"."id" = "sticker_logs"."board_id") AND ("b"."profile_id" = "sticker_logs"."profile_id") AND ("p"."auth_user_id" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM ("public"."boards" "b"
     JOIN "public"."profiles" "p" ON (("p"."id" = "b"."profile_id")))
  WHERE (("b"."id" = "sticker_logs"."board_id") AND ("b"."profile_id" = "sticker_logs"."profile_id") AND ("p"."auth_user_id" = "auth"."uid"())))));



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."claim_device_push_token"("p_profile_id" "uuid", "p_device_id" "text", "p_push_token" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."claim_device_push_token"("p_profile_id" "uuid", "p_device_id" "text", "p_push_token" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."claim_device_push_token"("p_profile_id" "uuid", "p_device_id" "text", "p_push_token" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."claim_due_push_reminders"("p_now" timestamp with time zone, "p_limit" integer, "p_message_type" "text", "p_message_trigger" "text", "p_message_body" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."claim_due_push_reminders"("p_now" timestamp with time zone, "p_limit" integer, "p_message_type" "text", "p_message_trigger" "text", "p_message_body" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."claim_due_push_reminders"("p_now" timestamp with time zone, "p_limit" integer, "p_message_type" "text", "p_message_trigger" "text", "p_message_body" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."collect_sticker"("p_board_id" "uuid", "p_source" "public"."sticker_source") TO "anon";
GRANT ALL ON FUNCTION "public"."collect_sticker"("p_board_id" "uuid", "p_source" "public"."sticker_source") TO "authenticated";
GRANT ALL ON FUNCTION "public"."collect_sticker"("p_board_id" "uuid", "p_source" "public"."sticker_source") TO "service_role";



GRANT ALL ON FUNCTION "public"."collect_sticker_app"("board_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."collect_sticker_app"("board_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."collect_sticker_app"("board_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."collect_sticker_widget"("board_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."collect_sticker_widget"("board_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."collect_sticker_widget"("board_id" "uuid") TO "service_role";



GRANT ALL ON TABLE "public"."boards" TO "anon";
GRANT ALL ON TABLE "public"."boards" TO "authenticated";
GRANT ALL ON TABLE "public"."boards" TO "service_role";



GRANT ALL ON FUNCTION "public"."create_board_with_active_limit"("p_profile_id" "uuid", "p_title" "text", "p_emoji" "text", "p_target_count" integer, "p_reward_memo" "text", "p_limit_count" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."create_board_with_active_limit"("p_profile_id" "uuid", "p_title" "text", "p_emoji" "text", "p_target_count" integer, "p_reward_memo" "text", "p_limit_count" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_board_with_active_limit"("p_profile_id" "uuid", "p_title" "text", "p_emoji" "text", "p_target_count" integer, "p_reward_memo" "text", "p_limit_count" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_board_streak"("p_board_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_board_streak"("p_board_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_board_streak"("p_board_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_boards_with_stats"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_boards_with_stats"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_boards_with_stats"() TO "service_role";



GRANT ALL ON FUNCTION "public"."refresh_board_progress"() TO "anon";
GRANT ALL ON FUNCTION "public"."refresh_board_progress"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."refresh_board_progress"() TO "service_role";



GRANT ALL ON FUNCTION "public"."refresh_board_progress_for"("p_board_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."refresh_board_progress_for"("p_board_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."refresh_board_progress_for"("p_board_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "anon";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";



GRANT ALL ON TABLE "public"."app_settings" TO "anon";
GRANT ALL ON TABLE "public"."app_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."app_settings" TO "service_role";



GRANT ALL ON TABLE "public"."devices" TO "anon";
GRANT ALL ON TABLE "public"."devices" TO "authenticated";
GRANT ALL ON TABLE "public"."devices" TO "service_role";



GRANT ALL ON TABLE "public"."notification_logs" TO "anon";
GRANT ALL ON TABLE "public"."notification_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."notification_logs" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."sticker_daily" TO "anon";
GRANT ALL ON TABLE "public"."sticker_daily" TO "authenticated";
GRANT ALL ON TABLE "public"."sticker_daily" TO "service_role";



GRANT ALL ON TABLE "public"."sticker_logs" TO "anon";
GRANT ALL ON TABLE "public"."sticker_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."sticker_logs" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";








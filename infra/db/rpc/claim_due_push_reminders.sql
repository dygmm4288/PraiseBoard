create or replace function public.claim_due_push_reminders(
  p_now timestamptz default now(),
  p_limit integer default 1000,
  p_message_type text default 'whale_message',
  p_message_trigger text default 'evening_reminder',
  p_message_body text default '오늘 하루도 얼마 남지 않았어요. 1분만 투자해서 습관을 지켜볼까요?'
)
returns table (
  notification_log_id uuid,
  profile_id uuid,
  local_date date,
  local_time text,
  push_tokens text[]
)
language sql
security definer
set search_path = public
as $$
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
$$;

grant execute on function public.claim_due_push_reminders(
  timestamptz,
  integer,
  text,
  text,
  text
) to service_role;

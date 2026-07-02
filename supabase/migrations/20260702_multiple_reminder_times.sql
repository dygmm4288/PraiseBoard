alter table profiles
  add column if not exists reminder_times jsonb not null default '[{"hour":21,"minute":0}]'::jsonb;

update profiles
set reminder_times = jsonb_build_array(
  jsonb_build_object(
    'hour', reminder_hour,
    'minute', reminder_minute
  )
)
where reminder_times = '[{"hour":21,"minute":0}]'::jsonb
  and (reminder_hour <> 21 or reminder_minute <> 0);

alter table profiles
  drop constraint if exists profiles_reminder_times_check,
  add constraint profiles_reminder_times_check
    check (jsonb_typeof(reminder_times) = 'array');

alter table notification_logs
  add column if not exists sent_local_time text null;

drop index if exists idx_notification_logs_push_once_per_day;

create unique index if not exists idx_notification_logs_push_once_per_time
on notification_logs(
  profile_id,
  type,
  channel,
  message_trigger,
  sent_local_date,
  sent_local_time
)
where channel = 'push'
  and sent_local_date is not null
  and sent_local_time is not null;

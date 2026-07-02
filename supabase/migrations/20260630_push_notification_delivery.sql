alter table profiles
  add column if not exists reminder_hour integer not null default 21,
  add column if not exists reminder_minute integer not null default 0,
  add column if not exists timezone text not null default 'Asia/Seoul';

alter table profiles
  drop constraint if exists profiles_reminder_time_check,
  add constraint profiles_reminder_time_check
    check (
      reminder_hour between 0 and 23
      and reminder_minute between 0 and 59
    );

alter table profiles
  drop constraint if exists profiles_timezone_length_check,
  add constraint profiles_timezone_length_check
    check (char_length(btrim(timezone)) between 1 and 64);

alter table notification_logs
  add column if not exists sent_local_date date null,
  add column if not exists expo_ticket_ids text[] null,
  add column if not exists expo_ticket_token_map jsonb null,
  add column if not exists expo_receipt_status text null,
  add column if not exists expo_receipt_checked_at timestamptz null,
  add column if not exists expo_error text null;

create unique index if not exists idx_notification_logs_push_once_per_day
on notification_logs(profile_id, type, channel, message_trigger, sent_local_date)
where channel = 'push' and sent_local_date is not null;

create index if not exists idx_notification_logs_expo_receipt_pending
on notification_logs(created_at)
where channel = 'push'
  and expo_ticket_ids is not null
  and expo_receipt_checked_at is null;

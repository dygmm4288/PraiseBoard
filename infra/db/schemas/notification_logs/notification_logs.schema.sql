-- 5. Notification Logs (알림 기록)
create table notification_logs(
    id uuid primary key default gen_random_uuid(),
    
    sent_at timestamptz not null default now(),
    open_at timestamptz null, 
    type text not null,
    
    created_at timestamptz not null default now(),
    channel text not null default 'push', -- "push" | "in_app"
    message_trigger text not null,
    message_body text null,
    sent_local_date date null,
    expo_ticket_ids text[] null,
    expo_ticket_token_map jsonb null,
    expo_receipt_status text null,
    expo_receipt_checked_at timestamptz null,
    expo_error text null,
    
    profile_id uuid not null references profiles(id) on delete cascade
);

create unique index idx_notification_logs_push_once_per_day
on notification_logs(profile_id, type, channel, message_trigger, sent_local_date)
where channel = 'push' and sent_local_date is not null;

create index idx_notification_logs_expo_receipt_pending
on notification_logs(created_at)
where channel = 'push'
  and expo_ticket_ids is not null
  and expo_receipt_checked_at is null;

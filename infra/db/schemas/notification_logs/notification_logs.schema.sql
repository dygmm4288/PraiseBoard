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
    
    profile_id uuid not null references profiles(id) on delete cascade
);

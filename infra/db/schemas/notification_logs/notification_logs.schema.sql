-- 5. Notification Logs (알림 기록)
create table notification_logs(
    id uuid primary key default gen_random_uuid(),
    
    sent_at timestamptz not null default now(),
    open_at timestamptz null, -- open_at은 아직 안 열어봤을 수 있으니 null 허용으로 수정하는 것을 추천해!
    type text not null,
    
    profile_id uuid not null references profiles(id) on delete cascade,
    board_id uuid not null references boards(id) on delete cascade
);

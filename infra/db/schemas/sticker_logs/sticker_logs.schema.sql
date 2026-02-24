-- 4. Sticker Logs (스티커 부착 기록)
create table sticker_logs (
    id uuid primary key default gen_random_uuid(),
    
    created_at timestamptz null default now(),
    updated_at timestamptz null default now(),
    
    profile_id uuid not null references profiles(id) on delete cascade,
    board_id uuid not null references boards(id) on delete cascade,
    
    source sticker_source not null
);

-- 보드별 시간순 정렬 및 조회를 위한 인덱스
create index idx_sticker_logs_board_time
on sticker_logs (board_id, created_at);

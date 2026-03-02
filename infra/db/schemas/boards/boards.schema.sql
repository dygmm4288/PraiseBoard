-- 3. Boards (스티커 보드)
create table boards (
    id uuid primary key default gen_random_uuid(),
    
    created_at timestamptz null default now(),
    updated_at timestamptz null default now(),
    
    profile_id uuid not null references profiles(id) on delete cascade,
    
    title text not null,
    target_count int not null check (target_count > 0),
    current_count int not null default 0,
    completed_at timestamptz null default now(),
    reward_memo text null default null,
    
    reward_enabled boolean not null default false,
    status board_status not null default 'active'
);

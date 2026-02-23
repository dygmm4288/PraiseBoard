-- 1. Profiles (통합 프로필)
create table profiles (
    id uuid primary key default gen_random_uuid(),
    
    -- 비회원일 때는 null, 회원가입 완료 시 auth.users의 id가 들어감
    auth_user_id uuid references auth.users(id) on delete cascade unique null,
    
    created_at timestamptz null default now(),
    updated_at timestamptz null default now()
);

-- 회원 로그인 시 빠른 조회를 위한 인덱스
create index idx_profiles_auth_user_id on profiles(auth_user_id);

-- 2. Devices (기기 정보)
create table devices (
    device_id text primary key, -- 기기 고유 식별자
    profile_id uuid not null references profiles(id) on delete cascade,
    
    created_at timestamptz null default now(),
    last_login_at timestamptz null default now()
);

-- 프로필이 소유한 기기들을 빠르게 찾기 위한 인덱스
create index idx_devices_profile_id on devices(profile_id);

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
    
    reward_enabled boolean not null default false,
    status board_status not null default 'active'
);

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

-- 5. Notification Logs (알림 기록)
create table notification_logs(
    id uuid primary key default gen_random_uuid(),
    
    sent_at timestamptz not null default now(),
    open_at timestamptz null, -- open_at은 아직 안 열어봤을 수 있으니 null 허용으로 수정하는 것을 추천해!
    type text not null,
    
    profile_id uuid not null references profiles(id) on delete cascade,
    board_id uuid not null references boards(id) on delete cascade
);

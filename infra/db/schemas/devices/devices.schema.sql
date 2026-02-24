-- 2. Devices (기기 정보)
create table devices (
    device_id text primary key, -- 기기 고유 식별자
    profile_id uuid not null references profiles(id) on delete cascade,
    
    created_at timestamptz null default now(),
    last_login_at timestamptz null default now()
);

-- 프로필이 소유한 기기들을 빠르게 찾기 위한 인덱스
create index idx_devices_profile_id on devices(profile_id);

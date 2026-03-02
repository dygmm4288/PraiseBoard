-- 2. Devices (기기 정보)
create table devices (
    device_id text primary key, -- 기기 고유 식별자
    profile_id uuid not null references profiles(id) on delete cascade,

    -- Expo push token (알림 등록 전에는 null 허용)
    push_token text null,
    push_enabled boolean not null default false,
    platform text null check (platform in ('ios', 'android', 'web')),
    
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    last_login_at timestamptz not null default now()
);

-- 프로필이 소유한 기기들을 빠르게 찾기 위한 인덱스
create index idx_devices_profile_id on devices(profile_id);

-- 푸시 토큰은 디바이스 단위로 유일하게 유지
create unique index idx_devices_push_token_unique
on devices(push_token)
where push_token is not null;

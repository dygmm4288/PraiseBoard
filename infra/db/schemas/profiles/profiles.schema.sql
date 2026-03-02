-- 1. Profiles (통합 프로필)
create table profiles (
    id uuid primary key default gen_random_uuid(),
    
    -- 익명 로그인(anonymous auth 포함)/회원 로그인 모두 auth.users의 id를 저장
    auth_user_id uuid not null references auth.users(id) on delete cascade unique,

    nickname text null,
    mbti mbti_type null,
    
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    last_login_at timestamptz not null default now(),

    constraint profiles_nickname_length_check
      check (nickname is null or char_length(btrim(nickname)) between 1 and 20)
);

-- 1. Profiles (통합 프로필)
create table profiles (
    id uuid primary key default gen_random_uuid(),
    
    -- 익명 로그인/회원 로그인 모두 auth.users의 id를 저장 (미연결 상태만 null 허용)
    auth_user_id uuid references auth.users(id) on delete cascade unique null,
    
    created_at timestamptz null default now(),
    updated_at timestamptz null default now()
);

-- 회원 로그인 시 빠른 조회를 위한 인덱스
create index idx_profiles_auth_user_id on profiles(auth_user_id);

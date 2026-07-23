begin;

create extension if not exists pgtap with schema extensions;

select plan(8);

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    '10000000-0000-0000-0000-000000000001',
    'authenticated',
    'authenticated',
    'board-owner@test.local',
    crypt('password', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '10000000-0000-0000-0000-000000000002',
    'authenticated',
    'authenticated',
    'other-user@test.local',
    crypt('password', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    now(),
    now()
  );

insert into public.profiles (id, auth_user_id, nickname)
values
  (
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    '보드 소유자'
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000002',
    '다른 사용자'
  );

set local role authenticated;
set local request.jwt.claim.role = 'authenticated';
set local request.jwt.claim.sub = '10000000-0000-0000-0000-000000000001';

select lives_ok(
  $$
    select public.create_board_with_active_limit(
      '20000000-0000-0000-0000-000000000001',
      '첫 번째 보드',
      '🐋',
      10,
      null,
      1
    )
  $$,
  'first active board can be created'
);

select lives_ok(
  $$
    select public.create_board_with_active_limit(
      '20000000-0000-0000-0000-000000000001',
      '두 번째 보드',
      '🌱',
      10,
      null,
      1
    )
  $$,
  'second active board can be created'
);

select lives_ok(
  $$
    select public.create_board_with_active_limit(
      '20000000-0000-0000-0000-000000000001',
      '세 번째 보드',
      '✨',
      10,
      null,
      1
    )
  $$,
  'third active board can be created'
);

select throws_ok(
  $$
    select public.create_board_with_active_limit(
      '20000000-0000-0000-0000-000000000001',
      '네 번째 보드',
      '🚫',
      10,
      null,
      1
    )
  $$,
  'P0001',
  'ACTIVE_BOARD_LIMIT_REACHED',
  'fourth active board is rejected'
);

select is(
  (
    select public.collect_sticker(
      (
        select id
        from public.boards
        where title = '첫 번째 보드'
      ),
      'app'
    )->>'success'
  ),
  'true',
  'first sticker collection succeeds'
);

select is(
  (
    select public.collect_sticker(
      (
        select id
        from public.boards
        where title = '첫 번째 보드'
      ),
      'app'
    )->>'reason'
  ),
  'DAILY_LIMIT_EXCEEDED',
  'daily sticker limit is enforced'
);

update public.boards
set status = 'completed'
where title = '두 번째 보드';

select is(
  (
    select public.collect_sticker(
      (
        select id
        from public.boards
        where title = '두 번째 보드'
      ),
      'app'
    )->>'reason'
  ),
  'BOARD_COMPLETED',
  'completed board rejects sticker collection'
);

set local request.jwt.claim.sub = '10000000-0000-0000-0000-000000000002';

select is(
  (
    select count(*)::integer
    from public.boards
    where profile_id = '20000000-0000-0000-0000-000000000001'
  ),
  0,
  'another user cannot read boards through RLS'
);

select * from finish();

rollback;

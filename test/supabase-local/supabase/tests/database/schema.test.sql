begin;

create extension if not exists pgtap with schema extensions;

select plan(8);

select has_table('public', 'profiles', 'profiles table exists');
select has_table('public', 'boards', 'boards table exists');
select has_table('public', 'sticker_logs', 'sticker_logs table exists');
select has_table('public', 'devices', 'devices table exists');
select has_column(
  'public',
  'boards',
  'limit_count',
  'boards.limit_count exists'
);
select has_column(
  'public',
  'profiles',
  'reminder_times',
  'profiles.reminder_times exists'
);
select has_function(
  'public',
  'collect_sticker',
  array['uuid', 'public.sticker_source'],
  'collect_sticker RPC exists'
);
select has_function(
  'public',
  'create_board_with_active_limit',
  array['uuid', 'text', 'text', 'integer', 'text', 'integer'],
  'create_board_with_active_limit RPC exists'
);

select * from finish();

rollback;

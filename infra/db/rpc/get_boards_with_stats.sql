drop function if exists get_boards_with_stats();

create or replace function get_boards_with_stats()
returns table (
  id uuid,
  created_at timestamptz,
  completed_at timestamptz,
  title text,
  emoji text,
  target_count int,
  limit_count int,
  current_count int,
  reward_memo text,
  status board_status,
  latest_sticker_collected_at timestamptz,
  today_sticker_count int,
  current_streak int,
  max_streak int,
  today_success boolean
)
language sql
stable
as $$
  select
    b.id,
    b.created_at,
    b.completed_at,
    b.title,
    b.emoji,
    b.target_count,
    b.limit_count,
    b.current_count,
    b.reward_memo,
    b.status,
    latest.latest_sticker_collected_at,
    coalesce(today.count, 0)::int as today_sticker_count,
    coalesce((streak.stats ->> 'currentStreak')::int, 0) as current_streak,
    coalesce((streak.stats ->> 'maxStreak')::int, 0) as max_streak,
    coalesce((streak.stats ->> 'todaySuccess')::boolean, false) as today_success
  from boards b
  left join lateral (
    select max(sl.created_at) as latest_sticker_collected_at
    from sticker_logs sl
    where sl.board_id = b.id
  ) latest on true
  left join sticker_daily today
    on today.board_id = b.id
   and today.d = (now() at time zone 'Asia/Seoul')::date
  left join lateral get_board_streak(b.id) as streak(stats) on true;
$$;

grant execute on function get_boards_with_stats() to authenticated;

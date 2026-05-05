create table sticker_daily (
    board_id uuid not null references boards(id) on delete cascade,
    d date not null,
    count int not null default 0 check (count >= 0),

    primary key(board_id, d)
);

create index index_idx_sticker_daily_board_date
on sticker_daily (board_id, d);

create or replace function get_board_streak(p_board_id uuid)
returns json as $$
declare
  max_streak int;
  current_streak int;
  today_success boolean;
begin
  -- max streak
  with ordered as (
    select d,
      d - (row_number() over (order by d))::int as grp
    from sticker_daily
    where board_id = p_board_id
      and count > 0
  ),

  streaks as (
    select count(*) as streak
    from ordered
    group by grp
  )

  select max(streak) into max_streak from streaks;

  -- current streak
  with dates as (
    select d
    from sticker_daily
    where board_id = p_board_id
      and count > 0
    order by d desc
  ),

  series as (
    select d,
      d - (row_number() over (order by d desc))::int as grp
    from dates
  )
  select count(*) into current_streak
  from series
  where grp = (select grp from series limit 1);

  -- today

  select exists (
    select 1
    from sticker_daily
    where board_id = p_board_id
      and d = (now() at time zone 'Asia/Seoul')::date
      and count > 0
  ) into today_success;
  return json_build_object(
    'maxStreak', coalesce(max_streak, 0),
    'currentStreak', coalesce(current_streak, 0),
    'todaySuccess', today_success
  );
end;
$$ language plpgsql;

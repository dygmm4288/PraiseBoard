alter table boards
add column if not exists limit_count int not null default 10;

alter table boards
drop constraint if exists boards_limit_count_check;

alter table boards
add constraint boards_limit_count_check check (limit_count > 0);

alter table sticker_daily
add column if not exists count int not null default 0;

alter table sticker_daily
drop constraint if exists sticker_daily_count_check;

alter table sticker_daily
add constraint sticker_daily_count_check check (count >= 0);

update sticker_daily sd
set count = coalesce(backfill.count, 1)
from (
    select
        board_id,
        (created_at at time zone 'Asia/Seoul')::date as d,
        count(*)::int as count
    from sticker_logs
    group by board_id, (created_at at time zone 'Asia/Seoul')::date
) backfill
where sd.board_id = backfill.board_id
  and sd.d = backfill.d;

update sticker_daily
set count = 1
where count = 0;

drop trigger if exists trg_sticker_logs_daily on sticker_logs;
drop function if exists fn_upsert_sticker_daily();

drop function if exists collect_sticker_app(uuid);
drop function if exists collect_sticker_widget(uuid);

create or replace function collect_sticker(
    p_board_id uuid,
    p_source sticker_source default 'app'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    v_profile_id uuid;
    v_limit_count int;
    v_current_count int;
    v_today date := (now() at time zone 'Asia/Seoul')::date;
begin
    select b.profile_id, b.limit_count
    into v_profile_id, v_limit_count
    from boards b
    join profiles p on p.id = b.profile_id
    where b.id = p_board_id
      and p.auth_user_id = auth.uid();

    if not found then
        if exists (select 1 from boards where id = p_board_id) then
            return jsonb_build_object(
                'success', false,
                'reason', 'FORBIDDEN'
            );
        end if;

        return jsonb_build_object(
            'success', false,
            'reason', 'BOARD_NOT_FOUND'
        );
    end if;

    insert into sticker_daily (board_id, d, count)
    values (p_board_id, v_today, 0)
    on conflict (board_id, d) do nothing;

    update sticker_daily
    set count = count + 1
    where board_id = p_board_id
      and d = v_today
      and count < v_limit_count
    returning count into v_current_count;

    if not found then
        select count
        into v_current_count
        from sticker_daily
        where board_id = p_board_id
          and d = v_today;

        return jsonb_build_object(
            'success', false,
            'reason', 'DAILY_LIMIT_EXCEEDED',
            'current_count', coalesce(v_current_count, v_limit_count),
            'limit_count', v_limit_count
        );
    end if;

    insert into sticker_logs (board_id, profile_id, source)
    values (p_board_id, v_profile_id, p_source);

    return jsonb_build_object(
        'success', true,
        'current_count', v_current_count,
        'limit_count', v_limit_count
    );
end;
$$;

grant execute on function collect_sticker(uuid, sticker_source) to authenticated;

create or replace function collect_sticker_app(board_id uuid)
returns jsonb
language plpgsql
as $$
begin
    return collect_sticker(board_id, 'app');
end;
$$;

grant execute on function collect_sticker_app(uuid) to authenticated;

create or replace function collect_sticker_widget(board_id uuid)
returns jsonb
language plpgsql
as $$
begin
    return collect_sticker(board_id, 'widget');
end;
$$;

grant execute on function collect_sticker_widget(uuid) to authenticated;

drop policy if exists "sticker_logs insert" on sticker_logs;
create policy "sticker_logs insert"
on sticker_logs
for insert
to authenticated
with check (false);

drop policy if exists "no direct update" on sticker_daily;
create policy "no direct update"
on sticker_daily
for update
using (false)
with check (false);

create or replace function get_board_streak(p_board_id uuid)
returns json as $$
declare
  max_streak int;
  current_streak int;
  today_success boolean;
begin
  with ordered_days as (
    select
      d,
      d - (row_number() over (order by d))::int as grp
    from sticker_daily
    where board_id = p_board_id
      and count > 0
  ),

  streaks as (
    select
      count(*)::int as streak_len
    from ordered_days
    group by grp
  )

  select coalesce(max(streak_len), 0)
  into max_streak
  from streaks;

  with recursive recent_days as (
    select d
    from sticker_daily
    where board_id = p_board_id
      and count > 0
    order by d desc
  ),

  current_group as (
    select d
    from recent_days
    where d <= (now() at time zone 'Asia/Seoul')::date
      and d >= (
        select max(d)
        from sticker_daily
        where board_id = p_board_id
          and count > 0
      ) - interval '365 days'
  )

  select count(*)::int
  into current_streak
  from current_group;

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
    'todaySuccess', coalesce(today_success, false)
  );
end;
$$ language plpgsql stable;

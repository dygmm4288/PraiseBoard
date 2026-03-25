create or replace function refresh_board_progress_for(p_board_id uuid)
returns void as $$
declare
  v_count int;
begin
  select count(*)::int into v_count
  from sticker_logs
  where board_id = p_board_id;

  update boards
  set current_count = v_count,
      status = case when v_count >= target_count then 'completed'::board_status else 'active'::board_status end,
      completed_at = case
        when v_count >= target_count then coalesce(completed_at, now())
        else null
      end
  where id = p_board_id;
end;
$$ language plpgsql;

create or replace function refresh_board_progress()
returns trigger as $$
begin
  if (TG_OP = 'UPDATE') then
    if new.board_id <> old.board_id then
      perform refresh_board_progress_for(old.board_id);
      perform refresh_board_progress_for(new.board_id);
      return null;
    end if;

    perform refresh_board_progress_for(new.board_id);
    return null;
  end if;

  if (TG_OP = 'INSERT') then
    perform refresh_board_progress_for(new.board_id);
    return null;
  end if;

  perform refresh_board_progress_for(old.board_id);
  return null;
end;
$$ language plpgsql;

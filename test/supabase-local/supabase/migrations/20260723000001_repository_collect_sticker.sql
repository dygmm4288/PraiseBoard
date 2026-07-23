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
    v_target_count int;
    v_board_current_count int;
    v_current_count int;
    v_status board_status;
    v_today date := (now() at time zone 'Asia/Seoul')::date;
begin
    select b.profile_id, b.limit_count, b.target_count, b.current_count, b.status
    into v_profile_id, v_limit_count, v_target_count, v_board_current_count, v_status
    from boards b
    join profiles p on p.id = b.profile_id
    where b.id = p_board_id
      and p.auth_user_id = auth.uid()
    for update of b;

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

    if v_status = 'completed'::board_status or v_board_current_count >= v_target_count then
        return jsonb_build_object(
            'success', false,
            'reason', 'BOARD_COMPLETED',
            'current_count', v_board_current_count,
            'target_count', v_target_count,
            'limit_count', v_limit_count
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
            'today_count', coalesce(v_current_count, v_limit_count),
            'limit_count', v_limit_count
        );
    end if;

    insert into sticker_logs (board_id, profile_id, source)
    values (p_board_id, v_profile_id, p_source);

    return jsonb_build_object(
        'success', true,
        'today_count', v_current_count,
        'limit_count', v_limit_count
    );
end;
$$;

grant execute on function collect_sticker(uuid, sticker_source) to authenticated;

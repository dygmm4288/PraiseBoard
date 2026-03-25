create or replace function collect_sticker_widget(board_id uuid)
returns boards
language plpgsql
as $$
declare
    v_board boards;
begin
    insert into sticker_logs (board_id, profile_id, source)
    select b.id, b.profile_id, 'widget'
    from boards b
    where b.id = board_id;

    select * into v_board
    from boards
    where id = board_id;

    return v_board;
end;
$$;
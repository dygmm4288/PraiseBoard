create or replace function collect_sticker_app(board_id uuid)
returns jsonb
language plpgsql
as $$
begin
    return collect_sticker(board_id, 'app');
end;
$$;

grant execute on function collect_sticker_app(uuid) to authenticated;

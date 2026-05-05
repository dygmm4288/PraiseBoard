create or replace function collect_sticker_widget(board_id uuid)
returns jsonb
language plpgsql
as $$
begin
    return collect_sticker(board_id, 'widget');
end;
$$;

grant execute on function collect_sticker_widget(uuid) to authenticated;

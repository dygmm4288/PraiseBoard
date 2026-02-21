create trigger sticker_logs_refresh_board
after insert or delete or update on sticker_logs
for each row execute function refresh_board_progress();
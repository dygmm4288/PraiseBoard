create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_set_updated_at
before update on profiles
for each row execute function set_updated_at();

create trigger boards_set_updated_at
before update on boards
for each row execute function set_updated_at();

create trigger sticker_logs_set_updated_at
before update on sticker_logs
for each row execute function set_updated_at();
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger profiles_set_updated_at
before update on profiles
for each row execute function set_updated_at();

create or replace trigger boards_set_updated_at
before update on boards
for each row execute function set_updated_at();

create or replace trigger devices_set_updated_at
before update on devices
for each row execute function set_updated_at();

create or replace trigger sticker_logs_set_updated_at
before update on sticker_logs
for each row execute function set_updated_at();

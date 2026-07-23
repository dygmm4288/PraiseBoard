insert into public.app_settings (
  id,
  latest_version,
  min_version,
  maintenance,
  maintenance_message
)
values (
  1,
  '1.0.0',
  '1.0.0',
  false,
  null
)
on conflict (id) do update
set
  latest_version = excluded.latest_version,
  min_version = excluded.min_version,
  maintenance = excluded.maintenance,
  maintenance_message = excluded.maintenance_message;

alter table app_settings enable row level security;

drop policy if exists "public can read app settings" on app_settings;
create policy "public can read app settings"
on app_settings
for select
to anon, authenticated
using (true);

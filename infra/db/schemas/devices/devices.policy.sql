alter table devices enable row level security;

-- ----------------------------------
-- select
-- ----------------------------------
drop policy if exists "devices select" on devices;
create policy "devices select"
on devices
for select
to authenticated
using (
  exists (
    select 1
    from profiles p
    where p.id = devices.profile_id
      and p.auth_user_id = auth.uid()
  )
);

-- ----------------------------------
-- insert
-- ----------------------------------
drop policy if exists "devices insert" on devices;
create policy "devices insert"
on devices
for insert
to authenticated
with check (
  exists (
    select 1
    from profiles p
    where p.id = devices.profile_id
      and p.auth_user_id = auth.uid()
  )
);

-- ----------------------------------
-- update
-- ----------------------------------
drop policy if exists "devices update" on devices;
create policy "devices update"
on devices
for update
to authenticated
using (
  exists (
    select 1
    from profiles p
    where p.id = devices.profile_id
      and p.auth_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from profiles p
    where p.id = devices.profile_id
      and p.auth_user_id = auth.uid()
  )
);

-- ----------------------------------
-- delete
-- ----------------------------------
drop policy if exists "devices delete" on devices;
create policy "devices delete"
on devices
for delete
to authenticated
using (
  exists (
    select 1
    from profiles p
    where p.id = devices.profile_id
      and p.auth_user_id = auth.uid()
  )
);

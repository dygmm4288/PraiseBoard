alter table profiles enable row level security;

-- ----------------------------------
-- select
-- ----------------------------------
drop policy if exists "profiles select" on profiles;
create policy "profiles select"
on profiles
for select
to authenticated
using (
  auth_user_id = auth.uid()
);

-- ----------------------------------
-- insert
-- ----------------------------------
drop policy if exists "profiles insert" on profiles;
create policy "profiles insert"
on profiles
for insert
to authenticated
with check (
  auth_user_id = auth.uid()
);

-- ----------------------------------
-- update
-- ----------------------------------
drop policy if exists "profiles update" on profiles;
create policy "profiles update"
on profiles
for update
to authenticated
using (
  auth_user_id = auth.uid()
)
with check (
  auth_user_id = auth.uid()
);

-- ----------------------------------
-- delete
-- ----------------------------------
drop policy if exists "profiles delete" on profiles;
create policy "profiles delete"
on profiles
for delete
to authenticated
using (
  auth_user_id = auth.uid()
);

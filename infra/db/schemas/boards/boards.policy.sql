alter table boards enable row level security;

-- ----------------------------------
-- select
-- ----------------------------------
drop policy if exists "boards select" on boards;
create policy "boards select"
on boards
for select
to authenticated
using (
  exists (
    select 1
    from profiles p
    where p.id = boards.profile_id
      and p.auth_user_id = auth.uid()
  )
);

-- ----------------------------------
-- insert
-- ----------------------------------
drop policy if exists "boards insert" on boards;
create policy "boards insert"
on boards
for insert
to authenticated
with check (
  exists (
    select 1
    from profiles p
    where p.id = boards.profile_id
      and p.auth_user_id = auth.uid()
  )
);

-- ----------------------------------
-- update
-- ----------------------------------
drop policy if exists "boards update" on boards;
create policy "boards update"
on boards
for update
to authenticated
using (
  exists (
    select 1
    from profiles p
    where p.id = boards.profile_id
      and p.auth_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from profiles p
    where p.id = boards.profile_id
      and p.auth_user_id = auth.uid()
  )
);

-- ----------------------------------
-- delete
-- ----------------------------------
drop policy if exists "boards delete" on boards;
create policy "boards delete"
on boards
for delete
to authenticated
using (
  exists (
    select 1
    from profiles p
    where p.id = boards.profile_id
      and p.auth_user_id = auth.uid()
  )
);

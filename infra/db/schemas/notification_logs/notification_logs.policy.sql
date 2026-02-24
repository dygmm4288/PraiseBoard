alter table notification_logs enable row level security;

-- ----------------------------------
-- select
-- ----------------------------------
drop policy if exists "notification_logs select" on notification_logs;
create policy "notification_logs select"
on notification_logs
for select
to authenticated
using (
  exists (
    select 1
    from boards b
    join profiles p on p.id = b.profile_id
    where b.id = notification_logs.board_id
      and b.profile_id = notification_logs.profile_id
      and p.auth_user_id = auth.uid()
  )
);

-- ----------------------------------
-- insert
-- ----------------------------------
drop policy if exists "notification_logs insert" on notification_logs;
create policy "notification_logs insert"
on notification_logs
for insert
to authenticated
with check (
  exists (
    select 1
    from boards b
    join profiles p on p.id = b.profile_id
    where b.id = notification_logs.board_id
      and b.profile_id = notification_logs.profile_id
      and p.auth_user_id = auth.uid()
  )
);

-- ----------------------------------
-- update
-- ----------------------------------
drop policy if exists "notification_logs update" on notification_logs;
create policy "notification_logs update"
on notification_logs
for update
to authenticated
using (
  exists (
    select 1
    from boards b
    join profiles p on p.id = b.profile_id
    where b.id = notification_logs.board_id
      and b.profile_id = notification_logs.profile_id
      and p.auth_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from boards b
    join profiles p on p.id = b.profile_id
    where b.id = notification_logs.board_id
      and b.profile_id = notification_logs.profile_id
      and p.auth_user_id = auth.uid()
  )
);

-- ----------------------------------
-- delete
-- ----------------------------------
drop policy if exists "notification_logs delete" on notification_logs;
create policy "notification_logs delete"
on notification_logs
for delete
to authenticated
using (
  exists (
    select 1
    from boards b
    join profiles p on p.id = b.profile_id
    where b.id = notification_logs.board_id
      and b.profile_id = notification_logs.profile_id
      and p.auth_user_id = auth.uid()
  )
);

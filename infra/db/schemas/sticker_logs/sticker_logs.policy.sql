alter table sticker_logs enable row level security;

-- ----------------------------------
-- select
-- ----------------------------------
drop policy if exists "sticker_logs select" on sticker_logs;
create policy "sticker_logs select"
on sticker_logs
for select
to authenticated
using (
  exists (
    select 1
    from boards b
    join profiles p on p.id = b.profile_id
    where b.id = sticker_logs.board_id
      and b.profile_id = sticker_logs.profile_id
      and p.auth_user_id = auth.uid()
  )
);

-- ----------------------------------
-- insert
-- ----------------------------------
drop policy if exists "sticker_logs insert" on sticker_logs;
create policy "sticker_logs insert"
on sticker_logs
for insert
to authenticated
with check (
  exists (
    select 1
    from boards b
    join profiles p on p.id = b.profile_id
    where b.id = sticker_logs.board_id
      and b.profile_id = sticker_logs.profile_id
      and p.auth_user_id = auth.uid()
  )
);

-- ----------------------------------
-- update
-- ----------------------------------
drop policy if exists "sticker_logs update" on sticker_logs;
create policy "sticker_logs update"
on sticker_logs
for update
to authenticated
using (
  exists (
    select 1
    from boards b
    join profiles p on p.id = b.profile_id
    where b.id = sticker_logs.board_id
      and b.profile_id = sticker_logs.profile_id
      and p.auth_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from boards b
    join profiles p on p.id = b.profile_id
    where b.id = sticker_logs.board_id
      and b.profile_id = sticker_logs.profile_id
      and p.auth_user_id = auth.uid()
  )
);

-- ----------------------------------
-- delete
-- ----------------------------------
drop policy if exists "sticker_logs delete" on sticker_logs;
create policy "sticker_logs delete"
on sticker_logs
for delete
to authenticated
using (
  exists (
    select 1
    from boards b
    join profiles p on p.id = b.profile_id
    where b.id = sticker_logs.board_id
      and b.profile_id = sticker_logs.profile_id
      and p.auth_user_id = auth.uid()
  )
);

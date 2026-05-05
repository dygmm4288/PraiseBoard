alter table sticker_daily enable row level security;

drop policy if exists "select own sticker_daily" on sticker_daily;
create policy "select own sticker_daily"
on sticker_daily
for select
using (
    exists (
        select 1
        from boards
        join profiles on profiles.id = boards.profile_id
        where boards.id = sticker_daily.board_id
        and profiles.auth_user_id = auth.uid()
    )
);

drop policy if exists "no direct insert" on sticker_daily;
create policy "no direct insert"
on sticker_daily
for insert
with check (false);

drop policy if exists "no direct update" on sticker_daily;
create policy "no direct update"
on sticker_daily
for update
using (false)
with check (false);

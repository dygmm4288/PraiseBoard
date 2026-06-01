update boards
set completed_at = null
where status <> 'completed'
  and completed_at is not null;

update boards b
set completed_at = latest.completed_at
from (
  select board_id, max(created_at) as completed_at
  from sticker_logs
  group by board_id
) latest
where b.id = latest.board_id
  and b.status = 'completed'
  and b.completed_at is null;

alter table boards
drop constraint if exists boards_completed_at_requires_completed_status;

alter table boards
add constraint boards_completed_at_requires_completed_status
check (completed_at is null or status = 'completed');

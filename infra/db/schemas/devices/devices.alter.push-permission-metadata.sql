alter table devices
    add column if not exists push_enabled_updated_at timestamptz null,
    add column if not exists push_permission_status text not null default 'undetermined'
        check (push_permission_status in ('undetermined', 'denied', 'granted')),
    add column if not exists push_permission_granted_at timestamptz null,
    add column if not exists push_permission_updated_at timestamptz null;

update devices
set push_permission_status = 'granted'
where push_enabled = true
  and push_permission_status = 'undetermined';

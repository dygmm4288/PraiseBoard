create table app_settings (
    id integer primary key default 1,
    
    latest_version text not null,
    min_version text not null,

    maintenance boolean not null default false,
    maintenance_message text,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint app_settings_single_row check (id = 1)
);

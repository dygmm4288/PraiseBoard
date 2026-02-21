create table profiles (
	user_id uuid primary key references auth.users(id) on delete cascade,
	
	created_at timestamptz null default now(),
	updated_at timestamptz null default now(),
	
	-- MVP: one device = one user
	device_id text unique not null
);

create table boards (
	id uuid primary key default gen_random_uuid(),
	
	created_at timestamptz null default now(),
	updated_at timestamptz null default now(),
	
	user_id uuid not null references profiles(user_id) on delete cascade,
	
	title text not null,
	target_count int not null check (target_count > 0),
	current_count int not null default 0,
	completed_at timestamptz null default now(),
	
	reward_enabled boolean not null default false,
	status board_status not null default 'active'
);

create table sticker_logs (
	id uuid primary key default gen_random_uuid(),
	
	created_at timestamptz null default now(),
	updated_at timestamptz null default now(),
	
	user_id uuid not null references profiles(user_id) on delete cascade,
	board_id uuid not null references boards(id) on delete cascade,
	
	source sticker_source not null
);

create index idx_sticker_logs_board_time
on sticker_logs (board_id, created_at);

create table notification_logs(
	id uuid primary key default gen_random_uuid(),
	
	sent_at timestamptz not null default now(),
	open_at timestamptz not null default now(),
	type text not null,
	
	user_id uuid not null references profiles(user_id) on delete cascade,
	board_id uuid not null references boards(id) on delete cascade
);

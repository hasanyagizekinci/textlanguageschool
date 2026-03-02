-- Players table: nickname-first, optional auth link
create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  auth_id uuid references auth.users(id) on delete set null unique,
  nickname text not null,
  avatar_seed text default '',
  role text not null default 'student' check (role in ('student', 'teacher')),
  total_xp int default 0,
  best_streak int default 0,
  current_streak int default 0,
  last_active_date date,
  created_at timestamptz default now()
);

alter table public.players enable row level security;

-- Everyone can see players (for leaderboard)
create policy "players_select_all" on public.players for select using (true);

-- Anyone can create a player (anonymous nickname flow)
create policy "players_insert_anon" on public.players for insert with check (true);

-- Only auth-linked users can update their own player
create policy "players_update_own" on public.players for update using (
  auth.uid() = auth_id
);

-- Also allow update where no auth_id is set (anonymous self-update via server action)
create policy "players_update_anon" on public.players for update using (
  auth_id is null
);

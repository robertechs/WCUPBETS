-- WCupBets MVP: markets, quotes, bets, cron cursors
-- Run in Supabase SQL editor or via supabase db push

create table if not exists public.markets (
  id text primary key,
  market_type text not null check (market_type in ('mc-target', 'h2h')),
  title text not null,
  deadline_ms bigint not null,
  target_mc_usd bigint,
  resolution_rule text not null check (resolution_rule in ('mc_gte', 'mc_lt', 'h2h')),
  token_a_symbol text not null,
  token_b_symbol text,
  outcome text check (outcome is null or outcome in ('YES', 'NO')),
  resolved_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.bet_quotes (
  id uuid primary key default gen_random_uuid(),
  market_id text not null references public.markets(id) on delete restrict,
  user_pubkey text not null,
  side text not null check (side in ('YES', 'NO')),
  amount_lamports bigint not null check (amount_lamports > 0),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'expired')),
  created_at timestamptz default now(),
  expires_at timestamptz not null
);

create index if not exists bet_quotes_pending_market on public.bet_quotes (market_id, status) where status = 'pending';

create table if not exists public.bets (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.bet_quotes(id) on delete restrict,
  market_id text not null references public.markets(id) on delete restrict,
  user_pubkey text not null,
  side text not null check (side in ('YES', 'NO')),
  amount_lamports bigint not null,
  deposit_sig text not null unique,
  block_time bigint,
  status text not null default 'confirmed' check (status in ('confirmed', 'paid')),
  payout_sig text,
  payout_lamports bigint,
  created_at timestamptz default now()
);

create index if not exists bets_market_side on public.bets (market_id, side, status);
create index if not exists bets_user on public.bets (user_pubkey);

create table if not exists public.cron_cursors (
  job_id text primary key,
  last_signature text,
  updated_at timestamptz default now()
);

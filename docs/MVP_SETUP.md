# WCupBets MVP (mainnet)

## 1. Supabase

1. Create a Supabase project.
2. Run the SQL in [`supabase/migrations/001_wcup_mvp.sql`](supabase/migrations/001_wcup_mvp.sql) in the SQL editor.
3. Copy **Project URL**, **anon key**, and **service role key** into `.env.local` (see [`.env.example`](.env.example)).

## 2. Seed markets

With `ADMIN_TOKEN` set:

```bash
curl -X POST "$ORIGIN/api/admin/seed-markets" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

This upserts rows from `WCUP_MARKETS` in [`src/lib/markets.ts`](src/lib/markets.ts).

## 3. Vault wallet

1. Generate a dedicated Solana keypair for the custodial vault (keep `VAULT_SECRET_KEY` base58 **secret** only on the server).
2. Set `NEXT_PUBLIC_VAULT_PUBKEY` to the public address users send SOL to.
3. Fund the vault with enough SOL for transaction fees on payout txs.

## 4. Environment

Copy [`.env.example`](.env.example) to `.env.local` and fill all variables.

## 5. Cron jobs (Vercel / external)

Call periodically with `Authorization: Bearer $CRON_SECRET`:

| Endpoint | Purpose |
|----------|---------|
| `POST /api/cron/ingest` | Match vault deposits (memo + quote) → `bets` |
| `POST /api/cron/resolve` | After deadline, set `markets.outcome` from DexScreener |
| `POST /api/cron/payout` | Pay winning `bets` from vault (98% of parimutuel share) |

## 6. Admin override

```bash
curl -X POST "$ORIGIN/api/admin/markets/<marketId>/force-resolve" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"outcome":"YES"}'
```

## User flow

1. Connect Phantom / Solflare (mainnet RPC from `NEXT_PUBLIC_SOLANA_RPC_URL`).
2. YES/NO opens modal → `POST /api/bets/build` returns unsigned tx (transfer + memo).
3. User signs and sends; `ingest` credits the bet when the memo matches a pending quote.

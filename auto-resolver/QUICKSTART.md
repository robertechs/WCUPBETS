# Quick Start - Run on Your Laptop

## 1. Install Dependencies
```bash
cd auto-resolver
npm install
```

## 2. Verify Configuration
The resolver is already configured with your private key in `.env.production`:
- Resolver wallet: 0x9eF2...
- Check interval: 5 seconds
- BSC RPC: Public endpoint

## 3. Start the Resolver

### Option A: Run in Terminal (see live logs)
```bash
./start-local.sh
```
**Pros:** See logs in real-time  
**Cons:** Stops when you close terminal or sleep laptop  
**Use for:** Testing, monitoring, debugging

### Option B: Run in Background (keeps running)
```bash
./start-background.sh
```
**Pros:** Runs even when terminal closed or laptop sleeps  
**Cons:** Need to use `pm2 logs` to see output  
**Use for:** 24/7 operation on your laptop

## 4. Monitor

### If running in foreground:
- Logs appear in terminal
- Press Ctrl+C to stop

### If running in background:
```bash
pm2 logs hivebets-resolver    # View live logs
pm2 status                     # Check if running
pm2 monit                      # Real-time monitor
```

## 5. Admin Tasks

### Resolve social markets manually:
```bash
npm run admin
> 1  # Set social market outcome
> CZ_TWEET
> 1  # 1=YES, 2=NO
```

### Check recent activity:
```bash
npm run admin
> 3  # View recent logs
```

## What the Resolver Does

Every 5 seconds:
1. ✅ Checks all markets for expired deadlines
2. 📊 For price markets (BNB): Gets price from Sora Oracle → CoinGecko
3. 🐦 For social markets (tweets): Checks your manual override
4. 💰 For market cap markets: Gets data from DEXScreener
5. ⛓️ Resolves on-chain automatically
6. 📝 Logs transaction to resolver.log

## Keeping Your Laptop Awake

The resolver needs your laptop awake to run. Two options:

### Option 1: Caffeinate (macOS)
```bash
caffeinate -i pm2 logs hivebets-resolver
```
Keeps laptop awake while watching logs.

### Option 2: System Preferences
- Go to System Preferences → Energy Saver
- Set "Prevent computer from sleeping" when plugged in
- Or use app like "Amphetamine" from Mac App Store

## Stopping the Resolver

### If running in foreground:
Press `Ctrl+C`

### If running in background:
```bash
pm2 stop hivebets-resolver
```

## Troubleshooting

**Not resolving markets?**
```bash
# Check if running
pm2 status

# View errors
pm2 logs hivebets-resolver --err

# Restart
pm2 restart hivebets-resolver
```

**Wallet out of BNB?**
- Resolver needs ~0.1 BNB for gas fees
- Check balance on BSCScan

**Markets expired but not resolving?**
- Check if markets have bets (won't resolve empty markets)
- Verify deadline has truly passed
- Check logs for specific errors

## Cost

Running on your laptop:
- **Electricity**: ~$1-2/month (laptop idle power)
- **BSC Gas**: ~$0.50 per resolution
- **APIs**: Free (CoinGecko, DEXScreener)

Total: ~$5-10/month depending on resolution frequency.

## Next Steps

1. Start the resolver: `./start-background.sh`
2. Monitor logs: `pm2 logs hivebets-resolver`
3. Test with a small market first
4. Once confident, enable auto-start on boot: `pm2 startup && pm2 save`

Questions? Check the logs first!


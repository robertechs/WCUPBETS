# Hivebets Auto-Resolver

Automatically monitors and resolves prediction markets using Sora Oracle and free APIs.

## Quick Start - Run on Your Laptop

### Option 1: Foreground (see logs in terminal)
```bash
cd auto-resolver
npm install
./start-local.sh
```
Press Ctrl+C to stop.

### Option 2: Background (runs even when terminal closed)
```bash
cd auto-resolver
npm install
./start-background.sh
```

**Monitor background process:**
```bash
pm2 logs hivebets-resolver    # View logs
pm2 status                     # Check status
pm2 stop hivebets-resolver     # Stop
pm2 restart hivebets-resolver  # Restart
```

**Auto-start on laptop boot:**
```bash
pm2 startup
pm2 save
```

### Production Deployment (DigitalOcean) - Optional

#### 1. Create DigitalOcean Droplet
- Size: Basic ($6/month - 1GB RAM)
- OS: Ubuntu 22.04
- Add your SSH key

#### 2. Configure Deployment
```bash
# Set your droplet IP
export DROPLET_IP="your_droplet_ip_here"

# Deploy
./deploy.sh
```

#### 3. Monitor
```bash
# View logs
ssh root@$DROPLET_IP 'cd /opt/hivebets-resolver && docker-compose logs -f'

# Check status
ssh root@$DROPLET_IP 'cd /opt/hivebets-resolver && docker-compose ps'
```

## How It Works

**Every 5 seconds**, the resolver:
1. Checks all markets for expired deadlines
2. For expired markets:
   - **Price markets**: Queries Sora Oracle → CoinGecko fallback
   - **Social markets**: Checks admin override file
   - **Market cap markets**: Queries DEXScreener API
3. Resolves market on-chain with determined outcome
4. Logs transaction and updates status

## Admin CLI

For social markets (Twitter, events), use the admin CLI:

```bash
cd auto-resolver
npm run admin

# Or on DigitalOcean
ssh root@$DROPLET_IP 'cd /opt/hivebets-resolver/auto-resolver && npm run admin'
```

### Setting Social Market Outcomes
```bash
# Example: Set CZ tweet outcome to YES
npm run admin
> Select option: 1
> Market ID: CZ_TWEET
> Outcome: 1  # 1=YES, 2=NO
```

The resolver will pick up the outcome on the next check cycle.

## Market Configuration

Edit `market-resolver.js` to add new markets:

```javascript
MARKETS.YOUR_MARKET = {
  address: '0x...',
  name: 'Your Market Name',
  type: 'PRICE',  // or 'SOCIAL', 'MCAP'
  resolve: async (oracle) => {
    // Your resolution logic
    return 1; // or 2
  }
}
```

## Environment Variables

```env
RESOLVER_PRIVATE_KEY=0x...        # Wallet with resolver permissions
BSC_RPC_URL=https://...           # BSC RPC endpoint
CHECK_INTERVAL=5000               # Check every 5 seconds
SORA_ORACLE_ENDPOINT=https://...  # Sora Oracle API
```

## Costs

- **DigitalOcean**: $6/month
- **BSC Gas**: ~$0.50 per resolution
- **APIs**: Free (CoinGecko, DEXScreener)
- **Total**: ~$10/month

## Logs

Logs are saved to `resolver.log` and rotated at 10MB.

View recent logs:
```bash
tail -f auto-resolver/resolver.log
```

## Troubleshooting

**Resolver not working?**
- Check wallet has BNB for gas (~0.1 BNB minimum)
- Verify RESOLVER_PRIVATE_KEY has permissions on contracts
- Check logs for errors

**Markets not resolving?**
- Ensure deadline has passed
- Check if market has bets (won't resolve empty markets)
- Verify price/data sources are accessible

**DigitalOcean connection issues?**
- Verify SSH key is added to droplet
- Check droplet IP is correct
- Ensure firewall allows SSH (port 22)

## Security

- Resolver wallet should be separate from personal wallet
- Only needs resolver permissions, not full ownership
- Keep ~0.1-0.5 BNB for gas fees
- Log files don't contain sensitive data

## Support

For issues or questions, check the logs first:
```bash
docker-compose logs -f resolver
```

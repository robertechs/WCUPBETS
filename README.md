# Hivebets - Decentralized Prediction Markets

![Hivebets Banner](./public/og-image.png)

## Features

- **Gasless Betting with S402** - Place bets without paying gas fees
- **Oracle-Powered Markets** - Automatic resolution via oracle
- **Parimutuel Betting** - Fair odds based on pool distribution
- **Secure & Transparent** - All bets on-chain, verifiable on BSCScan
- **Mobile-Friendly** - Beautiful UI works on all devices
- **Multi-Language** - English and Chinese support

## What is S402 Gasless Betting?

Hivebets integrates **Sora S402** - a protocol that lets users place bets by just signing a message instead of paying gas fees.

### How It Works:
1. User signs an EIP-712 message (no gas required)
2. Facilitator receives the signature
3. Transaction is executed on-chain by facilitator (who sponsors gas)
4. Bet is recorded - user pays 0 BNB for gas

**Learn more**: [x402 BNB Introduction](https://t.co/XUmMw1MI6B)

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Web3**: Wagmi, Viem, RainbowKit
- **Smart Contracts**: Solidity 0.8.24, Hardhat
- **Oracle**: Hivebets Oracle
- **Gasless**: Sora S402 Protocol (EIP-712 signatures)
- **Chain**: BNB Smart Chain (BSC)

## Project Structure

```
final_hivebets_darc/
├── src/
│   ├── app/                    # Next.js app router
│   ├── components/             # React components
│   │   └── betting-modal.tsx   # S402-enabled betting modal
│   ├── hooks/
│   │   ├── usePlaceBet.ts     # Regular betting hook
│   │   └── useS402Bet.ts      # Gasless betting hook
│   ├── lib/
│   │   ├── wagmi.ts           # Wagmi configuration
│   │   └── sora-s402/         # S402 gasless betting library
│   │       ├── types.ts       # EIP-712 types
│   │       ├── signature.ts   # Signature generation
│   │       ├── facilitator.ts # Relayer communication
│   │       └── config.ts      # S402 configuration
│   ├── contracts/
│   │   └── BinaryMarketV2.ts       # Standard contract ABI
│   └── data/
│       └── betCards.ts        # Market configurations
├── contracts/                  # Solidity smart contracts
│   └── BinaryMarketV2.sol     # Standard market contract
├── scripts/                    # Deployment & management scripts
```

## Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm
- MetaMask or compatible wallet
- BNB for gas (unless using S402 gasless)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/hivebets.git
cd hivebets

# Install dependencies
npm install
# or
pnpm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create `.env.local`:

```bash
# S402 Gasless Betting
NEXT_PUBLIC_S402_ENABLED=true
NEXT_PUBLIC_S402_FACILITATOR_URL=your_facilitator_url

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

### Development

```bash
# Start development server
npm run dev

# Open browser
open http://localhost:3004
```

## Using Gasless Betting

1. **Connect Wallet** - Click "Connect Wallet" in the navbar
2. **Choose a Market** - Browse active prediction markets
3. **Place a Bet**:
   - Click YES or NO
   - Enter bet amount
   - Gasless mode ON (default) - Just sign, no gas
   - Toggle OFF for standard betting (requires gas)
4. **Sign in Wallet** - Approve the EIP-712 signature
5. **Done** - Bet is executed without gas fees

### Wallet Experience

**With S402 Gasless (Recommended)**:
- Wallet shows: "Sign Message" or "Sign Typed Data"
- No gas estimation
- No BNB required for gas
- Instant signature

**Standard Betting**:
- Wallet shows: "Confirm Transaction"
- Gas estimation displayed
- Requires BNB for gas
- Blockchain confirmation needed

## Documentation

### For Users
- [How to Bet](./docs/markets/how-to-bet.md)
- [Understanding Odds](./docs/markets/understanding-odds.md)
- [Claiming Winnings](./docs/markets/claiming.md)
- [FAQ](./docs/getting-started/faq.md)

### For Developers
- [Smart Contracts](./docs/how-it-works/prediction-markets.md)
- [Oracle Integration](./docs/ORACLE_INTEGRATION.md)

### GitBook
Full Documentation: See our GitBook documentation

## Smart Contracts

### BinaryMarketV2 (S402-Enabled)

**Deployed on BSC Mainnet**: `0x...` (Update after deployment)

Key features:
- Standard `bet()` function (requires gas)
- `betWithSignature()` for gasless betting via S402
- EIP-712 signature verification
- Nonce-based replay protection
- Signature expiry mechanism
- Automatic oracle resolution

### Verified Contracts

All contracts are verified on BSCScan:
- Market Factory: `0x...`
- Active Markets: See [Active Markets](./docs/markets/active-markets.md)

## Architecture

### S402 Gasless Flow

```
User (Wallet)
    |
    | 1. Sign EIP-712 (No gas)
    v
Frontend (Next.js App)
    |
    | 2. Send signature
    v
S402 Facilitator (Relayer)
    |
    | 3. Execute tx (Sponsors gas)
    v
BNB Chain Smart Contract
    |
    4. Bet recorded
```

### Standard Betting Flow

```
User (Wallet)
    |
    | 1. Sign & Pay gas
    v
BNB Chain Smart Contract
    |
    2. Bet recorded
```

## Security

### S402 Security Features

- **EIP-712 Structured Signing** - Prevents phishing attacks
- **Nonce-Based Replay Protection** - Each signature used once
- **Signature Expiry** - 10-minute validity window
- **Facilitator Whitelist** - Only authorized relayer can execute
- **Amount Verification** - Contract verifies bet amount matches signature

### Audits

- Smart contract audit pending
- EIP-712 implementation reviewed
- Signature verification tested

## Testing

### Run Tests

```bash
# Smart contract tests
cd contracts
npx hardhat test

# Frontend tests
npm run test
```

### Test S402 Gasless Betting

```bash
# 1. Start development server
npm run dev

# 2. Test in browser
# - Connect wallet
# - Place bet with gasless ON
# - Check console logs
# - Verify on BSCScan
```

## Market Types

Currently supported:
- **Token Market Cap** - Will token reach target market cap?
- **Price Predictions** - Will BNB/token reach target price?
- **Event Outcomes** - Will specific event happen?

## Deployment

### Frontend (Vercel)

```bash
# Deploy to Vercel
vercel --prod

# Or connect GitHub repo to Vercel dashboard
```

### Smart Contracts (BSC)

```bash
cd contracts
npx hardhat run scripts/deployFactoryV2.js --network bsc
```

### Facilitator (Railway/Render)

```bash
cd s402-facilitator
railway init
railway up
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md).

### Development Workflow

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file.

## Links

- **Twitter**: [@Hivebets](https://twitter.com/hivebets)
- **Telegram**: [t.me/hivebets](https://t.me/hivebets)
- **BSCScan**: [View Contracts](https://bscscan.com/address/0x...)

## Acknowledgments

- [Sora S402 Protocol](https://github.com/SoraOracle/SoraOracle) by Sora Oracle
- Hivebets Oracle
- [Wagmi](https://wagmi.sh)
- [RainbowKit](https://rainbowkit.com)
- BNB Chain Community

## Support

- **Discord**: [Join our server](https://discord.gg/hivebets)
- **Email**: support@hivebets.io
- **GitHub Issues**: [Report bugs](https://github.com/yourusername/hivebets/issues)

---

## Roadmap

- [x] Basic prediction markets
- [x] Oracle integration for automatic resolution
- [x] S402 gasless betting
- [ ] Multi-token support (USDT, BUSD)
- [ ] Gasless claims
- [ ] Mobile app
- [ ] DAO governance
- [ ] Cross-chain markets

---

**Built with care by the Hivebets Team**

*Empowering decentralized predictions with gasless transactions*

// Automatic Market Resolver - Checks every 5 seconds
require('dotenv').config({ path: '.env.production' });
const { createWalletClient, createPublicClient, http } = require('viem');
const { bsc } = require('viem/chains');
const { privateKeyToAccount } = require('viem/accounts');
const SoraOracleClient = require('./sora-oracle-client');
const Logger = require('./logger');
const fs = require('fs');
const path = require('path');

const RESOLVER_PRIVATE_KEY = process.env.RESOLVER_PRIVATE_KEY;
const BSC_RPC_URL = process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org/';
const CHECK_INTERVAL = parseInt(process.env.CHECK_INTERVAL || '5000'); // 5 seconds

const BINARY_MARKET_ABI = [
  {
    inputs: [],
    name: 'state',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'deadline',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint8', name: '_outcome', type: 'uint8' }],
    name: 'resolve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'yesPool',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'noPool',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
];

// Market definitions with resolution logic
const MARKETS = {
  BNB_1200: {
    address: '0x1bb78D6F87dAa1C449f53b6b683Ce2aeD268eC3e',
    name: 'BNB $1200',
    type: 'PRICE',
    resolve: async (oracle) => {
      return await oracle.checkPriceTarget('BNB', 1200);
    }
  },
  BNB_1100: {
    address: '0x0000000000000000000000000000000000000000', // Update after deployment
    name: 'BNB $1100',
    type: 'PRICE',
    resolve: async (oracle) => {
      return await oracle.checkPriceTarget('BNB', 1100);
    }
  },
  CZ_TWEET: {
    address: '0xe7Bcd9358060Ded755B82eEBFB092e31F36C8eC7',
    name: 'CZ Tweet about Giggle',
    type: 'SOCIAL',
    resolve: async () => {
      // Check admin override file
      const overrideFile = path.join(__dirname, 'social_outcomes.json');
      if (fs.existsSync(overrideFile)) {
        const outcomes = JSON.parse(fs.readFileSync(overrideFile, 'utf8'));
        if (outcomes.CZ_TWEET !== undefined) {
          Logger.info('Using admin override for CZ_TWEET', { outcome: outcomes.CZ_TWEET });
          return outcomes.CZ_TWEET;
        }
      }
      Logger.warn('No admin override for CZ_TWEET - skipping resolution');
      return null; // Don't resolve without manual verification
    }
  },
  BINANCE_LIFE: {
    address: '0x4Dc0bdCD2E3320E8D50B2D8E70066bC9D85dE115',
    name: '币安人生 $300M',
    type: 'MCAP',
    tokenAddress: '0x...',  // Add actual token address
    resolve: async (oracle) => {
      // Would need actual 币安人生 token address
      Logger.warn('Token address needed for 币安人生 - skipping');
      return null;
    }
  },
  PALU: {
    address: '0x53105eC7dA79f810673c62674aE491d65b1BBD8F',
    name: 'PALU $30M',
    type: 'MCAP',
    tokenAddress: '0x...',  // Add actual PALU token address
    resolve: async (oracle) => {
      Logger.warn('Token address needed for PALU - skipping');
      return null;
    }
  }
};

class MarketResolver {
  constructor() {
    if (!RESOLVER_PRIVATE_KEY) {
      throw new Error('RESOLVER_PRIVATE_KEY not found in environment');
    }

    this.account = privateKeyToAccount(RESOLVER_PRIVATE_KEY);
    this.publicClient = createPublicClient({
      chain: bsc,
      transport: http(BSC_RPC_URL)
    });
    this.walletClient = createWalletClient({
      account: this.account,
      chain: bsc,
      transport: http(BSC_RPC_URL)
    });
    this.oracle = new SoraOracleClient();
    
    Logger.info('Market Resolver initialized', {
      details: {
        wallet: this.account.address,
        checkInterval: `${CHECK_INTERVAL}ms`,
        markets: Object.keys(MARKETS).length
      }
    });
  }

  async checkMarket(marketKey, market) {
    try {
      // Skip placeholder addresses
      if (market.address === '0x0000000000000000000000000000000000000000') {
        return;
      }

      // Check if already resolved
      const state = await this.publicClient.readContract({
        address: market.address,
        abi: BINARY_MARKET_ABI,
        functionName: 'state'
      });

      if (state === 1) {
        return; // Already resolved
      }

      if (state === 2) {
        return; // Cancelled
      }

      // Check deadline
      const deadline = await this.publicClient.readContract({
        address: market.address,
        abi: BINARY_MARKET_ABI,
        functionName: 'deadline'
      });

      const now = Math.floor(Date.now() / 1000);
      const timeUntilDeadline = Number(deadline) - now;

      if (timeUntilDeadline > 0) {
        return; // Not ready yet
      }

      // Check pool sizes
      const [yesPool, noPool] = await Promise.all([
        this.publicClient.readContract({
          address: market.address,
          abi: BINARY_MARKET_ABI,
          functionName: 'yesPool'
        }),
        this.publicClient.readContract({
          address: market.address,
          abi: BINARY_MARKET_ABI,
          functionName: 'noPool'
        })
      ]);

      // Skip if no bets placed
      if (yesPool === 0n && noPool === 0n) {
        Logger.warn(`Market ${market.name} has no bets - skipping resolution`);
        return;
      }

      // Deadline passed - determine outcome
      Logger.resolve(`Resolving ${market.name} (${market.address})`);
      
      const outcome = await market.resolve(this.oracle);
      
      if (outcome === null) {
        Logger.warn(`Cannot determine outcome for ${market.name}`);
        return;
      }

      const outcomeText = outcome === 1 ? 'YES' : 'NO';
      Logger.resolve(`Outcome determined: ${outcomeText}`, { market: market.name });

      // Resolve on-chain
      const hash = await this.walletClient.writeContract({
        address: market.address,
        abi: BINARY_MARKET_ABI,
        functionName: 'resolve',
        args: [outcome]
      });

      Logger.success(`Market resolved: ${market.name}`, {
        details: {
          outcome: outcomeText,
          txHash: hash,
          bscscan: `https://bscscan.com/tx/${hash}`
        }
      });

      await this.publicClient.waitForTransactionReceipt({ hash });
      Logger.success(`Transaction confirmed for ${market.name}`);

    } catch (error) {
      Logger.error(`Error checking market ${market.name}`, {
        details: {
          error: error.message,
          address: market.address
        }
      });
    }
  }

  async checkAllMarkets() {
    const checks = Object.entries(MARKETS).map(([key, market]) =>
      this.checkMarket(key, market)
    );
    await Promise.allSettled(checks);
  }

  start() {
    Logger.info(`Starting auto-resolver (${CHECK_INTERVAL}ms interval)`);
    Logger.info('Press Ctrl+C to stop');
    
    // Run immediately
    this.checkAllMarkets();

    // Then run at intervals
    setInterval(() => {
      this.checkAllMarkets();
    }, CHECK_INTERVAL);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  Logger.info('Shutting down resolver...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  Logger.info('Shutting down resolver...');
  process.exit(0);
});

// Start the resolver
if (require.main === module) {
  const resolver = new MarketResolver();
  resolver.start();
}

module.exports = MarketResolver;

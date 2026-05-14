// Sora Oracle Client with CoinGecko Fallback
const axios = require('axios');

const SORA_ORACLE_API = 'https://api.soraoracle.com/v1';
const COINGECKO_API = 'https://api.coingecko.com/api/v3';

class SoraOracleClient {
  constructor() {
    this.soraAvailable = true;
    this.lastSoraCheck = 0;
  }

  /**
   * Get BNB price in USD
   * Tries Sora Oracle first, falls back to CoinGecko
   */
  async getBNBPrice() {
    try {
      // Try Sora Oracle first
      if (this.soraAvailable) {
        const price = await this.getSoraBNBPrice();
        if (price) {
          console.log(`✅ Sora Oracle: BNB = $${price}`);
          return price;
        }
      }
    } catch (error) {
      console.log('⚠️  Sora Oracle unavailable, using fallback');
      this.soraAvailable = false;
      setTimeout(() => { this.soraAvailable = true; }, 60000); // Retry after 1 min
    }

    // Fallback to CoinGecko
    return await this.getCoinGeckoBNBPrice();
  }

  /**
   * Get token price from Sora Oracle
   */
  async getSoraBNBPrice() {
    try {
      // Sora Oracle endpoint for BNB/USD
      // Adjust based on actual Sora Oracle API documentation
      const response = await axios.get(`${SORA_ORACLE_API}/price/BNB_USD`, {
        timeout: 5000
      });
      
      return parseFloat(response.data.price);
    } catch (error) {
      throw new Error('Sora Oracle query failed');
    }
  }

  /**
   * Get BNB price from CoinGecko (free API, no key needed)
   */
  async getCoinGeckoBNBPrice() {
    try {
      const response = await axios.get(
        `${COINGECKO_API}/simple/price?ids=binancecoin&vs_currencies=usd`,
        { timeout: 5000 }
      );
      
      const price = response.data.binancecoin.usd;
      console.log(`📊 CoinGecko: BNB = $${price}`);
      return price;
    } catch (error) {
      console.error('❌ CoinGecko API failed:', error.message);
      throw new Error('All price sources unavailable');
    }
  }

  /**
   * Get token market cap from DEXScreener (free API)
   */
  async getTokenMarketCap(tokenAddress) {
    try {
      const response = await axios.get(
        `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`,
        { timeout: 5000 }
      );
      
      if (response.data.pairs && response.data.pairs.length > 0) {
        // Get the pair with highest liquidity
        const mainPair = response.data.pairs.sort((a, b) => 
          parseFloat(b.liquidity.usd) - parseFloat(a.liquidity.usd)
        )[0];
        
        const mcap = parseFloat(mainPair.fdv || mainPair.marketCap || 0);
        console.log(`📊 DEXScreener: Token market cap = $${mcap.toLocaleString()}`);
        return mcap;
      }
      
      return 0;
    } catch (error) {
      console.error('❌ DEXScreener API failed:', error.message);
      return 0;
    }
  }

  /**
   * Check if price target is met
   */
  async checkPriceTarget(asset, targetPrice) {
    let currentPrice;
    
    if (asset === 'BNB') {
      currentPrice = await this.getBNBPrice();
    } else {
      throw new Error(`Unsupported asset: ${asset}`);
    }
    
    const result = currentPrice >= targetPrice;
    console.log(`   Target: $${targetPrice}, Current: $${currentPrice} → ${result ? 'YES' : 'NO'}`);
    return result ? 1 : 2; // 1 = YES, 2 = NO
  }

  /**
   * Check if market cap target is met
   */
  async checkMarketCapTarget(tokenAddress, targetMcap) {
    const currentMcap = await this.getTokenMarketCap(tokenAddress);
    const result = currentMcap >= targetMcap;
    console.log(`   Target: $${targetMcap.toLocaleString()}, Current: $${currentMcap.toLocaleString()} → ${result ? 'YES' : 'NO'}`);
    return result ? 1 : 2;
  }
}

module.exports = SoraOracleClient;


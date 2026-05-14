# Deploy PALU Market Contract

## Overview
Deploy a new BinaryMarket contract for: **"Will PALU trade above $20M by November 12"**

## Contract Parameters

- **Question**: "Will PALU trade above $20M by November 12?"
- **Deadline**: November 12, 2025, 10PM EST (Unix timestamp: 1731466800)
- **Target Market Cap**: $20,000,000
- **Oracle**: Use existing oracle setup
- **Facilitator**: Your S402 facilitator address

## Deployment Steps

### Quick Deploy with Hardhat

**deployPaluMarket.js:**
```javascript
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying PALU market with account:", deployer.address);

  // Market parameters
  const question = "Will PALU trade above $20M by November 12?";
  const deadline = 1731466800; // Nov 12, 2025, 10PM EST
  const oracleAddress = "0xYourOracleAddress"; // Replace with your oracle
  const facilitatorAddress = "0x9eF2c1FbC05DFE3A9F80f06530EEe5E4cFA59348"; // Your S402 facilitator

  // Deploy BinaryMarketV2
  const BinaryMarketV2 = await hre.ethers.getContractFactory("BinaryMarketV2");
  const market = await BinaryMarketV2.deploy(
    question,
    deadline,
    oracleAddress,
    facilitatorAddress
  );

  await market.waitForDeployment();
  const marketAddress = await market.getAddress();

  console.log("✅ PALU Market deployed to:", marketAddress);
  console.log("📝 Question:", question);
  console.log("⏰ Deadline:", new Date(deadline * 1000).toLocaleString());
  console.log("🔮 Oracle:", oracleAddress);
  console.log("⚡ Facilitator:", facilitatorAddress);

  // Verify on BSCScan
  console.log("\n🔍 Verifying contract on BSCScan...");
  await hre.run("verify:verify", {
    address: marketAddress,
    constructorArguments: [
      question,
      deadline,
      oracleAddress,
      facilitatorAddress
    ],
  });

  console.log("\n✅ Contract verified on BSCScan!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

**Deploy:**
```bash
npx hardhat run scripts/deployPaluMarket.js --network bsc
```

### Using Remix IDE

1. Go to https://remix.ethereum.org/
2. Upload your `BinaryMarketV2.sol` contract
3. Deploy to BSC Mainnet:
   - `_question`: "Will PALU trade above $20M by November 12?"
   - `_deadline`: 1731466800
   - `_oracleAddress`: Your oracle contract address
   - `_facilitatorAddress`: 0x9eF2c1FbC05DFE3A9F80f06530EEe5E4cFA59348

## After Deployment

### Update Frontend

Edit `BinaryMarketV2.ts`:
```typescript
PALU: {
  address: "0xYOUR_NEW_CONTRACT_ADDRESS" as const, // PALU $20M - DEPLOYED
  tokenName: "PALU",
  description: "Will PALU trade above $20M?",
  targetMcap: "$20M",
  deadline: "2025-11-13T03:00:00Z",
  imageSrc: "/PALU-card.png"
},
```

### Configure Auto-Resolver

Add PALU market cap tracking to the resolver:

```javascript
// In auto-resolver/market-resolver.js

const PALU_TOKEN_ADDRESS = "0xPaluTokenAddress"; // Find on BSCScan

async function getPaluMarketCap() {
  try {
    // Query DEXScreener for PALU market cap
    const response = await axios.get(
      `https://api.dexscreener.com/latest/dex/tokens/${PALU_TOKEN_ADDRESS}`
    );
    
    if (response.data && response.data.pairs && response.data.pairs.length > 0) {
      const marketCap = response.data.pairs[0].fdv; // Fully diluted valuation
      console.log(`📊 PALU Market Cap: $${(marketCap / 1000000).toFixed(2)}M`);
      return marketCap;
    }
    
    return 0;
  } catch (error) {
    console.error("Error fetching PALU market cap:", error.message);
    return 0;
  }
}

// Add to market resolution logic
async function resolvePaluMarket(marketAddress) {
  const marketCap = await getPaluMarketCap();
  const targetMcap = 20000000; // $20M
  
  if (marketCap >= targetMcap) {
    console.log("✅ PALU reached $20M! Resolving as YES...");
    await resolveMarket(marketAddress, 1); // 1 = YES
  } else {
    console.log("❌ PALU did not reach $20M. Resolving as NO...");
    await resolveMarket(marketAddress, 2); // 2 = NO
  }
}
```

## PALU Token Info

- **Token Address**: Find on BSCScan or DEXScreener
- **Data Source**: DEXScreener API (free, no API key needed)
- **Market Cap Metric**: Use FDV (Fully Diluted Valuation)

## Summary of Changes

✅ Target changed: $30M → $20M
✅ Deadline changed: Nov 3 → Nov 12, 10PM EST
✅ Frontend updated with new description
✅ Translations updated (English & Chinese)
✅ Placeholder address: `0x0000000000000000000000000000000000000002`

## Next Steps

1. **Deploy contract** using Hardhat or Remix
2. **Copy the deployed address**
3. **Update `BinaryMarketV2.ts`** with real address
4. **Add PALU token address** to auto-resolver
5. **Restart dev server**: `npm run dev`

## Cost Estimate

- **Deployment Gas**: ~0.05 BNB (~$30)
- **Verification**: Free on BSCScan
- **API Costs**: $0 (DEXScreener is free)

---

**Ready to deploy?** Make sure you have BNB in your deployer wallet!


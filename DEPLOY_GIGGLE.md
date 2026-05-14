# Deploy GIGGLE Market Contract

## Overview
Deploy a new BinaryMarket contract for: **"Will GIGGLE reach $250M market cap by November 12"**

## Contract Parameters

- **Question**: "Will GIGGLE reach $250M market cap by November 12?"
- **Deadline**: November 12, 2025, 10PM EST (Unix timestamp: 1731466800)
- **Target Market Cap**: $250,000,000
- **Oracle**: Use existing oracle setup
- **Facilitator**: Your S402 facilitator address

## Deployment Steps

### Option 1: Using Hardhat (Recommended)

```bash
# Navigate to your contracts directory
cd /path/to/your/hardhat/project

# Create deployment script if not exists
nano scripts/deployGiggleMarket.js
```

**deployGiggleMarket.js:**
```javascript
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying GIGGLE market with account:", deployer.address);

  // Market parameters
  const question = "Will GIGGLE reach $250M market cap by November 12?";
  const deadline = 1731466800; // Nov 12, 2025, 10PM EST
  const targetMarketCap = hre.ethers.parseEther("250000000"); // $250M in wei (if tracking in BNB)
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

  console.log("✅ GIGGLE Market deployed to:", marketAddress);
  console.log("📝 Question:", question);
  console.log("⏰ Deadline:", new Date(deadline * 1000).toLocaleString());
  console.log("🔮 Oracle:", oracleAddress);
  console.log("⚡ Facilitator:", facilitatorAddress);

  // Verify on BSCScan (optional)
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
# Make sure you're on BSC Mainnet in hardhat.config.js
npx hardhat run scripts/deployGiggleMarket.js --network bsc
```

### Option 2: Using Remix IDE

1. Go to https://remix.ethereum.org/
2. Upload your `BinaryMarketV2.sol` contract
3. Compile with Solidity 0.8.x
4. Deploy to BSC Mainnet:
   - Network: BSC Mainnet (Chain ID: 56)
   - RPC: https://bsc-dataseed.binance.org/
   - Constructor Args:
     - `_question`: "Will GIGGLE reach $250M market cap by November 12?"
     - `_deadline`: 1731466800
     - `_oracleAddress`: Your oracle contract address
     - `_facilitatorAddress`: 0x9eF2c1FbC05DFE3A9F80f06530EEe5E4cFA59348

### Option 3: Using Foundry

```bash
# Deploy with Foundry
forge create src/BinaryMarketV2.sol:BinaryMarketV2 \
  --rpc-url https://bsc-dataseed.binance.org/ \
  --private-key $PRIVATE_KEY \
  --constructor-args \
    "Will GIGGLE reach $250M market cap by November 12?" \
    1731466800 \
    "0xYourOracleAddress" \
    "0x9eF2c1FbC05DFE3A9F80f06530EEe5E4cFA59348" \
  --verify \
  --etherscan-api-key $BSCSCAN_API_KEY
```

## After Deployment

### 1. Update Frontend with New Contract Address

Once deployed, update the contract address in your code:

```bash
# Edit BinaryMarketV2.ts
nano /Users/reef/Downloads/final_hivebets_darc\ 2/src/contracts/BinaryMarketV2.ts
```

Replace:
```typescript
BINANCE_LIFE: {
  address: "0x0000000000000000000000000000000000000001" as const, // GIGGLE $250M
```

With:
```typescript
BINANCE_LIFE: {
  address: "0xYOUR_NEW_CONTRACT_ADDRESS" as const, // GIGGLE $250M - DEPLOYED
```

### 2. Test the Contract

```bash
# Test placing a bet
npx hardhat run scripts/testGiggleBet.js --network bsc
```

### 3. Configure Auto-Resolver

The auto-resolver will automatically pick up the new market. Update the market config in:

```bash
nano /Users/reef/Downloads/final_hivebets_darc\ 2/auto-resolver/market-resolver.js
```

Add GIGGLE market cap tracking:
```javascript
// In the resolver, add DEXScreener tracking for GIGGLE
const GIGGLE_TOKEN_ADDRESS = "0xGiggleTokenAddress"; // Find on BSCScan

async function getGiggleMarketCap() {
  const response = await axios.get(
    `https://api.dexscreener.com/latest/dex/tokens/${GIGGLE_TOKEN_ADDRESS}`
  );
  const marketCap = response.data.pairs[0].fdv; // Fully diluted valuation
  return marketCap;
}
```

### 4. Restart Dev Server

```bash
cd /Users/reef/Downloads/final_hivebets_darc\ 2
npm run dev
```

## Verification

Once deployed and updated:

1. ✅ Visit your site: http://localhost:3000
2. ✅ You should see "Will GIGGLE reach 250m market cap by November 12"
3. ✅ Image should be giggle.jpg
4. ✅ Deadline shows "Nov 12, 10PM EST"
5. ✅ Users can place bets
6. ✅ Auto-resolver tracks GIGGLE market cap

## Important Notes

- **Gas Fee**: You'll need ~0.05 BNB for deployment (~$30)
- **Oracle**: Make sure your oracle supports market cap data
- **Facilitator**: The S402 facilitator must be funded with BNB for gasless transactions
- **Market Cap Source**: Configure your oracle to query DEXScreener or CoinGecko for GIGGLE's market cap

## Quick Deploy Command (All-in-One)

If you have your Hardhat project set up:

```bash
# Set your deployer private key
export PRIVATE_KEY="0xYourPrivateKey"

# Deploy
npx hardhat run scripts/deployGiggleMarket.js --network bsc

# Copy the deployed address and update frontend
# Then restart dev server
npm run dev
```

## Need Help?

- **Contract Template**: Use the same BinaryMarketV2.sol from previous deployments
- **Oracle Setup**: Use the same oracle as BNB/CZ markets
- **Questions?**: Check previous deployment logs in your hardhat artifacts

---

**Ready to deploy?** Run the deployment script and update the contract address in the frontend!


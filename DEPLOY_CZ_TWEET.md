# Deploy CZ Tweet Market Contract

## Overview
Deploy a new BinaryMarket contract for: **"Will CZ tweet about Giggle again by November 12"**

## Contract Parameters

- **Question**: "Will CZ tweet about Giggle again by November 12?"
- **Deadline**: November 12, 2025, 10PM EST (Unix timestamp: 1731466800)
- **Type**: Social/Tweet Prediction
- **Oracle**: Manual resolution (check Twitter/X for CZ tweets mentioning "Giggle")
- **Facilitator**: Your S402 facilitator address

## Deployment Steps

### Quick Deploy with Hardhat

**deployCZTweetMarket.js:**
```javascript
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying CZ Tweet market with account:", deployer.address);

  // Market parameters
  const question = "Will CZ tweet about Giggle again by November 12?";
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

  console.log("✅ CZ Tweet Market deployed to:", marketAddress);
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
npx hardhat run scripts/deployCZTweetMarket.js --network bsc
```

### Using Remix IDE

1. Go to https://remix.ethereum.org/
2. Upload your `BinaryMarketV2.sol` contract
3. Deploy to BSC Mainnet:
   - `_question`: "Will CZ tweet about Giggle again by November 12?"
   - `_deadline`: 1731466800
   - `_oracleAddress`: Your oracle contract address
   - `_facilitatorAddress`: 0x9eF2c1FbC05DFE3A9F80f06530EEe5E4cFA59348

## After Deployment

### Update Frontend

Edit `BinaryMarketV2.ts`:
```typescript
CZ_TWEET: {
  address: "0xYOUR_NEW_CONTRACT_ADDRESS" as const, // CZ Tweet - DEPLOYED
  tokenName: "CZ Tweet",
  description: "Will CZ tweet about Giggle again?",
  targetMcap: "N/A",
  deadline: "2025-11-13T03:00:00Z",
  imageSrc: "/CZ.png"
},
```

## How to Resolve This Market

Since this is a social/tweet prediction, resolution is **MANUAL**:

### Method 1: Using Admin CLI

```bash
cd auto-resolver
npm run admin

# Select: 1 - Set social market outcome
# Enter market address: 0xYOUR_CZ_TWEET_CONTRACT_ADDRESS
# Enter outcome: 1 for YES (if CZ tweeted), 2 for NO (if he didn't)
```

### Method 2: Direct Smart Contract Call

On November 12 after 10PM EST, check Twitter/X:

**If CZ tweeted about Giggle:**
```bash
# Call resolve() function with outcome = 1 (YES)
cast send 0xYOUR_CZ_TWEET_CONTRACT_ADDRESS \
  "resolve(uint8)" 1 \
  --rpc-url https://bsc-dataseed.binance.org/ \
  --private-key $PRIVATE_KEY
```

**If CZ did NOT tweet about Giggle:**
```bash
# Call resolve() function with outcome = 2 (NO)
cast send 0xYOUR_CZ_TWEET_CONTRACT_ADDRESS \
  "resolve(uint8)" 2 \
  --rpc-url https://bsc-dataseed.binance.org/ \
  --private-key $PRIVATE_KEY
```

### Method 3: Via BSCScan

1. Go to BSCScan: https://bscscan.com/address/0xYOUR_CONTRACT_ADDRESS
2. Click "Contract" → "Write Contract"
3. Connect wallet (must be contract owner)
4. Find `resolve()` function
5. Enter `1` for YES or `2` for NO
6. Click "Write" and confirm transaction

## How to Check CZ's Tweets

### Manual Check:
1. Go to https://x.com/cz_binance
2. Search for "Giggle" in his recent tweets
3. Check tweets between contract start and deadline (Nov 12, 10PM EST)

### Using Twitter API (Optional):
```javascript
// Pseudo-code for Twitter API check
const tweets = await twitterAPI.getUserTweets({
  userId: "cz_binance",
  startTime: "2025-11-01T00:00:00Z",
  endTime: "2025-11-13T03:00:00Z",
  query: "Giggle"
});

if (tweets.length > 0) {
  // CZ tweeted about Giggle - resolve as YES (1)
} else {
  // No tweets found - resolve as NO (2)
}
```

## Auto-Resolver Configuration

Update `auto-resolver/market-resolver.js` to check social markets:

```javascript
// Add CZ Tweet market tracking
const SOCIAL_MARKETS = {
  CZ_TWEET: {
    address: "0xYOUR_CZ_TWEET_CONTRACT_ADDRESS",
    type: "tweet",
    keywords: ["giggle"],
    twitterHandle: "@cz_binance"
  }
};

// Check if manual override file exists
async function checkSocialMarketOverride(marketAddress) {
  const overrideFile = `./social-overrides/${marketAddress}.json`;
  if (fs.existsSync(overrideFile)) {
    const data = JSON.parse(fs.readFileSync(overrideFile));
    return data.outcome; // 1 = YES, 2 = NO
  }
  return null;
}
```

## Important Notes

- **Manual Resolution Required**: Social markets need manual verification
- **Gas Fee**: ~0.01 BNB to resolve (~$5)
- **Verification**: Always check Twitter/X manually before resolving
- **Deadline**: Must wait until Nov 12, 10PM EST before resolving
- **Search Keywords**: "Giggle" (case-insensitive)
- **Time Window**: Tweets posted between contract creation and deadline count

## Summary of Changes

✅ Deadline changed: Nov 3 → Nov 12, 10PM EST
✅ Question unchanged: "Will CZ tweet about Giggle again?"
✅ Frontend updated with new deadline
✅ Translations updated (English & Chinese)
✅ Placeholder address: `0x0000000000000000000000000000000000000003`

## Next Steps

1. **Deploy contract** using Hardhat or Remix
2. **Copy the deployed address**
3. **Update `BinaryMarketV2.ts`** with real address
4. **Restart dev server**: `npm run dev`
5. **Monitor CZ's Twitter** until deadline
6. **Resolve manually** after Nov 12, 10PM EST

---

**Ready to deploy?** Make sure you have BNB in your deployer wallet!


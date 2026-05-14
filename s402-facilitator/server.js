/**
 * Sora S402 Facilitator Server
 * Based on: https://github.com/SoraOracle/SoraOracle
 * 
 * This server receives signed bet messages from users and submits them
 * to the blockchain, sponsoring the gas fees.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// BSC RPC Provider
const provider = new ethers.JsonRpcProvider(
  process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org/'
);

// Facilitator wallet (sponsors gas)
const facilitatorWallet = new ethers.Wallet(
  process.env.FACILITATOR_PRIVATE_KEY,
  provider
);

console.log('🚀 S402 Facilitator starting...');
console.log('📍 Facilitator address:', facilitatorWallet.address);

// BinaryMarketV2_Sora ABI (minimal - just what we need)
const MARKET_ABI = [
  'function betWithSignature(address user, uint256 amount, bool isYes, uint256 nonce, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external payable',
  'function nonces(address user) external view returns (uint256)',
];

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    facilitator: facilitatorWallet.address,
    chainId: 56,
    timestamp: Date.now(),
  });
});

/**
 * Main S402 relay endpoint
 * Receives signed bets and submits them on-chain
 */
app.post('/api/relay', async (req, res) => {
  try {
    const {
      user,
      marketAddress,
      amount,
      isYes,
      nonce,
      deadline,
      v,
      r,
      s,
    } = req.body;

    console.log('\n📥 Received gasless bet request:');
    console.log('  User:', user);
    console.log('  Market:', marketAddress);
    console.log('  Amount:', ethers.formatEther(amount), 'BNB');
    console.log('  Side:', isYes ? 'YES' : 'NO');
    console.log('  Nonce:', nonce);

    // Validate inputs
    if (!user || !marketAddress || !amount || isYes === undefined || !nonce || !deadline || !v || !r || !s) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters',
      });
    }

    // Check facilitator balance
    const balance = await provider.getBalance(facilitatorWallet.address);
    const requiredBalance = BigInt(amount) + ethers.parseEther('0.01'); // Amount + gas buffer
    
    if (balance < requiredBalance) {
      console.error('❌ Insufficient facilitator balance');
      return res.status(500).json({
        success: false,
        error: 'Facilitator has insufficient balance',
      });
    }

    // Create contract instance
    const market = new ethers.Contract(marketAddress, MARKET_ABI, facilitatorWallet);

    // Verify nonce
    const expectedNonce = await market.nonces(user);
    if (BigInt(nonce) !== expectedNonce) {
      console.error('❌ Invalid nonce. Expected:', expectedNonce.toString(), 'Got:', nonce);
      return res.status(400).json({
        success: false,
        error: `Invalid nonce. Expected ${expectedNonce.toString()}, got ${nonce}`,
      });
    }

    // Check deadline
    const now = Math.floor(Date.now() / 1000);
    if (now > parseInt(deadline)) {
      console.error('❌ Signature expired');
      return res.status(400).json({
        success: false,
        error: 'Signature has expired',
      });
    }

    console.log('✅ Validation passed. Submitting transaction...');

    // Submit transaction with facilitator sponsoring gas
    const tx = await market.betWithSignature(
      user,
      amount,
      isYes,
      nonce,
      deadline,
      v,
      r,
      s,
      {
        value: amount, // Send the bet amount
        gasLimit: 300000, // Set reasonable gas limit
      }
    );

    console.log('📤 Transaction submitted:', tx.hash);
    console.log('⏳ Waiting for confirmation...');

    // Wait for confirmation
    const receipt = await tx.wait();

    console.log('✅ Transaction confirmed!');
    console.log('   Block:', receipt.blockNumber);
    console.log('   Gas used:', receipt.gasUsed.toString());

    res.json({
      success: true,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      message: 'Gasless bet placed successfully!',
    });

  } catch (error) {
    console.error('❌ Error processing gasless bet:', error);
    
    let errorMessage = 'Failed to process gasless bet';
    if (error.message) {
      errorMessage = error.message;
    }
    
    res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
});

/**
 * Get facilitator stats
 */
app.get('/api/stats', async (req, res) => {
  try {
    const balance = await provider.getBalance(facilitatorWallet.address);
    const blockNumber = await provider.getBlockNumber();

    res.json({
      facilitator: facilitatorWallet.address,
      balance: ethers.formatEther(balance),
      blockNumber,
      chainId: 56,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ S402 Facilitator running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 Relay endpoint: http://localhost:${PORT}/api/relay`);
  console.log(`📍 Stats: http://localhost:${PORT}/api/stats\n`);
});


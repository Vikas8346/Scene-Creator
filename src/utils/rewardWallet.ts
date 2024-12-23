import { ethers } from 'ethers';

// Load these from environment variables in a real application
const REWARD_WALLET_PRIVATE_KEY = process.env.REWARD_WALLET_PRIVATE_KEY;
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;

if (!REWARD_WALLET_PRIVATE_KEY || !INFURA_PROJECT_ID) {
  throw new Error('Missing required environment variables for reward wallet');
}

const provider = new ethers.JsonRpcProvider(`https://arbitrum-sepolia.infura.io/v3/${INFURA_PROJECT_ID}`);
const wallet = new ethers.Wallet(REWARD_WALLET_PRIVATE_KEY, provider);

export async function sendReward(recipientAddress: string, amount: string) {
  console.log(`Sending ${amount} ETH to ${recipientAddress}`);

  const tx = await wallet.sendTransaction({
    to: recipientAddress,
    value: ethers.parseEther(amount)
  });

  await tx.wait();
  return tx.hash;
}

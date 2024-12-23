import { Transaction, secp256k1, address } from 'thor-devkit';
import { unitsUtils } from '@vechain/sdk-core';
import axios from 'axios';

export async function sendTestnetFunds(recipientAddress: string, amount: string) {

  const TESTNET_URL = 'https://testnet.vechain.org/';
  const FAUCET_PRIVATE_KEY = process.env.FAUCET_PRIVATE_KEY; // We'll set this up

  if (!FAUCET_PRIVATE_KEY) {
        throw new Error('FAUCET_PRIVATE_KEY is not set in environment variables');
  }

  const privateKey = Buffer.from(FAUCET_PRIVATE_KEY.replace(/^0x/, ''), 'hex');
  const publicKey = secp256k1.derivePublicKey(privateKey);
  const senderAddress = address.fromPublicKey(publicKey);

  const { data: bestBlock } = await axios.get(`${TESTNET_URL}/blocks/best`);
  const blockRef = bestBlock.id.slice(0, 18);
  const { data: genesisBlock } = await axios.get(`${TESTNET_URL}/blocks/0`);
  const chainTag = parseInt(genesisBlock.id.slice(-2), 16);

  const body: Transaction.Body = {
    chainTag,
    blockRef,
    expiration: 32,
    clauses: [{
      to: recipientAddress,
      value: unitsUtils.parseVET(amount).toString(),
      data: '0x'
    }],
    gasPriceCoef: 0,
    gas: 21000,
    dependsOn: null,
    nonce: '0x' + Math.random().toString().slice(2, 10),
  };

  const tx = new Transaction(body);
  const signingHash = tx.signingHash();
  const signature = secp256k1.sign(signingHash, privateKey);
  tx.signature = signature;

  const raw = tx.encode();

  try {
    const response = await axios.post(`${TESTNET_URL}/transactions`, {
      raw: '0x' + raw.toString('hex')
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Transaction response:', response.data);
    return response.data.id;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error sending test transaction:', error.response?.data || error.message);
    } else {
      console.error('Error sending test transaction:', error);
    }
    throw error;
  }
 
}

export async function sendRewardTransaction(recipientAddress: string) {
  try {
    const REWARD_AMOUNT = '1'; // 1 VET as reward
    const txid = await sendTestnetFunds(recipientAddress, REWARD_AMOUNT);
    console.log(`Reward transaction sent: ${txid}`);
    return txid;
  } catch (error) {
    console.error('Error sending reward:', error);
    throw error;
  }
}

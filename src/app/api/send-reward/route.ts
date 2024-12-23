import { sendReward } from '@/utils/rewardWallet';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { recipientAddress } = body;

    if (!recipientAddress) {
      return new Response(
        JSON.stringify({ success: false, message: 'Recipient address is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log(`from api route Sending reward to ${recipientAddress}`);
    const REWARD_AMOUNT = '0.00001'; // Define reward amount in ETH
    const txHash = await sendReward(recipientAddress, REWARD_AMOUNT);
    console.log('sent reward');

    return new Response(
      JSON.stringify({ success: true, txHash }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in reward API:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

    return new Response(
      JSON.stringify({ success: false, message: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

import { useState } from 'react';

export function useSendRewardTransaction() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendReward = async (recipientAddress: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/send-reward', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipientAddress }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send reward');
      }
      
      const { txid } = await response.json();
      console.log(`Reward transaction sent: ${txid}`);
      return txid;
    } catch (error) {
      console.error('Error sending reward:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { sendReward, isLoading, error };
}

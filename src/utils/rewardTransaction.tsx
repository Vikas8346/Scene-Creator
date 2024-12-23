"use client"

import { useConnex } from '@vechain/dapp-kit-react';
import { unitsUtils, clauseBuilder } from '@vechain/sdk-core';

export function useSendRewardTransaction() {
  console.log("useSendRewardTransaction called");
  const connex = useConnex();

  console.log("useSendRewardTransaction connex", connex);

  const sendReward = async (recipientAddress: string) => {
    console.log("Sending reward to:", recipientAddress);
    const REWARD_AMOUNT = '1'; // 1 VET as reward
    const rewardClause = clauseBuilder.transferVET(
      recipientAddress,
      unitsUtils.parseVET(REWARD_AMOUNT)
    );
    console.log("Reward clause", rewardClause);
    try {
      const { txid } = await connex.vendor.sign('tx', [rewardClause]).request();
      console.log(`Reward transaction sent: ${txid}`);
      return txid;
    } catch (error) {
      console.error('Error sending reward:', error);
      throw error;
    }
  };

  return sendReward;
}

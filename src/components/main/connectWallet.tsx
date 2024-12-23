'use client';

import { useEffect, useState } from "react";
import { useWallet, WalletButton, useWalletModal } from "@vechain/dapp-kit-react";
import { Button } from "@/components/ui/button";
import { FaWallet } from "react-icons/fa6";

// You might need to create this utility function
const humanAddress = (address: string, lengthBefore = 4, lengthAfter = 10) => {
  const before = address.substring(0, lengthBefore)
  const after = address.substring(address.length - lengthAfter)
  return `${before}…${after}`
}

export const ConnectWallet = () => {
  const { account } = useWallet();
  const { open } = useWalletModal();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading placeholder
  }

  if (!account) {
    return (
      <Button
        onClick={open}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <FaWallet className="mr-2 h-4 w-4" /> Connect Wallet
      </Button>
    );
  }

  return (
    <Button
      onClick={open}
      className="rounded-full bg-[rgba(235,236,252,1)] text-black hover:bg-[rgba(235,236,252,0.8)]"
    >
      {/* You might want to replace this with an actual icon component */}
      <div className="mr-2 h-4 w-4 rounded-full bg-gray-300"></div>
      <span className="font-normal">{humanAddress(account, 4, 6)}</span>
    </Button>
  );
};

export default ConnectWallet;

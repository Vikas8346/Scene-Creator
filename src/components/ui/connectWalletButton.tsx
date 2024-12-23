import { useState, useEffect } from "react";
import { useSDK } from "@metamask/sdk-react";
import { FaWallet } from "react-icons/fa6";
import { Button } from "./button";
import { formatAddress } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

export const ConnectWalletButton = () => {
  const [account, setAccount] = useState<string | undefined>();
  const { sdk, connected, connecting } = useSDK();

  useEffect(() => {
    const checkAccount = async () => {
      if (connected) {
        try {
          const accounts = await sdk?.connect();
          setAccount(accounts[0]);
        } catch (err) {
          console.error("Failed to get accounts", err);
          setAccount(undefined);
        }
      } else {
        setAccount(undefined);
      }
    };

    checkAccount();
  }, [sdk, connected]);

  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      setAccount(accounts?.[0]);
    } catch (err) {
      console.warn("failed to connect..", err);
    }
  };
  
  const disconnect = async () => {
    try {
      await sdk?.disconnect();
      setAccount(undefined);
    } catch (err) {
      console.warn("failed to disconnect..", err);
    }
  };

  return (
    <div className="relative">
      {connected && account ? (
        <Popover>
          <PopoverTrigger>
            <Button>{formatAddress(account)}</Button>
          </PopoverTrigger>
          <PopoverContent className="mt-2 w-44 bg-gray-100 border rounded-md shadow-lg right-0 z-10 top-10">
            <button
              onClick={disconnect}
              className="block w-full pl-2 pr-4 py-2 text-left text-[#F05252] hover:bg-gray-200"
            >
              Disconnect
            </button>
          </PopoverContent>
        </Popover>
      ) : (
        <Button disabled={connecting} onClick={connect}>
          <FaWallet className="mr-2 h-4 w-4" /> Connect Wallet
        </Button>
      )}
    </div>
  );
};;

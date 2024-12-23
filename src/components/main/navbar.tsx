'use client';

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logout } from "@/server/actions/auth";
import { useSDK } from "@metamask/sdk-react";
import { formatAddress } from "@/lib/utils";
import { ConnectWalletButton } from "../ui/connectWalletButton";

export function Navbar({ userName }: { userName: string | undefined }) {
  const router = useRouter();
  const { sdk, connected } = useSDK();

  const handleLogout = async () => {
    await logout();
  }

  const connectWallet = async () => {
    try {
      await sdk?.connect();
    } catch (err) {
      console.error("Failed to connect", err);
    }
  }

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
            <img src="/templogoglow.png" alt="Temporary Logo" className="w-20 h-20 object-contain mb-2" />
              {/* <span className="text-xl font-bold">Criminal Scenes</span> */}
              <img src="/midshieldwords.png" alt="Midshield words" className="w-32 h-32 object-contain mb-2" />
            </div>
          </div>
          <div className="flex items-center">
            {!userName ? (
              <Button onClick={() => router.push('/auth/register')} className="mr-2">Login</Button>
            ) : (
            <div className="flex gap-2">
            <ConnectWalletButton />
            <Button onClick={handleLogout}>Logout</Button>
            </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

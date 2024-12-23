'use client';

import { DAppKitProvider } from "@vechain/dapp-kit-react";

export default function DAppKitProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <DAppKitProvider
      nodeUrl="https://mainnet.vechain.org/"
      usePersistence
    >
      {children}
    </DAppKitProvider>
  );
}

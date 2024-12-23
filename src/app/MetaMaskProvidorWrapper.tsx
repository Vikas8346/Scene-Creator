'use client';

import { ReactNode } from 'react';
import { MetaMaskProvider } from "@metamask/sdk-react";

export default function MetaMaskProviderWrapper({ children }: { children: ReactNode }) {
  const host = typeof window !== "undefined" ? window.location.host : "defaultHost";

  const sdkOptions = {
    logging: { developerMode: true },
    checkInstallationImmediately: false,
    dappMetadata: {
      name: "Next-Metamask-Boilerplate",
      url: "http://localhost:3000", // using the host constant defined above
    },
  };


  return (
    <MetaMaskProvider debug={false} sdkOptions={sdkOptions}>
      {children}
    </MetaMaskProvider>
  );
}

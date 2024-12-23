import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from 'next/dynamic';
import { Toaster } from "@/components/ui/toaster"
import MetaMaskProviderWrapper from "./MetaMaskProvidorWrapper";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`dark ${inter.className}`}>
        <MetaMaskProviderWrapper >
          {children}
        <Toaster />
        </MetaMaskProviderWrapper>
      </body>
    </html>
  );
}

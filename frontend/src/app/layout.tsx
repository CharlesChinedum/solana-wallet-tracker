import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solana Wallet Tracker",
  description: "Track and analyze your Solana wallet activities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
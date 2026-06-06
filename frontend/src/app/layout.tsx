import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ScrollObserver from "../components/ScrollObserver";
import MainLayoutWrapper from "../components/MainLayoutWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Orchid SpellBee",
  description: "The Ultimate Spelling Competition",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ScrollObserver />
        <MainLayoutWrapper>{children}</MainLayoutWrapper>
      </body>
    </html>
  );
}

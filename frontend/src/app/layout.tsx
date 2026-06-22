import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ScrollObserver from "../components/ScrollObserver";
import MainLayoutWrapper from "../components/MainLayoutWrapper";
import CursorFollower from "../components/CursorFollower";

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  display: "swap" 
});

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
      <body className={plusJakartaSans.className}>
        <ScrollObserver />
        <CursorFollower />
        <MainLayoutWrapper>{children}</MainLayoutWrapper>
      </body>
    </html>
  );
}

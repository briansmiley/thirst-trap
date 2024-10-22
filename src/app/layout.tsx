import type { Metadata } from "next";
import localFont from "next/font/local";
import { Satisfy } from "next/font/google";
import "./globals.css";

const satisfy = Satisfy({
  subsets: ["latin"],
  variable: "--font-satisfy",
  weight: "400"
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900"
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900"
});

export const metadata: Metadata = {
  title: "Thirst Trap",
  description: "This party sucks.",
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${satisfy.variable} bg-blood text-white`}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-[100dvh]`}
      >
        {children}
      </body>
    </html>
  );
}

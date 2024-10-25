import type { Metadata } from "next";
import localFont from "next/font/local";
import { Satisfy } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Navbar from "@/components/Navbar";
import QrScanner from "@/components/QrScanner";

const satisfy = Satisfy({
  subsets: ["latin"],
  variable: "--font-satisfy",
  weight: "400"
});

const geistSans = localFont({
  src: "../lib/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900"
});
const geistMono = localFont({
  src: "../lib/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900"
});

export const metadata: Metadata = {
  title: "Thirst Trap",
  description: "This party sucks.",
  icons: {
    icon: "/images/favicon.svg"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${satisfy.variable} bg-blood`}
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-[100dvh] flex flex-col`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Navbar />
          <QrScanner />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

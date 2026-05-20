import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Satisfy } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'
import { AppStoreProvider } from '@/lib/stores/AppStoreProvider'
import StoreUpdater from '@/lib/stores/StoreUpdater'
import Navbar from '@/components/Navbar'
import { Toaster } from '@/components/ui/toaster'
import { DEFAULT_SETTINGS } from '@/lib/seed'

const satisfy = Satisfy({
  subsets: ['latin'],
  variable: '--font-satisfy',
  weight: '400',
})

const geistSans = localFont({
  src: '../lib/fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: '../lib/fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'Thirst Trap',
  description: 'This party sucks.',
  icons: {
    icon: '/images/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Initial state is empty; AppStoreProvider rehydrates from localStorage on
  // mount and falls back to the bundled seed on first visit.
  const initProps = { players: [], settings: DEFAULT_SETTINGS }

  return (
    <html
      lang="en"
      className={`${satisfy.variable} bg-blood`}
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex h-[100dvh] w-[100dvw] flex-col antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <AppStoreProvider initProps={initProps}>
            <StoreUpdater />
            <Navbar />
            {children}
            <Toaster />
          </AppStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

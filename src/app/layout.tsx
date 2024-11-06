import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Satisfy } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'
import playerService from '@/server/services/player'
import settingService from '@/server/services/setting'
import { AppStoreProvider } from '@/lib/stores/AppStoreProvider'
import StoreUpdater from '@/lib/stores/StoreUpdater'
import Navbar from '@/components/Navbar'
import { Toaster } from '@/components/ui/toaster'
import { isAuthenticated } from './actions/auth'

export const dynamic = 'force-dynamic'

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

async function getInitProps() {
  'use server'
  const authenticated = await isAuthenticated()
  const settings = await settingService.get()
  // Only load data if authenticated
  if (authenticated) {
    return {
      players: await playerService.getAll(),
      settings,
    }
  }

  // Return empty data if not authenticated
  return {
    players: [],
    settings,
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const initProps = await getInitProps()

  return (
    <html
      lang="en"
      className={`${satisfy.variable} bg-blood`}
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex h-[100dvh] w-full flex-col antialiased`}
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

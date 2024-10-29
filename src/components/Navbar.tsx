'use client'

import { useState } from 'react'
import { logout } from '@/app/actions/auth'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { CameraIcon, LogOut } from 'lucide-react'
import { useSocketSubscription } from '@/socket/client'
import { cn } from '@/lib/utils'

interface Connection {
  connected: boolean
  label: string
}

const CONNECTED = {
  true: {
    connected: true,
    label: 'Connected',
  },
  false: {
    connected: false,
    label: 'Disconnected',
  },
}

const Navbar = () => {
  const [connection, setConnection] = useState<Connection>(CONNECTED.false)

  useSocketSubscription('connect', () => setConnection(CONNECTED.true))
  useSocketSubscription('connect_error', (error) => console.error(error))
  useSocketSubscription('disconnect', () => setConnection(CONNECTED.false))

  const pathname = usePathname()
  const router = useRouter()
  const excludedPaths = ['/splash', '/']
  const isSplashRoute = excludedPaths.includes(pathname)

  const selectedClass = (tabName: string): string => {
    return pathname.startsWith(tabName)
      ? 'bg-neutral-800 font-semibold'
      : 'hover:text-neutral-300 hover:bg-neutral-700'
  }

  if (isSplashRoute) {
    return null
  }
  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <header className="flex flex-col">
      <nav className="flex min-h-16 items-center bg-neutral-900 text-xs text-neutral-50 sm:text-sm md:text-base">
        <div className="flex h-full w-full items-center justify-start gap-2 px-2">
          <Link href="/">
            <img alt="logo" src="/images/favicon.svg" width={24} height={24} />
          </Link>
          <ul className="flex h-full overflow-x-auto">
            <li>
              <Link
                href="/dashboard"
                className={`flex h-full w-[75px] items-center justify-center px-1 sm:w-[100px] sm:px-2 md:w-[125px] md:px-4 ${selectedClass(
                  '/dashboard'
                )}`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/profile"
                className={`flex h-full w-[75px] items-center justify-center px-1 sm:w-[100px] sm:px-2 md:w-[125px] md:px-4 ${selectedClass(
                  '/profile'
                )}`}
              >
                Profiles
              </Link>
            </li>
            <li>
              <Link
                href="/admin"
                className={`flex h-full w-[75px] items-center justify-center px-1 sm:w-[100px] sm:px-2 md:w-[125px] md:px-4 ${selectedClass(
                  '/admin'
                )}`}
              >
                Admin
              </Link>
            </li>
            <li>
              <Link
                href="/scan"
                className={`flex h-full w-[75px] items-center justify-center px-1 sm:w-[100px] sm:px-2 md:w-[125px] md:px-4 ${selectedClass(
                  '/scan'
                )}`}
              >
                <span className="flex items-center gap-3">
                  QR
                  <CameraIcon className="!size-4" />
                </span>
              </Link>
            </li>
            {/* Consolidated the below into admin */}
            {/* <li>
              <Link
                href="/commands"
                className={`flex h-full w-[75px] items-center justify-center px-1 sm:w-[100px] sm:px-2 md:w-[125px] md:px-4 ${selectedClass(
                  '/commands'
                )}`}
              >
                Commands
              </Link>
            </li>
            <li>
              <Link
                href="/settings"
                className={`flex h-full w-[75px] items-center justify-center px-1 sm:w-[100px] sm:px-2 md:w-[125px] md:px-4 ${selectedClass(
                  '/settings'
                )}`}
              >
                Settings
              </Link>
            </li> */}
          </ul>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut />
        </Button>
      </nav>
      <div className="flex items-center justify-end gap-2 p-2 text-xs text-neutral-400 md:text-sm">
        <div
          className={cn(
            'h-[0.75em] w-[0.75em] rounded-full',
            connection.connected ? 'bg-green-500' : 'bg-red-500'
          )}
        />
        {connection.label}
      </div>
    </header>
  )
}

export default Navbar

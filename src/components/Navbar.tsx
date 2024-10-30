'use client'

import { useState } from 'react'
import { logout } from '@/app/actions/auth'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { CameraIcon, CheckIcon, LogOut, XIcon } from 'lucide-react'
import { useSocketSubscription } from '@/socket/client'
import { cn } from '@/lib/utils'

interface Connection {
  connected: boolean
  label: string
}

const Navbar = () => {
  const [isConnected, setIsConnected] = useState(false)

  useSocketSubscription('connect', () => setIsConnected(true))
  useSocketSubscription('connect_error', (error) => console.error(error))
  useSocketSubscription('disconnect', () => setIsConnected(false))

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
    <header className="sticky top-0 z-50 flex w-full flex-col">
      <nav className="flex min-h-16 items-center bg-neutral-900 text-xs text-neutral-50 sm:text-sm md:text-base">
        <div className="flex h-full w-full items-center justify-start gap-1 px-2 sm:gap-2">
          <Link href="/">
            <img alt="logo" src="/images/favicon.svg" width={24} height={24} />
          </Link>
          <ul className="flex h-full overflow-x-auto">
            <li>
              <Link
                href="/dashboard"
                className={`flex h-full items-center justify-center px-3.5 sm:px-5 md:px-8 ${selectedClass(
                  '/dashboard'
                )}`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/profile"
                className={`flex h-full items-center justify-center px-3.5 sm:px-5 md:px-8 ${selectedClass(
                  '/profile'
                )}`}
              >
                Profiles
              </Link>
            </li>
            <li>
              <Link
                href="/admin"
                className={`flex h-full items-center justify-center px-3.5 sm:px-5 md:px-8 ${selectedClass(
                  '/admin'
                )}`}
              >
                Admin
              </Link>
            </li>
            <li>
              <Link
                href="/scan"
                className={`flex h-full items-center justify-center px-3.5 sm:px-5 md:px-8 ${selectedClass(
                  '/scan'
                )}`}
              >
                <span className="flex items-center gap-2">
                  QR
                  <CameraIcon
                    className="!size-5"
                    strokeWidth={pathname.startsWith('/scan') ? 3 : 1}
                  />
                </span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex items-center justify-end gap-2 p-2 text-xs text-neutral-400 md:text-sm">
          <div
            className={cn(
              'h-[0.75em] w-[0.75em] animate-pulse rounded-full',
              isConnected ? 'bg-green-500' : 'bg-red-500 duration-300'
            )}
          />
          {/* {isConnected ? <CheckIcon size={8} /> : <XIcon size={8} />} */}
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
    </header>
  )
}

export default Navbar

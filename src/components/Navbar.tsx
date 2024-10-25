'use client'

import { logout } from '@/app/actions/auth'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { LogOut } from 'lucide-react'

const Navbar = () => {
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
        </ul>
      </div>
      <Button size="icon" variant="ghost" onClick={handleLogout} title="Logout">
        <LogOut />
      </Button>
    </nav>
  )
}

export default Navbar

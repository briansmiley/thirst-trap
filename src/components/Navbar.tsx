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
      ? 'bg-neutral-800'
      : 'hover:text-neutral-300 hover:bg-neutral-800'
  }

  if (isSplashRoute) {
    return null
  }
  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <nav className="flex min-h-16 items-center bg-neutral-900 text-sm text-neutral-50 md:text-base">
      <div className="flex h-full w-full items-center justify-between px-2">
        <ul className="flex h-full">
          <li className="flex items-center justify-center px-2 md:px-4">
            <Link href="/">
              <img
                alt="logo"
                src="/images/favicon.svg"
                width={24}
                height={24}
              />
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard"
              className={`flex h-full items-center justify-center px-2 md:px-4 ${selectedClass(
                '/dashboard'
              )}`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/commands"
              className={`flex h-full items-center justify-center px-2 md:px-4 ${selectedClass(
                '/commands'
              )}`}
            >
              Commands
            </Link>
          </li>
          <li>
            <Link
              href="/settings"
              className={`flex h-full items-center justify-center px-2 md:px-4 ${selectedClass(
                '/settings'
              )}`}
            >
              Settings
            </Link>
          </li>
          <li>
            <Link
              href="/profile"
              className={`flex h-full items-center justify-center px-2 md:px-4 ${selectedClass(
                '/profile'
              )}`}
            >
              Profiles
            </Link>
          </li>
        </ul>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut />
        </Button>
      </div>
    </nav>
  )
}

export default Navbar

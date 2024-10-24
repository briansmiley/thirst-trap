"use client";

import { logout } from "@/app/actions/auth";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const excludedPaths = ["/splash", "/"];
  const isSplashRoute = excludedPaths.includes(pathname);

  if (isSplashRoute) {
    return null;
  }
  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <nav className="bg-neutral-900 text-neutral-50 text-sm md:text-base min-h-16 flex items-center">
      <div className="flex items-center justify-between w-full h-full px-2">
        <ul className="flex h-full">
          <li className="flex items-center justify-center px-2 md:px-4">
            <Link href="/">
              <Image alt="logo" src="/favicon.svg" width={24} height={24} />
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard"
              className="hover:text-neutral-300 hover:bg-neutral-800 h-full flex justify-center items-center px-2 md:px-4"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/commands"
              className="hover:text-neutral-300 hover:bg-neutral-800 h-full flex justify-center items-center px-2 md:px-4"
            >
              Commands
            </Link>
          </li>
          <li>
            <Link
              href="/settings"
              className="hover:text-neutral-300 hover:bg-neutral-800 h-full flex justify-center items-center px-2 md:px-4"
            >
              Settings
            </Link>
          </li>
          <li>
            <Link
              href="/profile"
              className="hover:text-neutral-300 hover:bg-neutral-800 h-full flex justify-center items-center px-2 md:px-4"
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
  );
};

export default Navbar;

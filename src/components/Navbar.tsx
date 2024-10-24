import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-neutral-900 text-neutral-50 h-16 flex items-center">
      <ul className="flex h-full">
        <li className="">
          <Link
            href="/dashboard"
            className="hover:text-neutral-300 hover:bg-neutral-800 h-full flex justify-center items-center px-4"
          >
            Dashboard
          </Link>
        </li>
        <li className="">
          <Link
            href="/commands"
            className="hover:text-neutral-300 hover:bg-neutral-800 h-full flex justify-center items-center px-4"
          >
            Commands
          </Link>
        </li>
        <li className="">
          <Link
            href="/settings"
            className="hover:text-neutral-300 hover:bg-neutral-800 h-full flex justify-center items-center px-4"
          >
            Settings
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

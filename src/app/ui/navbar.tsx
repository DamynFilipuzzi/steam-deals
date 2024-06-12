import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { getServerAuthSession } from "~/server/auth";
import Image from "next/image";
import Logo from "public/android-chrome-192x192.png";
import { LogOut } from "lucide-react";
import { User } from "lucide-react";

export default async function Navbar() {
  noStore();
  const session = await getServerAuthSession();
  return (
    <nav className="sticky top-0 z-50 flex h-24 w-full flex-row items-center justify-between bg-background px-6 py-3 shadow-md">
      <a
        aria-label="Navigate to home page"
        href="/"
        className="flex flex-row items-center justify-center gap-4 hover:opacity-70"
      >
        <Image src={Logo} height={60} width={60} alt="Steam Deals Site Logo" />
        <h1 className="text-lg font-medium text-cyan-500 sm:text-3xl">
          Steam Deals
        </h1>
      </a>

      <div className="my-7 flex flex-row items-center justify-center gap-4">
        {session ? (
          <div className="dropdown group relative inline-block">
            <button className="dropbtn">
              <p className="mr-2 inline text-center align-middle text-2xl text-white">
                {session.user?.name ? (
                  <span className="hidden capitalize sm:inline">
                    {session.user?.name}
                  </span>
                ) : (
                  <span className="hidden sm:inline">Username</span>
                )}
              </p>
              <div className="inline text-center align-middle">
                {session.user.image ? (
                  <img
                    src={`${session.user.image}`}
                    alt="Profile Photo"
                    className="inline h-12 w-12 overflow-hidden rounded-full"
                  />
                ) : (
                  <div className="inline-block h-12 w-12 overflow-hidden rounded-full border-2 border-cyan-300 bg-white/10 align-middle text-xl text-cyan-300"></div>
                )}
              </div>
              <div className="dropdown-content absolute right-0 z-10 hidden min-w-36 border-2 border-t-0 border-slate-500/20 bg-background shadow-lg group-hover:block">
                <Link
                  aria-label="Sign Out Button"
                  href="/api/auth/signout"
                  className="block px-4 py-3 text-white hover:text-cyan-300 active:border-cyan-700"
                >
                  Sign Out <LogOut className="inline" />
                </Link>
              </div>
            </button>
          </div>
        ) : (
          <Link
            aria-label="Sign In Button"
            href="/api/auth/signin"
            className="rounded-full border-2 border-cyan-500 px-1 py-1 font-semibold text-black no-underline hover:border-cyan-300 active:border-cyan-700"
          >
            <User size={32} color="#06b6d4" />
          </Link>
        )}
      </div>
    </nav>
  );
}

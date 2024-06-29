import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import Image from "next/image";
import Logo from "public/android-chrome-192x192.png";
import { ChevronDown } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "~/server/auth";
import { SignIn, SignOut } from "./authButtons";

export default async function Navbar() {
  noStore();
  const session = await getServerSession(getAuthOptions());

  return (
    <nav className="sticky top-0 z-50 flex h-24 w-full flex-row items-center justify-between bg-background px-6 py-3 shadow-md">
      <a
        aria-label="Navigate to home page"
        href="/"
        className="flex flex-row items-center justify-center gap-5 hover:opacity-70"
      >
        <Image src={Logo} height={60} width={60} alt="Steam Deals Site Logo" />
        <h1 className="hidden font-medium text-cyan-500 sm:flex sm:text-3xl">
          Steam Deals
        </h1>
      </a>

      <div className="flex h-full flex-row items-center justify-center gap-5">
        <div className="group relative text-lg sm:mr-8">
          <button>
            <span className="hidden sm:inline">Steam</span> Stats
            <ChevronDown className="ml-2 inline duration-200 group-hover:rotate-180" />
          </button>
          <div className="absolute right-0 z-10 hidden min-w-36 border-2 border-t-0 border-slate-500/20 bg-background shadow-lg group-hover:block">
            <Link
              href={"/stats"}
              className="block px-4 py-3 text-sm text-white hover:text-cyan-300 active:border-cyan-700"
            >
              Steam Stats
            </Link>
            <Separator />
            <Link
              href={"/stats/mostplayed"}
              className="block px-4 py-3 text-sm text-white hover:text-cyan-300 active:border-cyan-700"
            >
              Most Played
            </Link>
            <Link
              href={"/stats/topsellers"}
              className="block px-4 py-3 text-sm text-white hover:text-cyan-300 active:border-cyan-700"
            >
              Top Selling
            </Link>
          </div>
        </div>
        {session ? (
          <div className="group relative flex h-full items-center">
            <div className="dropbtn cursor-pointer">
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
              {/* dropdown */}
              <div className="absolute right-0 z-10 hidden min-w-36 border-2 border-t-0 border-slate-500/20 bg-background shadow-lg group-hover:block">
                <SignOut />
              </div>
            </div>
          </div>
        ) : (
          <SignIn />
        )}
      </div>
    </nav>
  );
}

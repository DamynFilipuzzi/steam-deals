import Image from "next/image";
import Link from "next/link";
import Logo from "public/android-chrome-192x192.png";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

import { unstable_noStore as noStore } from "next/cache";
import { getServerAuthSession } from "~/server/auth";

export default async function Navbar() {
  noStore();
  const session = await getServerAuthSession();

  return (
    <nav className="sticky top-0 z-50 flex h-24 w-full flex-row items-center justify-between bg-slate-950 px-6 py-3 shadow-md">
      <Link
        href="/"
        className="flex flex-row items-center justify-center gap-4 hover:opacity-70"
      >
        <Image src={Logo} height={60} width={60} alt="Steam Deals Site Logo" />
        <h1 className="text-3xl text-cyan-300">Steam Deals</h1>
      </Link>
      <div className="my-7 flex flex-row items-center justify-center gap-4">
        {session ? (
          <div className="hover:cursor-pointer hover:opacity-70">
            <p className="mr-2 inline text-center align-middle text-2xl text-white">
              <span>{session.user?.name}</span>
              <ChevronDownIcon className="ml-1 inline h-4 w-4" />
            </p>
            <div className="inline">
              <img
                src={`${session.user.image}`}
                alt="Profile Photo"
                className="inline  h-12 w-12 overflow-hidden rounded-full"
              />
            </div>
          </div>
        ) : (
          <Link
            href="/api/auth/signin"
            className="rounded-full bg-cyan-300/90 px-6 py-2 font-semibold no-underline transition hover:bg-cyan-300/60"
          >
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
}

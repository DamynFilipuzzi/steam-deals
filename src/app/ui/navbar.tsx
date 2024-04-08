import Image from "next/image";
import Link from "next/link";
import Logo from "public/android-chrome-192x192.png";
import Search from "./search";

import { unstable_noStore as noStore } from "next/cache";
import { getServerAuthSession } from "~/server/auth";

export default async function Navbar() {
  noStore();
  const session = await getServerAuthSession();

  return (
    <nav className="sticky top-0 z-50 flex h-24 w-full flex-row items-center justify-between bg-slate-950 px-6 py-3 shadow-md">
      <Link
        href="/"
        className="flex flex-row items-center justify-center gap-4"
      >
        <Image src={Logo} height={60} width={60} alt="Steam Deals Site Logo" />
        <h1 className="text-3xl text-cyan-300">Steam Deals</h1>
      </Link>
      <div className="w-1/3">
        <Search placeholder="Search games..." />
      </div>
      <div className="my-7 flex flex-row items-center justify-center gap-4">
        <p className="text-center text-2xl text-white">
          {session && <span>{session.user?.name}</span>}
        </p>
        <Link
          href={session ? "/api/auth/signout" : "/api/auth/signin"}
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          {session ? "Sign out" : "Sign in"}
        </Link>
      </div>
    </nav>
  );
}

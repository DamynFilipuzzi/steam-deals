import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import Image from "next/image";
import Logo from "public/android-chrome-192x192.png";
import { ChevronDown } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "~/server/auth";
import { SignIn, SignOut } from "./authButtons";
import ThemeDefault from "./themeToggle";

export default async function Navbar() {
  noStore();
  const session = await getServerSession(getAuthOptions());

  return (
    <nav className="sticky top-0 z-50 flex h-16 w-full flex-row items-center justify-between bg-background px-6  shadow-md">
      {/* Logo */}
      <a
        aria-label="Navigate to home page"
        href="/"
        className="flex flex-row items-center justify-center gap-5 hover:opacity-70"
      >
        <Image
          src={Logo}
          height={60}
          width={60}
          alt="Steam Deals Site Logo"
          className="p-1"
        />
        <h1 className="text-identity-default hidden font-medium sm:flex sm:text-3xl">
          Steam Deals
        </h1>
      </a>

      {/* Stats */}
      <div className="flex h-full flex-row items-center justify-center gap-4">
        <div className="group relative h-full items-center text-lg hover:bg-foreground/10">
          <button className="h-full">
            <span className="hidden sm:inline">Steam</span> Stats
            <ChevronDown className=" inline duration-200 group-hover:rotate-180" />
          </button>
          <div className="absolute left-0 z-10 hidden min-w-32 border-2 border-t-0 border-border bg-background shadow-lg group-hover:block sm:w-full">
            <Link
              href={"/stats"}
              className="hover:text-identity-hover active:text-identity-focus block px-4 py-3 text-sm text-primary"
            >
              Steam Stats
            </Link>
            <Separator />
            <Link
              href={"/stats/mostplayed"}
              className="hover:text-identity-hover active:text-identity-focus block px-4 py-3 text-sm text-primary"
            >
              Most Played
            </Link>
            <Link
              href={"/stats/topsellers"}
              className="hover:text-identity-hover active:text-identity-focus block px-4 py-3 text-sm text-primary"
            >
              Top Selling
            </Link>
          </div>
        </div>

        {/* Theme */}
        <div className="sm:mr-8">
          <ThemeDefault />
        </div>

        {/* Auth User */}
        {session ? (
          <div className="group relative flex h-full items-center">
            <div className="h-full cursor-pointer hover:bg-foreground/10">
              <p className="mr-2 inline h-full text-center align-middle text-2xl text-primary">
                {session.user?.name ? (
                  <span className="hidden h-full capitalize md:inline">
                    {session.user?.name}
                  </span>
                ) : (
                  <span className="hidden h-full text-primary md:inline">
                    Username
                  </span>
                )}
              </p>
              <div className="inline h-full text-center align-middle">
                {session.user.image && (
                  <img
                    src={`${session.user.image}`}
                    alt="Profile Photo"
                    className="inline h-full overflow-hidden rounded-full p-1"
                  />
                )}
              </div>
              {/* dropdown */}
              <div className="absolute right-0 z-10 hidden min-w-36 border-2 border-t-0 border-border bg-background shadow-lg group-hover:block sm:w-full">
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

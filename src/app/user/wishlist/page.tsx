import { Suspense } from "react";
import UsersWishlistTable from "./_components/usersWishlistTable";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "~/server/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wish List | Steam Deals",
  description: "Explore your Wishlist.",
};

export default async function Page() {
  const session = await getServerSession(getAuthOptions());

  if (!session) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen flex-row items-center justify-center bg-body text-primary">
      <Suspense
        fallback={
          <p className="mr-5 animate-pulse text-center">
            Retrieving your Wish List, this should only take a minute...
          </p>
        }
      >
        <UsersWishlistTable />
      </Suspense>
    </main>
  );
}

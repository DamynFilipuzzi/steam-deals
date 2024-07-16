import { Suspense } from "react";
import UsersAppsTable from "./_components/usersAppsTable";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "~/server/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Owned Apps | Steam Deals",
  description: "Explore your owned apps.",
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
          <p className="mr-5 animate-pulse">
            Retrieving your apps, this should only take a minute...
          </p>
        }
      >
        <UsersAppsTable />
      </Suspense>
    </main>
  );
}

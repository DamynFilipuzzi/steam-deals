import { api } from "~/trpc/server";
import { MostPlayedTable } from "./_components/mostPlayedTable";
import { TopSellingTable } from "./_components/topSellingTable";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default async function Page() {
  const mostPlayed = await api.apps.mostPlayedSample.query();
  const topSellers = await api.apps.topSellersSample.query();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-black text-white">
      <h1 className="pt-5 text-3xl">Steam Stats</h1>
      <div className="flex flex-col gap-5 p-5 xl:flex-row">
        <Card>
          <CardHeader>
            <CardTitle>Top Selling</CardTitle>
            <CardDescription>
              Top Selling apps on Steam. Updated every 15 minutes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TopSellingTable games={topSellers} />
          </CardContent>
          <CardFooter>
            <Link href={`/stats/topsellers`} className="w-full text-center">
              <Button>View All Top Selling Games</Button>
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Most Played</CardTitle>
            <CardDescription>
              Most played games on Steam. Updated every 15 minutes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MostPlayedTable games={mostPlayed} />
          </CardContent>
          <CardFooter>
            <Link href={`/stats/mostplayed`} className="w-full text-center">
              <Button>View All Most played Games</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}

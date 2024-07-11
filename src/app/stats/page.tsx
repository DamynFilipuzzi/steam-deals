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
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-body text-primary">
      <h1 className="pt-5 text-3xl">Steam Stats</h1>
      <div className="flex flex-col gap-5 pb-5 xl:flex-row">
        <Card className="shrink-0 basis-1/2 border-2 border-solid border-border bg-secondary-background">
          <CardHeader>
            <CardTitle>Top Selling</CardTitle>
            <CardDescription>
              Top Selling apps on Steam. Updated every 15 minutes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TopSellingTable games={topSellers} />
          </CardContent>
          <CardFooter className="justify-center">
            <Link href={`/stats/topsellers`} className="text-center">
              <Button>View All</Button>
            </Link>
          </CardFooter>
        </Card>
        <Card className="shrink-0 basis-1/2 border-2 border-solid border-border bg-secondary-background">
          <CardHeader>
            <CardTitle>Most Played</CardTitle>
            <CardDescription>
              Most played games on Steam. Updated every 15 minutes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MostPlayedTable games={mostPlayed} />
          </CardContent>
          <CardFooter className="justify-center">
            <Link href={`/stats/mostplayed`} className="text-center">
              <Button>View All</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}

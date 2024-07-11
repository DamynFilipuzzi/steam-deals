import { api } from "~/trpc/server";
import { TopSellingTable } from "../_components/topSellingTable";

export default async function Page() {
  const topSelling = await api.apps.topSellers.query();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-body text-primary">
      <h1 className="pt-5 text-3xl">Top Selling</h1>
      <div className="flex flex-col gap-5 pb-5 xl:flex-row">
        <TopSellingTable games={topSelling} />
      </div>
    </main>
  );
}

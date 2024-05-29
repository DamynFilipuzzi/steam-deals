import { api } from "~/trpc/server";
import { MostPlayedTable } from "../_components/mostPlayedTable";

export default async function Page() {
  const mostPlayed = await api.apps.mostPlayed.query();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-black text-white">
      <h1 className="pt-5 text-3xl">Most Played</h1>
      <div className="flex flex-col gap-5 pb-5 xl:flex-row">
        <MostPlayedTable games={mostPlayed} />
      </div>
    </main>
  );
}

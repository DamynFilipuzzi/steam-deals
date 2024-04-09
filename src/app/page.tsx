import Pagination from "./ui/pagination";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { gamesPerPages } from "~/server/api/routers/game";

import { api } from "~/trpc/server";

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    queue?: string;
    page?: string;
  };
}) {
  noStore();
  // const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = Math.ceil(
    Number((await api.games.getTotalPages.query()) / gamesPerPages()),
  );

  // const allGames = await api.games.getAll.query();
  const gamesQuery = await api.games.getQuery.query(currentPage);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <h1 className="my-5 text-3xl underline">Top Games of the Day</h1>
      <div className="flex w-2/3 flex-wrap items-center justify-center gap-4">
        {gamesQuery.map((game) => {
          return (
            <Link
              key={game.id}
              href={`/game/${game.id}`}
              className="text-center"
            >
              <div className="m-0">
                <div className="ease- flex h-80 w-44 flex-col justify-between border-2 border-slate-700/25 bg-slate-700/25 transition duration-100 hover:border-cyan-300">
                  <div className="h-16 overflow-hidden text-ellipsis bg-slate-900 p-1">
                    {game.title}
                  </div>
                  <div>
                    <img
                      src={`https://steamcdn-a.akamaihd.net/steam/apps/${game.steam_id}/library_600x900.jpg`}
                      alt={`${game.title} game image`}
                    />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>

      <div className="my-7"></div>
    </main>
  );
}

import Pagination from "./ui/pagination";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { gamesPerPages } from "~/server/api/routers/game";
import Search from "./ui/search";

import { api } from "~/trpc/server";

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  noStore();
  const query = searchParams?.query ?? "";
  const currentPage = Number(searchParams?.page) || 1;
  const params = { page: currentPage, query: query };
  const totalPages = Math.ceil(
    Number((await api.games.getTotalPages.query(query)) / gamesPerPages()),
  );

  const gamesQuery = await api.games.getQuery.query(params);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="my-5 w-2/3 lg:w-1/3">
        <Search placeholder="Search games..." />
      </div>
      <div className="flex w-full flex-wrap items-center justify-center gap-4 lg:w-2/3 3xl:w-3/6">
        {gamesQuery.map((game) => {
          return (
            <Link
              key={game.id}
              href={`/game/${game.id}`}
              className="text-center"
            >
              <div className="m-0">
                <div className="ease- flex h-80 w-44 flex-col justify-between border-2 border-slate-700/25 bg-slate-700/25 transition duration-100 hover:border-cyan-500">
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
    </main>
  );
}

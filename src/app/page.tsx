import Pagination from "./ui/pagination";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { appsPerPages } from "~/server/api/routers/app";
import Search from "./ui/search";

import { api } from "~/trpc/server";

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    byTags?: boolean;
    tags?: string;
  };
}) {
  noStore();
  const query = searchParams?.query ?? "";
  const currentPage = Number(searchParams?.page) || 1;
  const byTags = Boolean(searchParams?.byTags) ?? false;
  const tags = String(searchParams?.tags) ?? "";
  const params = {
    page: currentPage,
    query: query,
    byTags: byTags,
    tags: tags,
  };
  const paramsPages = { query: query, byTags: byTags, tags: tags };
  const totalPages = Math.ceil(
    Number((await api.apps.getTotalPages.query(paramsPages)) / appsPerPages()),
  );

  const appsQuery = await api.apps.getQuery.query(params);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="my-5 w-2/3 lg:w-1/3">
        <Search placeholder="Search games..." />
      </div>
      <div className="flex w-full flex-wrap items-center justify-center gap-4 lg:w-2/3 3xl:w-3/6">
        {appsQuery.map((game) => {
          return (
            <Link
              key={game.id + "g"}
              href={`/game/${game.id}`}
              className="text-center"
            >
              <div className="m-0">
                <div className="flex w-44 flex-col justify-between rounded-lg border-2 border-slate-700/25 bg-slate-700/25 transition duration-100 ease-in hover:border-cyan-500 active:border-cyan-700">
                  <div className="line-clamp-2 h-12 rounded-lg bg-slate-900">
                    {game.title}
                  </div>
                  <div>
                    <img
                      src={`https://steamcdn-a.akamaihd.net/steam/apps/${game.steam_id}/library_600x900.jpg`}
                      alt={`${game.title} game image`}
                      className="h-64"
                    />
                  </div>
                  <div className="flex h-12 flex-row items-center justify-end rounded-lg bg-slate-900 p-1 text-right text-sm">
                    {game.original_price != null &&
                      game.discount_price != null &&
                      game.discount_price != game.original_price && (
                        <>
                          <p className="bg-green-600 p-1">
                            -
                            {(
                              ((game.original_price - game.discount_price) /
                                game.original_price) *
                              100
                            ).toFixed(0)}
                            %
                          </p>
                          <p className="bg-slate-300/10 p-1 text-slate-400 line-through">
                            {"$" + (game.original_price / 100).toFixed(2)}
                          </p>
                        </>
                      )}
                    <div className="bg-slate-300/10 p-1">
                      {game.prices.map((price) => {
                        return (
                          <div key={price.id + "p"}>
                            {/* TODO: FIX THIS DISPLAY FOR GAMES THAT HAVE NO LISTED PRICE BECAUSE THEY ARE ONLY SOLD AS PACKAGED */}
                            {!price.is_free && game.discount_price != null
                              ? "$" + (game.discount_price / 100).toFixed(2)
                              : "Free"}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
        {appsQuery.length == 0 && (
          <div>
            <p className="text-white">No results found</p>
          </div>
        )}
      </div>
      <div className="my-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </main>
  );
}

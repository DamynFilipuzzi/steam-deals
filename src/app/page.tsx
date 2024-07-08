import Pagination from "./ui/pagination";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { appsPerPages } from "~/server/api/routers/app";
import Search from "./ui/search";
import { formatCurrencyInt } from "~/lib/utils";

import { api } from "~/trpc/server";
import TagsFilter from "./_components/tagsFilter";
import FiltersDropdownMenu from "./_components/filtersDropdownMenu";
import PriceDisplay from "./_components/priceDisplay";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    tags?: string;
    type?: string;
    limit?: number;
    hidefree?: number;
    hideOwned?: number;
  };
}) {
  noStore();
  const session = await getServerSession(getAuthOptions());

  // validate search params if user signed out with having selected havingOwned
  if (!session && searchParams?.hideOwned == 1) {
    searchParams.hideOwned = 0;
    redirect("/");
  }

  const userId = session?.user.steam.steamid ?? "";
  const maxPrice = await api.price.getMaxPrice.query();
  const query = searchParams?.query ?? "";
  const currentPage = Number(searchParams?.page) || 1;
  const tags = searchParams?.tags ?? "";
  const type = searchParams?.type ?? "game";
  const hidefree = Number(searchParams?.hidefree) || 0;
  const hideOwned = Number(searchParams?.hideOwned) || 0;

  let limit = 1500;
  if (maxPrice._max.discount_price != null) {
    limit =
      Number(searchParams?.limit) ||
      formatCurrencyInt(maxPrice._max.discount_price);
  } else {
    limit = Number(searchParams?.limit) || 1500;
  }
  const params = {
    page: currentPage,
    query: query,
    tags: tags,
    type: type,
    limit: limit,
    hidefree: hidefree,
    userId: userId,
    hideOwned: hideOwned,
  };
  const paramsPages = {
    query: query,
    tags: tags,
    type: type,
    limit: limit,
    hidefree: hidefree,
    userId: userId,
    hideOwned: hideOwned,
  };
  const totalPages = Math.ceil(
    Number((await api.apps.getTotalPages.query(paramsPages)) / appsPerPages()),
  );

  const appsQuery = await api.apps.getQuery.query(params);
  const tagsQuery = await api.tags.getAllTags.query();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="my-5 flex w-5/6 flex-row justify-center gap-4 xl:w-1/3">
        <Search placeholder="Search apps..." />
        <TagsFilter data={tagsQuery} />
        {maxPrice._max.discount_price == null ? (
          <FiltersDropdownMenu maxPrice={0} />
        ) : (
          <FiltersDropdownMenu maxPrice={maxPrice._max.discount_price} />
        )}
      </div>
      <div className="grid grid-cols-2 items-center justify-center gap-4 md:grid-cols-3 xl:grid-cols-6">
        {appsQuery.map((game) => {
          return (
            <Link
              key={game.id + "gid"}
              href={`/game/${game.steam_id}`}
              className="text-center"
            >
              <div className="relative flex w-44 flex-col justify-between rounded-lg border-2 border-slate-700/25 bg-slate-700/25 transition duration-100 ease-in hover:border-cyan-500 active:border-cyan-700">
                <div className="line-clamp-2 h-12 rounded-t-md bg-background">
                  {game.title}
                </div>
                <div className="relative flex overflow-hidden">
                  {game.type == "game" ? (
                    <img
                      src={`https://steamcdn-a.akamaihd.net/steam/apps/${game.steam_id}/library_600x900.jpg`}
                      alt={`${game.title} game image`}
                      className="mx-auto h-64"
                    />
                  ) : (
                    <img
                      src={`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${game.steam_id}/capsule_231x87.jpg`}
                      alt={`${game.title} game image`}
                      className="h-24"
                    />
                  )}

                  {game.users_apps.map((userApp) => {
                    return (
                      <div
                        key={userApp.steam_id + "UAID"}
                        className="absolute -left-14 top-4 w-full -rotate-45 border-2 border-white/85 bg-green-600"
                      >
                        Owned
                      </div>
                    );
                  })}
                </div>
                <PriceDisplay prices={game.prices} hasBackground={true} />
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

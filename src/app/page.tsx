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
  };
}) {
  noStore();
  const maxPrice = await api.price.getMaxPrice.query();

  const query = searchParams?.query ?? "";
  const currentPage = Number(searchParams?.page) || 1;
  const tags = searchParams?.tags ?? "";
  const type = searchParams?.type ?? "game";
  const hidefree = Number(searchParams?.hidefree) || 0;

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
  };
  const paramsPages = {
    query: query,
    tags: tags,
    type: type,
    limit: limit,
    hidefree: hidefree,
  };
  const totalPages = Math.ceil(
    Number((await api.apps.getTotalPages.query(paramsPages)) / appsPerPages()),
  );

  const appsQuery = await api.apps.getQuery.query(params);
  const tagsQuery = await api.tags.getAllTags.query();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="my-5 flex w-5/6 flex-row gap-4 lg:w-1/3">
        <Search placeholder="Search apps..." />
        <TagsFilter data={tagsQuery} />
        {maxPrice._max.discount_price == null ? (
          <FiltersDropdownMenu maxPrice={0} />
        ) : (
          <FiltersDropdownMenu maxPrice={maxPrice._max.discount_price} />
        )}
      </div>
      <div className="flex w-full flex-wrap items-center justify-center gap-4 lg:w-2/3 3xl:w-3/6">
        {appsQuery.map((game) => {
          return (
            <Link
              prefetch={false}
              key={game.id + "gid"}
              href={`/game/${game.steam_id}`}
              className="text-center"
            >
              <div className="m-0">
                <div className="flex w-44 flex-col justify-between rounded-lg border-2 border-slate-700/25 bg-slate-700/25 transition duration-100 ease-in hover:border-cyan-500 active:border-cyan-700">
                  <div className="line-clamp-2 h-12 rounded-lg bg-background">
                    {game.title}
                  </div>
                  <div>
                    {game.type == "game" ? (
                      <img
                        src={`https://steamcdn-a.akamaihd.net/steam/apps/${game.steam_id}/library_600x900.jpg`}
                        alt={`${game.title} game image`}
                        className="h-64"
                      />
                    ) : (
                      <img
                        src={`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${game.steam_id}/capsule_231x87.jpg`}
                        alt={`${game.title} game image`}
                        className="h-24"
                      />
                    )}
                  </div>
                  <PriceDisplay prices={game.prices} hasBackground={true} />
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

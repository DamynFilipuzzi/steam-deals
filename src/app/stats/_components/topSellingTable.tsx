"use client";
import { useRouter } from "next/navigation";

type Props = {
  games: {
    steam_id: number;
    app_order: number;
    apps: {
      id: number;
      title: string | null;
      prices: {
        id: number;
        original_price: number | null;
        discount_price: number | null;
        is_free: boolean | null;
      }[];
    };
  }[];
};

export function TopSellingTable({ games }: Props) {
  const router = useRouter();
  return (
    <table className="">
      <thead>
        <tr className="text-center text-xs xl:text-lg">
          <th>Rank</th>
          <th></th>
          <th></th>
          <th></th>
          <th className="text-right">Price</th>
        </tr>
      </thead>
      <tbody>
        {games.map((game) => {
          return (
            <tr
              onClick={() => router.push(`/game/${game.apps.id}`)}
              key={game.steam_id + "sid"}
              className="h-12 max-h-16 cursor-pointer text-center text-xs hover:bg-slate-500/20 xl:text-lg"
            >
              <td>{game.app_order}</td>
              <td className="m-0 w-fit p-1">
                <img
                  src={`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${game.steam_id}/capsule_231x87.jpg`}
                  alt={`${game.apps.title} game image`}
                  className="aspect-[231/87]"
                />
              </td>
              <td className="text-left">{game.apps.title}</td>
              <td className="xl:w-34"></td>
              <td className="xl:w-32">
                <div className="flex flex-row items-center justify-end rounded-lg p-1 text-right text-sm">
                  {game.apps.prices.map((price) => {
                    return (
                      <div key={price.id + "pd"}>
                        {price.original_price != null &&
                          price.discount_price != null &&
                          price.discount_price != price.original_price && (
                            <div className="flex flex-row">
                              <p className="bg-green-600 p-1">
                                -
                                {(
                                  ((price.original_price -
                                    price.discount_price) /
                                    price.original_price) *
                                  100
                                ).toFixed(0)}
                                %
                              </p>
                              <p className="bg-slate-300/10 p-1 text-slate-400 line-through">
                                {"$" + (price.original_price / 100).toFixed(2)}
                              </p>
                            </div>
                          )}
                      </div>
                    );
                  })}
                  <div className="bg-slate-300/10 p-1">
                    {game.apps.prices.map((price) => {
                      return (
                        <div key={price.id + "prid"}>
                          {/* TODO: FIX THIS DISPLAY FOR GAMES THAT HAVE NO LISTED PRICE BECAUSE THEY ARE ONLY SOLD AS PACKAGED */}
                          {!price.is_free && price.discount_price != null
                            ? "$" + (price.discount_price / 100).toFixed(2)
                            : "Free"}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

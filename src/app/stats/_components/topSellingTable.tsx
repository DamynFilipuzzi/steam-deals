"use client";
import { useRouter } from "next/navigation";

type Props = {
  games: {
    steam_id: number;
    app_order: number;
    apps: {
      id: number;
      title: string | null;
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
          <th></th>
        </tr>
      </thead>
      <tbody>
        {games.map((game) => {
          return (
            <tr
              onClick={() => router.push(`/game/${game.apps.id}`)}
              key={game.steam_id + "sid"}
              className="h-12 cursor-pointer text-center text-xs hover:bg-slate-500/20 xl:text-lg"
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
              <td className="xl:w-32"></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

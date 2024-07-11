"use client";
import { useRouter } from "next/navigation";
import PriceDisplay from "~/app/_components/priceDisplay";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

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
        currency: string | null;
      }[];
    };
  }[];
};

export function TopSellingTable({ games }: Props) {
  const router = useRouter();
  return (
    <Table className="bg-background">
      <TableHeader>
        <TableRow className="hover:bg-background">
          <TableHead className="w-[10px] text-center">Rank</TableHead>
          <TableHead className="hidden w-[100px] lg:inline-block lg:w-[140px]"></TableHead>
          <TableHead className="text-left">Title</TableHead>
          <TableHead className="text-right">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {games.map((game) => {
          return (
            <TableRow
              key={game.steam_id + "sid"}
              className="cursor-pointer"
              onClick={() => router.push(`/game/${game.steam_id}`)}
            >
              <TableCell className="text-center text-xs md:text-sm">
                {game.app_order}
              </TableCell>
              <TableCell className="m-0 hidden w-fit p-1 lg:inline-block">
                <img
                  src={`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${game.steam_id}/capsule_sm_120.jpg`}
                  alt={`${game.apps.title} game image`}
                />
              </TableCell>
              <TableCell className="text-left text-xs md:text-sm">
                {game.apps.title}
              </TableCell>
              <TableCell>
                <PriceDisplay prices={game.apps.prices} noPadding={true} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

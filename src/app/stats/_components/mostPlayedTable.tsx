"use client";
import { useRouter } from "next/navigation";

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
    current: number;
    peak: number;
    apps: {
      id: number;
      title: string | null;
    };
  }[];
};

export function MostPlayedTable({ games }: Props) {
  const router = useRouter();
  return (
    <Table className="bg-background">
      <TableHeader>
        <TableRow className="hover:bg-background">
          <TableHead className="w-[10px] text-center">Rank</TableHead>
          <TableHead className="hidden w-[100px] lg:inline-block lg:w-[140px]"></TableHead>
          <TableHead>Title</TableHead>
          <TableHead className="text-left">Current Players</TableHead>
          <TableHead className="text-right">Peak Today</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {games.map((game) => {
          return (
            <TableRow
              onClick={() => router.push(`/game/${game.steam_id}`)}
              key={game.steam_id + "sid"}
              className="cursor-pointer"
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
              <TableCell className="max-w-20 overflow-hidden text-ellipsis text-nowrap text-left text-xs md:max-w-80 md:text-sm">
                {game.apps.title}
              </TableCell>
              <TableCell className="text-right text-xs md:text-sm">
                {game.current.toLocaleString()}
              </TableCell>
              <TableCell className="text-right text-xs md:text-sm">
                {game.peak.toLocaleString()}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

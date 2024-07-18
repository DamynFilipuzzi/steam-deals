"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import PriceDisplay from "~/app/_components/priceDisplay";
import { useRouter } from "next/navigation";

type Apps = {
  apps: {
    steam_id: number;
    user_id: string;
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

export default function AppsTable({ apps }: Apps) {
  const router = useRouter();

  return (
    <Table className="bg-background">
      <TableHeader>
        <TableRow className="hover:bg-background">
          <TableHead className=""></TableHead>
          <TableHead className="text-left">Title</TableHead>
          <TableHead className="text-right">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {apps.map((app) => (
          <TableRow
            key={app.apps.id}
            onClick={() => router.push(`/game/${app.steam_id}`)}
            className="cursor-pointer"
          >
            <TableCell className="m-0 w-[140px] p-1">
              <img
                src={`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${app.steam_id}/capsule_sm_120.jpg`}
                alt={`${app.apps.title} game image`}
              />
            </TableCell>
            <TableCell className="overflow-hidden text-ellipsis p-1 text-left text-xs md:text-sm">
              {app.apps.title}
            </TableCell>
            <TableCell className="p-1">
              <PriceDisplay prices={app.apps.prices} noPadding={true} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

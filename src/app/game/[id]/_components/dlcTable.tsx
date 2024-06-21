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

type DLCProp = {
  appDLC: {
    id: number;
    steam_id: number;
    dlc_steam_id: number | null;
    title: string | null;
    type: string;
    total_reviews: number | null;
    total_positive_reviews: number | null;
    last_modified: number | null;
    price_change_number: number;
    updated_at: Date;
    created_at: Date;
    prices: {
      id: number;
      is_free: boolean | null;
      currency: string | null;
      original_price: number | null;
      discount_price: number | null;
    }[];
  }[];
};

export default function DLCTable({ appDLC }: DLCProp) {
  const router = useRouter();

  return (
    <>
      {appDLC.length > 1 && (
        <div className="mb-5 flex flex-col-reverse justify-center gap-4 px-5 xl:flex-row xl:px-80">
          <div className="h-full w-full bg-slate-900 p-5">
            <h2 className="mb-2 text-2xl text-cyan-500">DLC</h2>
            <Table className="bg-background">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]"></TableHead>
                  <TableHead className="text-left">Title</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appDLC.map((dlc) => {
                  return (
                    <TableRow
                      key={dlc.id}
                      onClick={() => router.push(`/game/${dlc.steam_id}`)}
                      className="cursor-pointer"
                      aria-label={`Link to dlc item: ${dlc.title}`}
                    >
                      <TableCell>
                        <img
                          src={`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${dlc.steam_id}/capsule_sm_120.jpg`}
                          alt={`DLC - ${dlc.title} capsule image`}
                        />
                      </TableCell>
                      <TableCell className="text-xs md:text-sm">
                        {dlc.title}
                      </TableCell>
                      <TableCell>
                        <PriceDisplay prices={dlc.prices} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </>
  );
}

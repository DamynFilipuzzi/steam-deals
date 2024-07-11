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
import { Button } from "~/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import React from "react";

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
  const [max, setMax] = React.useState(5);

  const [prevBtnDisabled, setPrevButtonDisabled] = React.useState(true);
  const [nextBtnDisabled, setNextButtonDisabled] = React.useState(false);

  const showNext = () => {
    if (max <= appDLC.length) {
      setMax(max + 5);
      if (prevBtnDisabled) {
        setPrevButtonDisabled(false);
      }
      if (max + 5 >= appDLC.length) {
        setNextButtonDisabled(true);
      }
    }
  };

  const showPrev = () => {
    if (max - 5 > 0) {
      setMax(max - 5);
      if (nextBtnDisabled) {
        setNextButtonDisabled(false);
      }
      if (max - 10 <= 0) {
        setPrevButtonDisabled(true);
      }
    }
  };

  return (
    <>
      {appDLC.length > 0 && (
        <div className="mb-5 flex flex-col-reverse justify-center gap-4 px-5 xl:flex-row xl:px-80">
          <div className="h-full w-full bg-secondary-background p-5 shadow-md shadow-background dark:shadow-none">
            <h2 className="mb-2 text-2xl text-cyan-500">DLC</h2>
            <Table className="bg-background">
              <TableHeader>
                <TableRow>
                  <TableHead className=" w-[100px] lg:w-[140px]"></TableHead>
                  <TableHead className="text-left">Title</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appDLC.slice(max - 5, max).map((dlc) => {
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
                      <TableCell className="text-xs text-primary md:text-sm">
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
            {appDLC.length > 5 && (
              <div className="mt-5 flex w-full flex-row items-center justify-between">
                <span className="inline">
                  {max > appDLC.length ? appDLC.length : max} of {appDLC.length}
                </span>
                <div>
                  <Button
                    disabled={prevBtnDisabled}
                    variant="outline"
                    onClick={() => showPrev()}
                  >
                    <ArrowLeftIcon />
                  </Button>
                  <Button
                    disabled={nextBtnDisabled}
                    variant="outline"
                    onClick={() => showNext()}
                  >
                    <ArrowRightIcon />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

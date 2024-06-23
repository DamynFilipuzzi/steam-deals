"use Client";

import clsx from "clsx";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

interface PricesProps {
  id: number;
  original_price: number | null;
  is_free: boolean | null;
  currency: string | null;
  discount_price: number | null;
}

interface Props {
  prices: PricesProps[];
  hasBackground?: boolean;
  noPadding?: boolean;
}

export default function PriceDisplay({
  prices,
  hasBackground = false,
  noPadding = false,
}: Props) {
  const className = clsx(
    "flex flex-row items-center justify-end rounded-lg text-right text-sm",
    { "bg-background": hasBackground },
    { "p-1": !noPadding },
    { "h-12": !noPadding },
  );

  return (
    <div className={className}>
      {prices.map((price) => {
        return (
          <div key={price.id + "pd"}>
            {price.original_price != null &&
              price.discount_price != null &&
              price.discount_price != price.original_price && (
                <div className="flex flex-row">
                  <p className={clsx(`bg-green-600`, { "p-1": !noPadding })}>
                    -
                    {(
                      ((price.original_price - price.discount_price) /
                        price.original_price) *
                      100
                    ).toFixed(0)}
                    %
                  </p>
                  <p
                    className={clsx(
                      `bg-slate-300/10 text-slate-400 line-through`,
                      { "p-1": !noPadding },
                    )}
                  >
                    {"$" + (price.original_price / 100).toFixed(2)}
                  </p>
                </div>
              )}
          </div>
        );
      })}
      <div className={clsx(`bg-slate-300/10`, { "p-1": !noPadding })}>
        {prices.map((price) => {
          return (
            <div key={price.id + "prid"}>
              {!price.is_free ? (
                <>
                  {price.discount_price != null ? (
                    "$" + (price.discount_price / 100).toFixed(2)
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          Price Not Listed{" "}
                          <QuestionMarkCircleIcon
                            className="inline"
                            height={22}
                            width={22}
                          />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-80">
                          <p className="text-left">
                            The price is not listed, likely because the app is
                            part of a <span className="underline">package</span>{" "}
                            or has not been{" "}
                            <span className="underline">released</span> yet.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </>
              ) : (
                "Free"
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

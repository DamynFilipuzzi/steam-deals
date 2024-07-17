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
    "flex flex-row items-center justify-end text-right text-sm",
    { "rounded-lg": !hasBackground },
    { "rounded-b-md": hasBackground },
    { "bg-background": hasBackground },
    { "p-1": !noPadding },
    { "h-12": !noPadding },
  );
  const classNameTooltip = clsx({ "hidden sm:inline": noPadding });

  return (
    <div className={className}>
      {prices.map((price) => {
        return (
          <div key={price.id + "pd"}>
            {price.original_price != null &&
              price.discount_price != null &&
              price.discount_price != price.original_price && (
                <div className="flex flex-row">
                  <p
                    className={clsx(`bg-green-600 text-white`, {
                      "p-1": !noPadding,
                    })}
                  >
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
                      `bg-muted text-muted-foreground line-through `,
                      {
                        "p-1": !noPadding,
                      },
                    )}
                  >
                    {"$" + (price.original_price / 100).toFixed(2)}
                  </p>
                </div>
              )}
          </div>
        );
      })}
      <div className={clsx(`bg-muted`, { "p-1": !noPadding })}>
        {prices.map((price) => {
          return (
            <div key={price.id + "prid"} className="text-primary">
              {!price.is_free ? (
                <>
                  {price.discount_price != null ? (
                    "$" + (price.discount_price / 100).toFixed(2)
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="text-primary">
                          <span className={classNameTooltip}>
                            Price Not Listed{" "}
                          </span>
                          <QuestionMarkCircleIcon
                            className="inline text-primary"
                            height={22}
                            width={22}
                          />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-80">
                          <p className="text-left text-primary">
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

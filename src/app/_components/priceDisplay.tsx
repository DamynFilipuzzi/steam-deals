"use Client";

import clsx from "clsx";

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
}

export default function PriceDisplay({ prices, hasBackground = false }: Props) {
  const className = clsx(
    "flex h-12 flex-row items-center justify-end rounded-lg p-1 text-right text-sm",
    { "bg-background": hasBackground },
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
                  <p className="bg-green-600 p-1">
                    -
                    {(
                      ((price.original_price - price.discount_price) /
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
        {prices.map((price) => {
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
  );
}

"use client";

import React, { useState } from "react";
import { Slider } from "~/components/ui/slider";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { formatCurrencyInt } from "~/lib/utils";

type Props = {
  maxPrice: number;
};

export default function MaxPriceFilter({ maxPrice }: Props) {
  const [value, setValue] = useState(formatCurrencyInt(maxPrice));

  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  // Initialize state with value from URL param if exists
  React.useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const limit = params.get("limit");
    if (limit != null) {
      setValue(parseInt(limit));
      return;
    }
  }, [searchParams]);

  const handleChange = (val: Array<number> | string) => {
    if (typeof val == "string") {
      const i = parseInt(val);
      if (!isNaN(i) && i <= formatCurrencyInt(maxPrice)) {
        if (i != undefined) {
          setValue(i);
          updateParams(i);
        }
      }
    } else if (typeof val == "object") {
      if (val[0] != undefined && val[0] <= formatCurrencyInt(maxPrice)) {
        setValue(val[0]);
        updateParams(val[0]);
      }
    }
  };

  const updateParams = useDebouncedCallback((num: number) => {
    const params = new URLSearchParams(searchParams);
    // Remove limit param if it's the same as the max price.
    if (num == formatCurrencyInt(maxPrice)) {
      params.delete("limit");
    } else {
      params.set("limit", num.toString());
    }
    params.delete("page");
    replace(`${pathname}?${params.toString()}`);
  }, 200);

  return (
    <div className="p-2">
      $
      <input
        className="w-1/4 bg-slate-700 text-white"
        type="number"
        onChange={(e) => handleChange(e.target.value)}
        value={value}
        max={formatCurrencyInt(maxPrice)}
        min={1}
        step={1}
      />
      <Slider
        className="p-2"
        onValueChange={(e) => handleChange(e)}
        value={[value]}
        max={formatCurrencyInt(maxPrice)}
        min={1}
        step={1}
      />
    </div>
  );
}

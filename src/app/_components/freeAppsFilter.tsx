"use client";

import React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function FreeAppsFilter() {
  const [checked, setChecked] = React.useState(false);

  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  // Initialize state with value from URL param if exists
  React.useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const hideFree = params.get("hidefree");
    if (hideFree != null) {
      setChecked(true);
      return;
    }
  }, [searchParams]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams);
    const { checked } = event.target;
    setChecked(checked);

    if (checked) {
      params.set("hidefree", "1");
    } else {
      params.delete("hidefree");
    }
    // reset page
    params.delete("page");

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <ul>
      <li className="mx-2 my-1 overflow-hidden text-nowrap hover:bg-accent">
        <label className="block select-none text-sm">
          <input
            className="mr-2"
            type="checkbox"
            checked={checked}
            onChange={handleChange}
          />{" "}
          Hide Free Apps?
        </label>
      </li>
    </ul>
  );
}

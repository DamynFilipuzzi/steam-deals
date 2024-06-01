"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function TypeFilter() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const [position, setPosition] = React.useState<string>("game");

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const type = params.get("type");
    if (type != null) {
      setPosition(type);
      return;
    }
  }, [searchParams]);

  // Sets url if checked type is not game (default option is games).
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPosition(event.target.value);
    const params = new URLSearchParams(searchParams);
    if (event.target.value == "game") {
      if (params.get("type") != null) {
        params.delete("type");
      }
      // reset page
      if (params.get("page") != null) {
        params.delete("page");
      }
    } else {
      params.set("type", event.target.value);
      // reset page
      if (params.get("page") != null) {
        params.delete("page");
      }
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <ul>
      <li className="mx-2 my-1 overflow-hidden text-nowrap hover:bg-accent">
        <label className="block select-none">
          <input
            className="mr-2"
            type="radio"
            value="game"
            checked={position == "game"}
            onChange={handleChange}
          />
          Games
        </label>
      </li>
      <li className="mx-2 my-1 overflow-hidden text-nowrap hover:bg-accent">
        <label className="block select-none">
          <input
            className="mr-2"
            type="radio"
            value="dlc"
            checked={position == "dlc"}
            onChange={handleChange}
          />
          DLC
        </label>
      </li>
    </ul>
  );
}

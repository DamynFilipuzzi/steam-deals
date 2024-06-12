"use client";

import * as React from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ChevronUpIcon } from "lucide-react";
import { ChevronDownIcon } from "lucide-react";
import MaxPriceFilter from "./maxPriceFilter";
import TypeFilter from "./typeFilter";
import FreeAppsFilter from "./freeAppsFilter";

type Props = {
  maxPrice: number;
};

export default function FiltersDropdownMenu({ maxPrice }: Props) {
  const [changeButton, setChangeButton] = React.useState(false);

  return (
    <DropdownMenu onOpenChange={() => setChangeButton(!changeButton)}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" aria-label="Various filters dropdown button">
          {changeButton ? (
            <ChevronUpIcon size={25} />
          ) : (
            <ChevronDownIcon size={25} />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel className="text-center">
          Sort by Type
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <TypeFilter />
        <DropdownMenuLabel className="text-center">Max Price</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <MaxPriceFilter maxPrice={maxPrice} />
        <DropdownMenuLabel className="text-center">
          Additional Filters
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <FreeAppsFilter />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "~/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ListBulletIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface CheckboxOption {
  id: number;
  tag_id: number;
  tag_name: string;
}

interface DynamicCheckboxesProps {
  data: CheckboxOption[];
}

export default function TagsFilter({ data }: DynamicCheckboxesProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [changeButton, setChangeButton] = useState(false);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    {},
  );

  // Handles initial load state (e.g. if the user refreshes the page this ensures that the parameters from the URL are maintained and sets the checkboxes accordingly)
  React.useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const tags = params.get("tags");
    if (tags != null) {
      const tagsArr = decodeURIComponent(tags).split(",");
      tagsArr.forEach((tag) => {
        setCheckedItems((prevCheckedItems) => {
          const newCheckedItems = {
            ...prevCheckedItems,
            [tag]: true,
          };
          return newCheckedItems;
        });
      });
    }
  }, [searchParams]);

  // Store new checkedItems as true or false when user selects or deselects checkbox
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setCheckedItems((prevCheckedItems) => {
      const newCheckedItems = {
        ...prevCheckedItems,
        [name]: checked,
      };
      return newCheckedItems;
    });
  };

  // Updates URL Search Params when checkedItems changes
  React.useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const tags = [];
    let hasTags = false;
    for (const key in checkedItems) {
      if (checkedItems[key] == true) {
        tags.push(key);
        hasTags = true;
      }
    }
    if (hasTags) {
      if (tags.length > 1) {
        const multipleTags = encodeURIComponent(tags.toString());
        params.set("tags", multipleTags);
      } else {
        if (tags[0] != undefined) {
          params.set("tags", tags[0]);
        }
      }
    } else {
      params.delete("tags");
    }
    replace(`${pathname}?${params.toString()}`);
  }, [checkedItems, pathname, replace, searchParams]);

  return (
    <DropdownMenu onOpenChange={() => setChangeButton(!changeButton)}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {changeButton ? (
            <XMarkIcon height={30} width={30} />
          ) : (
            <ListBulletIcon height={30} width={30} />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="h-96 w-48 overflow-scroll lg:h-[32rem] lg:w-[32rem]">
        <DropdownMenuLabel className="text-center">
          Sort by Tags
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="columns-1 lg:columns-3">
          <ul>
            {data.map((tag) => (
              <li
                className="mx-2 my-1 overflow-hidden text-nowrap hover:bg-accent"
                key={tag.tag_id}
              >
                <label className="block" htmlFor={tag.tag_id.toString()}>
                  <input
                    id={tag.tag_id.toString()}
                    type="checkbox"
                    className="mr-2"
                    name={tag.tag_id.toString()}
                    checked={checkedItems[tag.tag_id] ?? false}
                    onChange={handleChange}
                  />
                  {tag.tag_name}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

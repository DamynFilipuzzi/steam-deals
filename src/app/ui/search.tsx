"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { X } from "lucide-react";
import React, { useRef } from "react";

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const searchRef = useRef<HTMLInputElement>(null);
  const clearRef = useRef<HTMLDivElement>(null);

  const { replace } = useRouter();

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const query = params.get("query");
    if (query != null) {
      if (clearRef.current?.hidden != null) {
        clearRef.current.hidden = false;
      }
    } else {
      if (clearRef.current?.hidden != null) {
        clearRef.current.hidden = true;
      }
    }
  }, [searchParams]);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.delete("query");
    if (searchRef.current?.value != null) {
      searchRef.current.value = "";
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative flex max-w-[500px] grow">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        id="search"
        ref={searchRef}
        className="max-w peer block w-full rounded-md border border-border bg-background px-10 py-[9px] text-sm text-primary placeholder:text-muted-foreground"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-primary peer-focus:text-muted-foreground" />
      <div ref={clearRef} hidden>
        <X
          onClick={clearSearch}
          className="peer-focus:text--muted-foreground absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 cursor-pointer text-primary"
        />
      </div>
    </div>
  );
}

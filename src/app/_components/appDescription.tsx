"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";
import { ChevronDoubleDownIcon } from "@heroicons/react/24/outline";

type Props = {
  data: string | null | undefined;
};

export function AppDescription({ data }: Props) {
  const [expandDescription, setExpandDescription] = React.useState(false);

  const textRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;

  function isOverflowActive(event: HTMLElement) {
    return event.offsetHeight < event.scrollHeight;
  }

  useEffect(() => {
    if (!isOverflowActive(textRef.current)) {
      setExpandDescription(true);
      return;
    }
  }, []);

  return (
    <div className="w-full basis-2/3">
      <div
        ref={textRef}
        id="description-box"
        className="overflow-hidden bg-slate-900 p-5"
        style={{
          height: expandDescription ? "100%" : "53rem",
          boxShadow: expandDescription ? "" : "inset 0 -30px 30px -30px black",
        }}
      >
        {data ? (
          <div>
            <h2 className="desc-header">Description</h2>
            <div
              className="game_area_description"
              dangerouslySetInnerHTML={{
                __html: data,
              }}
            ></div>
          </div>
        ) : (
          <div>
            <h2 className="desc-header">Description</h2>
            <div>No Description Available</div>
          </div>
        )}
      </div>
      {!expandDescription && (
        <div className="text-right">
          <Button
            variant="ghost"
            className="hover:bg-black hover:text-slate-400"
            onClick={() => setExpandDescription(!expandDescription)}
          >
            Show more
            <ChevronDoubleDownIcon className="ml-1 h-[18px] w-[18px]" />
          </Button>
        </div>
      )}
    </div>
  );
}

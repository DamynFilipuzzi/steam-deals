"use client";

import React, { useEffect } from "react";
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
      <div className="shadow-md shadow-background dark:shadow-none">
        <div
          ref={textRef}
          id="description-box"
          className="overflow-hidden bg-secondary-background p-5 text-primary"
          style={{
            height: expandDescription ? "100%" : "53rem",
            boxShadow: expandDescription
              ? ""
              : "inset 0 -30px 30px -30px black",
          }}
        >
          {data ? (
            <div>
              <h2 className="text-2xl text-identity-default">Description</h2>
              <div className="mb-5 h-1 rounded-xl bg-gradient-to-r from-identity-default pt-0"></div>
              <div
                className="game_area_description"
                dangerouslySetInnerHTML={{
                  __html: data,
                }}
              ></div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl text-identity-default">Description</h2>
              <div className="mb-5 h-1 rounded-xl bg-gradient-to-r from-identity-default pt-0"></div>
              <div>No Description Available</div>
            </div>
          )}
        </div>
      </div>
      {!expandDescription && (
        <div className="text-right">
          <Button
            variant="showmore"
            className="text-primary hover:text-primary/60"
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

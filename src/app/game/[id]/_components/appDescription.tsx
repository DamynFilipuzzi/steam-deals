"use client";

import React, { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { ChevronDoubleDownIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";

type Props = {
  data: string | null | undefined;
};

export function AppDescription({ data }: Props) {
  const [expandDescription, setExpandDescription] = React.useState(false);
  const { resolvedTheme } = useTheme();

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
        className="bg-secondary-background overflow-hidden p-5 text-primary"
        style={{
          height: expandDescription ? "100%" : "53rem",
          boxShadow: expandDescription ? "" : "inset 0 -30px 30px -30px black",
        }}
      >
        {data ? (
          <div>
            {resolvedTheme == "dark" ? (
              <h2 className="desc_header_dark text-identity-default">
                Description
              </h2>
            ) : (
              <h2 className="desc_header_light text-identity-default">
                Description
              </h2>
            )}
            {resolvedTheme == "dark" ? (
              <div
                className="game_area_description_dark"
                dangerouslySetInnerHTML={{
                  __html: data,
                }}
              ></div>
            ) : (
              <div
                className="game_area_description_light"
                dangerouslySetInnerHTML={{
                  __html: data,
                }}
              ></div>
            )}
          </div>
        ) : (
          <div>
            {resolvedTheme == "dark" ? (
              <h2 className="desc_header_dark text-identity-default">
                Description
              </h2>
            ) : (
              <h2 className="desc_header_light text-identity-default">
                Description
              </h2>
            )}
            <div>No Description Available</div>
          </div>
        )}
      </div>
      {!expandDescription && (
        <div className="text-right">
          <Button
            variant="ghost"
            className="text-primary hover:bg-body hover:text-primary/60"
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

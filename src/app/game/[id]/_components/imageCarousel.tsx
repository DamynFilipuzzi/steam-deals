"use client";

import Autoplay from "embla-carousel-autoplay";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";

type props = {
  screenshots: {
    id: number;
    steam_id: number;
    image_order: number;
    path_thumbnail: string;
    path_full: string;
  }[];
};

export default function ImageCarousel({ screenshots }: props) {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true }),
  );

  return (
    <div>
      {screenshots.length > 0 && (
        <div className="mt-5 flex flex-col-reverse justify-center gap-4 px-5 xl:flex-row xl:px-80 ">
          <div className="h-full w-full bg-slate-900 p-5">
            <h2 className="mb-2 text-2xl text-cyan-500">Screenshots</h2>
            <Carousel plugins={[plugin.current]}>
              <CarouselContent>
                {screenshots.map((image) => {
                  return (
                    <CarouselItem
                      className="basis-5/6 md:basis-2/4"
                      key={image.id + "sid"}
                    >
                      <img
                        src={image.path_thumbnail}
                        alt={`Image: ${image.id}`}
                      />
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious onMouseDown={plugin.current.stop} />
              <CarouselNext onMouseDown={plugin.current.stop} />
            </Carousel>
          </div>
        </div>
      )}
    </div>
  );
}

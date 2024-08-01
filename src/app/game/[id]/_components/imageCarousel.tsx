"use client";

import { PlayCircle } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

type props = {
  screenshots: images;
  videos: videoProps;
};

type images = {
  id: number;
  steam_id: number;
  image_order: number;
  path_thumbnail: string;
  path_full: string;
}[];

type videoProps = {
  id: number;
  steam_id: number;
  video_id: number;
  video_name: string;
}[];

export default function ImageCarousel({ screenshots, videos }: props) {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true }),
  );

  return (
    <>
      {screenshots.length > 0 || videos.length > 0 ? (
        <div className="mt-5 flex flex-col-reverse justify-center gap-4 px-5 xl:flex-row xl:px-80">
          <div className="h-full w-full bg-secondary-background p-5 shadow-md shadow-background dark:shadow-none">
            <h2 className="mb-2 text-2xl text-identity-default">Screenshots</h2>
            <Carousel plugins={[plugin.current]}>
              <CarouselContent>
                {videos.map((video) => {
                  return (
                    <CarouselItem
                      key={video.video_id}
                      className="basis-5/6 md:basis-2/4 lg:basis-1/3 2xl:basis-1/4 3xl:basis-1/3 4xl:basis-1/6 5xl:basis-1/5"
                    >
                      <Dialog>
                        <DialogTrigger
                          onMouseDown={plugin.current.stop}
                          className="h-full w-full"
                        >
                          <div className="group relative">
                            <img
                              className="m-auto h-full w-full"
                              src={`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${video.video_id}/movie.293x165.jpg`}
                              alt={video.video_name}
                            />
                            <PlayCircle
                              className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-black/70 p-1 text-slate-300 group-hover:text-slate-500"
                              size={38}
                            />
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-7xl border-0 bg-background">
                          <DialogHeader>
                            <DialogTitle></DialogTitle>
                            <DialogDescription>
                              <video
                                className="m-auto"
                                controls
                                poster={`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${video.video_id}/movie.293x165.jpg`}
                              >
                                {/* http://cdn.akamai.steamstatic.com/steam/apps/${video.video_id}/movie_max.mp4 */}
                                <source
                                  src={`http://cdn.akamai.steamstatic.com/steam/apps/${video.video_id}/movie480.mp4`}
                                  type="video/mp4"
                                  title={video.video_name}
                                />
                              </video>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </CarouselItem>
                  );
                })}
                {screenshots.map((image) => {
                  return (
                    <CarouselItem
                      className="basis-5/6 md:basis-2/4 lg:basis-1/3 2xl:basis-1/4 3xl:basis-1/3 4xl:basis-1/6 5xl:basis-1/5"
                      key={image.id + "sid"}
                    >
                      <Dialog>
                        <DialogTrigger onMouseDown={plugin.current.stop}>
                          <img
                            src={image.path_thumbnail}
                            alt={`Image: ${image.id}`}
                          />
                        </DialogTrigger>
                        <DialogContent className="max-w-7xl border-0 bg-background">
                          <DialogHeader>
                            <DialogTitle></DialogTitle>
                            <DialogDescription>
                              <img
                                className="m-auto"
                                src={image.path_full}
                                alt={`Image: ${image.id}`}
                              />
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious onMouseDown={plugin.current.stop} />
              <CarouselNext onMouseDown={plugin.current.stop} />
            </Carousel>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

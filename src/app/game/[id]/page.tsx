import { Metadata } from "next";
import { api } from "~/trpc/server";
import noCapsule from "public/no-capsule.jpg";
import noHeader from "public/no-header.jpg";
import Image from "next/image";
import { notFound } from "next/navigation";
import { HistoricalPriceChart } from "./_components/historicalChart";
import { cookies } from "next/headers";
import { AppDescription } from "./_components/appDescription";
import Tag from "~/app/_components/tag";
import ContentWarning from "./_components/contentWarning";
import { cache } from "react";
import ImageCarousel from "./_components/imageCarousel";
import PriceDisplay from "~/app/_components/priceDisplay";
import DLCTable from "./_components/dlcTable";
import Link from "next/link";

type Props = {
  params: { id: string };
};

const getAppInfo = cache(async (id: string) => {
  return await api.apps.getAppInfo.query(Number(id));
});

const getPriceInfo = cache(async (id: string) => {
  return await api.price.getAppPrices.query(Number(id));
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const game = await getAppInfo(params.id);
  const capsuleFetch = await fetch(
    `https://steamcdn-a.akamaihd.net/steam/apps/${game?.steam_id}/library_600x900.jpg`,
  );

  // if app has no library image use capsule image instead
  let ogImageUrl = new URL(
    `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${game?.steam_id}/capsule_616x353.jpg`,
  );
  if (capsuleFetch.ok) {
    ogImageUrl = new URL(
      `https://steamcdn-a.akamaihd.net/steam/apps/${game?.steam_id}/library_600x900.jpg`,
    );
  }

  return {
    title: `${game?.title ?? "Game"} | Steam Deals`,
    description: `${game?.app_info?.short_description ?? "Description"}`,
    metadataBase: new URL(ogImageUrl.origin),
    openGraph: {
      type: "website",
      url: ogImageUrl.origin,
      title: `${game?.title ?? "Game"} | Steam Deals`,
      description: `${game?.app_info?.short_description ?? "Description"}`,
      siteName: "Steam Deals",
      images: [{ url: ogImageUrl }],
    },
  };
}

export default async function Page({ params }: Props) {
  const game = await getAppInfo(params.id);
  const priceHistory = await getPriceInfo(params.id);

  let priceIsAllNull = true;
  let historicalLow = null as number | null;
  priceHistory.some((price) => {
    if (price.discount_price != null) {
      if (historicalLow == null || historicalLow > price.discount_price) {
        historicalLow = price.discount_price;
      }
      return (priceIsAllNull = false);
    }
  });

  if (!game) {
    notFound();
  }

  let contentWarn = false;
  if (
    game?.app_info?.is_mature &&
    cookies().get("ageVerify")?.value != "true"
  ) {
    contentWarn = true;
  }

  const headerFetch = await fetch(
    `https://steamcdn-a.akamaihd.net/steam/apps/${game?.steam_id}/library_hero.jpg`,
  );

  const capsuleFetch = await fetch(
    `https://steamcdn-a.akamaihd.net/steam/apps/${game?.steam_id}/library_600x900.jpg`,
  );

  return (
    <main className="flex min-h-screen flex-col bg-body text-white">
      {game.type == "game" ? (
        <>
          <div className="grid-rows grid w-full p-4 text-center align-middle xl:hidden">
            <h1 className="text-2xl">{game?.title}</h1>
          </div>
          <div className="relative overflow-hidden">
            {headerFetch.ok ? (
              <img
                src={headerFetch.url}
                alt={`${game?.title} Hero Image`}
                className="aspect-[426000/137561] w-full"
              />
            ) : (
              <div>
                <p className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center text-cyan-500 xl:text-2xl">
                  No Image Found :(
                </p>
                <Image
                  src={noHeader}
                  alt={`${game?.title} Missing Hero Image`}
                  className="aspect-[426000/137561] w-full blur-xl"
                />
              </div>
            )}
            <div className="absolute left-60 top-0 hidden h-full w-1/4 grid-rows-12 items-center justify-items-center space-y-0 bg-slate-950/80 p-8 xl:grid">
              <h1 className="z-10 row-start-1 row-end-3 text-2xl">
                {game?.title}
              </h1>
              {capsuleFetch.ok ? (
                <img
                  className="row-start-3 row-end-12 h-5/6 border-2 border-slate-700/25 shadow-2xl"
                  src={capsuleFetch.url}
                  alt={`${game?.title} Library Image`}
                />
              ) : (
                <>
                  <p className="absolute top-1/2 z-10 text-cyan-500">
                    No Image Found :(
                  </p>
                  <Image
                    src={noCapsule}
                    alt={`${game?.title} Missing Library Image`}
                    className="row-start-3 row-end-12 h-5/6 border-2 border-slate-700/25 shadow-2xl blur-md"
                  />
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="grid-rows mt-5 grid w-full p-4 text-center align-middle">
          <h1 className="text-2xl text-primary">{game?.title}</h1>
        </div>
      )}
      {/* Image Carousel */}
      <ImageCarousel screenshots={game.screenshots} videos={game.videos} />
      <div className="mt-5 flex flex-col-reverse justify-center gap-4 px-5 xl:flex-row xl:px-80">
        {/* Price History */}
        <div className="h-full w-full bg-secondary-background p-5 shadow-md shadow-background dark:shadow-none">
          <h2 className="mb-2 text-2xl text-identity-default">Price History</h2>
          {priceHistory.length > 1 && !priceIsAllNull ? (
            <HistoricalPriceChart data={priceHistory} />
          ) : (
            <p className="text-center text-muted-foreground">
              No price history to display.
            </p>
          )}
        </div>
      </div>
      {/* Game Info Area */}
      <div className="flex flex-col-reverse justify-center gap-4 p-5 xl:flex-row xl:px-80">
        {/* Description */}
        <AppDescription data={game?.app_info?.description} />
        {/* Right Bar */}
        <div className="flex h-full w-full basis-1/3 flex-col gap-5">
          {/* Price */}
          <div className="h-full w-full bg-secondary-background p-5 shadow-md shadow-background dark:shadow-none">
            <h2 className="mb-2 text-2xl text-identity-default">Price</h2>
            {!priceIsAllNull && (
              <h3 className="text-lg text-identity-default">Current Price</h3>
            )}
            <PriceDisplay prices={game.prices} />
            {!priceIsAllNull && (
              <>
                <h3 className="text-lg text-identity-default">
                  Historical Low
                </h3>
                <div className="flex h-12 flex-row items-center justify-end rounded-lg p-1 text-right text-sm">
                  {historicalLow != null ? (
                    <span className="bg-muted p-1 text-primary">
                      {"$" + (historicalLow / 100).toFixed(2)}
                    </span>
                  ) : (
                    "Something went wrong"
                  )}
                </div>
              </>
            )}
          </div>
          {/* Reviews */}
          <div className="h-full w-full bg-secondary-background p-5 shadow-md shadow-background dark:shadow-none">
            <h2 className="mb-2 text-2xl text-identity-default">Reviews</h2>
            <p className="text-right text-primary">
              Total Reviews:{" "}
              <span className="text-muted-foreground">
                {game?.total_reviews != 0 && game?.total_reviews != null
                  ? (game?.total_reviews)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : "No reviews yet"}
              </span>
            </p>
            <p className="text-right text-primary">
              Positive reviews:{" "}
              <span className="text-muted-foreground">
                {game?.total_reviews != null &&
                game?.total_positive_reviews != null &&
                game?.total_reviews != 0 &&
                game?.total_positive_reviews != 0
                  ? (
                      (game?.total_positive_reviews / game?.total_reviews) *
                      100
                    ).toFixed(0) + "%"
                  : "No reviews yet"}
              </span>
            </p>
          </div>
          {/* Tags */}
          <div className="h-full w-full bg-secondary-background p-5 shadow-md shadow-background dark:shadow-none">
            <h2 className="mb-2 text-2xl text-identity-default">
              Popular Tags
            </h2>
            {game.apps_tags.length > 0 ? (
              game.apps_tags.map((tag) => (
                <Tag key={tag.tag_id + "tk"} data={tag.tags} />
              ))
            ) : (
              <p className="text-right text-muted-foreground">
                This app does not have any tags associated
              </p>
            )}
          </div>
          {/* Base Game - only appears if app is DLC */}
          {game.dlc_steam_id != null && (
            <div className="h-full w-full bg-secondary-background p-5 shadow-md shadow-background dark:shadow-none">
              <h2 className="mb-2 text-2xl text-identity-default">Base Game</h2>
              <div>
                <Link href={`/game/${game.dlc_steam_id}`}>
                  <img
                    src={`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${game.dlc_steam_id}/capsule_616x353.jpg`}
                    alt={`Base game for ${game.title}`}
                  />
                </Link>
              </div>
            </div>
          )}
          {/* Publishers/Developers TODO: Add links so users can search by Developer/Publisher (Similar to Tags) */}
          {game.apps_developers.length > 0 ||
          game.apps_publishers.length > 0 ? (
            <div className="h-full w-full bg-secondary-background p-5 shadow-md shadow-background dark:shadow-none">
              {game.apps_developers.length > 0 && (
                <>
                  <h2 className="mb-2 text-2xl text-identity-default">
                    Developer:
                  </h2>
                  <div className="gap-x-4 text-end">
                    {game.apps_developers.map((dev) => (
                      <p
                        className="text-muted-foreground"
                        key={dev.developer_id}
                      >
                        {dev.developers.developer_name}
                      </p>
                    ))}
                  </div>
                </>
              )}
              {game.apps_publishers.length > 0 && (
                <>
                  <h2 className="mb-2 text-2xl text-identity-default">
                    Publisher:
                  </h2>
                  <div className="gap-x-4 text-end">
                    {game.apps_publishers.map((pub) => (
                      <p
                        className="text-muted-foreground"
                        key={pub.publisher_id}
                      >
                        {pub.publisher.publisher_name}
                      </p>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <></>
          )}
          {/* Release Information */}
          {game.releasedate?.coming_soon != null &&
            game.releasedate.release_date != null && (
              <div className="h-full w-full bg-secondary-background p-5 shadow-md shadow-background dark:shadow-none">
                <h2 className="mb-2 text-2xl text-identity-default">
                  Release:
                </h2>
                {game.releasedate.coming_soon ? (
                  <div>
                    <p className="text-right text-primary">
                      Coming:{" "}
                      <span className="text-muted-foreground">
                        {game.releasedate.release_date}
                      </span>
                    </p>
                  </div>
                ) : (
                  <p className="text-right text-primary">
                    Released:{" "}
                    <span className="text-muted-foreground">
                      {game.releasedate.release_date}
                    </span>
                  </p>
                )}
              </div>
            )}
        </div>
      </div>
      {/* DLC */}
      <DLCTable appDLC={game?.dlc} />
      <div className="mb-5 justify-center gap-4 px-5 xl:flex-row xl:px-80">
        <iframe
          title={`${game.title} - Link to steam store page`}
          src={`https://store.steampowered.com/widget/${game.steam_id}`}
          height="190"
          className="w-full"
        ></iframe>
      </div>
      {contentWarn && <ContentWarning warn={contentWarn} />}
    </main>
  );
}

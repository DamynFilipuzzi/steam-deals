import { Metadata } from "next";
import { api } from "~/trpc/server";
import Steam from "public/steam.svg";
import BackButton from "~/app/_components/backButton";
import noCapsule from "public/no-capsule.jpg";
import noHeader from "public/no-header.jpg";
import Image from "next/image";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const game = await api.games.getGameInfo.query(Number(params.id));
  return {
    title: `${game?.title ?? "Game"} | Steam Deals`,
  };
}

export default async function Page({ params }: Props) {
  const game = await api.games.getGameInfo.query(Number(params.id));

  const headerFetch = await fetch(
    `https://steamcdn-a.akamaihd.net/steam/apps/${game?.steam_id}/library_hero.jpg`,
  );

  const capsuleFetch = await fetch(
    `https://steamcdn-a.akamaihd.net/steam/apps/${game?.steam_id}/library_600x900.jpg`,
  );

  if (!game) {
    // return not found redirect
  }

  return (
    <main className="flex min-h-screen flex-col bg-black text-white">
      <div className="grid w-full grid-rows-2 p-4 text-center xl:hidden">
        <BackButton />
        <h1 className="row-start-2 text-2xl">{game?.title}</h1>
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
          <BackButton />
          <h1 className="z-10 row-start-3 row-end-3 text-2xl">{game?.title}</h1>
          {capsuleFetch.ok ? (
            <img
              className="row-start-4 row-end-11 h-5/6 border-2 border-slate-700/25 shadow-2xl"
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
                className="row-start-4 row-end-11 h-5/6 border-2 border-slate-700/25 shadow-2xl blur-md"
              />
            </>
          )}
          <a
            className="row-start-12"
            target="_blank"
            rel="noopener noreferrer"
            href={`https://store.steampowered.com/app/${game?.steam_id}`}
          >
            <p className="rounded-lg bg-cyan-500 p-2 text-xl transition ease-in-out hover:bg-cyan-300">
              View on Steam
              <Image
                src={Steam as string}
                alt="Steam logo"
                height={24}
                width={24}
                className="ml-2 inline"
              />
            </p>
          </a>
        </div>
      </div>
      <div className="flex justify-center p-4 text-center xl:hidden">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://store.steampowered.com/app/${game?.steam_id}`}
        >
          <p className="rounded-lg bg-cyan-500 p-2 text-xl transition ease-in-out hover:bg-cyan-300">
            View on Steam
            <Image
              src={Steam as string}
              alt="Steam logo"
              height={24}
              width={24}
              className="ml-2 inline"
            />
          </p>
        </a>
      </div>
      <div className="p-5">
        {/* Description */}
        <div className="grid-rows grid content-center justify-items-center xl:grid-cols-3">
          {game?.info_games?.description ? (
            <div className="col-span-2 xl:w-1/2">
              <p className="mb-2 text-2xl text-cyan-500">About This Game</p>
              <div
                dangerouslySetInnerHTML={{
                  __html: game?.info_games?.description,
                }}
              ></div>
            </div>
          ) : (
            <div className="col-span-2 xl:w-1/2">No Description Available</div>
          )}
          {/* Price */}
          <div className="col-span-1 place-self-start">
            <p className="mb-2 text-2xl text-cyan-500">Price</p>
            <div className="flex h-12 flex-row items-center justify-end bg-slate-900 p-1 text-right text-sm">
              {game?.original_price != null && game?.discount_price != null && (
                <>
                  <p className="bg-green-600 p-1">
                    -
                    {(
                      ((game.original_price - game.discount_price) /
                        game.original_price) *
                      100
                    ).toFixed(0)}
                    %
                  </p>
                  <p className="bg-slate-300/10 p-1 text-slate-400 line-through">
                    {"$" + (game.original_price / 100).toFixed(2)}
                  </p>
                </>
              )}
              <p className="bg-slate-300/10 p-1">
                $
                {game?.discount_price != null
                  ? (game.discount_price / 100).toFixed(2)
                  : "0.00"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

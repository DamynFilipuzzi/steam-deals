import { Metadata } from "next";
import Link from "next/link";
import { api } from "~/trpc/server";
import Steam from "public/steam.svg";
import Image from "next/image";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const game = await api.games.getById.query(Number(params.id));
  return {
    title: `${game?.title ?? "Game"} | Steam Games`,
  };
}

export default async function Page({ params }: Props) {
  const game = await api.games.getById.query(Number(params.id));

  if (!game) {
    // return not found redirect
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="relative">
        <img
          src={`https://steamcdn-a.akamaihd.net/steam/apps/${game?.steam_id}/library_hero.jpg`}
          alt={`${game?.title} Hero Image`}
          className="w-full"
        />
        <div className="absolute left-60 top-0 grid h-full w-1/4 grid-rows-10 items-center justify-items-center space-y-0 bg-slate-950/80 p-8">
          <Link
            href="/"
            className="row-start-1 w-min justify-self-start text-slate-200"
          >
            <h1 className="text-lg">Back</h1>
          </Link>
          <h1 className="row-start-2 text-2xl">{game?.title}</h1>
          <img
            className="row-start-3 row-end-9 h-5/6 border-2 border-slate-700/25 shadow-2xl"
            src={`https://steamcdn-a.akamaihd.net/steam/apps/${game?.steam_id}/library_600x900.jpg`}
            alt={`${game?.title} Library Image`}
          />
          <a
            className="row-start-10"
            target="_blank"
            rel="noopener noreferrer"
            href={`https://store.steampowered.com/app/${game?.steam_id}`}
          >
            <h1 className="rounded-lg bg-lime-700 p-2 text-xl transition ease-in-out hover:bg-lime-600">
              View on Steam
              <Image
                src={Steam as string}
                alt="Steam logo"
                height={24}
                width={24}
                className="ml-2 inline"
              />
            </h1>
          </a>
        </div>
      </div>
    </main>
  );
}

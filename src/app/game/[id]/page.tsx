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
  const game = await api.games.getById.query(Number(params.id));
  return {
    title: `${game?.title ?? "Game"} | Steam Deals`,
  };
}

export default async function Page({ params }: Props) {
  const game = await api.games.getById.query(Number(params.id));

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
        <p className=" my-10 text-center text-3xl">
          THIS IS FILLER TEXT FOR THE TIME BEING.
        </p>
        <ul>
          <li>
            Morbi in sem quis dui placerat ornare. Pellentesque odio nisi,
            euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras
            consequat.
          </li>
          <li>
            Praesent dapibus, neque id cursus faucibus, tortor neque egestas
            augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam
            dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.
          </li>
          <li>
            Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec
            consectetuer ligula vulputate sem tristique cursus. Nam nulla quam,
            gravida non, commodo a, sodales sit amet, nisi.
          </li>
          <li>
            Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor,
            ultrices ut, elementum vulputate, nunc.
          </li>
        </ul>

        <p>
          Pellentesque habitant morbi tristique senectus et netus et malesuada
          fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae,
          ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam
          egestas semper. Aenean ultricies mi vitae est. Mauris placerat
          eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra.
          Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet,
          wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum
          rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in
          turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus
          faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat.
          Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor,
          facilisis luctus, metus
        </p>
        <p>
          Pellentesque habitant morbi tristique senectus et netus et malesuada
          fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae,
          ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam
          egestas semper. Aenean ultricies mi vitae est. Mauris placerat
          eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra.
          Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet,
          wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum
          rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in
          turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus
          faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat.
          Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor,
          facilisis luctus, metus
        </p>
        <p>
          Pellentesque habitant morbi tristique senectus et netus et malesuada
          fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae,
          ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam
          egestas semper. Aenean ultricies mi vitae est. Mauris placerat
          eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra.
          Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet,
          wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum
          rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in
          turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus
          faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat.
          Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor,
          facilisis luctus, metus
        </p>
        <p>
          Pellentesque habitant morbi tristique senectus et netus et malesuada
          fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae,
          ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam
          egestas semper. Aenean ultricies mi vitae est. Mauris placerat
          eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra.
          Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet,
          wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum
          rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in
          turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus
          faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat.
          Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor,
          facilisis luctus, metus
        </p>
        <p>
          Pellentesque habitant morbi tristique senectus et netus et malesuada
          fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae,
          ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam
          egestas semper. Aenean ultricies mi vitae est. Mauris placerat
          eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra.
          Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet,
          wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum
          rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in
          turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus
          faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat.
          Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor,
          facilisis luctus, metus
        </p>
        <p>
          Pellentesque habitant morbi tristique senectus et netus et malesuada
          fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae,
          ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam
          egestas semper. Aenean ultricies mi vitae est. Mauris placerat
          eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra.
          Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet,
          wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum
          rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in
          turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus
          faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat.
          Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor,
          facilisis luctus, metus
        </p>
        <p>
          Pellentesque habitant morbi tristique senectus et netus et malesuada
          fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae,
          ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam
          egestas semper. Aenean ultricies mi vitae est. Mauris placerat
          eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra.
          Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet,
          wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum
          rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in
          turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus
          faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat.
          Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor,
          facilisis luctus, metus
        </p>
      </div>
    </main>
  );
}

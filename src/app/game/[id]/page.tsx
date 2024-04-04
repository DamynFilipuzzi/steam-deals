import { Metadata } from "next";
import Link from "next/link";
import { api } from "~/trpc/server";

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
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <Link href="/">
        <h1 className="mb-5 text-2xl">back</h1>
      </Link>
      <h1 className="mb-5 text-2xl underline">{game?.title}</h1>
    </main>
  );
}

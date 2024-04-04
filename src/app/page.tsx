import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Home() {
  noStore();
  const session = await getServerAuthSession();

  const allPosts = await api.post.getAll.query();
  const allGames = await api.games.getAll.query();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <h1 className="mb-5 text-2xl underline">Top Games of the Day</h1>
      <div className="flex flex-row gap-4 text-center">
        {allGames.map((game) => {
          return (
            <Link key={game.id} href={`/game/${game.id}`}>
              <div className="m-0">
                <div className="flex h-80 w-44 flex-col justify-between border-2 border-slate-700/25 bg-slate-700/25">
                  <div className="h-16 overflow-hidden text-ellipsis bg-slate-900 p-1">
                    {game.title}
                  </div>
                  <div>
                    <img
                      src={`https://steamcdn-a.akamaihd.net/steam/apps/${game.steam_id}/library_600x900.jpg`}
                      alt={`${game.title} game image`}
                    />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="my-7"></div>

      {allPosts.map((post) => {
        return <div key={post.id}>{post.name}</div>;
      })}

      <div className="my-7"></div>

      <CrudShowcase />

      <div className="my-7 flex flex-col items-center justify-center gap-4">
        <p className="text-center text-2xl text-white">
          {session && <span>Logged in as {session.user?.name}</span>}
        </p>
        <Link
          href={session ? "/api/auth/signout" : "/api/auth/signin"}
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          {session ? "Sign out" : "Sign in"}
        </Link>
      </div>
    </main>
  );
}

async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const latestPost = await api.post.getLatest.query();

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost />
    </div>
  );
}

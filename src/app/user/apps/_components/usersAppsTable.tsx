import { getServerSession } from "next-auth";
import { getAuthOptions } from "~/server/auth";
import { db } from "~/server/db";
import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import Link from "next/link";

interface AppsResponse {
  response:
    | {
        game_count: number | null | undefined;
        games:
          | {
              appid: number;
              playtime_forever: number;
              playtime_windows_forever: number;
              playtime_mac_forever: number;
              playtime_linux_forever: number;
              playtime_deck_forever: number;
              rtime_last_played: number;
              playtime_disconnected: number;
            }[]
          | null
          | undefined;
      }
    | null
    | undefined;
}

export default async function UsersAppsTable() {
  const session = await getServerSession(getAuthOptions());

  async function upsertUsersApps(userId: string) {
    // updates or inserts users games. connects games from users steam library to users account
    // get users games
    if (userId != null) {
      const response = await fetch(
        `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${process.env.STEAM_SECRET!}&steamid=${userId}`,
      );
      const apps: AppsResponse = (await response.json()) as AppsResponse;
      console.log("Games Count: ", apps.response?.game_count);
      // this only works locally
      if (
        (apps.response != null || apps.response != undefined) &&
        (apps.response.games != null || apps.response.games != undefined)
      ) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        apps.response.games.map(async (app) => {
          // Check if UsersGames already exists.
          const uaExists = !!(await db.usersApps.count({
            where: { user_id: userId, steam_id: app.appid },
          }));
          if (!uaExists) {
            // Else Check if app exists
            const appExists = !!(await db.apps.count({
              where: { steam_id: app.appid },
            }));
            if (appExists && userId != undefined) {
              // if true then store UsersGames
              await db.usersApps.create({
                data: { steam_id: app.appid, user_id: userId },
              });
            } else {
              console.log("DNE: ", app.appid);
            }
          }
        });
      } else {
        console.error("Something Went wrong, or User has no games");
      }
    }
  }

  if (!session) {
    console.error("failed to retrieve session info");
    // TODO: add toast to let user know an error occurred
    redirect("/");
  } else {
    console.log("id: ", session?.user.steam);
    await upsertUsersApps(session.user.steam.steamid);
    const userApps = await api.user.getUserApps.query(
      session.user.steam.steamid,
    );

    return (
      <div>
        {userApps.map((app) => (
          <Link href={`/game/${app.steam_id}`} key={app.apps.id}>
            <div>{app.apps.title}</div>
          </Link>
        ))}
      </div>
    );
  }
}

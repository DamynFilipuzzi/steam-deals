import { getServerSession } from "next-auth";
import { getAuthOptions } from "~/server/auth";
import { LoaderCircle } from "lucide-react";
import { db } from "~/server/db";
import { redirect } from "next/navigation";

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

interface SteamUser {
  id: string;
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
  steam: {
    steamid: string;
    communityvisibilitystate: number;
    profilestate: number;
    personaname: string;
    profileurl: string;
    avatar: string;
    avatarmedium: string;
    avatarfull: string;
    avatarhash: string;
    lastlogoff: number;
    personastate: number;
    realname: string;
    primaryclanid: string;
    timecreated: number;
    personastateflags: number;
  };
}

export default async function Home() {
  const session = await getServerSession(getAuthOptions());
  if (session != null) {
    console.log("id: ", session?.user.steam);
    await upsertUser(session.user);
    await upsertUsersApps(session.user.steam.steamid);
    redirect("/");
  } else {
    console.error("failed to retrieve session info");
    // TODO: add toast to let user know an error occured
    redirect("/");
  }

  async function upsertUser(user: SteamUser) {
    // Upsert User
    await db.user.upsert({
      where: {
        id: user.steam.steamid,
      },
      update: {
        name: user.name,
        email: user.email,
        image: user.image,
      },
      create: {
        id: user.steam.steamid,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    });
  }

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

  return (
    <main className="flex min-h-screen flex-row items-center justify-center bg-body text-primary">
      <p className="mr-5 animate-pulse">
        Retrieving your apps, this should only take about a minute...
      </p>
      <div className="flex animate-spin">
        <LoaderCircle size={32} />
      </div>
    </main>
  );
}

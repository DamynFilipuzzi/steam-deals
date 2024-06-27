// import { PrismaAdapter } from "@auth/prisma-adapter";
// import {
//   getServerSession,
//   type DefaultSession,
//   type NextAuthOptions,
// } from "next-auth";
// import { type Adapter } from "next-auth/adapters";
// import DiscordProvider from "next-auth/providers/discord";

// import { env } from "~/env";
// import { db } from "~/server/db";

import { type DefaultSession } from "next-auth";

import { db } from "~/server/db";

import SteamProvider, { PROVIDER_ID } from "@kenjiow/next-auth-steam";

import type { AuthOptions } from "next-auth";
import type { NextRequest } from "next/server";
import { JWT } from "next-auth/jwt";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
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
    } & DefaultSession["user"];
  }
}

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

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
// export const authOptions: NextAuthOptions = {
//   callbacks: {
//     session: ({ session, user }) => ({
//       ...session,
//       user: {
//         ...session.user,
//         id: user.id,
//       },
//     }),
//   },
//   adapter: PrismaAdapter(db) as Adapter,
//   providers: [
//     DiscordProvider({
//       clientId: env.DISCORD_CLIENT_ID,
//       clientSecret: env.DISCORD_CLIENT_SECRET,
//     }),
//     /**
//      * ...add more providers here.
//      *
//      * Most other providers require a bit more work than the Discord provider. For example, the
//      * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
//      * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
//      *
//      * @see https://next-auth.js.org/providers/github
//      */
//   ],
// };

// /**
//  * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
//  *
//  * @see https://next-auth.js.org/configuration/nextjs
//  */
// export const getServerAuthSession = () => getServerSession(authOptions);

export function getAuthOptions(req?: NextRequest): AuthOptions {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    providers: req
      ? [
          SteamProvider(req, {
            clientSecret: process.env.STEAM_SECRET!,
            callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/callback`,
          }),
        ]
      : [],
    callbacks: {
      async jwt({ token, account, profile }) {
        if (account?.provider === PROVIDER_ID) {
          // console.log(token, account, profile);
          token.steam = profile;
          await upsertUser(token);
          await upsertUsersApps(token);
        }
        return token;
      },
      session({ session, token }) {
        if ("steam" in token) {
          // @ts-expect-error expect error ts
          session.user.steam = token.steam;
        }
        return session;
      },
    },
  };
}

async function upsertUser(token: JWT) {
  // Upsert User
  await db.user.upsert({
    where: {
      id: token.sub,
    },
    update: {
      id: token.sub,
      name: token.name,
      email: token.email,
      image: token.picture,
    },
    create: {
      id: token.sub,
      name: token.name,
      email: token.email,
      image: token.picture,
    },
  });
}

async function upsertUsersApps(token: JWT) {
  // updates or inserts users games. connects games from users steam library to users account
  // get users games
  if (token.sub != null) {
    const response = await fetch(
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${process.env.STEAM_SECRET!}&steamid=${token.sub}`,
    );
    const apps: AppsResponse = (await response.json()) as AppsResponse;
    console.log("Games Count: ", apps.response?.game_count);
    if (
      (apps.response != null || apps.response != undefined) &&
      (apps.response.games != null || apps.response.games != undefined)
    ) {
      Promise.all(
        apps.response.games.map(async (app) => {
          // Check if UsersGames already exists.
          const uaExists = !!(await db.usersApps.count({
            where: { user_id: token.sub, steam_id: app.appid },
          }));
          if (!uaExists) {
            // Else Check if app exists
            const appExists = !!(await db.apps.count({
              where: { steam_id: app.appid },
            }));
            if (appExists && token.sub != undefined) {
              // if true then store UsersGames
              await db.usersApps.create({
                data: { steam_id: app.appid, user_id: token.sub },
              });
            } else {
              console.log("DNE: ", app.appid);
            }
          }
        }),
      )
        .then(function () {
          return;
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      console.log("Something Went wrong, or User has no games");
    }
  }
}

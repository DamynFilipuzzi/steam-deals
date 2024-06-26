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
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
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
          await createUser(token);
          token.steam = profile;
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

async function createUser(token: JWT) {
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

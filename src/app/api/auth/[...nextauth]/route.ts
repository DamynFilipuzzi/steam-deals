// import NextAuth from "next-auth";

// import { authOptions } from "~/server/auth";

// // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };

import NextAuth from "next-auth/next";
import { getAuthOptions } from "~/server/auth";

import type { NextRequest } from "next/server";

const handler = (req: NextRequest, ctx: { params: { nextauth: string[] } }) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  NextAuth(req, ctx, getAuthOptions(req));

// async function handler(
//   req: NextRequest,
//   ctx: { params: { nextauth: string[] } },
// ) {
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-return
//   return NextAuth(req, ctx, getAuthOptions(req));
// }

export { handler as GET, handler as POST };

import { createTRPCRouter } from "~/server/api/trpc";
import { appsRouter } from "./routers/app";
import { tagsRouter } from "./routers/tag";
import { priceRouter } from "./routers/price";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  apps: appsRouter,
  tags: tagsRouter,
  price: priceRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

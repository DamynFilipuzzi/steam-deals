import { createTRPCRouter } from "~/server/api/trpc";
import { appsRouter } from "./routers/app";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  apps: appsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

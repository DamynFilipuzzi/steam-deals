import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getUserApps: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.usersApps.findMany({
      where: {
        user_id: input,
      },
      include: {
        apps: true,
      },
    });
  }),

  getUserWishlist: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.usersWishlist.findMany({
      where: {
        user_id: input,
      },
      include: {
        apps: true,
      },
    });
  }),
});

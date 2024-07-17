import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getUserApps: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.usersApps.findMany({
      where: {
        user_id: input,
      },
      include: {
        apps: {
          select: {
            id: true,
            title: true,
            prices: {
              where: { valid_to: new Date("9999-12-31T00:00:00.000Z") },
              select: {
                id: true,
                is_free: true,
                discount_price: true,
                original_price: true,
                currency: true,
              },
            },
          },
        },
      },
    });
  }),

  getUserWishlist: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.usersWishlist.findMany({
      where: {
        user_id: input,
      },
      include: {
        apps: {
          select: {
            id: true,
            title: true,
            prices: {
              where: { valid_to: new Date("9999-12-31T00:00:00.000Z") },
              select: {
                id: true,
                is_free: true,
                discount_price: true,
                original_price: true,
                currency: true,
              },
            },
          },
        },
      },
    });
  }),
});

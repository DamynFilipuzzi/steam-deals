import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
// import { z } from "zod";

export const priceRouter = createTRPCRouter({
  getMaxPrice: publicProcedure.query(({ ctx }) => {
    return ctx.db.prices.aggregate({
      _max: {
        discount_price: true,
        original_price: true,
      },
    });
  }),
});

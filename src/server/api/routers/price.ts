import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const priceRouter = createTRPCRouter({
  getMaxPrice: publicProcedure.query(({ ctx }) => {
    return ctx.db.prices.aggregate({
      _max: {
        discount_price: true,
        original_price: true,
      },
    });
  }),

  getAppPrices: publicProcedure
    .input(
      z
        .number({
          required_error: "Input is required",
          invalid_type_error: "Input must be a number",
        })
        .lte(2147483647)
        .gte(-2147483647)
        .int(),
    )
    .query(({ ctx, input }) => {
      return ctx.db.prices.findMany({
        where: { steam_id: input },
      });
    }),
});

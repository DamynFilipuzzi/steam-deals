import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const gameRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.games.findMany({
      skip: 0,
      take: 64,
      orderBy: { id: "asc" },
    });
  }),

  getById: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.db.games.findFirst({
      where: { id: input },
    });
  }),
});

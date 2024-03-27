import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const gameRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.games.findMany({
      skip: 2,
      take: 8,
      orderBy: { id: "asc" },
    });
  }),
});

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

const gamesPerPage = 18;
export const gamesPerPages = () => {
  return gamesPerPage;
};

export const gameRouter = createTRPCRouter({
  getQuery: publicProcedure
    .input(z.object({ page: z.number(), query: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.games.findMany({
        skip: Number(gamesPerPage * input.page - gamesPerPage),
        take: gamesPerPage,
        orderBy: { id: "asc" },
        where: {
          title: {
            contains: input.query,
            mode: "insensitive",
          },
        },
      });
    }),

  getGameInfo: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.db.games.findFirst({
      include: {
        info_games: true,
      },
      where: { id: input },
    });
  }),

  getTotalPages: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.games.count({
      where: {
        title: {
          contains: input,
          mode: "insensitive",
        },
      },
    });
  }),
});

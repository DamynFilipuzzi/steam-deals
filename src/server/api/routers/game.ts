import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

const gamesPerPage = 18;
export const gamesPerPages = () => {
  return gamesPerPage;
};

export const gameRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.games.findMany({
      skip: 0,
      take: gamesPerPage,
      orderBy: { id: "asc" },
    });
  }),

  getQuery: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.db.games.findMany({
      skip: Number(gamesPerPage * input - gamesPerPage),
      take: gamesPerPage,
      orderBy: { id: "asc" },
    });
  }),

  getById: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.db.games.findFirst({
      where: { id: input },
    });
  }),

  getTotalPages: publicProcedure.query(({ ctx }) => {
    return ctx.db.games.count();
  }),
});

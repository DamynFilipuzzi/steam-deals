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
          // price: {
          //   some: {
          //     valid_to: { lte: new Date().toISOString() },
          //   },
          // },
        },
        // include: {
        //   // price: {
        //   //   where: {
        //   //     valid_from: { gte: new Date().toISOString() },
        //   //     valid_to: { lte: new Date().toISOString() },
        //   //   },
        //   // },
        //   price: true,
        // },
      });
    }),

  getGameInfo: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    if (input < 2147483647)
      return ctx.db.games.findFirst({
        include: {
          info_games: true,
          price: {
            orderBy: { valid_from: "asc" },
            //include filter when ready
            //   where: {
            //     valid_from: { gte: new Date().toISOString() },
            //     valid_to: { lte: new Date().toISOString() },
            //   },
          },
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

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
// import { z } from "zod";

export const tagsRouter = createTRPCRouter({
  getAllTags: publicProcedure.query(({ ctx }) => {
    return ctx.db.tags.findMany({
      orderBy: {
        apps_tags: {
          _count: "desc",
        },
      },
    });
  }),
});

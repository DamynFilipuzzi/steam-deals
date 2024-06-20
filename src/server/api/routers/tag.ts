import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

type Tags = {
  id: number;
  tag_id: number;
  tag_name: string;
}[];

export const tagsRouter = createTRPCRouter({
  getAllTags: publicProcedure.query(({ ctx }) => {
    // return ctx.db.tags.findMany({
    //   orderBy: {
    //     apps_tags: {
    //       _count: "desc",
    //     },
    //   },
    // });
    return ctx.db
      .$queryRaw<Tags>`SELECT DISTINCT "Tags".tag_id, "Tags".tag_name, "Tags".id FROM "Tags" Right JOIN "Apps_Tags" ON "Tags".tag_id = "Apps_Tags".tag_id ORDER BY "Tags".id;`;
  }),
});

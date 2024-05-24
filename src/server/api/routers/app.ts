import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

const appsPerPage = 18;
export const appsPerPages = () => {
  return appsPerPage;
};

function convertToIntArray(str: string) {
  const arr = [] as Array<number>;
  const item = str.split(",");
  item.forEach((element) => {
    arr.push(Number(element));
  });
  return arr;
}

export const appsRouter = createTRPCRouter({
  getQuery: publicProcedure
    .input(
      z.object({
        page: z.number(),
        query: z.string(),
        tags: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.apps.findMany({
        skip: Number(appsPerPage * input.page - appsPerPage),
        take: appsPerPage,
        orderBy: [
          {
            app_info: {
              total_reviews: { sort: "desc", nulls: "last" },
              // Cant use 2 columns to sort by. TODO: try to find a solution
              // total_positive_reviews: { sort: "desc", nulls: "last" },
            },
          },
          { updated_at: "asc" },
          { id: "desc" },
        ],
        where: {
          title: {
            contains: input.query,
            mode: "insensitive",
          },
          ...(input.tags
            ? {
                apps_tags: {
                  some: {
                    tag_id: {
                      in: convertToIntArray(decodeURIComponent(input.tags)),
                    },
                  },
                },
              }
            : {}),
        },
        include: {
          prices: {
            where: { valid_to: new Date("9999-12-31T00:00:00.000Z") },
          },
          // prices: true,
        },
      });
    }),

  getAppInfo: publicProcedure
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
      return ctx.db.apps.findFirst({
        include: {
          apps_tags: {
            include: {
              tags: true,
            },
          },
          app_info: true,
          prices: {
            orderBy: { valid_from: "asc" },
            where: {
              // valid_from: { gte: new Date(2022, 0, 20).toISOString() },
              // valid_to: { lte: new Date(9999, , 24).toISOString() },
            },
          },
        },
        where: { id: input },
      });
    }),

  getTotalPages: publicProcedure
    .input(
      z.object({
        query: z.string(),
        tags: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.apps.count({
        where: {
          title: {
            contains: input.query,
            mode: "insensitive",
          },
          ...(input.tags
            ? {
                apps_tags: {
                  some: {
                    tag_id: {
                      in: convertToIntArray(decodeURIComponent(input.tags)),
                    },
                  },
                },
              }
            : {}),
        },
      });
    }),
});

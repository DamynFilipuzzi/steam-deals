import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { reverseFormatCurrencyInt } from "~/lib/utils";
import { z } from "zod";

const appsPerPage = 24;
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
        type: z.string(),
        limit: z.number(),
        hidefree: z.number(),
        userId: z.string(),
        hideOwned: z.number(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.apps.findMany({
        skip: Number(appsPerPage * input.page - appsPerPage),
        take: appsPerPage,
        orderBy: [
          { total_positive_reviews: { sort: "desc", nulls: "last" } },
          { total_reviews: { sort: "desc", nulls: "last" } },
          { updated_at: "asc" },
          { id: "asc" },
          // HAS to be ONE-ONE relationship to be filtered here.
          // TO BE Used for table storing: price savings, sort by discount
          // {
          //   app_info: {
          //     total_reviews: { sort: "desc", nulls: "last" },
          //     total_positive_reviews: { sort: "desc", nulls: "last" },
          //   },
          // },
        ],
        where: {
          type: input.type,
          title: {
            contains: input.query,
            mode: "insensitive",
          },
          // Hide all Owned Apps
          ...(input.hideOwned != 0
            ? {
                users_apps: {
                  none: {
                    user_id: input.userId,
                  },
                },
              }
            : {}),
          // Limit by maximum price set by user AND hide free apps if selected
          ...(input.limit
            ? {
                prices: {
                  some: {
                    ...(input.hidefree == 0
                      ? {
                          OR: [
                            {
                              valid_to: new Date("9999-12-31T00:00:00.000Z"),
                              discount_price: {
                                lte: reverseFormatCurrencyInt(input.limit),
                              },
                            },
                            {
                              valid_to: new Date("9999-12-31T00:00:00.000Z"),
                              original_price: 0 || null,
                              discount_price: 0 || null,
                            },
                          ],
                        }
                      : {
                          valid_to: new Date("9999-12-31T00:00:00.000Z"),
                          discount_price: {
                            lte: reverseFormatCurrencyInt(input.limit),
                          },
                          OR: [
                            {
                              valid_to: new Date("9999-12-31T00:00:00.000Z"),
                              discount_price: {
                                lte: reverseFormatCurrencyInt(input.limit),
                              },
                            },
                            {
                              valid_to: new Date("9999-12-31T00:00:00.000Z"),
                              original_price: 0 || null,
                              discount_price: 0 || null,
                            },
                          ],
                        }),
                  },
                },
              }
            : {}),
          // Filter by tags if provided
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
        select: {
          id: true,
          title: true,
          steam_id: true,
          type: true,
          prices: {
            where: { valid_to: new Date("9999-12-31T00:00:00.000Z") },
            select: {
              id: true,
              original_price: true,
              discount_price: true,
              currency: true,
              is_free: true,
            },
          },
          users_apps: {
            where: { user_id: input.userId },
          },
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
          screenshots: {
            orderBy: { image_order: "asc" },
          },
          videos: true,
          dlc: {
            orderBy: {
              steam_id: "desc",
            },
            include: {
              prices: {
                select: {
                  id: true,
                  original_price: true,
                  discount_price: true,
                  currency: true,
                  is_free: true,
                },
                where: {
                  valid_to: new Date("9999-12-31T00:00:00.000Z"),
                },
              },
            },
          },
          apps_developers: {
            include: {
              developers: true,
            },
          },
          apps_publishers: {
            include: {
              publisher: true,
            },
          },
          releasedate: true,
          app_info: true,
          prices: {
            select: {
              id: true,
              original_price: true,
              discount_price: true,
              currency: true,
              is_free: true,
            },
            orderBy: { valid_from: "asc" },
            where: {
              valid_to: new Date("9999-12-31T00:00:00.000Z"),
            },
          },
        },
        where: { steam_id: input },
      });
    }),

  getTotalPages: publicProcedure
    .input(
      z.object({
        query: z.string(),
        tags: z.string(),
        type: z.string(),
        limit: z.number(),
        hidefree: z.number(),
        userId: z.string(),
        hideOwned: z.number(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.apps.count({
        where: {
          type: input.type,
          title: {
            contains: input.query,
            mode: "insensitive",
          },
          // Hide all Owned Apps
          ...(input.hideOwned != 0
            ? {
                users_apps: {
                  none: {
                    user_id: input.userId,
                  },
                },
              }
            : {}),
          // Limit by maximum price set by user AND hide free apps if selected
          ...(input.limit
            ? {
                prices: {
                  some: {
                    ...(input.hidefree == 0
                      ? {
                          OR: [
                            {
                              valid_to: new Date("9999-12-31T00:00:00.000Z"),
                              discount_price: {
                                lte: reverseFormatCurrencyInt(input.limit),
                              },
                            },
                            {
                              valid_to: new Date("9999-12-31T00:00:00.000Z"),
                              original_price: 0 || null,
                              discount_price: 0 || null,
                            },
                          ],
                        }
                      : {
                          valid_to: new Date("9999-12-31T00:00:00.000Z"),
                          discount_price: {
                            lte: reverseFormatCurrencyInt(input.limit),
                          },
                        }),
                  },
                },
              }
            : {}),

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

  mostPlayed: publicProcedure.query(({ ctx }) => {
    return ctx.db.mostPlayed.findMany({
      orderBy: {
        app_order: "asc",
      },
      select: {
        steam_id: true,
        app_order: true,
        current: true,
        peak: true,
        apps: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }),

  mostPlayedSample: publicProcedure.query(({ ctx }) => {
    return ctx.db.mostPlayed.findMany({
      take: 5,
      orderBy: {
        app_order: "asc",
      },
      select: {
        steam_id: true,
        app_order: true,
        current: true,
        peak: true,
        apps: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }),

  topSellers: publicProcedure.query(({ ctx }) => {
    return ctx.db.topSellers.findMany({
      orderBy: {
        app_order: "asc",
      },
      select: {
        steam_id: true,
        app_order: true,
        apps: {
          select: {
            id: true,
            title: true,
            prices: {
              where: { valid_to: new Date("9999-12-31T00:00:00.000Z") },
              select: {
                id: true,
                is_free: true,
                discount_price: true,
                original_price: true,
                currency: true,
              },
            },
          },
        },
      },
    });
  }),

  topSellersSample: publicProcedure.query(({ ctx }) => {
    return ctx.db.topSellers.findMany({
      take: 5,
      orderBy: {
        app_order: "asc",
      },
      select: {
        steam_id: true,
        app_order: true,
        apps: {
          select: {
            id: true,
            title: true,
            prices: {
              where: { valid_to: new Date("9999-12-31T00:00:00.000Z") },
              select: {
                id: true,
                is_free: true,
                discount_price: true,
                original_price: true,
                currency: true,
              },
            },
          },
        },
      },
    });
  }),

  // Used to generate sitemap.xml
  getAllApps: publicProcedure
    .input(z.number().int())
    .query(({ ctx, input }) => {
      return ctx.db.apps.findMany({
        skip: Number(49998 * input),
        take: 49998,
        select: {
          steam_id: true,
          updated_at: true,
        },
      });
    }),
});

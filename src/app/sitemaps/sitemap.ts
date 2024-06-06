import { MetadataRoute } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const revalidate = 43200; // revalidate page every 12 hours
const urlPerSitemap = 10000;

type Sitemap = Array<{
  url: string;
  lastModified?: string | Date;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
}>;

export async function generateSitemaps() {
  // Fetch the total number of products and calculate the number of sitemaps needed
  const numApps = await prisma.apps.count();
  const numSitemaps = Math.ceil(numApps / urlPerSitemap);
  const maps: { id: number }[] = [];
  for (let i = 0; i < numSitemaps; i++) {
    maps.push({ id: i });
  }

  return maps;
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  const apps = await prisma.apps.findMany({
    skip: Number(urlPerSitemap * id),
    take: urlPerSitemap,
    select: {
      steam_id: true,
      updated_at: true,
    },
  });

  const app = apps.map((item) => ({
    url: `${process.env.NEXTAUTH_URL}/game/${item.steam_id}`,
    lastModified: item.updated_at.toISOString(),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...(app as Sitemap)];
}

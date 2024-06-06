import { MetadataRoute } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const revalidate = 43200; // revalidate page every 12 hours
const urlPerSitemap = 10000;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch the total number of products and calculate the number of sitemaps needed
  const numApps = await prisma.apps.count();
  const numSitemaps = Math.ceil(numApps / urlPerSitemap);

  const maps: {
    url: string;
    lastModified: string | Date | undefined;
    changeFrequency:
      | "monthly"
      | "always"
      | "hourly"
      | "daily"
      | "weekly"
      | "yearly"
      | "never"
      | undefined;
    priority: number | undefined;
  }[] = [];
  for (let i = 0; i < numSitemaps; i++) {
    maps.push({
      url: `${process.env.NEXTAUTH_URL}/sitemaps/sitemap/${i}.xml`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    });
  }

  return [
    {
      url: `${process.env.NEXTAUTH_URL}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${process.env.NEXTAUTH_URL}/stats`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${process.env.NEXTAUTH_URL}/stats/topsellers`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${process.env.NEXTAUTH_URL}/stats/mostplayed`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    ...maps,
  ];
}

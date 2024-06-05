import { MetadataRoute } from "next";
import { api } from "~/trpc/server";

export const revalidate = 43200; // revalidate page every 12 hours

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const apps = api.apps.getAllApps.query();

  const app = (await apps).map((item) => ({
    url: `${process.env.NEXTAUTH_URL}/game/${item.steam_id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    {
      url: "https://steamdeals.ca",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://steamdeals.ca/stats",
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    ...(app as Sitemap),
  ];
}

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const revalidate = 43200; // revalidate page every 12 hours
const urlPerSitemap = 10000;

const generateSitemapLink = (url: string) =>
  `<sitemap><loc>${url}</loc></sitemap>`;

export async function GET() {
  const numApps = await prisma.apps.count();
  const numSitemaps = Math.ceil(numApps / urlPerSitemap);

  const sitemapIndexXML = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${generateSitemapLink(`${process.env.NEXTAUTH_URL}/sitemap.xml`)}

        ${Array.from({ length: numSitemaps }, (_, i) => i + 1)
          .map((id) =>
            generateSitemapLink(
              `${process.env.NEXTAUTH_URL}/games/sitemap/${id - 1}.xml`,
            ),
          )
          .join("")} 
    </sitemapindex>`;

  return new Response(sitemapIndexXML, {
    headers: { "Content-Type": "text/xml" },
  });
}

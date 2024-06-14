import "~/styles/globals.css";

import { Inter as FontSans } from "next/font/google";
import { cn } from "~/lib/utils";
import { TRPCReactProvider } from "~/trpc/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "./ui/navbar";
import Footer from "./ui/footer";
import GoogleAdsense from "./_components/googleAdsense";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const ogImageUrl = new URL("https://www.steamdeals.ca/favicon.ico");
export const metadata = {
  title: "Dashboard | Steam Deals",
  description:
    "Steam Deals. Created to help you find better deals on steam games",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  metadataBase: new URL(ogImageUrl.origin),
  openGraph: {
    type: "website",
    url: ogImageUrl.origin,
    title: "Dashboard | Steam Deals",
    description:
      "Steam Deals. Created to help you find better deals on steam games",
    siteName: "Steam Deals",
    images: [{ url: ogImageUrl }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          `dark min-h-screen bg-background font-sans antialiased ${fontSans.variable}`,
        )}
      >
        <TRPCReactProvider>
          <Navbar />
          {children}
          <Footer />
        </TRPCReactProvider>
        <SpeedInsights />
        <Analytics />
      </body>
      <GoogleAdsense pId={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID} />
    </html>
  );
}

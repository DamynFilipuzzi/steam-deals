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

export const metadata = {
  title: "Dashboard | Steam Deals",
  description:
    "Discover the best deals with Steam Deals. Find the biggest discounts on a wide range of Steam games. Stay updated on the latest offers and never miss a great deal on Steam!",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    type: "website",
    url: "/android-chrome-512x512.png",
    title: "Dashboard | Steam Deals",
    description:
      "Discover the best deals with Steam Deals. Find the biggest discounts on a wide range of Steam games. Stay updated on the latest offers and never miss a great deal on Steam!",
    siteName: "Steam Deals",
    images: ["/android-chrome-512x512.png"],
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

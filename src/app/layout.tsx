import "~/styles/globals.css";

import { Inter as FontSans } from "next/font/google";
import { cn } from "~/lib/utils";
import { TRPCReactProvider } from "~/trpc/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "./ui/navbar";
import Footer from "./ui/footer";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Dashboard | Steam Deals",
  description:
    "Steam Deals. Created to help you find better deals on steam games",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
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
    </html>
  );
}

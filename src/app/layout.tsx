import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { PostHogProvider } from "@/components/analytics/PostHogProvider";
import { Header } from "@/components/layout/Header";
import { SITE_URL } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Equity Bali — Where to Buy Real Estate in Bali | Data-Driven Investment",
    template: "%s | Equity Bali",
  },
  description:
    "Equity Bali is a data-driven real estate investment agency in Bali. We help foreign investors buy villas and land with net yield from 12%, in-house management and PT PMA legal structuring. Portfolios built on 37,000+ Airbnb listings.",
  applicationName: "Equity Bali",
  authors: [{ name: "Equity Bali" }],
  creator: "Equity Bali",
  publisher: "Equity Bali",
  category: "Real Estate Investment",
  keywords: [
    "buy property in Bali",
    "Bali real estate investment",
    "where to buy real estate in Bali",
    "Bali villa investment",
    "Bali land for sale",
    "foreigner property Bali",
    "PT PMA Bali",
    "Bali Airbnb investment ROI",
    "leasehold freehold Bali",
  ],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Equity Bali — Where to Buy Real Estate in Bali",
    description:
      "Data-driven Bali property investment. Villas and land with net yield from 12%, in-house management and PT PMA legal structuring. Portfolios built on 37,000+ Airbnb listings.",
    type: "website",
    locale: "en_US",
    siteName: "Equity Bali",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Equity Bali — Where to Buy Real Estate in Bali",
    description:
      "Data-driven Bali property investment with net yield from 12%, in-house management and legal structuring for foreigners.",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@300..700&family=Playfair+Display:wght@400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <PostHogProvider>
          <Header />
          {children}
        </PostHogProvider>
        <Analytics />
      </body>
    </html>
  );
}

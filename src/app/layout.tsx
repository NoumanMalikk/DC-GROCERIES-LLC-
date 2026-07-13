import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { DemoModeBanner } from "@/components/layout/DemoModeBanner";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Providers } from "@/components/layout/Providers";
import { SkipLink } from "@/components/layout/SkipLink";
import { storeConfig } from "@data/store-config";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const siteUrl = storeConfig.siteUrl.replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Fresh Produce & Everyday Groceries | DC Groceries LLC",
    template: `%s | ${storeConfig.brandName}`,
  },
  description:
    "Browse fresh fruit, vegetables, pantry goods, refrigerated items, beverages and household essentials from DC Groceries LLC.",
  applicationName: storeConfig.brandName,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: storeConfig.brandName,
    title: "Fresh Produce & Everyday Groceries | DC Groceries LLC",
    description:
      "Browse fresh fruit, vegetables, pantry goods, refrigerated items, beverages and household essentials from DC Groceries LLC.",
    images: [
      {
        url: "/og-brand.png",
        width: 1200,
        height: 630,
        alt: `${storeConfig.brandName} — ${storeConfig.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fresh Produce & Everyday Groceries | DC Groceries LLC",
    description:
      "Browse fresh fruit, vegetables, pantry goods, refrigerated items, beverages and household essentials from DC Groceries LLC.",
    images: ["/og-brand.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "OnlineStore"],
  name: storeConfig.legalName,
  brand: storeConfig.brandName,
  url: siteUrl,
  telephone: storeConfig.phoneE164,
  description:
    "Fairburn, Georgia-based grocery retailer offering an online catalog of produce, pantry goods and everyday grocery items.",
  areaServed: {
    "@type": "Country",
    name: "United States",
  },
  address: storeConfig.showFullBusinessAddress
    ? {
        "@type": "PostalAddress",
        streetAddress: storeConfig.registeredAddress.line1,
        addressLocality: storeConfig.registeredAddress.city,
        addressRegion: storeConfig.registeredAddress.state,
        postalCode: storeConfig.registeredAddress.postalCode,
        addressCountry: "US",
      }
    : {
        "@type": "PostalAddress",
        addressLocality: "Fairburn",
        addressRegion: "GA",
        addressCountry: "US",
      },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: storeConfig.brandName,
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationJsonLd, websiteJsonLd]),
          }}
        />
        <Providers>
          <SkipLink />
          <DemoModeBanner />
          <AnnouncementBar />
          <Header />
          <MobileNav />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}

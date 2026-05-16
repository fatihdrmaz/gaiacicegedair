import type { Metadata } from "next";
import "./globals.css";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://cicegedair.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "GAIA · Çiçeğe Dair",
  description:
    "GAIA Çiçeğe Dair — düğün, kurumsal, tekne ve özel gün çiçek organizasyonu. İstanbul merkezli butik atölye.",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "GAIA Çiçeğe Dair",
  description:
    "Düğün, kurumsal, tekne ve özel gün çiçek organizasyonu. İstanbul merkezli butik atölye.",
  url: SITE,
  address: {
    "@type": "PostalAddress",
    addressLocality: "İstanbul",
    addressCountry: "TR",
  },
  areaServed: "İstanbul",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body data-accent="green" data-fontpair="editorial">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}

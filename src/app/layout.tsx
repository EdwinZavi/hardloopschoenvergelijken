import type { Metadata } from "next";
import { SiteChrome } from "@/components/SiteChrome";
import { companyInfo } from "@/lib/company";
import { JsonLd, organizationJsonLd, siteUrl, websiteJsonLd } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${companyInfo.platformName} | ${companyInfo.tagline}`,
  description: `Vergelijk hardloopschoenen op demping, steun, pasvorm, gebruik en prijs. ${companyInfo.platformName} helpt je zien welke schoenen logisch zijn voor jouw loopdoel.`,
  alternates: {
    canonical: "/",
    languages: {
      nl: "/",
      en: "/en"
    }
  },
  openGraph: {
    title: `${companyInfo.platformName} | ${companyInfo.tagline}`,
    description: `Vergelijk hardloopschoenen op demping, steun, pasvorm, gebruik en prijs. ${companyInfo.platformName} helpt je zien welke schoenen logisch zijn voor jouw loopdoel.`,
    locale: "nl_NL",
    siteName: companyInfo.platformName,
    type: "website",
    url: "/"
  },
  icons: {
    icon: "/brand/loopwijzer-shoe-mark.png",
    apple: "/brand/loopwijzer-shoe-mark.png"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl">
      <body>
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}

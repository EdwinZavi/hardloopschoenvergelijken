import type { Metadata } from "next";
import { SiteChrome } from "@/components/SiteChrome";
import { companyInfo } from "@/lib/company";
import "./globals.css";

export const metadata: Metadata = {
  title: `${companyInfo.platformName} | ${companyInfo.tagline}`,
  description: `Vergelijk hardloopschoenen op comfort, steun, demping, pasvorm en prijs. ${companyInfo.platformName} helpt je begrijpen welke hardloopschoen bij jouw loopdoel past.`,
  icons: {
    icon: "/brand/loopwijzer-shoe-mark.png",
    apple: "/brand/loopwijzer-shoe-mark.png"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl">
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}

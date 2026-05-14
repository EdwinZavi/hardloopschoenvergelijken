import type { Metadata } from "next";
import { SiteChrome } from "@/components/SiteChrome";
import "./globals.css";

export const metadata: Metadata = {
  title: "Loopwijzer | Hardloopschoenen vergelijken met duidelijke keuzehulp",
  description: "Vergelijk hardloopschoenen op comfort, steun, demping, pasvorm en prijs. Loopwijzer helpt je begrijpen welke hardloopschoen bij jouw loopdoel past.",
  icons: {
    icon: "/brand/loopwijzer-logo-cropped.png",
    apple: "/brand/loopwijzer-logo-cropped.png"
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

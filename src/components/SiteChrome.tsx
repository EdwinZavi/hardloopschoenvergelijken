"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { companyInfo } from "@/lib/company";

export function SiteChrome({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdminRoute) {
    return children;
  }

  return (
    <>
      <header className="site-header">
        <BrandLogo />
        <nav aria-label="Hoofdnavigatie">
          <Link href="/schoenen">Schoenen</Link>
          <Link href="/keuzehulp">Keuzehulp</Link>
          <Link href="/vergelijken">Vergelijken</Link>
          <Link href="/advies">Advies</Link>
          <Link href="/methodologie">Zo vergelijken we</Link>
        </nav>
      </header>
      {children}
      <footer className="site-footer">
        <BrandLogo />
        <div className="footer-copy">
          <span>
            {companyInfo.platformName} wordt beheerd door {companyInfo.legalName}, KvK {companyInfo.chamberOfCommerceNumber}.
          </span>
          <nav aria-label="Footer navigatie">
            <Link href="/schoenen">Schoenen</Link>
            <Link href="/keuzehulp">Keuzehulp</Link>
            <Link href="/advies">Advies</Link>
            <Link href="/methodologie">Zo vergelijken we</Link>
            <Link href="/over-ons">Over ons</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/onafhankelijkheid">Onafhankelijkheid</Link>
            <Link href="/privacy">Privacybeleid</Link>
            <Link href="/cookies">Cookiebeleid</Link>
          </nav>
        </div>
      </footer>
    </>
  );
}

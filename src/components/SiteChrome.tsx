"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";

function toEnglishPath(pathname: string) {
  if (pathname === "/en" || pathname.startsWith("/en/")) return pathname;
  if (pathname === "/") return "/en";
  if (pathname === "/schoenen") return "/en/shoes";
  if (pathname.startsWith("/schoenen/")) return pathname.replace("/schoenen/", "/en/shoes/");
  if (pathname === "/keuzehulp") return "/en/shoe-finder";
  if (pathname === "/vergelijken") return "/en/compare";
  if (pathname === "/advies") return "/en/advice";
  if (pathname.startsWith("/advies/")) return pathname.replace("/advies/", "/en/advice/");
  if (pathname === "/methodologie") return "/en/methodology";
  if (pathname === "/over-ons") return "/en/about";
  if (pathname === "/contact") return "/en/contact";
  if (pathname === "/onafhankelijkheid") return "/en/independence";
  if (pathname === "/privacy") return "/en/privacy";
  if (pathname === "/cookies") return "/en/cookies";
  return "/en";
}

function toDutchPath(pathname: string) {
  if (!(pathname === "/en" || pathname.startsWith("/en/"))) return pathname;
  if (pathname === "/en") return "/";
  if (pathname === "/en/shoes") return "/schoenen";
  if (pathname.startsWith("/en/shoes/")) return pathname.replace("/en/shoes/", "/schoenen/");
  if (pathname === "/en/shoe-finder") return "/keuzehulp";
  if (pathname === "/en/compare") return "/vergelijken";
  if (pathname === "/en/advice") return "/advies";
  if (pathname.startsWith("/en/advice/")) return pathname.replace("/en/advice/", "/advies/");
  if (pathname === "/en/methodology") return "/methodologie";
  if (pathname === "/en/about") return "/over-ons";
  if (pathname === "/en/contact") return "/contact";
  if (pathname === "/en/independence") return "/onafhankelijkheid";
  if (pathname === "/en/privacy") return "/privacy";
  if (pathname === "/en/cookies") return "/cookies";
  return "/";
}

export function SiteChrome({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");
  const dutchHref = toDutchPath(pathname);
  const englishHref = toEnglishPath(pathname);
  const navItems = isEnglish
    ? [
        { href: "/en/shoes", label: "Shoes" },
        { href: "/en/shoe-finder", label: "Shoe Finder" },
        { href: "/en/compare", label: "Compare" },
        { href: "/en/advice", label: "Advice" },
        { href: "/en/methodology", label: "How we compare" }
      ]
    : [
        { href: "/schoenen", label: "Schoenen" },
        { href: "/keuzehulp", label: "Keuzehulp" },
        { href: "/vergelijken", label: "Vergelijken" },
        { href: "/advies", label: "Advies" },
        { href: "/methodologie", label: "Zo vergelijken we" }
      ];
  const footerItems = isEnglish
    ? [
        ...navItems,
        { href: "/en/about", label: "About" },
        { href: "/en/contact", label: "Contact" },
        { href: "/en/independence", label: "Independence" },
        { href: "/en/privacy", label: "Privacy" },
        { href: "/en/cookies", label: "Cookies" }
      ]
    : [
        ...navItems,
        { href: "/over-ons", label: "Over ons" },
        { href: "/contact", label: "Contact" },
        { href: "/onafhankelijkheid", label: "Onafhankelijkheid" },
        { href: "/privacy", label: "Privacybeleid" },
        { href: "/cookies", label: "Cookiebeleid" }
      ];

  if (isAdminRoute) {
    return children;
  }

  return (
    <>
      <header className="site-header">
        <BrandLogo href={isEnglish ? "/en" : "/"} />
        <nav aria-label={isEnglish ? "Main navigation" : "Hoofdnavigatie"}>
          {navItems.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
          <span className="language-switch" aria-label="Language switch">
            <Link aria-current={!isEnglish ? "page" : undefined} href={dutchHref}>
              NL
            </Link>
            <Link aria-current={isEnglish ? "page" : undefined} href={englishHref}>
              EN
            </Link>
          </span>
        </nav>
      </header>
      {children}
      <footer className="site-footer">
        <BrandLogo href={isEnglish ? "/en" : "/"} />
        <div className="footer-copy">
          <nav aria-label={isEnglish ? "Footer navigation" : "Footer navigatie"}>
            {footerItems.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </>
  );
}

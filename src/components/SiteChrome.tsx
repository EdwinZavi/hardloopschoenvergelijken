"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { companyInfo } from "@/lib/company";

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
        { href: "/en", label: "Home" },
        { href: "/en/shoe-finder", label: "Finder" },
        { href: "/en/shoes", label: "Shoes" },
        { href: "/en/compare", label: "Compare" },
        { href: "/en/advice", label: "Advice" },
        { href: "/en/contact", label: "Contact" }
      ]
    : [
        { href: "/", label: "Home" },
        { href: "/keuzehulp", label: "Keuzehulp" },
        { href: "/schoenen", label: "Schoenen" },
        { href: "/vergelijken", label: "Vergelijken" },
        { href: "/advies", label: "Advies" },
        { href: "/contact", label: "Contact" }
      ];
  const footerTrustItems = isEnglish
    ? [
        { href: "/en/methodology", label: "How we compare" },
        { href: "/en/independence", label: "Independence" },
        { href: "/en/privacy", label: "Privacy" },
        { href: "/en/contact", label: "Report a correction" }
      ]
    : [
        { href: "/methodologie", label: "Zo vergelijken we" },
        { href: "/onafhankelijkheid", label: "Onafhankelijkheid" },
        { href: "/privacy", label: "Privacybeleid" },
        { href: "/contact", label: "Correctie doorgeven" }
      ];
  const footerLegalItems = isEnglish
    ? [
        { href: "/en/about", label: "About" },
        { href: "/en/independence", label: "Independence" },
        { href: "/en/privacy", label: "Privacy" },
        { href: "/en/cookies", label: "Cookies" }
      ]
    : [
        { href: "/over-ons", label: "Over ons" },
        { href: "/onafhankelijkheid", label: "Onafhankelijkheid" },
        { href: "/privacy", label: "Privacybeleid" },
        { href: "/cookies", label: "Cookiebeleid" }
      ];

  if (isAdminRoute) {
    return children;
  }

  return (
    <>
      <header className="site-header site-header-home">
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
          <Link className="site-nav-cta" href={isEnglish ? "/en/shoe-finder" : "/keuzehulp"}>
            {isEnglish ? "Start finder" : "Start keuzehulp"}
          </Link>
        </nav>
      </header>
      {children}
      <footer className="site-footer" aria-label={isEnglish ? "Footer" : "Voettekst"}>
        <div className="footer-shell">
          <div className="footer-link-group">
            <strong>{isEnglish ? "Platform" : "Platform"}</strong>
            <nav aria-label={isEnglish ? "Footer navigation" : "Footer navigatie"}>
              {footerItems.map((item) => (
                <Link href={item.href} key={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="footer-link-group">
            <strong>{isEnglish ? "Trust" : "Vertrouwen"}</strong>
            <nav aria-label={isEnglish ? "Trust links" : "Vertrouwenslinks"}>
              {footerTrustItems.map((item) => (
                <Link href={item.href} key={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <form action={isEnglish ? "/en/contact" : "/contact"} className="footer-signup" method="get">
            <strong>{isEnglish ? "Updates" : "Updates"}</strong>
            <p>{isEnglish ? "Get a note when new comparison data is available." : "Ontvang een seintje wanneer nieuwe vergelijkingsdata beschikbaar is."}</p>
            <label htmlFor="footer-email">{isEnglish ? "Email address" : "E-mailadres"}</label>
            <div>
              <input id="footer-email" name="email" placeholder={isEnglish ? "Email address" : "E-mailadres"} type="email" />
              <button type="submit">{isEnglish ? "Subscribe" : "Aanmelden"}</button>
            </div>
          </form>
        </div>

        <div className="footer-bottom">
          <p>
            © 2026 {companyInfo.platformName}. {isEnglish ? "Clearer running shoe decisions." : "Voor betere hardloopschoenkeuzes."}
          </p>
          <nav className="footer-legal-links" aria-label={isEnglish ? "Legal links" : "Juridische links"}>
            {footerLegalItems.map((item) => (
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

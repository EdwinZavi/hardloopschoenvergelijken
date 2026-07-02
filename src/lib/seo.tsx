import { companyInfo } from "@/lib/company";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hardloopschoenvergelijken.nl";

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: companyInfo.platformName,
  legalName: companyInfo.legalName,
  url: absoluteUrl("/"),
  logo: absoluteUrl("/brand/loopwijzer-logo-cropped.png"),
  email: companyInfo.generalEmail,
  address: {
    "@type": "PostalAddress",
    streetAddress: companyInfo.address,
    postalCode: companyInfo.postalCode,
    addressLocality: companyInfo.city,
    addressCountry: "NL"
  }
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: companyInfo.platformName,
  alternateName: companyInfo.tagline,
  url: absoluteUrl("/"),
  inLanguage: "nl-NL",
  publisher: {
    "@type": "Organization",
    name: companyInfo.platformName
  }
};

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c")
      }}
    />
  );
}

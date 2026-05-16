import Link from "next/link";
import { companyInfo } from "@/lib/company";

export function BrandLogo() {
  return (
    <Link className="brand-logo" href="/" aria-label={`Naar de homepage van ${companyInfo.platformName}`}>
      <img className="brand-mark" src="/brand/loopwijzer-shoe-mark.png" alt="" aria-hidden="true" />
      <span className="brand-wordmark">
        <strong>{companyInfo.platformName}</strong>
        <span>{companyInfo.tagline}</span>
      </span>
    </Link>
  );
}

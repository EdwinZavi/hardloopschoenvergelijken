import Link from "next/link";

export function BrandLogo() {
  return (
    <Link className="brand-logo" href="/" aria-label="Naar de homepage van Loopwijzer">
      <img className="brand-mark" src="/brand/loopwijzer-logo-cropped.png" alt="" aria-hidden="true" />
      <span className="brand-wordmark">
        <strong>Loopwijzer</strong>
        <span>hardloopschoenen vergelijken</span>
      </span>
    </Link>
  );
}

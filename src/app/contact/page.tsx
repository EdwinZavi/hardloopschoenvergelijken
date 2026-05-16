import type { Metadata } from "next";
import { companyInfo } from "@/lib/company";

export const metadata: Metadata = {
  title: "Contact | Loopwijzer",
  description: "Neem contact op met Loopwijzer en bekijk de bedrijfsgegevens achter de website."
};

export default function ContactPage() {
  return (
    <main className="policy-page page-policy">
      <p className="eyebrow">Contact</p>
      <h1>Contact met Loopwijzer</h1>
      <p className="lead">
        Heb je een vraag, correctie, samenwerking of opmerking over een hardloopschoen op Loopwijzer? Neem contact met ons op. Feedback helpt ons productinformatie, prijzen en uitleg betrouwbaarder te maken.
      </p>

      <section className="policy-section">
        <h2>Contactgegevens</h2>
        <p>
          Loopwijzer wordt beheerd door {companyInfo.legalName}. Gebruik het onderstaande e-mailadres voor algemene vragen, correcties, samenwerkingen, privacyverzoeken en productinformatie.
        </p>
        <ul>
          <li>Beheerder: {companyInfo.legalName}</li>
          <li>KvK-nummer: {companyInfo.chamberOfCommerceNumber}</li>
          <li>
            Vestigingsadres: {companyInfo.address}, {companyInfo.postalCode} {companyInfo.city}
          </li>
          <li>
            E-mail: <a href={`mailto:${companyInfo.generalEmail}`}>{companyInfo.generalEmail}</a>
          </li>
        </ul>
      </section>
    </main>
  );
}

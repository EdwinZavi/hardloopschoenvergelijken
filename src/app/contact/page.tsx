import Link from "next/link";
import type { Metadata } from "next";
import { companyInfo } from "@/lib/company";

export const metadata: Metadata = {
  title: "Contact | Loopwijzer",
  description: "Neem contact op met Loopwijzer voor vragen, correcties, privacyverzoeken, productdata of samenwerkingen."
};

const contactItems = [
  ["Algemene vragen", "contact@loopwijzer.nl", "Voor vragen over Loopwijzer, ontbrekende informatie of algemene feedback."],
  ["Correcties op productdata", "redactie@loopwijzer.nl", "Voor specificaties, scores, productteksten of verouderde informatie."],
  ["Samenwerkingen en winkels", "partners@loopwijzer.nl", "Voor retailers, affiliate-netwerken, feedkoppelingen en commerciële afspraken."],
  ["Privacyvragen", "privacy@loopwijzer.nl", "Voor vragen over persoonsgegevens, keuzehulp-antwoorden of rechten onder de AVG."]
];

export default function ContactPage() {
  return (
    <main className="policy-page page-policy">
      <p className="eyebrow">Contact</p>
      <h1>Contact met Loopwijzer</h1>
      <p className="lead">
        Heb je een vraag, correctie, samenwerking of opmerking over een hardloopschoen op Loopwijzer? Neem contact met ons op. Feedback helpt ons productinformatie, prijzen en uitleg betrouwbaarder te maken.
      </p>

      <section className="method-list">
        {contactItems.map(([label, email, description]) => (
          <article className="panel" key={label}>
            <h2>{label}</h2>
            <p>{description}</p>
            <p>
              <a href={`mailto:${email}`}>{email}</a>
            </p>
          </article>
        ))}
      </section>

      <section className="policy-section">
        <h2>Verantwoordelijke en contact</h2>
        <p>
          Loopwijzer wordt beheerd door {companyInfo.legalName}. Voor formele vragen, correcties of privacyverzoeken kun je contact opnemen via de adressen hierboven.
        </p>
        <ul>
          <li>Platform: {companyInfo.platformName}</li>
          <li>Beheerder: {companyInfo.legalName}</li>
          <li>KvK-nummer: {companyInfo.chamberOfCommerceNumber}</li>
          <li>
            Vestigingsadres: {companyInfo.address}, {companyInfo.postalCode} {companyInfo.city}
          </li>
          <li>Markt: Nederland</li>
          <li>Algemeen contact: {companyInfo.generalEmail}</li>
          <li>Privacycontact: {companyInfo.privacyEmail}</li>
        </ul>
      </section>

      <section className="policy-content standalone">
        <PolicySection title="Waarvoor kun je contact opnemen?">
          <ul>
            <li>Onjuiste productinformatie of verouderde prijsinformatie.</li>
            <li>Vragen over beoordelingen, methodologie of aanbevelingen.</li>
            <li>Verzoeken rond privacy of persoonsgegevens.</li>
            <li>Retailer- of partnerinformatie.</li>
            <li>Suggesties voor schoenen die ontbreken.</li>
          </ul>
        </PolicySection>

        <PolicySection title="Redactionele correcties">
          <p>
            Zie je een fout in specificaties, prijsinformatie of uitleg? Stuur ons de productnaam, de pagina en wat volgens jou niet klopt. We beoordelen correcties inhoudelijk en passen informatie aan wanneer daar een betrouwbare grond voor is.
          </p>
          <p>
            Correcties over productkenmerken beoordelen we los van commerciële belangen. Een retailer of merk kan informatie aanleveren, maar dat is niet automatisch reden om een score, aanbeveling of rangschikking aan te passen.
          </p>
        </PolicySection>

        <PolicySection title="Affiliate en retailers">
          <p>
            Retailers, affiliate-netwerken en merken kunnen contact opnemen over productfeeds, beschikbaarheid, prijsdata of foutcorrecties. Commerciële afspraken geven geen recht op een hogere beoordeling of voorkeursadvies.
          </p>
        </PolicySection>

        <PolicySection title="Privacy">
          <p>
            Voor vragen over persoonsgegevens kun je ook ons <Link href="/privacy">privacybeleid</Link> lezen. Voor cookievragen staat er een aparte pagina met ons <Link href="/cookies">cookiebeleid</Link>.
          </p>
        </PolicySection>
      </section>
    </main>
  );
}

function PolicySection({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <section className="policy-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

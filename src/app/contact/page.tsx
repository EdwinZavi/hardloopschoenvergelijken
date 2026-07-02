import type { Metadata } from "next";
import Link from "next/link";
import { companyInfo } from "@/lib/company";

export const metadata: Metadata = {
  title: `Contact | ${companyInfo.platformName}`,
  description: `Neem contact op met ${companyInfo.platformName} voor vragen, productcorrecties, privacyverzoeken en gecontroleerde partnerdata.`,
  alternates: {
    canonical: "/contact"
  }
};

export default function ContactPage() {
  return (
    <main className="policy-page page-policy">
      <p className="eyebrow">Contact</p>
      <h1>Contact met {companyInfo.platformName}</h1>
      <p className="lead">
        Heb je een vraag, correctie of voorstel voor gecontroleerde product- of prijsdata? Mail ons. Productcorrecties en samenwerkingen blijven gescheiden van redactionele beoordeling.
      </p>

      <section className="trust-answers">
        <article>
          <strong>Beschikbaar: e-mail</strong>
          <span>Gebruik het e-mailadres voor vragen, correcties, privacy en partnerdata.</span>
        </article>
        <article>
          <strong>Nog niet live</strong>
          <span>Er is nog geen contactformulier, chat, telefoonlijn of partnerportaal.</span>
        </article>
        <article>
          <strong>Geen verkoopsupport</strong>
          <span>We verkopen zelf geen schoenen. Vragen over bestelling, retour of garantie horen bij de winkel.</span>
        </article>
      </section>

      <section className="policy-content standalone">
        <div className="policy-callout">
          <strong>Commercie bepaalt geen advies</strong>
          <span>Correcties, retailerfeeds en affiliatevragen zijn welkom, maar een samenwerking verandert geen score, matchuitleg of redactionele volgorde.</span>
        </div>

        <PolicySection title="Contactgegevens">
          <p>
            {companyInfo.platformName} wordt beheerd door {companyInfo.legalName}. Gebruik e-mail als primair contactkanaal voor algemene vragen, productcorrecties, privacyverzoeken en partnerdata.
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
        </PolicySection>

        <PolicySection title="Welke kanalen wel en nog niet beschikbaar zijn">
          <ul>
            <li>E-mail is het publieke contactkanaal op deze website.</li>
            <li>Een contactformulier, chatfunctie en telefoonnummer staan nog niet live.</li>
            <li>Er is nog geen openbaar loket voor automatische retailer- of feedaanmeldingen.</li>
            <li>Privacyverzoeken kunnen via hetzelfde e-mailadres worden gestuurd.</li>
          </ul>
        </PolicySection>

        <PolicySection title="Waarvoor je ons kunt mailen">
          <ul>
            <li>Een fout of ontbrekende nuance in productinformatie, specificaties of uitleg.</li>
            <li>Een vraag over hoe scores, keuzehulp en prijsinformatie van elkaar gescheiden blijven.</li>
            <li>Een voorstel voor gecontroleerde retailerdata, productfeeds of deeplinks.</li>
            <li>Een privacy- of cookiegerelateerde vraag over het gebruik van de website.</li>
          </ul>
        </PolicySection>

        <PolicySection title="Voor retailers, merken en affiliatepartners">
          <p>
            We zoeken gecontroleerde product- en prijsinformatie waarmee hardlopers beter kunnen vergelijken. Stuur bij voorkeur mee welke feedvelden beschikbaar zijn, hoe vaak de data wordt bijgewerkt en welke voorwaarden gelden voor productlinks en beelden.
          </p>
          <p>
            We claimen geen samenwerking voordat die bevestigd is. Kooplinks, affiliate links en eventuele commerciële posities moeten herkenbaar blijven en staan los van redactionele beoordeling. Lees ook <Link href="/onafhankelijkheid">hoe we onafhankelijkheid en inkomsten scheiden</Link>.
          </p>
        </PolicySection>

        <PolicySection title="Correcties en grenzen">
          <p>
            Stuur bij productcorrecties liefst een bron, productpagina of concrete specificatie mee. We beoordelen correcties inhoudelijk en passen informatie aan wanneer die betrouwbaar en relevant is.
          </p>
          <ul>
            <li>We geven geen medisch advies bij pijn of blessures.</li>
            <li>We behandelen geen klantenservicevragen over bestellingen bij winkels.</li>
            <li>We verkopen geen betaalde scoreverhoging, reviewclaim of voorkeurspositie als redactioneel advies.</li>
          </ul>
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

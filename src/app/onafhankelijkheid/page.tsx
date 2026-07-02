import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { companyInfo } from "@/lib/company";

export const metadata: Metadata = {
  title: `Onafhankelijkheid en inkomsten | ${companyInfo.platformName}`,
  description: `Lees hoe ${companyInfo.platformName} redactionele beoordeling, aanbevelingen, winkelprijzen en mogelijke inkomsten van elkaar scheidt.`,
  alternates: {
    canonical: "/onafhankelijkheid"
  }
};

export default function IndependencePage() {
  return (
    <main className="policy-page page-policy">
      <section className="page-hero-with-visual page-hero-with-visual-compact image-hero image-hero-shoe">
        <div>
          <p className="eyebrow">Onafhankelijkheid en inkomsten</p>
          <h1>Hoe we vertrouwen en commercie gescheiden houden</h1>
          <p className="lead">
            {companyInfo.platformName} kan inkomsten ontvangen via winkelverwijzingen of samenwerkingen. Dat mag niet bepalen welke schoen als passend wordt uitgelegd. Productkwaliteit, persoonlijke match en winkelinformatie blijven aparte signalen.
          </p>
        </div>
        <div className="page-hero-visual page-hero-visual-product">
          <Image
            alt="Hardloopschoen als neutraal productbeeld bij uitleg over redactionele onafhankelijkheid"
            fill
            priority
            sizes="(max-width: 820px) 100vw, 360px"
            src="/images/home/shoe-hero-asics.png"
          />
        </div>
      </section>

      <section className="trust-answers">
        <article>
          <strong>Score staat los van winkel</strong>
          <span>Een winkelvergoeding verandert de redactionele beoordeling van een schoen niet.</span>
        </article>
        <article>
          <strong>Match blijft uitlegbaar</strong>
          <span>Aanbevelingen komen uit je antwoorden, productkenmerken en onze beoordelingsregels.</span>
        </article>
        <article>
          <strong>Prijs is een aparte laag</strong>
          <span>Retailerprijzen zijn koopinformatie, geen bewijs dat een schoen beter bij je past.</span>
        </article>
      </section>

      <section className="policy-content standalone">
        <PolicySection title={`Hoe ${companyInfo.platformName} inkomsten kan krijgen`}>
          <p>
            Sommige links naar winkels kunnen affiliate links zijn. Als je via zo'n link iets koopt, kan {companyInfo.platformName} een vergoeding ontvangen. Voor jou hoeft de prijs daardoor niet hoger te worden.
          </p>
          <p>
            Deze vergoeding is bedoeld als inkomstenbron voor het platform, niet als beoordelingscriterium. Wanneer we gesponsorde plaatsingen, advertenties of commerciële samenwerkingen tonen, moeten die herkenbaar gelabeld zijn. We willen geen advies verkopen als onafhankelijk oordeel.
          </p>
        </PolicySection>

        <PolicySection title="Wat bezoekers moeten kunnen herkennen">
          <ul>
            <li>Of een link naar een winkel een kooplink of partnerlink is.</li>
            <li>Of een positie redactioneel, persoonlijk aanbevolen of commercieel ingekocht is.</li>
            <li>Of een score gaat over productkwaliteit, persoonlijke match, gebruikerservaring of winkelinformatie.</li>
            <li>Wanneer informatie nog niet volledig gecontroleerd is, bijvoorbeeld bij ontbrekende feeddata, maatbeschikbaarheid of productspecificaties.</li>
          </ul>
        </PolicySection>

        <PolicySection title="Wat inkomsten niet mogen bepalen">
          <ul>
            <li>De redactionele score van een schoen.</li>
            <li>De uitleg waarom een schoen wel of niet bij jouw profiel past.</li>
            <li>De volgorde van persoonlijke keuzehulp-resultaten, behalve wanneer een commerciële positie apart en duidelijk is gelabeld.</li>
            <li>De scheiding tussen productkwaliteit, gebruikerservaringen en winkelkwaliteit.</li>
          </ul>
        </PolicySection>

        <PolicySection title="Wat we wel commercieel mogen tonen">
          <p>
            We mogen prijzen, beschikbaarheid, aanbieders en kooplinks tonen om je aankoopbeslissing praktischer te maken. Die informatie komt van winkels, partners of handmatige invoer en kan wijzigen.
          </p>
          <p>
            Daarom tonen we winkelinformatie apart van onze beoordeling. Een lage prijs maakt een schoen niet automatisch passend voor jou, en een winkelvergoeding maakt een schoen niet beter beoordeeld.
          </p>
        </PolicySection>

        <PolicySection title="Waar winkelinformatie vandaan kan komen">
          <p>
            Prijs- en beschikbaarheidsdata kan later komen uit handmatig gecontroleerde invoer, directe retailerdata, een affiliate- of feednetwerk of TradeTracker na goedkeuring. Een bron wordt pas publiek gebruikt wanneer de productmatch, prijs, URL, bron en controledatum kloppen.
          </p>
          <p>
            Zolang er geen gecontroleerde prijs of partnerlink is, tonen we liever dat prijsdata nog ontbreekt dan dat we een winkelrelatie, korting of voorraadstatus suggereren.
          </p>
        </PolicySection>

        <PolicySection title="Welke regels gelden voor kooplinks">
          <p>
            Kooplinks en partnerlinks mogen je naar een winkel sturen, maar ze mogen geen redactioneel advies worden. Daarom gelden vaste regels voordat winkelinformatie prominent wordt getoond.
          </p>
          <ul>
            <li>Partnerlinks moeten herkenbaar blijven wanneer ze worden gebruikt.</li>
            <li>Prijzen, voorraad en maatbeschikbaarheid moeten apart staan van de redactionele beoordeling.</li>
            <li>Gesponsorde posities of advertenties moeten duidelijk als commercieel herkenbaar zijn.</li>
            <li>Correcties van merken of retailers worden inhoudelijk beoordeeld en verhogen niet automatisch een score.</li>
            <li>We gebruiken geen claims als laagste prijs, officiële partner of getest door experts zonder passende onderbouwing en toestemming.</li>
          </ul>
        </PolicySection>

        <PolicySection title="Voor merken en retailers">
          <p>
            Merken en retailers mogen fouten melden of gecontroleerde feedinformatie aanbieden via de <Link href="/contact">contactpagina</Link>. Die data is alleen bruikbaar wanneer de bron controleerbaar is en niet wordt gebruikt om advies te kopen.
          </p>
          <p>
            Een commerciële relatie kan dus leiden tot betere winkelinformatie, maar niet tot een hogere score, een positie als persoonlijke aanbeveling of een redactionele claim die niet inhoudelijk klopt.
          </p>
        </PolicySection>

        <PolicySection title="Meer over vertrouwen">
          <p>
            Lees ook <Link href="/methodologie">hoe we schoenen beoordelen</Link>, ons <Link href="/privacy">privacybeleid</Link> en het <Link href="/cookies">cookiebeleid</Link>.
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

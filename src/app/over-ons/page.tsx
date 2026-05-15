import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Over Loopwijzer | Hardloopschoenen vergelijken met uitleg",
  description: "Lees waarom Loopwijzer is gebouwd en hoe we hardloopschoenen vergelijken op productkenmerken, persoonlijke match en prijs."
};

export default function AboutPage() {
  return (
    <main className="policy-page page-policy">
      <section className="page-hero-with-visual page-hero-with-visual-compact image-hero image-hero-surfaces">
        <div>
          <p className="eyebrow">Over Loopwijzer</p>
          <h1>Een rustigere manier om hardloopschoenen te kiezen.</h1>
          <p className="lead">
            Loopwijzer helpt Nederlandse hardlopers beter kiezen tussen hardloopschoenen. We combineren gestructureerde productinformatie, keuzehulp, redactionele beoordeling en prijsvergelijking, zonder te doen alsof één schoen voor iedereen de beste keuze is.
          </p>
        </div>
        <div className="page-hero-visual page-hero-visual-wide">
          <Image
            alt="Hardlopers op verschillende ondergronden als beeld voor de missie van Loopwijzer"
            fill
            priority
            sizes="(max-width: 820px) 100vw, 390px"
            src="/images/home/running-surfaces-triptych.png"
          />
        </div>
      </section>

      <section className="trust-answers">
        <article>
          <strong>Geen webshop</strong>
          <span>We verkopen zelf geen hardloopschoenen en houden productadvies los van winkelinformatie.</span>
        </article>
        <article>
          <strong>Uitleg boven hype</strong>
          <span>Een schoen is pas interessant als je begrijpt voor wie hij logisch is en waar je op moet letten.</span>
        </article>
        <article>
          <strong>Nederlandse lopers</strong>
          <span>We bouwen voor beginners, recreatieve lopers, prijsbewuste kopers en lopers met pasvorm- of steunvragen.</span>
        </article>
      </section>

      <section className="policy-content standalone">
        <div className="policy-callout">
          <strong>Transparant in opbouw</strong>
          <span>Loopwijzer kiest voor gecontroleerde productdata, duidelijke prijsinformatie en onderbouwing per schoen. We tonen liever duidelijk wat we zeker weten dan dat we schijnzekerheid verkopen.</span>
        </div>

        <PolicySection title="Waarom Loopwijzer bestaat">
          <p>
            Hardloopschoenen vergelijken is lastig. Merken gebruiken eigen termen, webshops sturen snel richting verkoop en veel toplijstjes leggen onvoldoende uit voor wie een schoen echt geschikt is en voor wie juist niet.
          </p>
          <p>
            Loopwijzer is gebouwd om die keuze rustiger en beter uitlegbaar te maken. Je moet niet alleen zien welke schoenen populair of goedkoop zijn, maar vooral begrijpen welke eigenschappen passen bij jouw loopdoel, ondergrond, steunbehoefte, pasvorm en budget.
          </p>
        </PolicySection>

        <PolicySection title="Wat we wel en niet zijn">
          <ul>
            <li>We zijn een vergelijkings- en adviesplatform, geen webshop.</li>
            <li>We tonen productinformatie, redactionele uitleg, persoonlijke match en winkelprijzen als aparte signalen.</li>
            <li>We geven geen medisch advies. Bij blessures of pijnklachten blijft persoonlijk advies van een specialist belangrijk.</li>
            <li>We verbeteren productdata, prijsdekking, gebruikersreviews en redactionele onderbouwing zonder commerciële invloed op advies.</li>
          </ul>
        </PolicySection>

        <PolicySection title="Onze belofte">
          <p>
            We willen dat je begrijpt waarom een schoen bij je past, wat de belangrijkste alternatieven zijn en welke nadelen je moet meenemen voordat je koopt.
          </p>
          <p>
            Daarom scheiden we productkwaliteit, persoonlijke match, gebruikerservaringen en winkelinformatie. Die signalen helpen samen bij een keuze, maar ze betekenen niet hetzelfde.
          </p>
        </PolicySection>

        <PolicySection title="Hoe Loopwijzer geld kan verdienen">
          <p>
            Loopwijzer kan inkomsten ontvangen wanneer je via een winkelverwijzing iets koopt. Een vergoeding mag onze redactionele score, keuzehulp of uitleg niet bepalen. Kooplinks en eventuele commerciële posities moeten herkenbaar zijn zodra ze publiek worden gebruikt.
          </p>
          <p>
            Lees meer op <Link href="/onafhankelijkheid">Onafhankelijkheid en inkomsten</Link>.
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

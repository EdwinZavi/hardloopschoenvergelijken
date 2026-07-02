import Image from "next/image";
import type { Metadata } from "next";
import { companyInfo } from "@/lib/company";
import recommendationRules from "../../../data/recommendation-rules.json";

export const metadata: Metadata = {
  title: `Methodologie | Hoe ${companyInfo.platformName} hardloopschoenen beoordeelt`,
  description:
    "Lees hoe hardloopschoenen worden beoordeeld op productkwaliteit, persoonlijke match en prijsinformatie, met scorestatus en redactionele regels.",
  alternates: {
    canonical: "/methodologie"
  }
};

export default function MethodologyPage() {
  const weights = recommendationRules.scoreModel.weights;

  return (
    <main className="page-methodology">
      <section className="page-hero-with-visual page-hero-with-visual-compact image-hero image-hero-shoe">
        <div>
          <p className="eyebrow">Zo vergelijken we</p>
          <h1>Hoe we hardloopschoenen beoordelen</h1>
          <p className="lead">
            We vergelijken hardloopschoenen op vaste punten en scheiden drie signalen: productkwaliteit, persoonlijke match en koopinformatie. Daardoor zie je wat een schoen kan, waarom hij bij je past en welke prijsinformatie al gecontroleerd is.
          </p>
        </div>
        <div className="page-hero-visual page-hero-visual-product">
          <Image
            alt="Close-up van hardloopschoendetails als beeld bij redactionele beoordeling"
            fill
            priority
            sizes="(max-width: 820px) 100vw, 360px"
            src="/images/home/method-detail-shoe.png"
          />
        </div>
      </section>

      <section className="methodology-summary-grid" aria-label="Kernprincipes van de beoordeling">
        <article>
          <span className="methodology-summary-kicker">Onafhankelijk</span>
          <strong>Winkels sturen de score niet</strong>
          <p>Productkwaliteit en persoonlijke match staan los van prijs, voorraad en affiliatevergoeding.</p>
        </article>
        <article>
          <span className="methodology-summary-kicker">Persoonlijk</span>
          <strong>Een goede schoen past bij jouw situatie</strong>
          <p>Loopdoel, ondergrond, steunbehoefte, pasvorm en budget bepalen samen welke richting past.</p>
        </article>
        <article>
          <span className="methodology-summary-kicker">Controleerbaar</span>
          <strong>We leggen trade-offs uit</strong>
          <p>Je ziet pluspunten en nadelen, zonder algemene claims die voor iedere loper zouden gelden.</p>
        </article>
      </section>

      <section className="methodology-dropdown-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Rustig uitgelegd</p>
            <h2>Open alleen wat je wilt weten</h2>
            <p>
              De methodologie is verdeeld in categorieën. Scan eerst de hoofdpunten en open daarna alleen de uitleg die je nodig hebt.
            </p>
          </div>
        </div>

        <div className="methodology-dropdown-grid">
          <details className="methodology-dropdown-card">
            <summary className="methodology-dropdown-summary">
              <span className="methodology-dropdown-index">01</span>
              <span>
                <span className="methodology-dropdown-kicker">Score, match en prijs</span>
                <strong>Drie signalen, drie betekenissen</strong>
                <span>Productkwaliteit zegt iets anders dan persoonlijke match of koopinformatie.</span>
              </span>
            </summary>
            <div className="methodology-dropdown-body">
              <article>
                <h3>Productkwaliteit</h3>
                <p>Onze beoordeling van de schoen als model. Een hoge score betekent dat de schoen sterk presteert binnen zijn categorie, maar niet automatisch dat hij bij iedere loper past.</p>
              </article>
              <article>
                <h3>Persoonlijke match</h3>
                <p>De koppeling tussen jouw profiel en de eigenschappen van de schoen. Een stabiele duurloopschoen kan voor de ene loper logisch zijn en voor een ander juist te stevig of te zwaar.</p>
              </article>
              <article>
                <h3>Prijs en winkelinformatie</h3>
                <p>Prijzen helpen bij kopen, maar veranderen niets aan de productscore of de inhoudelijke uitleg waarom een schoen wel of niet past.</p>
              </article>
            </div>
          </details>

          <details className="methodology-dropdown-card">
            <summary className="methodology-dropdown-summary">
              <span className="methodology-dropdown-index">02</span>
              <span>
                <span className="methodology-dropdown-kicker">Data en bronnen</span>
                <strong>Voorzichtig met onvolledige informatie</strong>
                <span>We combineren productspecificaties, publieke bronnen, retailerdata en redactionele controle.</span>
              </span>
            </summary>
            <div className="methodology-dropdown-body">
              <p>
                We gebruiken gestructureerde productinformatie van merken, publieke productspecificaties, retailerinformatie en redactionele controle. Als bronnen verschillen of specificaties ontbreken, kiezen we voorzichtigheid boven schijnzekerheid.
              </p>
              <p>
                Scores zijn redactionele beoordelingen op vaste criteria. Ze zijn bedoeld om schoenen vergelijkbaar te maken, niet als laboratoriumtest, medisch advies of absolute waarheid.
              </p>
              <p>
                Winkelprijzen en affiliatevergoedingen tellen niet mee als productkwaliteit of persoonlijke match. Commerciële links moeten herkenbaar blijven.
              </p>
            </div>
          </details>

          <details className="methodology-dropdown-card">
            <summary className="methodology-dropdown-summary">
              <span className="methodology-dropdown-index">03</span>
              <span>
                <span className="methodology-dropdown-kicker">Scorestatus</span>
                <strong>Niet elke score heeft dezelfde bewijsbasis</strong>
                <span>We tonen of een score voorlopig, redactioneel gecontroleerd of getest is.</span>
              </span>
            </summary>
            <div className="methodology-dropdown-body">
              <div className="methodology-detail-list">
                {scoreStatusItems.map(([title, text]) => (
                  <article key={title}>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </article>
                ))}
              </div>
            </div>
          </details>

          <details className="methodology-dropdown-card">
            <summary className="methodology-dropdown-summary">
              <span className="methodology-dropdown-index">04</span>
              <span>
                <span className="methodology-dropdown-kicker">Redactionele criteria</span>
                <strong>Waar we inhoudelijk op letten</strong>
                <span>We beoordelen schoenen op eigenschappen die invloed hebben op loopgevoel, gebruik en zekerheid.</span>
              </span>
            </summary>
            <div className="methodology-dropdown-body">
              <div className="methodology-detail-list">
                {scoreItems.map(([title, text]) => (
                  <article key={title}>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </article>
                ))}
              </div>
            </div>
          </details>

          <details className="methodology-dropdown-card">
            <summary className="methodology-dropdown-summary">
              <span className="methodology-dropdown-index">05</span>
              <span>
                <span className="methodology-dropdown-kicker">Keuzehulpweging</span>
                <strong>Waarom jouw profiel meeweegt</strong>
                <span>Een aanbeveling moet passen bij doel, ondergrond, steunbehoefte, gevoel, pasvorm en budget.</span>
              </span>
            </summary>
            <div className="methodology-dropdown-body">
              <p>
                De keuzehulp gebruikt een gewogen matchmodel. De exacte score is minder belangrijk dan de uitleg: waarom past deze schoen bij jouw situatie, en welk nadeel moet je accepteren?
              </p>
              <div className="methodology-weights-list">
                {Object.entries(weights).map(([key, value]) => (
                  <div className="weight-row" key={key}>
                    <span>{weightLabels[key as keyof typeof weights]}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </details>

          <details className="methodology-dropdown-card">
            <summary className="methodology-dropdown-summary">
              <span className="methodology-dropdown-index">06</span>
              <span>
                <span className="methodology-dropdown-kicker">Eerlijkheid en correcties</span>
                <strong>Zo houden we het advies uitlegbaar</strong>
                <span>Correcties zijn welkom, maar commerciële belangen mogen de beoordeling niet sturen.</span>
              </span>
            </summary>
            <div className="methodology-dropdown-body">
              <p>
                Zie je een fout? Meld die via de contactpagina. We passen productinformatie aan wanneer een correctie betrouwbaar en relevant is. Merken en retailers kunnen correcties aanleveren, maar een commerciële relatie is geen reden om een score hoger te zetten.
              </p>
              <div className="methodology-detail-list">
                {recommendationRules.trustRules.map((rule) => (
                  <article key={rule}>
                    <p>{rule}</p>
                  </article>
                ))}
              </div>
            </div>
          </details>
        </div>
      </section>
    </main>
  );
}

const scoreItems = [
  ["Comfort", "Hoe prettig de schoen voelt tijdens gewone trainingen."],
  ["Demping", "Hoe zacht en beschermend de schoen loopt."],
  ["Stabiliteit", "Hoeveel steun en zekerheid de schoen geeft."],
  ["Tempo", "Hoe direct de schoen voelt wanneer je versnelt."],
  ["Grip", "Hoe zeker de zool voelt op de juiste ondergrond."],
  ["Veelzijdigheid", "Voor hoeveel soorten trainingen de schoen geschikt is."],
  ["Prijs-kwaliteit", "Of je veel schoen krijgt voor de prijs."]
];

const scoreStatusItems = [
  [
    "Voorlopige redactionele inschatting",
    "De score is gebaseerd op beschikbare productspecificaties en onze vaste weging. Dit helpt vergelijken, maar betekent nog niet dat alle productinformatie volledig brongecontroleerd of getest is."
  ],
  [
    "Redactioneel gecontroleerd",
    "Belangrijke productspecificaties en het redactionele oordeel zijn gecontroleerd. De score blijft een hulpmiddel naast pasvorm, doel en persoonlijke voorkeur."
  ],
  [
    "Getest volgens methode",
    "De score heeft naast broncontrole ook aanvullende praktijk- of testcontrole volgens onze gepubliceerde methode. We tonen dit alleen wanneer die basis er echt is."
  ]
];

const weightLabels: Record<keyof typeof recommendationRules.scoreModel.weights, string> = {
  surfaceMatch: "Ondergrond",
  goalAndUseCaseMatch: "Doel en gebruik",
  distanceMatch: "Afstand",
  supportMatch: "Steun",
  feelMatch: "Loopgevoel",
  fitMatch: "Pasvorm",
  experienceSafety: "Ervaring",
  budgetFit: "Budget",
  editorialQuality: "Algemene kwaliteit"
};

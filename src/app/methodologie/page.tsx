import Image from "next/image";
import recommendationRules from "../../../data/recommendation-rules.json";

export default function MethodologyPage() {
  const weights = recommendationRules.scoreModel.weights;
  const scoreItems = [
    ["Comfort", "Hoe prettig de schoen voelt tijdens gewone trainingen."],
    ["Demping", "Hoe zacht en beschermend de schoen loopt."],
    ["Stabiliteit", "Hoeveel steun en zekerheid de schoen geeft."],
    ["Tempo", "Hoe makkelijk de schoen helpt om sneller te lopen."],
    ["Grip", "Hoeveel vertrouwen de zool geeft op de juiste ondergrond."],
    ["Veelzijdigheid", "Voor hoeveel soorten trainingen de schoen geschikt is."],
    ["Prijs-kwaliteit", "Of je veel schoen krijgt voor de prijs."]
  ];

  return (
    <main className="page-methodology">
      <section className="page-hero-with-visual page-hero-with-visual-compact">
        <div>
          <p className="eyebrow">Zo vergelijken we</p>
          <h1>Hoe we hardloopschoenen beoordelen</h1>
          <p className="lead">
            We vergelijken hardloopschoenen op vaste punten en scheiden daarbij drie vragen: hoe goed is de schoen als product, hoe goed past hij bij jouw situatie en waar kun je hem kopen voor een redelijke prijs?
          </p>
        </div>
        <div className="page-hero-visual page-hero-visual-product">
          <Image
            alt="Hardloopschoen als productbeeld bij de beoordelingsmethodologie"
            fill
            priority
            sizes="(max-width: 820px) 100vw, 360px"
            src="/images/home/shoe-hero-asics.png"
          />
        </div>
      </section>

      <section className="trust-answers">
        <article>
          <strong>Heeft een winkel invloed op de score?</strong>
          <span>Nee. De beoordeling van de schoen staat los van winkelprijzen en affiliatevergoedingen.</span>
        </article>
        <article>
          <strong>Staat de goedkoopste schoen altijd bovenaan?</strong>
          <span>Nee. Prijs telt mee, maar pasvorm en gebruik zijn belangrijker.</span>
        </article>
        <article>
          <strong>Waarom een persoonlijke matchscore?</strong>
          <span>Omdat jouw voeten, afstand en loopdoel anders kunnen zijn dan die van iemand anders.</span>
        </article>
      </section>

      <section className="grid">
        <article className="panel">
          <h2>Productkwaliteit</h2>
          <p>Een redactionele beoordeling kijkt naar eigenschappen van de schoen zelf, zoals comfort, demping, stabiliteit, grip en duurzaamheid.</p>
        </article>
        <article className="panel">
          <h2>Persoonlijke match</h2>
          <p>Een matchscore kijkt naar jouw antwoorden, zoals ondergrond, loopdoel, afstand, steunbehoefte, pasvorm, gevoel en budget.</p>
        </article>
        <article className="panel">
          <h2>Winkelprijzen</h2>
          <p>Prijs en beschikbaarheid helpen bij kopen, maar zijn geen bewijs dat een schoen beter is of beter bij jou past.</p>
        </article>
      </section>

      <section>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Drie aparte signalen</p>
            <h2>Waarom score, match en prijs niet hetzelfde betekenen</h2>
          </div>
        </div>
        <div className="method-list">
          <article className="panel">
            <h3>1. Productkwaliteit</h3>
            <p>
              Dit is onze beoordeling van de schoen als model. Een hoge productscore betekent dat de schoen sterk presteert binnen zijn categorie, maar niet automatisch dat hij voor iedere loper de juiste keuze is.
            </p>
          </article>
          <article className="panel">
            <h3>2. Persoonlijke match</h3>
            <p>
              Dit is de koppeling tussen jouw profiel en de eigenschappen van de schoen. Een stabiele duurloopschoen kan voor de ene loper logisch zijn en voor een ander juist te zwaar, te stevig of te weinig snel.
            </p>
          </article>
          <article className="panel">
            <h3>3. Winkelprijs</h3>
            <p>
              Dit is praktische koopinformatie van retailers of partners. Een scherpe prijs kan een goede deal zijn, maar verandert niets aan de productscore of aan de inhoudelijke uitleg waarom een schoen wel of niet past.
            </p>
          </article>
          <article className="panel">
            <h3>4. Gebruikerservaring</h3>
            <p>
              Reviews kunnen helpen om patronen te herkennen, zoals pasvorm, slijtage of comfort na langere tijd. We behandelen gebruikerservaring als aanvullend signaal, niet als vervanging van productspecificaties of persoonlijke match.
            </p>
          </article>
        </div>
      </section>

      <section>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Datastatus</p>
            <h2>Waar onze informatie vandaan komt</h2>
          </div>
        </div>
        <div className="method-list">
          <article className="panel">
            <h3>Productgegevens</h3>
            <p>
              We gebruiken gestructureerde productinformatie van merken, publieke productspecificaties, retailerinformatie en redactionele controle. Als bronnen verschillen of specificaties ontbreken, kiezen we voorzichtigheid boven schijnzekerheid en markeren we informatie intern voor controle.
            </p>
          </article>
          <article className="panel">
            <h3>Scores</h3>
            <p>
              Onze scores zijn redactionele beoordelingen op basis van vaste criteria. Ze maken schoenen vergelijkbaar, maar zijn geen laboratoriumtest, medisch advies of grootschalig praktijktestpanel. Waar informatie onzeker of onvolledig is, kiezen we voor voorzichtigheid en vermijden we schijnzekerheid.
            </p>
          </article>
          <article className="panel">
            <h3>Prijzen en winkels</h3>
            <p>
              Winkelprijzen en affiliatevergoedingen tellen niet mee als productkwaliteit of persoonlijke match. We tonen prijzen pas publiek wanneer aanbiedingen gecontroleerd zijn of via een betrouwbare feed binnenkomen, en commerciële links moeten herkenbaar blijven.
            </p>
          </article>
          <article className="panel">
            <h3>Correcties</h3>
            <p>
              Zie je een fout? Meld die via de contactpagina. We passen productinformatie aan wanneer een correctie betrouwbaar en relevant is. Merken en retailers kunnen correcties aanleveren, maar commerciële relatie is geen reden om een score hoger te zetten.
            </p>
          </article>
        </div>
      </section>

      <section>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Voorlopige beoordeling</p>
            <h2>Waar letten we op?</h2>
          </div>
        </div>
        <div className="method-list">
          {scoreItems.map(([title, text]) => (
            <article className="panel" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Persoonlijke match</p>
            <h2>Wat telt mee in de keuzehulp?</h2>
          </div>
        </div>
        <div className="weights-grid">
          {Object.entries(weights).map(([key, value]) => (
            <div className="weight-row" key={key}>
              <span>{weightLabels[key as keyof typeof weights]}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Belofte</p>
            <h2>Zo houden we het eerlijk</h2>
          </div>
        </div>
        <div className="panel">
          <p>
            Deze regels moeten voorkomen dat een aanbeveling voelt als een zwarte doos. We leggen liever een duidelijke trade-off uit dan dat we een schoen zonder context als beste keuze presenteren.
          </p>
          <ul>
            {recommendationRules.trustRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

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

import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShoeVisual } from "@/components/ShoeVisual";
import { companyInfo } from "@/lib/company";
import { getEnrichedShoes, getPublicOffersForShoe } from "@/lib/data";
import { formatPrice, labels, scoreStatusDescriptions, scoreStatusLabels } from "@/lib/labels";
import type { EnrichedShoe } from "@/types/product";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getEnrichedShoes().map((shoe) => ({ slug: shoe.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const shoe = getEnrichedShoes().find((item) => item.slug === slug);

  if (!shoe) return {};

  return {
    title: `${shoe.fullName} vergelijken | ${companyInfo.platformName}`,
    description: `${shoe.fullName}: bekijk voor wie deze hardloopschoen past, waar je op moet letten en welke specs zoals demping, steun, pasvorm en prijs meetellen.`,
    alternates: {
      canonical: `/schoenen/${shoe.slug}`
    }
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const shoe = getEnrichedShoes().find((item) => item.slug === slug);

  if (!shoe) notFound();

  const offers = getPublicOffersForShoe(shoe.id).sort((a, b) => a.price - b.price);
  const decisionSignals = getDecisionSignals(shoe);
  const chooseReasons = getChooseReasons(shoe);
  const cautionReasons = getCautionReasons(shoe);
  const alternatives = getEnrichedShoes()
    .filter((item) => item.id !== shoe.id && (item.shoeType === shoe.shoeType || item.supportType === shoe.supportType || item.cushioningLevel === shoe.cushioningLevel))
    .sort((a, b) => b.editorialScore.overall - a.editorialScore.overall)
    .slice(0, 3)
    .map((item) => ({ shoe: item, reason: getAlternativeReason(shoe, item) }));

  return (
    <main className="page-product">
      <section className="product-hero-detail">
        <div>
          <p className="eyebrow">{labels.shoeType[shoe.shoeType]}</p>
          <h1>{shoe.fullName}</h1>
          <p className="lead">{shoe.editorialVerdict.summary}</p>
          <div className="product-decision-strip" aria-label="Belangrijkste keuze-signalen">
            {decisionSignals.map((signal) => (
              <div key={signal.label}>
                <span>{signal.label}</span>
                <strong>{signal.value}</strong>
              </div>
            ))}
          </div>
          <div className="actions">
            <Link className="button" href={`/vergelijken?ids=${shoe.id}`}>
              Vergelijk deze schoen
            </Link>
            <Link className="button secondary" href="/keuzehulp">
              Doe de keuzehulp
            </Link>
          </div>
        </div>
        <aside className="product-side-panel">
          <span className="product-hero-media">
            {shoe.imageUrl ? (
              <Image alt={`${shoe.fullName} productbeeld`} fill priority sizes="(max-width: 820px) 100vw, 420px" src={shoe.imageUrl} />
            ) : (
              <ShoeVisual shoe={shoe} size="hero" />
            )}
          </span>
          <div className="score-panel">
            <span>Redactionele score</span>
            <strong>{shoe.editorialScore.overall.toFixed(1)}</strong>
            <em>{scoreStatusLabels[shoe.scoreStatus]}</em>
            <p>Deze score gaat over de schoen zelf. Winkelprijzen, voorraad en partnerlinks tellen niet mee in de beoordeling.</p>
            <p>{scoreStatusDescriptions[shoe.scoreStatus]}</p>
          </div>
        </aside>
      </section>

      <section className="grid">
        <article className="panel">
          <h2>Kies deze als...</h2>
          <p>{shoe.editorialVerdict.bestFor}</p>
        </article>
        <article className="panel">
          <h2>Kijk verder als...</h2>
          <p>{shoe.editorialVerdict.lessSuitableFor}</p>
        </article>
        <article className="panel">
          <h2>Controleer dit...</h2>
          <p>
            {labels.supportType[shoe.supportType]} met {labels.level[shoe.cushioningLevel].toLowerCase()} demping en een {labels.level[shoe.responsivenessLevel].toLowerCase()} gevoel bij tempo.
          </p>
          <Link href="/methodologie">Zo beoordelen we schoenen</Link>
        </article>
      </section>

      <section>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Besliskader</p>
            <h2>Past deze schoen bij jouw training?</h2>
            <p>Controleer eerst loopdoel, steun en pasvorm. Kijk daarna pas naar prijs of aanbieding.</p>
          </div>
        </div>
        <div className="product-choice-grid">
          <article className="product-choice-panel product-choice-panel-positive">
            <h3>Past wanneer</h3>
            <ul>
              {chooseReasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </article>
          <article className="product-choice-panel product-choice-panel-caution">
            <h3>Wees voorzichtig als</h3>
            <ul>
              {cautionReasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Beoordeling</p>
            <h2>Waar beoordelen we deze schoen op?</h2>
          </div>
        </div>
        <div className="score-breakdown">
          <ScoreBar label="Comfort" value={shoe.editorialScore.comfort} />
          <ScoreBar label="Demping" value={shoe.editorialScore.cushioning} />
          <ScoreBar label="Stabiliteit" value={shoe.editorialScore.stability} />
          <ScoreBar label="Tempo-gevoel" value={shoe.editorialScore.responsiveness} />
          <ScoreBar label="Grip" value={shoe.editorialScore.grip} />
          <ScoreBar label="Veelzijdigheid" value={shoe.editorialScore.versatility} />
          <ScoreBar label="Prijs-kwaliteit" value={shoe.editorialScore.valueForMoney} />
        </div>
      </section>

      <section>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Specificaties</p>
            <h2>Belangrijke eigenschappen</h2>
          </div>
        </div>
        <dl className="spec-grid panel">
          <div>
            <dt>Ondergrond</dt>
            <dd>{labels.surfaceType[shoe.surfaceType]}</dd>
          </div>
          <div>
            <dt>Steun</dt>
            <dd>{labels.supportType[shoe.supportType]}</dd>
          </div>
          <div>
            <dt>Demping</dt>
            <dd>{labels.level[shoe.cushioningLevel]}</dd>
          </div>
          <div>
            <dt>Gevoel bij tempo</dt>
            <dd>{labels.level[shoe.responsivenessLevel]}</dd>
          </div>
          <div>
            <dt>Pasvorm</dt>
            <dd>{labels.width[shoe.widthLabel]}</dd>
          </div>
          <div>
            <dt>Gewicht</dt>
            <dd>{shoe.weightGrams} gram</dd>
          </div>
          <div>
            <dt>Drop</dt>
            <dd>{shoe.heelDropMm} mm</dd>
          </div>
          <div>
            <dt>Carbonplaat</dt>
            <dd>{shoe.hasCarbonPlate ? "Ja" : "Nee"}</dd>
          </div>
          <div>
            <dt>Waterdicht</dt>
            <dd>{shoe.isWaterproof ? "Ja" : "Nee"}</dd>
          </div>
        </dl>
      </section>

      <section>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Prijs vergelijken</p>
            <h2>Waar kun je deze schoen kopen?</h2>
            <p>Prijsinformatie staat los van ons productadvies. Een winkel kan ons via een partnerlink vergoeden, maar dat verandert de redactionele score, pluspunten of waarschuwingen niet.</p>
          </div>
        </div>
        <div className="product-price-disclosure">
          <strong>Redactioneel eerst, commercie apart.</strong>
          <p>
            We beoordelen de schoen op comfort, steun, pasvorm, grip en waarde. Daarna tonen we gecontroleerde winkeloffers, zodat een goedkope of affiliate-gedreven aanbieding geen advies wordt.
          </p>
          <p>
            Prijzen, voorraad, verzendkosten, retourvoorwaarden en maten kunnen bij de winkel wijzigen. Controleer die informatie altijd bij de retailer voordat je bestelt.
          </p>
        </div>
        {offers.length ? (
          <div className="offers-list">
            {offers.map((offer) => (
              <div className="offer-row" key={offer.id}>
                <div>
                  <strong>{offer.retailer}</strong>
                  <span>{labels.availability[offer.availability]}</span>
                  {offer.isAffiliate ? <span>Partnerlink mogelijk</span> : null}
                </div>
                <strong>{formatPrice(offer.price)}</strong>
                <a href={offer.url}>Bekijk bij winkel</a>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>Prijsvergelijking in voorbereiding</h2>
            <p>
              We tonen winkelprijzen pas wanneer aanbiedingen gecontroleerd zijn of via een betrouwbare feed binnenkomen. Onzekere prijsinformatie gebruiken we niet als koopadvies.
            </p>
          </div>
        )}
      </section>

      <section>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Ook bekijken</p>
            <h2>Vergelijkbare hardloopschoenen</h2>
            <p>Deze alternatieven overlappen in type, steun of demping. Winkelvergoeding speelt hier geen rol.</p>
          </div>
          {alternatives.length ? <Link href={`/vergelijken?ids=${[shoe.id, ...alternatives.slice(0, 2).map((item) => item.shoe.id)].join(",")}`}>Vergelijk met alternatieven</Link> : null}
        </div>
        <div className="grid">
          {alternatives.map((alternative) => (
            <article className="panel product-alternative-card" key={alternative.shoe.id}>
              <p className="eyebrow">{alternative.shoe.brand}</p>
              <h2>{alternative.shoe.fullName}</h2>
              <p>{alternative.shoe.editorialVerdict.summary}</p>
              <div>
                <span>Waarom alternatief</span>
                <strong>{alternative.reason}</strong>
              </div>
              <Link href={`/schoenen/${alternative.shoe.slug}`}>Bekijk deze schoen</Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function getDecisionSignals(shoe: EnrichedShoe) {
  return [
    { label: "Vooral voor", value: labels.shoeType[shoe.shoeType] },
    { label: "Steun", value: labels.supportType[shoe.supportType] },
    { label: "Demping", value: labels.level[shoe.cushioningLevel] },
    { label: "Pasvorm", value: labels.width[shoe.widthLabel] }
  ];
}

function getChooseReasons(shoe: EnrichedShoe) {
  const reasons = [
    shoe.editorialVerdict.bestFor,
    `Je zoekt ${labels.supportType[shoe.supportType].toLowerCase()} met ${labels.level[shoe.cushioningLevel].toLowerCase()} demping voor trainingen ${getSurfacePhrase(shoe)}.`
  ];

  if (shoe.widthLabel === "wide" || shoe.fitProfile === "roomy") {
    reasons.push("Je wilt meer ruimte in de pasvorm of merkt dat standaardmodellen snel knellen.");
  } else if (shoe.responsivenessLevel === "high" || shoe.hasCarbonPlate) {
    reasons.push("Je loopt regelmatig tempoblokken of wedstrijden en wilt een directer, sneller gevoel.");
  } else {
    reasons.push("Je wilt een voorspelbare schoen die niet alleen op snelheid of een opvallende eigenschap leunt.");
  }

  return reasons;
}

function getCautionReasons(shoe: EnrichedShoe) {
  const reasons = [
    shoe.editorialVerdict.lessSuitableFor,
    shoe.hasCarbonPlate ? "Je zoekt vooral comfort voor rustige trainingen; een plaat kan dan onnodig dwingend aanvoelen." : "Je verwacht een uitgesproken wedstrijdgevoel of maximale energieteruggave."
  ];

  if (shoe.widthLabel === "narrow" || shoe.fitProfile === "snug") {
    reasons.push("Je hebt brede voeten of wilt veel teenruimte; controleer de maatvoering extra kritisch.");
  } else if (shoe.supportType === "neutral") {
    reasons.push("Je wilt merkbaar meer stabiliteit of je bent gevoelig voor pijntjes; controleer dan extra of een neutrale schoen genoeg begeleiding geeft.");
  } else {
    reasons.push("Je loopt vooral korte, snelle trainingen en gewicht belangrijker vindt dan bescherming.");
  }

  return reasons;
}

function getAlternativeReason(current: EnrichedShoe, alternative: EnrichedShoe) {
  if (alternative.shoeType === current.shoeType && alternative.supportType !== current.supportType) {
    return `Vergelijkbaar type, maar met ${labels.supportType[alternative.supportType].toLowerCase()} in plaats van ${labels.supportType[current.supportType].toLowerCase()}.`;
  }

  if (alternative.cushioningLevel === current.cushioningLevel && alternative.responsivenessLevel !== current.responsivenessLevel) {
    return `Zelfde dempingsniveau, maar met een ${labels.level[alternative.responsivenessLevel].toLowerCase()} tempogevoel.`;
  }

  if (alternative.widthLabel !== current.widthLabel) {
    return `Interessant als je een ${getWidthAlternativeLabel(alternative)} pasvorm wilt vergelijken.`;
  }

  if (alternative.editorialScore.valueForMoney > current.editorialScore.valueForMoney) {
    return "Neem mee als prijs-kwaliteit zwaarder weegt in je keuze.";
  }

  return `Ligt dicht bij deze schoen qua ${labels.shoeType[alternative.shoeType].toLowerCase()} en gebruiksdoel.`;
}

function getSurfacePhrase(shoe: EnrichedShoe) {
  if (shoe.surfaceType === "road") return "op de weg";
  if (shoe.surfaceType === "track") return "op de baan";
  if (shoe.surfaceType === "trail") return "op onverhard terrein";
  return "op gemengde ondergrond";
}

function getWidthAlternativeLabel(shoe: EnrichedShoe) {
  if (shoe.widthLabel === "wide") return "ruimere";
  if (shoe.widthLabel === "narrow") return "smallere";
  return "meer gemiddelde";
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="score-bar">
      <div>
        <span>{label}</span>
        <strong>{value.toFixed(1)}</strong>
      </div>
      <div aria-hidden="true">
        <span style={{ width: `${value * 10}%` }} />
      </div>
    </div>
  );
}

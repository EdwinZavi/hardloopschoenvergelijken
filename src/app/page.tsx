import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getEnrichedShoes } from "@/lib/data";
import { companyInfo } from "@/lib/company";

export const metadata: Metadata = {
  title: `${companyInfo.platformName} | Hardloopschoenen vergelijken met uitleg`,
  description:
    "Kies hardloopschoenen op afstand, ondergrond, demping, steun en pasvorm. Vergelijk modellen, lees de nadelen en controleer prijsdata apart.",
  alternates: {
    canonical: "/"
  }
};

const m3Cards = [
  {
    href: "/keuzehulp",
    icon: "5K",
    imageAlt: "",
    imageSrc: "/images/home/choice-road-runner.png",
    title: "Begin bij je loopdoel",
    text: "Loop je 5 km, train je voor een halve marathon of ga je het bos in? Kies eerst waarvoor je de schoen gebruikt.",
    cta: "Start met je profiel"
  },
  {
    href: "/advies/stabiliteit",
    icon: "FIT",
    imageAlt: "",
    imageSrc: "/images/home/method-detail-shoe.png",
    title: "Voorkom druk en twijfel",
    text: "Vergelijk steun, breedte en teenruimte voordat score of merknaam de keuze overneemt.",
    cta: "Bekijk pasvormadvies"
  },
  {
    href: "/vergelijken",
    icon: "VS",
    imageAlt: "",
    imageSrc: "/images/home/compare-shoes-panel.png",
    title: "Leg modellen naast elkaar",
    text: "Zie het verschil in demping, gewicht, steun en gebruik zonder dat er meteen één winnaar wordt aangewezen.",
    cta: "Vergelijk modellen"
  },
  {
    href: "/schoenen",
    icon: "€",
    imageAlt: "",
    imageSrc: "/images/home/decision-table-compare.png",
    title: "Koop niet alleen op korting",
    text: "Een aanbieding telt pas mee als de schoen bij je training, voet en ondergrond past.",
    cta: "Filter op budget"
  }
];

const featuredRelease = {
  cta: "Bekijk schoenen",
  href: "/schoenen",
  imageSrc: "/images/home/nike-alphafly-3-release.png",
  kicker: "Uitgelichte release",
  meta: "Raceschoen voor snelle wedstrijddagen",
  title: "Nike Alphafly 3"
};

const carouselShoes = [
  {
    brand: "Nike",
    category: "Max dempende trainingsschoen",
    href: "/schoenen",
    imageSrc: "/images/home/carousel/nike-vomero-plus.png",
    title: "Nike Vomero Plus"
  },
  {
    brand: "ASICS",
    category: "Carbon raceschoen",
    href: "/schoenen",
    imageSrc: "/images/home/carousel/asics-metaspeed-sky.png",
    title: "ASICS Metaspeed Sky"
  },
  {
    brand: "adidas",
    category: "Carbon raceschoen",
    href: "/schoenen",
    imageSrc: "/images/home/carousel/adidas-adizero-adios-pro.png",
    title: "adidas Adizero Adios Pro"
  },
  {
    brand: "HOKA",
    category: "Snelle raceschoen",
    href: "/schoenen",
    imageSrc: "/images/home/carousel/hoka-cielo-x1-2.png",
    title: "HOKA Cielo X1 2.0"
  },
  {
    brand: "Saucony",
    category: "Carbon raceschoen",
    href: "/schoenen",
    imageSrc: "/images/home/carousel/saucony-endorphin-elite.png",
    title: "Saucony Endorphin Elite"
  },
  {
    brand: "Brooks",
    category: "Allround trainingsschoen",
    href: "/schoenen",
    imageSrc: "/images/home/carousel/brooks-ghost-18.png",
    title: "Brooks Ghost 18"
  },
  {
    brand: "New Balance",
    category: "Carbon raceschoen",
    href: "/schoenen",
    imageSrc: "/images/home/carousel/new-balance-fuelcell-sc-elite.png",
    title: "New Balance FuelCell SC Elite"
  },
  {
    brand: "PUMA",
    category: "Wedstrijdschoen",
    href: "/schoenen",
    imageSrc: "/images/home/carousel/puma-fast-r-3.png",
    title: "PUMA Fast-R 3"
  },
  {
    brand: "On",
    category: "Wedstrijdschoen",
    href: "/schoenen",
    imageSrc: "/images/home/carousel/on-cloudboom-strike.png",
    title: "On Cloudboom Strike"
  },
  {
    brand: "Mizuno",
    category: "Wedstrijdschoen",
    href: "/schoenen",
    imageSrc: "/images/home/carousel/mizuno-wave-rebellion-pro-3.png",
    title: "Mizuno Wave Rebellion Pro 3"
  }
];

function HomeCarouselCard({
  duplicate = false,
  shoe
}: {
  duplicate?: boolean;
  shoe: (typeof carouselShoes)[number];
}) {
  return (
    <article className="home-shoe-card" aria-hidden={duplicate ? "true" : undefined}>
      <Link href={shoe.href} tabIndex={duplicate ? -1 : undefined}>
        <span className="home-shoe-image">
          <Image alt={shoe.title} fill sizes="(max-width: 820px) 82vw, 300px" src={shoe.imageSrc} />
        </span>
        <span className="home-shoe-meta">{shoe.brand}</span>
        <strong>{shoe.title}</strong>
        <span className="home-shoe-category">{shoe.category}</span>
        <span className="home-shoe-footer">
          <span className="price-state price-state-empty">Prijs volgt</span>
          <b>Bekijk schoen</b>
        </span>
      </Link>
    </article>
  );
}

export default function HomePage() {
  const shoes = getEnrichedShoes();
  const brandCount = new Set(shoes.map((shoe) => shoe.brand)).size;
  const proofStats = [
    { value: `${shoes.length}`, label: "modellen in de database" },
    { value: `${brandCount}`, label: "merken naast elkaar" },
    { value: "6", label: "keuzecriteria direct zichtbaar" },
    { value: "0", label: "winkels in de scoreweging" }
  ];

  return (
    <main className="page-home">
      <section className="home-hero-section" aria-label="Hardloopschoenen vergelijken">
        <div className="home-hero-media" aria-hidden="true">
          <Image
            alt=""
            fill
            priority
            sizes="100vw"
            src="/images/home/premium-runner-hero.png"
          />
        </div>
        <div className="home-hero-light" aria-hidden="true" />
        <div className="home-section-inner home-hero">
          <div className="home-hero-content">
            <p className="eyebrow">Hardloopschoenen vergelijken</p>
            <h1>Vind hardloopschoenen zonder giswerk.</h1>
            <p className="lead">
              Vul je loopdoel, ondergrond en pasvorm in. Je ziet welke schoenen logisch zijn, waar de twijfel zit en wanneer een goedkoper alternatief verstandiger is.
            </p>
            <div className="actions">
              <Link className="button home-primary-cta" href="/keuzehulp">
                <span>Start de keuzehulp</span>
                <span className="home-cta-arrow" aria-hidden="true" />
              </Link>
              <Link className="button secondary" href="/schoenen">
                Bekijk schoenen
              </Link>
            </div>
            <div className="home-hero-trust" aria-label="Vertrouwenssignalen">
              <span>Methode zichtbaar</span>
              <span>Score los van winkels</span>
              <span>Nadelen per schoen</span>
            </div>
          </div>
          <Link className="home-latest-release-card" href={featuredRelease.href} aria-label={`Bekijk ${featuredRelease.title}`}>
            <span className="home-latest-release-copy">
              <span className="home-latest-release-kicker">{featuredRelease.kicker}</span>
              <strong>{featuredRelease.title}</strong>
              <span>{featuredRelease.meta}</span>
            </span>
            <span className="home-latest-release-media" aria-hidden="true">
              <Image alt="" fill priority sizes="(max-width: 820px) 88vw, 520px" src={featuredRelease.imageSrc} />
            </span>
            <span className="home-latest-release-cta">{featuredRelease.cta}</span>
          </Link>
        </div>
      </section>

      <section className="home-section home-proof-section" aria-label="Waarom Loopwijzer helpt bij kiezen">
        <div className="home-section-inner home-proof-layout">
          <div className="home-proof-copy">
            <p className="eyebrow">Van twijfel naar shortlist</p>
            <h2>We vergelijken niet alleen specs; we vertalen ze naar jouw keuze.</h2>
            <p>
              Een schoen voelt pas logisch als afstand, ondergrond, steun, breedte en budget samen kloppen. Daarom tonen we productdata, redactionele uitleg en winkelinformatie naast elkaar, maar niet door elkaar.
            </p>
          </div>
          <span className="home-proof-image" aria-hidden="true">
            <Image alt="" fill sizes="(max-width: 820px) 88vw, 320px" src="/images/home/choice-road-runner.png" />
          </span>
          <div className="home-proof-stats" aria-label="Platformsignalen">
            {proofStats.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-m3-section" aria-label="Waarom vergelijken via Loopwijzer">
        <div className="home-section-inner">
          <div className="home-section-header home-section-header-centered">
            <div>
              <p className="eyebrow">Waarom vergelijken via Loopwijzer?</p>
              <h2>Kies niet op merknaam alleen.</h2>
              <p>Begin bij afstand, ondergrond en pasvorm. Daarna vergelijk je merk, score en prijs met meer houvast.</p>
            </div>
          </div>
          <div className="home-m3-grid">
            {m3Cards.map((card) => (
              <Link className="home-m3-card" href={card.href} key={card.title}>
                <span className="home-m3-media" aria-hidden="true">
                  <Image alt={card.imageAlt} fill sizes="(max-width: 820px) 88vw, 520px" src={card.imageSrc} />
                </span>
                <span className="home-m3-body">
                  <span className="home-m3-icon" aria-hidden="true">{card.icon}</span>
                  <strong>{card.title}</strong>
                  <span>{card.text}</span>
                  <em>{card.cta}</em>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-carousel-section" aria-label="Populaire hardloopschoenen">
        <div className="home-section-inner">
          <div className="home-section-header">
            <div>
              <p className="eyebrow">Populaire hardloopschoenen</p>
              <h2>Bekende modellen om mee te starten.</h2>
              <p>Zet ze naast elkaar en let op demping, steun, pasvorm en prijsstatus.</p>
            </div>
            <Link href="/schoenen">Alle schoenen</Link>
          </div>
        </div>
        <div className="home-carousel-shell">
          <div className="home-shoe-track">
            {carouselShoes.map((shoe) => (
              <HomeCarouselCard key={shoe.title} shoe={shoe} />
            ))}
            {carouselShoes.map((shoe) => (
              <HomeCarouselCard duplicate key={`${shoe.title}-duplicate`} shoe={shoe} />
            ))}
          </div>
        </div>
      </section>

      <section className="home-section" aria-label="Vergelijken op belangrijke kenmerken">
        <div className="home-section-inner home-split-section">
          <div>
            <p className="eyebrow">Vergelijk op keuzecriteria</p>
            <h2>Pasvorm, steun en gebruik bepalen meer dan de merknaam.</h2>
            <p>
              Een schoen voor rustige kilometers vraagt iets anders dan een temposchoen of trailschoen. Daarom vertalen we specs naar praktische vragen: waar loop je, hoe ver, hoeveel steun wil je en welk gevoel zoek je onder je voet?
            </p>
          </div>
          <div className="home-feature-grid" role="list" aria-label="Belangrijke vergelijkingskenmerken">
            <div className="home-feature-core" aria-hidden="true">
              <span>Vergelijk</span>
              <strong>Wat past?</strong>
            </div>
            <span className="home-feature-chip" role="listitem">
              <b><em>Demping</em></b>
            </span>
            <span className="home-feature-chip" role="listitem">
              <b><em>Steun</em></b>
            </span>
            <span className="home-feature-chip" role="listitem">
              <b><em>Pasvorm</em></b>
            </span>
            <span className="home-feature-chip" role="listitem">
              <b><em>Drop</em></b>
            </span>
            <span className="home-feature-chip" role="listitem">
              <b><em>Gewicht</em></b>
            </span>
            <span className="home-feature-chip" role="listitem">
              <b><em>Prijs-kwaliteit</em></b>
            </span>
          </div>
        </div>
      </section>

      <section className="home-section home-final-section" aria-label="Onafhankelijk vergelijken">
        <div className="home-final-media" aria-hidden="true">
          <Image
            alt=""
            fill
            sizes="100vw"
            src="/images/home/final-road-runner.png"
          />
        </div>
        <div className="home-final-light" aria-hidden="true" />
        <div className="home-section-inner home-split-section">
          <div>
            <p className="eyebrow">Waarom je de uitkomst kunt vertrouwen</p>
            <h2>Koopadvies moet controleerbaar blijven.</h2>
            <p>
              Loopwijzer verkoopt zelf geen schoenen. Prijs, voorraad en partnerlinks staan los van de redactionele score en de uitleg waarom een schoen wel of niet bij je profiel past.
            </p>
          </div>
          <div className="home-final-actions">
            <Link className="button" href="/methodologie">
              Bekijk onze methode
            </Link>
            <Link className="button secondary" href="/onafhankelijkheid">
              Lees over onafhankelijkheid
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

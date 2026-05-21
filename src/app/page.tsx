import Image from "next/image";
import Link from "next/link";
import { ShoeVisual } from "@/components/ShoeVisual";
import { getEnrichedShoes } from "@/lib/data";
import { formatPrice, labels } from "@/lib/labels";
import type { EnrichedShoe } from "@/types/product";

const m3Cards = [
  {
    href: "/keuzehulp",
    icon: "5K",
    title: "Doelgericht kiezen",
    text: "Voor 5 km, halve marathon, marathon, hersteltraining of dagelijkse kilometers.",
    cta: "Start met je doel"
  },
  {
    href: "/advies/stabiliteit",
    icon: "FIT",
    title: "Begrijp je voettype",
    text: "Krijg inzicht in ondersteuning, stabiliteit, demping en afwikkeling.",
    cta: "Lees waar je op let"
  },
  {
    href: "/vergelijken",
    icon: "VS",
    title: "Vergelijk eerlijk",
    text: "Geen willekeurige toplijstjes, maar duidelijke verschillen per schoen.",
    cta: "Vergelijk modellen"
  },
  {
    href: "/schoenen",
    icon: "€",
    title: "Budget bewust",
    text: "Zie welke schoenen passen bij jouw wensen én prijsklasse.",
    cta: "Filter op budget"
  }
];

const popularShoeIds = [
  "nike-pegasus-41",
  "asics-novablast-5",
  "hoka-clifton-9",
  "brooks-ghost-16",
  "saucony-endorphin-speed-4",
  "new-balance-fresh-foam-x-1080v13"
];

function getPopularShoes() {
  const shoes = getEnrichedShoes();
  return popularShoeIds
    .map((id) => shoes.find((shoe) => shoe.id === id))
    .filter((shoe): shoe is EnrichedShoe => Boolean(shoe));
}

function HomeShoeCard({ duplicate = false, shoe }: { duplicate?: boolean; shoe: EnrichedShoe }) {
  return (
    <article className="home-shoe-card" aria-hidden={duplicate ? "true" : undefined}>
      <Link href={`/schoenen/${shoe.slug}`} tabIndex={duplicate ? -1 : undefined}>
        <span className="home-shoe-image">
          {shoe.imageUrl ? (
            <Image alt={shoe.fullName} fill sizes="(max-width: 820px) 82vw, 300px" src={shoe.imageUrl} />
          ) : (
            <ShoeVisual shoe={shoe} size="compact" />
          )}
        </span>
        <span className="home-shoe-meta">{shoe.brand}</span>
        <strong>{shoe.fullName}</strong>
        <span className="home-shoe-category">{labels.shoeType[shoe.shoeType]}</span>
        <span className="home-shoe-footer">
          <span>{shoe.priceFrom === null ? formatPrice(shoe.priceFrom) : `Vanaf ${formatPrice(shoe.priceFrom)}`}</span>
          <b>Bekijk schoen</b>
        </span>
      </Link>
    </article>
  );
}

export default function HomePage() {
  const popularShoes = getPopularShoes();

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
            <h1>Vind de hardloopschoen die écht bij je past.</h1>
            <p className="lead">
              Vergelijk schoenen op doel, demping, ondersteuning, budget en loopstijl. Geen losse toplijstjes, maar duidelijke keuzesignalen.
            </p>
            <div className="actions">
              <Link className="button home-primary-cta" href="/keuzehulp">
                Start de keuzehulp
              </Link>
              <Link className="button secondary" href="/schoenen">
                Bekijk schoenen
              </Link>
            </div>
            <div className="home-hero-trust" aria-label="Vertrouwenssignalen">
              <span>Onafhankelijk advies</span>
              <span>Uitlegbare scores</span>
              <span>Productinformatie los van winkels</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section home-m3-section" aria-label="Waarom vergelijken via Loopwijzer">
        <div className="home-section-inner">
          <div className="home-section-header home-section-header-centered">
            <div>
              <p className="eyebrow">Waarom vergelijken via Loopwijzer?</p>
              <h2>Kies niet zomaar de populairste schoen.</h2>
              <p>Ontdek welke schoen past bij jouw lichaam, doel en manier van lopen.</p>
            </div>
          </div>
          <div className="home-m3-grid">
            {m3Cards.map((card) => (
              <Link className="home-m3-card" href={card.href} key={card.title}>
                <span className="home-m3-icon" aria-hidden="true">{card.icon}</span>
                <strong>{card.title}</strong>
                <span>{card.text}</span>
                <em>{card.cta}</em>
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
              <h2>Bekijk modellen die vaak worden vergeleken door hardlopers.</h2>
              <p>Zie snel de verschillen in demping, steun, pasvorm en prijs.</p>
            </div>
            <Link href="/schoenen">Alle schoenen</Link>
          </div>
        </div>
        <div className="home-carousel-shell">
          <div className="home-shoe-track">
            {popularShoes.map((shoe) => (
              <HomeShoeCard key={shoe.id} shoe={shoe} />
            ))}
            {popularShoes.map((shoe) => (
              <HomeShoeCard duplicate key={`${shoe.id}-duplicate`} shoe={shoe} />
            ))}
          </div>
        </div>
      </section>

      <section className="home-section" aria-label="Vergelijken op belangrijke kenmerken">
        <div className="home-section-inner home-split-section">
          <div>
            <p className="eyebrow">Vergelijk op wat echt verschil maakt</p>
            <h2>Niet alleen merk en prijs, maar pasvorm, steun en gebruik.</h2>
            <p>
              Hardloopschoenen verschillen sterk per loopdoel. Daarom brengen we technische kenmerken terug naar praktische keuzevragen.
            </p>
          </div>
          <div className="home-feature-grid">
            <span>Demping</span>
            <span>Steun</span>
            <span>Pasvorm</span>
            <span>Drop</span>
            <span>Gewicht</span>
            <span>Prijs-kwaliteit</span>
          </div>
        </div>
      </section>

      <section className="home-section home-final-section" aria-label="Onafhankelijk vergelijken">
        <div className="home-section-inner home-split-section">
          <div>
            <p className="eyebrow">Waarom je de uitkomst kunt vertrouwen</p>
            <h2>Advies moet uitlegbaar blijven.</h2>
            <p>
              We bouwen hardloopschoenvergelijken.nl als keuzeplatform, niet als webshop. Commerciële links mogen het advies niet sturen.
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

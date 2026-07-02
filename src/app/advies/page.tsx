import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { companyInfo } from "@/lib/company";
import { getEnrichedShoes } from "@/lib/data";
import { intentPages } from "@/lib/intent-pages";

export const metadata: Metadata = {
  title: `Hardloopschoen advies | ${companyInfo.platformName}`,
  description:
    "Lees hardloopschoenadvies per loopdoel, pasvorm, demping, stabiliteit, afstand en prijs-kwaliteit. Start bij de vraag die jij wilt oplossen.",
  alternates: {
    canonical: "/advies"
  }
};

export default function AdviceIndexPage() {
  const shoes = getEnrichedShoes();
  const groupedPages = adviceGroups.map((group) => ({
    ...group,
    pages: group.slugs.map((slug) => intentPages.find((page) => page.slug === slug)).filter((page): page is (typeof intentPages)[number] => Boolean(page))
  }));

  return (
    <main className="page-advice">
      <section className="intent-hero image-hero image-hero-runner">
        <div>
          <p className="eyebrow">Hardloopschoen advies</p>
          <h1>Begin bij je loopdoel, niet bij een merknaam</h1>
          <p className="lead">
            Hardloopschoenen vergelijken wordt overzichtelijker als je eerst weet welke twijfel je wilt oplossen. Kies een route en ga daarna pas naar filters, keuzehulp of vergelijking.
          </p>
          <div className="actions">
            <Link className="button" href="/keuzehulp">
              Start keuzehulp
            </Link>
            <Link className="button secondary" href="/schoenen">
              Bekijk alle schoenen
            </Link>
          </div>
        </div>
        <aside className="visual-panel visual-panel-portrait">
          <div className="visual-panel-image">
            <Image
              alt="Overzicht van verschillende typen lopers en gebruikssituaties voor hardloopschoenen"
              fill
              priority
              sizes="(max-width: 820px) 100vw, 340px"
              src="/images/home/runner-types-trail.png"
            />
          </div>
          <div>
            <p className="eyebrow">Waarom dit helpt</p>
            <ul className="check-list">
              <li>Je ziet welke schoenkenmerken voor jouw situatie verschil maken.</li>
              <li>Elke pagina linkt door naar passende filters en vergelijkingen.</li>
              <li>Scores blijven los van winkelvergoedingen en partnerlinks.</li>
            </ul>
          </div>
        </aside>
      </section>

      <section>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Keuzeroutes</p>
            <h2>Kies de vraag die het dichtst bij jouw twijfel zit</h2>
          </div>
        </div>
        {groupedPages.map((group) => (
          <div className="advice-group" key={group.title}>
            <div className="section-heading">
              <div>
                <p className="eyebrow">{group.eyebrow}</p>
                <h3>{group.title}</h3>
                <p>{group.description}</p>
              </div>
            </div>
            <div className="grid">
              {group.pages.map((page) => {
                const matchCount = shoes.filter(page.filter).length;

                return (
                  <article className="panel advice-card" key={page.slug}>
                    <p className="eyebrow">{page.eyebrow}</p>
                    <h3>{page.title}</h3>
                    <p>{page.intro}</p>
                    <strong>{matchCount} passende schoenen in de huidige catalogus</strong>
                    <Link href={`/advies/${page.slug}`}>Bekijk keuzeadvies</Link>
                  </article>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

const adviceGroups = [
  {
    eyebrow: "Starten",
    title: "Ik wil veilig beginnen of rustig opbouwen",
    description: "Voor lopers die vooral comfort, voorspelbaarheid en een eerste schoen zonder gedoe zoeken.",
    slugs: ["beginners", "prijs-kwaliteit"]
  },
  {
    eyebrow: "Pasvorm en steun",
    title: "Ik twijfel over breedte, steun of stabiliteit",
    description: "Voor keuzes waarbij pasvorm en steun zwaarder wegen dan een hoge score alleen.",
    slugs: ["brede-voeten", "stabiliteit", "neutrale-hardloopschoenen"]
  },
  {
    eyebrow: "Afstand en tempo",
    title: "Ik kies op afstand, snelheid of wedstrijdgevoel",
    description: "Voor lopers die comfort over langere afstanden of juist meer tempo willen vergelijken.",
    slugs: ["5k-10k", "halve-marathon", "sneller-trainen", "carbon-wedstrijdschoenen"]
  },
  {
    eyebrow: "Ondergrond en comfort",
    title: "Ik loop op trail of zoek meer demping",
    description: "Voor situaties waarin grip, bescherming, zachtheid en stabiliteit samen de keuze bepalen.",
    slugs: ["trail", "zachte-demping"]
  }
];

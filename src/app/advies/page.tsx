import Link from "next/link";
import Image from "next/image";
import { getEnrichedShoes } from "@/lib/data";
import { intentPages } from "@/lib/intent-pages";

export default function AdviceIndexPage() {
  const shoes = getEnrichedShoes();

  return (
    <main className="page-advice">
      <section className="intent-hero image-hero image-hero-runner">
        <div>
          <p className="eyebrow">Hardloopschoen advies</p>
          <h1>Begin bij je loopdoel, niet bij een merknaam</h1>
          <p className="lead">
            Hardloopschoenen vergelijken wordt makkelijker als je eerst weet welke keuzevraag je probeert te beantwoorden. Deze adviespagina's helpen je per situatie naar de juiste filters, uitleg en vergelijkingen.
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
              <li>Je ziet welke verschillen voor jouw situatie belangrijk zijn.</li>
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
            <h2>Populaire vragen over hardloopschoenen</h2>
          </div>
        </div>
        <div className="grid">
          {intentPages.map((page) => {
            const matchCount = shoes.filter(page.filter).length;

            return (
              <article className="panel advice-card" key={page.slug}>
                <p className="eyebrow">{page.eyebrow}</p>
                <h3>{page.title}</h3>
                <p>{page.intro}</p>
                <strong>{matchCount} passende schoenen in de huidige catalogus</strong>
                <Link href={`/advies/${page.slug}`}>Bekijk advies</Link>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

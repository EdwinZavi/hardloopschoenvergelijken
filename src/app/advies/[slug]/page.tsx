import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { getEnrichedShoes } from "@/lib/data";
import { getIntentPage, intentPages } from "@/lib/intent-pages";

type IntentPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return intentPages.map((page) => ({ slug: page.slug }));
}

export default async function IntentPage({ params }: IntentPageProps) {
  const { slug } = await params;
  const page = getIntentPage(slug);

  if (!page) notFound();

  const shoes = getEnrichedShoes().filter(page.filter).sort(page.sort).slice(0, 6);
  const compareIds = page.compareSeed.join(",");

  return (
    <main className="page-advice">
      <section className="intent-hero">
        <div>
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p className="lead">{page.intro}</p>
          <div className="actions">
            <Link className="button" href={page.helperHref}>
              {page.primaryCta}
            </Link>
            <Link className="button secondary" href={page.filterHref}>
              Bekijk passende schoenen
            </Link>
          </div>
        </div>
        <aside className="visual-panel visual-panel-portrait">
          <div className="visual-panel-image">
            <Image
              alt="Hardloper op bergpad als beeld voor het kiezen van hardloopschoenen per loopdoel"
              fill
              sizes="(max-width: 820px) 100vw, 340px"
              src="/images/home/runner-types-trail.png"
            />
          </div>
          <div>
            <p className="eyebrow">Waar we op letten</p>
            <ul className="check-list">
              {page.criteria.map((criterion) => (
                <li key={criterion}>{criterion}</li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      <section className="method-strip">
        <div>
          <p className="eyebrow">Makkelijk vergelijken</p>
          <h2>Start met drie logische opties</h2>
          <p>Deze selectie is een goed beginpunt. Vergelijk steun, demping, pasvorm, snelheid en prijs voordat je een keuze maakt.</p>
        </div>
        <Link className="button secondary" href={`/vergelijken?ids=${compareIds}`}>
          Vergelijk deze drie schoenen
        </Link>
      </section>

      <section>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Aanbevolen schoenen</p>
            <h2>Hardloopschoenen die hierbij passen</h2>
          </div>
          <Link href={page.filterHref}>Bekijk alle resultaten</Link>
        </div>
        <div className="grid">
          {shoes.map((shoe) => (
            <ProductCard compareHref={`/schoenen?compare=${shoe.id}`} compareLabel="Vergelijk deze schoen" key={shoe.id} shoe={shoe} />
          ))}
        </div>
      </section>
    </main>
  );
}

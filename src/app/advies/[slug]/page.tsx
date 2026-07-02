import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { getEnrichedShoes } from "@/lib/data";
import { companyInfo } from "@/lib/company";
import { getIntentPage, getIntentPageSeo, intentPages } from "@/lib/intent-pages";

type IntentPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return intentPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: IntentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getIntentPage(slug);

  if (!page) return {};

  const seo = getIntentPageSeo(slug);

  return {
    title: `${page.title} | ${companyInfo.platformName}`,
    description: seo?.metaDescription ?? page.intro,
    alternates: {
      canonical: `/advies/${page.slug}`
    }
  };
}

export default async function IntentPage({ params }: IntentPageProps) {
  const { slug } = await params;
  const page = getIntentPage(slug);

  if (!page) notFound();

  const seo = getIntentPageSeo(slug);
  const isTrailPage = page.slug === "trail";
  const shoes = getEnrichedShoes().filter(page.filter).sort(page.sort).slice(0, 6);
  const compareIds = page.compareSeed.join(",");
  const compareCountLabel = `${page.compareSeed.length} relevante opties`;
  const relatedPages = (seo?.relatedSlugs ?? [])
    .map((relatedSlug) => getIntentPage(relatedSlug))
    .filter((relatedPage): relatedPage is NonNullable<typeof relatedPage> => Boolean(relatedPage));
  const faqSchema = seo?.faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: seo.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer
          }
        }))
      }
    : null;

  return (
    <main className="page-advice">
      {faqSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema)
          }}
        />
      ) : null}
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
          <div className={isTrailPage ? "visual-panel-image visual-panel-image-trail" : "visual-panel-image"}>
            <Image
              alt={isTrailPage ? "Trailrunner op onverhard bospad als beeld voor grip en zekerheid" : "Hardloper op bergpad als beeld voor het kiezen van hardloopschoenen per loopdoel"}
              fill
              sizes="(max-width: 820px) 100vw, 340px"
              src={isTrailPage ? "/images/home/trail-forest-runner.png" : "/images/home/runner-types-trail.png"}
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

      {seo?.guidance.length ? (
        <section>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Keuzeadvies</p>
              <h2>Waar baseer je de keuze op?</h2>
            </div>
          </div>
          <div className="grid landing-guidance-grid">
            {seo.guidance.map((item) => (
              <article className="panel landing-guidance-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {page.decisionFrame ? (
        <section>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Besliskader</p>
              <h2>Controleer dit voordat je kiest</h2>
            </div>
          </div>
          <div className="grid landing-guidance-grid">
            <article className="panel landing-guidance-card">
              <h3>Kies vooral op</h3>
              <p>{page.decisionFrame.chooseBy}</p>
            </article>
            <article className="panel landing-guidance-card">
              <h3>Let minder op</h3>
              <p>{page.decisionFrame.lessBy}</p>
            </article>
            <article className="panel landing-guidance-card">
              <h3>Veelgemaakte fout</h3>
              <p>{page.decisionFrame.commonMistake}</p>
            </article>
            <article className="panel landing-guidance-card">
              <h3>Wanneer niet deze route?</h3>
              <p>{page.decisionFrame.whenNot}</p>
            </article>
          </div>
        </section>
      ) : null}

      {page.dataNotice ? (
        <section className="method-strip" aria-label="Datastatus voor deze adviesroute">
          <div>
            <p className="eyebrow">Datastatus</p>
            <h2>{page.dataNotice.label}</h2>
            <p>{page.dataNotice.text}</p>
          </div>
          <Link className="button secondary" href="/methodologie">
            Bekijk methode
          </Link>
        </section>
      ) : null}

      <section className="method-strip">
        <div>
          <p className="eyebrow">Makkelijk vergelijken</p>
          <h2>Start met {compareCountLabel}</h2>
          <p>Gebruik deze selectie als startpunt. Vergelijk steun, demping, pasvorm, snelheid en prijs voordat je kiest.</p>
        </div>
        <Link className="button secondary" href={`/vergelijken?ids=${compareIds}`}>
          Vergelijk deze set
        </Link>
      </section>

      <section>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Aanbevolen schoenen</p>
            <h2>Hardloopschoenen die bij deze vraag passen</h2>
          </div>
          <Link href={page.filterHref}>Bekijk alle resultaten</Link>
        </div>
        <div className="grid">
          {shoes.map((shoe) => (
            <ProductCard compareHref={`/schoenen?compare=${shoe.id}`} compareLabel="Vergelijk deze schoen" key={shoe.id} shoe={shoe} />
          ))}
        </div>
      </section>

      {seo?.faqs.length ? (
        <section className="landing-faq">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Veelgestelde vragen</p>
              <h2>Vragen die vaak terugkomen</h2>
            </div>
          </div>
          <div className="faq-list">
            {seo.faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      {relatedPages.length ? (
        <section className="landing-related">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Verder vergelijken</p>
              <h2>Gerelateerde keuzevragen</h2>
            </div>
          </div>
          <div className="path-grid">
            {relatedPages.map((relatedPage) => (
              <Link className="path-card" href={`/advies/${relatedPage.slug}`} key={relatedPage.slug}>
                <strong>{relatedPage.title}</strong>
                <span>{relatedPage.intro}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

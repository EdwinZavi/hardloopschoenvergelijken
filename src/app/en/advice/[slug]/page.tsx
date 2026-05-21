import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShoeVisual } from "@/components/ShoeVisual";
import { enLabels, formatEuro } from "@/app/en/copy";
import { getEnrichedShoes } from "@/lib/data";
import { companyInfo } from "@/lib/company";
import {
  englishIntentPages,
  getEnglishIntentPage,
  getEnglishIntentPageSeo
} from "@/lib/intent-pages-en";
import type { EnrichedShoe } from "@/types/product";

type IntentPageProps = {
  params: Promise<{ slug: string }>;
};

function EnglishShoeCard({ compareHref, shoe }: { compareHref: string; shoe: EnrichedShoe }) {
  return (
    <article className="product-card">
      <ShoeVisual shoe={shoe} />
      <div>
        <p className="eyebrow">{shoe.brand}</p>
        <h3>{shoe.fullName}</h3>
        <p>
          {enLabels.shoeType[shoe.shoeType]} for {enLabels.surfaceType[shoe.surfaceType].toLowerCase()} running,
          with {enLabels.level[shoe.cushioningLevel].toLowerCase()} cushioning and {enLabels.supportType[shoe.supportType].toLowerCase()}.
        </p>
      </div>
      <div className="advice-marker">
        <strong>Best signal</strong>
        <span>
          {enLabels.width[shoe.widthLabel]} fit, {shoe.heelDropMm} mm drop and editorial score {shoe.editorialScore.overall.toFixed(1)}.
        </span>
      </div>
      <dl className="spec-grid">
        <div>
          <dt>Type</dt>
          <dd>{enLabels.shoeType[shoe.shoeType]}</dd>
        </div>
        <div>
          <dt>Cushioning</dt>
          <dd>{enLabels.level[shoe.cushioningLevel]}</dd>
        </div>
        <div>
          <dt>Support</dt>
          <dd>{enLabels.supportType[shoe.supportType]}</dd>
        </div>
        <div>
          <dt>Drop</dt>
          <dd>{shoe.heelDropMm} mm</dd>
        </div>
      </dl>
      <div className="card-footer">
        <strong>Editorial score {shoe.editorialScore.overall.toFixed(1)}</strong>
        <span>{shoe.priceFrom === null ? formatEuro(null) : `From ${formatEuro(shoe.priceFrom)}`}</span>
        <Link href={`/en/shoes/${shoe.slug}`}>View shoe</Link>
      </div>
      <Link className="compare-link" href={compareHref}>
        Compare this shoe
      </Link>
    </article>
  );
}

export function generateStaticParams() {
  return englishIntentPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: IntentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getEnglishIntentPage(slug);

  if (!page) return {};

  const seo = getEnglishIntentPageSeo(slug);

  return {
    title: `${page.title} | ${companyInfo.platformName}`,
    description: seo?.metaDescription ?? page.intro,
    alternates: {
      canonical: `/en/advice/${page.slug}`
    }
  };
}

export default async function EnglishIntentPage({ params }: IntentPageProps) {
  const { slug } = await params;
  const page = getEnglishIntentPage(slug);

  if (!page) notFound();

  const seo = getEnglishIntentPageSeo(slug);
  const isTrailPage = page.slug === "trail";
  const shoes = getEnrichedShoes().filter(page.filter).sort(page.sort).slice(0, 6);
  const compareIds = page.compareSeed.join(",");
  const relatedPages = (seo?.relatedSlugs ?? [])
    .map((relatedSlug) => getEnglishIntentPage(relatedSlug))
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
              View matching shoes
            </Link>
          </div>
        </div>
        <aside className="visual-panel visual-panel-portrait">
          <div className={isTrailPage ? "visual-panel-image visual-panel-image-trail" : "visual-panel-image"}>
            <Image
              alt={
                isTrailPage
                  ? "Trail runner on an off-road forest path as a visual for grip and confidence"
                  : "Runner on a mountain path as a visual for choosing running shoes by goal"
              }
              fill
              sizes="(max-width: 820px) 100vw, 340px"
              src={isTrailPage ? "/images/home/trail-forest-runner.png" : "/images/home/runner-types-trail.png"}
            />
          </div>
          <div>
            <p className="eyebrow">What we check</p>
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
              <p className="eyebrow">Choice guidance</p>
              <h2>What should you pay attention to?</h2>
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

      <section className="method-strip">
        <div>
          <p className="eyebrow">Easy comparison</p>
          <h2>Start with three logical options</h2>
          <p>Use this selection as a starting point. Compare support, cushioning, fit, pace feel and price before choosing.</p>
        </div>
        <Link className="button secondary" href={`/en/compare?ids=${compareIds}`}>
          Compare these three shoes
        </Link>
      </section>

      <section>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Recommended shoes</p>
            <h2>Running shoes that fit this situation</h2>
          </div>
          <Link href={page.filterHref}>View all results</Link>
        </div>
        <div className="grid">
          {shoes.map((shoe) => (
            <EnglishShoeCard compareHref={`/en/compare?ids=${shoe.id}`} key={shoe.id} shoe={shoe} />
          ))}
        </div>
      </section>

      {seo?.faqs.length ? (
        <section className="landing-faq">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Frequently asked questions</p>
              <h2>Common doubts before choosing</h2>
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
              <p className="eyebrow">Compare further</p>
              <h2>Related decision questions</h2>
            </div>
          </div>
          <div className="path-grid">
            {relatedPages.map((relatedPage) => (
              <Link className="path-card" href={`/en/advice/${relatedPage.slug}`} key={relatedPage.slug}>
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

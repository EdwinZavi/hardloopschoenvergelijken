import Link from "next/link";
import { englishIntentPages } from "@/lib/intent-pages-en";

export const metadata = {
  title: "Running Shoe Advice | Hardloopschoenvergelijken.nl",
  description: "Practical running shoe advice based on goals, support, cushioning, surface and budget."
};

const featuredSlugs = ["beginners", "zachte-demping", "stabiliteit"];

export default function EnglishAdvicePage() {
  const featuredPages = featuredSlugs
    .map((slug) => englishIntentPages.find((page) => page.slug === slug))
    .filter((page): page is NonNullable<typeof page> => Boolean(page));
  const remainingPages = englishIntentPages.filter((page) => !featuredSlugs.includes(page.slug));

  return (
    <main className="page-advice">
      <section className="intent-hero image-hero image-hero-advice">
        <div>
          <p className="eyebrow">Running shoe advice</p>
          <h1>Start with your running situation, not a brand name</h1>
          <p className="lead">
            Compare running shoes through the question you are actually trying to answer: your goal, fit,
            support needs, surface, pace and budget.
          </p>
          <div className="actions">
            <Link className="button" href="/en/shoe-finder">
              Start the Shoe Finder
            </Link>
            <Link className="button secondary" href="/en/shoes">
              Browse all shoes
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Most used guides</p>
            <h2>Start with a common running shoe question</h2>
          </div>
        </div>
        <div className="grid landing-guidance-grid">
          {featuredPages.map((page) => (
            <Link className="path-card" href={`/en/advice/${page.slug}`} key={page.slug}>
              <strong>{page.title}</strong>
              <span>{page.intro}</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="section-heading">
          <div>
            <p className="eyebrow">All advice pages</p>
            <h2>Choose the route that matches your decision</h2>
          </div>
        </div>
        <div className="path-grid">
          {remainingPages.map((page) => (
            <Link className="path-card" href={`/en/advice/${page.slug}`} key={page.slug}>
              <strong>{page.title}</strong>
              <span>{page.eyebrow}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

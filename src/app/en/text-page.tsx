import { englishPages } from "@/app/en/copy";

type EnglishPageKey = keyof typeof englishPages;

export function EnglishTextPage({ pageKey }: { pageKey: EnglishPageKey }) {
  const page = englishPages[pageKey];

  return (
    <main className="policy-page page-policy">
      <section className="policy-section">
        <p className="eyebrow">{page.eyebrow}</p>
        <h1>{page.title}</h1>
        <p className="lead">{page.intro}</p>
        <ul>
          {page.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

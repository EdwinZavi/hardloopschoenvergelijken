import Link from "next/link";

export const metadata = {
  title: "Running Shoe Advice | Hardloopschoenvergelijken.nl",
  description: "Practical running shoe advice based on goals, support, cushioning, surface and budget."
};

const adviceCards = [
  {
    title: "Start with your running goal",
    text: "A beginner who runs 5K needs different trade-offs than someone training for a half marathon.",
    href: "/en/shoe-finder"
  },
  {
    title: "Separate cushioning from support",
    text: "Soft shoes are not automatically stable shoes. Compare both signals before choosing.",
    href: "/en/compare"
  },
  {
    title: "Do not judge by brand alone",
    text: "Brand familiarity can help, but fit, use case and price should carry more weight.",
    href: "/en/shoes"
  }
];

export default function EnglishAdvicePage() {
  return (
    <main className="page-advice">
      <section className="intent-hero image-hero image-hero-advice">
        <div>
          <p className="eyebrow">Running shoe advice</p>
          <h1>Start with your running situation, not a brand name</h1>
          <p className="lead">
            Running shoe comparison becomes easier when you first know which decision you are trying to make.
          </p>
        </div>
      </section>

      <section>
        <div className="grid">
          {adviceCards.map((card) => (
            <article className="product-card" key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
              <Link href={card.href}>Continue</Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

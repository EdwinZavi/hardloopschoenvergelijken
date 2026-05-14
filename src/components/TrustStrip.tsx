const items = [
  {
    title: "Onafhankelijke score",
    text: "Schoenkwaliteit staat los van winkels en prijzen."
  },
  {
    title: "Prijs apart",
    text: "Je ziet aanbiedingen zonder dat ze het advies bepalen."
  },
  {
    title: "Nadelen zichtbaar",
    text: "We noemen ook wanneer een schoen minder logisch is."
  },
  {
    title: "Uitleg per advies",
    text: "Elke aanbeveling laat zien waarom hij bij jou past."
  }
];

export function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="Vertrouwenssignalen">
      {items.map((item) => (
        <article key={item.title}>
          <span className="trust-icon" aria-hidden="true" />
          <strong>{item.title}</strong>
          <span>{item.text}</span>
        </article>
      ))}
    </section>
  );
}

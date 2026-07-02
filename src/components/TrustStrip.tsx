const items = [
  {
    title: "Score los van winkels",
    text: "Productkwaliteit wordt apart beoordeeld van prijs en partnerlinks."
  },
  {
    title: "Prijs als koopinformatie",
    text: "Aanbiedingen zijn koopinformatie, geen reden om een schoen hoger te zetten."
  },
  {
    title: "Nadelen zichtbaar",
    text: "Je ziet ook wanneer een schoen niet goed aansluit op je situatie."
  },
  {
    title: "Uitleg per aanbeveling",
    text: "Elke aanbeveling koppelt je antwoorden aan concrete schoenkenmerken."
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

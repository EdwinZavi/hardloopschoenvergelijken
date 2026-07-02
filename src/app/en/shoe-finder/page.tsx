import Link from "next/link";

export const metadata = {
  title: "Shoe Finder | Hardloopschoenvergelijken.nl",
  description: "A shorter English guide to help runners choose the right type of running shoe."
};

const questions = [
  "What is your main running goal?",
  "How often do you run each week?",
  "Which surface do you use most?",
  "Do you need neutral shoes or extra support?",
  "Do you prefer soft cushioning or a faster feel?",
  "What is your maximum budget?"
];

export default function EnglishShoeFinderPage() {
  return (
    <main className="page-helper">
      <section className="page-hero-with-visual page-hero-with-visual-compact image-hero image-hero-advice">
        <div>
          <p className="eyebrow">Shoe Finder</p>
          <h1>Find the running shoes that fit your situation</h1>
          <p className="lead">
            The English version uses the same product logic as the Dutch flow, but keeps the journey shorter:
            six questions focused on goal, training, surface, support, feel and budget.
          </p>
          <Link className="button" href="/en/shoes">
            Browse shoes
          </Link>
        </div>
      </section>

      <section>
        <div className="section-heading">
          <p className="eyebrow">Short guided flow</p>
          <h2>Six questions instead of ten</h2>
        </div>
        <div className="trust-grid">
          {questions.map((question, index) => (
            <article key={question}>
              <span className="metric-badge">{index + 1}</span>
              <h3>{question}</h3>
              <p>Used to explain why a shoe may or may not match your running profile.</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

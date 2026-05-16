import Link from "next/link";
import type { Metadata } from "next";
import { companyInfo } from "@/lib/company";

export const metadata: Metadata = {
  title: `Cookiebeleid | ${companyInfo.platformName}`,
  description: `Lees welke cookies ${companyInfo.platformName} gebruikt, waarvoor ze dienen en wanneer toestemming nodig is.`
};

const cookieRows = [
  ["loopwijzer_admin", "Noodzakelijk", "Herkent een ingelogde beheerder in de adminomgeving. httpOnly, SameSite=Lax en in productie Secure.", "Maximaal 8 uur", "Nee"],
  ["Analytics", "Niet actief", "Alleen als we privacyvriendelijke statistieken toevoegen.", "Niet actief", "Afhankelijk van inrichting"],
  ["Marketing of tracking", "Niet actief", `Alleen als we advertentie-, tracking- of affiliatecookies op ${companyInfo.platformName} plaatsen.`, "Niet actief", "Ja, vooraf"]
];

export default function CookiesPage() {
  return (
    <main className="policy-page page-policy">
      <p className="eyebrow">Cookiebeleid</p>
      <h1>Welke cookies gebruikt {companyInfo.platformName}?</h1>
      <p className="lead">
        Cookies zijn kleine bestanden die een website nodig kan hebben om goed te werken, voorkeuren te onthouden of gebruik te meten. {companyInfo.platformName} gebruikt nu alleen noodzakelijke cookies voor de beheeromgeving.
      </p>

      <section className="policy-summary">
        <article>
          <strong>Geen trackingcookies actief</strong>
          <span>We plaatsen nu geen marketing- of trackingcookies voor gewone bezoekers.</span>
        </article>
        <article>
          <strong>Admincookie is noodzakelijk</strong>
          <span>De cookie `loopwijzer_admin` houdt een beheerder tijdelijk ingelogd.</span>
        </article>
        <article>
          <strong>Toestemming waar nodig</strong>
          <span>Tracking, marketing en niet-noodzakelijke affiliatecookies plaatsen we alleen na toestemming.</span>
        </article>
      </section>

      <section className="policy-section">
        <h2>Cookieoverzicht</h2>
        <div className="policy-table-wrap">
          <table className="policy-table">
            <thead>
              <tr>
                <th scope="col">Naam of categorie</th>
                <th scope="col">Type</th>
                <th scope="col">Doel</th>
                <th scope="col">Bewaartermijn</th>
                <th scope="col">Toestemming nodig?</th>
              </tr>
            </thead>
            <tbody>
              {cookieRows.map(([name, type, goal, retention, consent]) => (
                <tr key={name}>
                  <th scope="row">{name}</th>
                  <td>{type}</td>
                  <td>{goal}</td>
                  <td>{retention}</td>
                  <td>{consent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="policy-layout">
        <aside className="policy-index" aria-label="Inhoud">
          <strong>Op deze pagina</strong>
          <a href="#noodzakelijk">Noodzakelijke cookies</a>
          <a href="#analytics">Analytische cookies</a>
          <a href="#tracking">Tracking en marketing</a>
          <a href="#affiliate">Affiliate doorkliks</a>
          <a href="#instellingen">Cookie-instellingen</a>
        </aside>

        <div className="policy-content">
          <PolicySection id="noodzakelijk" title="Noodzakelijke cookies">
            <p>
              Noodzakelijke cookies zijn nodig om de website veilig en technisch goed te laten werken. De adminomgeving gebruikt de cookie `loopwijzer_admin` om een ingelogde beheerder tijdelijk te herkennen. Deze cookie is `httpOnly`, heeft `SameSite=Lax`, wordt in productie als `Secure` gezet, geldt voor het domeinpad `/` en blijft maximaal 8 uur geldig.
            </p>
          </PolicySection>

          <PolicySection id="analytics" title="Analytische cookies">
            <p>
              We gebruiken nu geen analyticscookies voor gewone bezoekers. Als we privacyvriendelijke analytics toevoegen, richten we die zo sober mogelijk in. Beperkte analytics met weinig privacy-impact kan onder voorwaarden zonder toestemming, maar we informeren bezoekers daar altijd duidelijk over en leggen vast welke gegevens worden gemeten.
            </p>
          </PolicySection>

          <PolicySection id="tracking" title="Tracking en marketingcookies">
            <p>
              We plaatsen geen trackingcookies zonder toestemming. Als we marketing-, advertentie- of affiliate-trackingcookies op {companyInfo.platformName} gebruiken, vragen we vooraf toestemming via een cookiemelding. Marketingcategorieën worden niet vooraf aangevinkt.
            </p>
          </PolicySection>

          <PolicySection id="affiliate" title="Affiliate doorkliks">
            <p>
              Wanneer je op een winkelknop klikt, kom je op de website van een winkel of partner. Vanaf dat moment kan die partij eigen cookies gebruiken. Het privacy- en cookiebeleid van die winkel geldt dan ook.
            </p>
            <p>
              Een affiliate doorklik is niet hetzelfde als een marketingcookie op {companyInfo.platformName}. Als een partnerlink via een redirect of netwerk loopt, kan die partner de klik verwerken volgens het eigen beleid.
            </p>
            <p>
              Lees ook hoe we omgaan met commerciële transparantie op de pagina{" "}
              <Link href="/onafhankelijkheid">Onafhankelijkheid en inkomsten</Link>.
            </p>
          </PolicySection>

          <PolicySection id="instellingen" title="Cookie-instellingen">
            <p>
              Omdat {companyInfo.platformName} nu geen tracking- of marketingcookies plaatst, tonen we geen cookiebanner. Als we cookies gebruiken waarvoor toestemming nodig is, voegen we duidelijke keuzes toe: noodzakelijke cookies, analytics en marketing/tracking. Bezoekers moeten hun keuze kunnen wijzigen of intrekken.
            </p>
            <p>Laatst bijgewerkt: 26 april 2026.</p>
          </PolicySection>
        </div>
      </section>
    </main>
  );
}

function PolicySection({ children, id, title }: { children: React.ReactNode; id: string; title: string }) {
  return (
    <section className="policy-section" id={id}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

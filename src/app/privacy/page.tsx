import type { Metadata } from "next";
import { companyInfo } from "@/lib/company";

export const metadata: Metadata = {
  title: `Privacybeleid | ${companyInfo.platformName}`,
  description: `Lees hoe ${companyInfo.platformName} omgaat met persoonsgegevens, keuzehulp-antwoorden, adminsessies, affiliate links en toekomstige reviews.`,
  alternates: {
    canonical: "/privacy"
  }
};

export default function PrivacyPage() {
  return (
    <main className="policy-page page-policy">
      <p className="eyebrow">Privacybeleid</p>
      <h1>Hoe {companyInfo.platformName} met gegevens omgaat</h1>
      <p className="lead">
        {companyInfo.platformName} laat je hardloopschoenen vergelijken zonder account. We verzamelen zo min mogelijk persoonsgegevens en leggen uit welke gegevens nodig zijn voor de website, keuzehulp en beheeromgeving.
      </p>

      <section className="trust-answers">
        <article>
          <strong>Geen account nodig</strong>
          <span>Je kunt schoenen bekijken, filteren en vergelijken zonder een gebruikersaccount aan te maken.</span>
        </article>
        <article>
          <strong>Keuzehulp blijft praktisch</strong>
          <span>Antwoorden gebruiken we voor matches en uitleg, niet voor medische conclusies.</span>
        </article>
        <article>
          <strong>Commercie blijft apart</strong>
          <span>Winkelvergoedingen veranderen onze redactionele beoordeling of persoonlijke matchscore niet.</span>
        </article>
      </section>

      <section className="policy-layout">
        <aside className="policy-index" aria-label="Inhoud">
          <strong>Op deze pagina</strong>
          <a href="#verantwoordelijke">Wie is verantwoordelijk?</a>
          <a href="#gegevens">Welke gegevens verwerken we?</a>
          <a href="#doelen">Waarvoor gebruiken we gegevens?</a>
          <a href="#keuzehulp">Keuzehulp en advies</a>
          <a href="#derden">Delen met derden</a>
          <a href="#bewaren">Bewaartermijnen</a>
          <a href="#rechten">Jouw rechten</a>
          <a href="#contact">Contact</a>
        </aside>

        <div className="policy-content">
          <PolicySection id="verantwoordelijke" title="Wie is verantwoordelijk?">
            <p>
              {companyInfo.legalName} is verantwoordelijk voor de verwerking van persoonsgegevens die nodig zijn om {companyInfo.platformName}, de keuzehulp, contactmogelijkheden en beheeromgeving te laten werken.
            </p>
            <ul>
              <li>Platform: {companyInfo.platformName}</li>
              <li>Beheerder: {companyInfo.legalName}</li>
              <li>KvK-nummer: {companyInfo.chamberOfCommerceNumber}</li>
              <li>
                Vestigingsadres: {companyInfo.address}, {companyInfo.postalCode} {companyInfo.city}
              </li>
              <li>Markt: Nederland</li>
              <li>Privacycontact: {companyInfo.privacyEmail}</li>
            </ul>
          </PolicySection>

          <PolicySection id="gegevens" title="Welke gegevens verwerken we?">
            <ul>
              <li>Technische gegevens die nodig zijn om de website te tonen, zoals IP-adres, browser, apparaat, datum en tijd.</li>
              <li>Antwoorden in de keuzehulp, zolang die nodig zijn om aanbevelingen en uitleg in je huidige sessie te tonen.</li>
              <li>Adminsessiegegevens voor de beheeromgeving, zoals de noodzakelijke sessiecookie `loopwijzer_admin`.</li>
              <li>Contactgegevens als je ons via een formulier of e-mail benadert.</li>
              <li>Reviewgegevens wanneer we gebruikersreviews aanbieden, zoals schermnaam, ervaringstype en reviewtekst.</li>
            </ul>
          </PolicySection>

          <PolicySection id="doelen" title="Waarvoor gebruiken we gegevens?">
            <ul>
              <li>Om de website technisch goed en veilig te laten werken.</li>
              <li>Om filters, vergelijkingstabellen en productpagina's te tonen.</li>
              <li>Om op basis van keuzehulp-antwoorden een matchscore, uitleg en trade-offs te tonen.</li>
              <li>Om de adminomgeving veilig te houden en handmatige schoen-, score- en prijsdata te beheren.</li>
              <li>Om vragen te beantwoorden wanneer je zelf contact opneemt.</li>
              <li>Om de website met privacyvriendelijke statistieken te verbeteren, maar alleen als we analytics daadwerkelijk toevoegen en daarover vooraf duidelijk informeren.</li>
            </ul>
          </PolicySection>

          <PolicySection id="keuzehulp" title="Keuzehulp en aanbevelingen">
            <p>
              Antwoorden in de keuzehulp gebruiken we om te bepalen welke schoenen beter passen bij je loopdoel, ondergrond, voorkeur voor demping, steun, pasvorm en budget. De uitleg bij een aanbeveling is gebaseerd op productkenmerken en onze beoordelingsregels.
            </p>
            <p>
              We gebruiken keuzehulp-antwoorden niet om medische diagnoses te stellen. Bij blessures, pijnklachten of twijfel over je lichaam blijft advies van een specialist, fysiotherapeut, podoloog of arts belangrijk.
            </p>
          </PolicySection>

          <PolicySection id="affiliate" title="Affiliate links en winkels">
            <p>
              Sommige winkelverwijzingen kunnen affiliate links zijn. Dat betekent dat {companyInfo.platformName} een vergoeding kan ontvangen als je via zo'n link iets koopt. Voor jou hoeft de prijs daardoor niet hoger te worden.
            </p>
            <p>
              Affiliatevergoedingen mogen de redactionele score, persoonlijke matchscore of uitleg waarom een schoen bij je past niet bepalen. Commerciële plaatsingen, advertenties of gesponsorde posities moeten herkenbaar worden gelabeld.
            </p>
            <p>
              Zodra je doorklikt naar een winkel, geldt ook het privacy- en cookiebeleid van die winkel of partner.
            </p>
          </PolicySection>

          <PolicySection id="derden" title="Delen met derden">
            <p>We delen gegevens alleen wanneer dat nodig is voor de werking van de website, wanneer je daar zelf voor kiest of wanneer we daartoe wettelijk verplicht zijn. Denk aan:</p>
            <ul>
              <li>hosting en technische infrastructuur;</li>
              <li>analytics of foutmonitoring, als die privacyrechtelijk zijn ingericht;</li>
              <li>retailers of affiliatepartners wanneer je zelf doorklikt naar een winkel of wanneer een noodzakelijke redirect voor de kooplink wordt gebruikt;</li>
              <li>e-mail- of contactdiensten wanneer je ons benadert.</li>
            </ul>
          </PolicySection>

          <PolicySection id="bewaren" title="Bewaartermijnen">
            <ul>
              <li>De adminsessiecookie blijft maximaal 8 uur geldig.</li>
              <li>Keuzehulp-antwoorden bewaren we niet langer dan nodig voor het tonen van het advies, tenzij je expliciet kiest voor opslag.</li>
              <li>Technische logs bewaren we maximaal 30 dagen voor beveiliging, foutopsporing en beheer, tenzij langere bewaring nodig is voor onderzoek naar misbruik of wettelijke verplichtingen.</li>
              <li>Reviews bewaren we zolang ze gepubliceerd zijn of totdat verwijdering passend en mogelijk is.</li>
            </ul>
          </PolicySection>

          <PolicySection id="rechten" title="Jouw rechten">
            <p>Onder de AVG heb je onder meer recht op inzage, correctie, verwijdering, beperking, bezwaar en overdraagbaarheid van gegevens waar dat van toepassing is.</p>
            <p>
              Je kunt ook een klacht indienen bij de Autoriteit Persoonsgegevens. Meer informatie staat op de website van de{" "}
              <a href="https://www.autoriteitpersoonsgegevens.nl/" rel="noreferrer" target="_blank">
                Autoriteit Persoonsgegevens
              </a>.
            </p>
          </PolicySection>

          <PolicySection id="contact" title="Contact en updates">
            <p>
              Deze pagina werken we bij wanneer onze diensten, cookies, analytics, reviews, affiliatepartners of bewaartermijnen veranderen. Laatst bijgewerkt: 11 mei 2026.
            </p>
            <div className="policy-callout">
              <strong>Vragen over privacy</strong>
              <span>Mail {companyInfo.privacyEmail} als je vragen hebt over gegevens, keuzehulp-antwoorden, correctie of verwijdering.</span>
            </div>
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

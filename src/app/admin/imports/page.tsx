import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAdminImports } from "@/lib/admin-imports";

const statusLabels = {
  received: "Ontvangen",
  normalized: "Genormaliseerd",
  matched: "Gematcht",
  needs_review: "Controle nodig",
  rejected: "Afgewezen",
  published: "Geverifieerd"
} as const;

export default async function AdminImportsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const imports = await getAdminImports();

  return (
    <main className="admin-workspace">
      <section className="admin-hero">
        <div>
          <p className="eyebrow">Feed imports</p>
          <h1>Controleer feeddata voordat iets publiek zichtbaar wordt.</h1>
          <p className="lead">
            Imports uit TradeTracker, retailerfeeds of CSV blijven eerst in staging. Feedregels worden hier alleen voorbereid en beoordeeld; ze verschijnen pas publiek na een expliciete admin-review en verificatie.
          </p>
          <div className="actions">
            <Link className="button" href="/admin">
              Terug naar dataworkspace
            </Link>
            <Link className="button secondary" href="/schoenen">
              Publieke catalogus bekijken
            </Link>
          </div>
        </div>
        <aside className="admin-status-panel">
          <span className="status-dot ok" />
          <p className="eyebrow">TradeTracker readiness</p>
          <h2>Niet inschakelen zonder reviewpoort</h2>
          <p>Deze demo-import toont de controlelaag die nodig is voordat echte feedrecords tot geverifieerde offers kunnen leiden.</p>
        </aside>
      </section>

      <section className="admin-grid-two" aria-label="Import guardrails">
        <div className="admin-check-list">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Guardrail-flow</p>
              <h2>Van ruwe feedregel naar verified offer</h2>
            </div>
          </div>
          {readinessSteps.map((step, index) => (
            <div className="admin-check-row" key={step.title}>
              <span className={index < 3 ? "check-icon passed" : "check-icon failed"} aria-hidden="true" />
              <div>
                <strong>{index + 1}. {step.title}</strong>
                <span>{step.description}</span>
              </div>
            </div>
          ))}
        </div>

        <aside className="admin-status-panel">
          <span className="status-dot danger" />
          <p className="eyebrow">Volgende actie</p>
          <h2>Review eerst de stagingregels</h2>
          <p>
            Open een import, filter op lage match confidence en warnings, en markeer per record of het een handmatige match, afwijzing of offer-kandidaat wordt.
          </p>
          <p>Pas daarna hoort TradeTracker-publicatie naar de publieke catalogus bespreekbaar te zijn.</p>
        </aside>
      </section>

      {imports.length ? (
        <section>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Importoverzicht</p>
              <h2>Beschikbare feedimports</h2>
            </div>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col">Import</th>
                  <th scope="col">Bron</th>
                  <th scope="col">Status</th>
                  <th scope="col">Records</th>
                  <th scope="col">Warnings</th>
                  <th scope="col">Matches</th>
                  <th scope="col">Staging-kandidaten</th>
                  <th scope="col">Kwaliteit</th>
                  <th scope="col">Actie</th>
                </tr>
              </thead>
              <tbody>
                {imports.map((item) => (
                  <tr key={item.id}>
                    <th scope="row">
                      <span>{item.sourceName}</span>
                      <small>{new Intl.DateTimeFormat("nl-NL", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.importedAt))}</small>
                    </th>
                    <td>{providerLabels[item.provider]}</td>
                    <td>{statusLabels[item.status]}</td>
                    <td>{item.stats.totalRecords}</td>
                    <td>{item.stats.warnings}</td>
                    <td>{item.stats.exactMatches + item.stats.highMatches + item.stats.mediumMatches}/{item.stats.totalRecords}</td>
                    <td>{item.stats.publishable}</td>
                    <td>{item.stats.qualityScore}%</td>
                    <td>
                      <Link href={`/admin/imports/${item.id}`}>Open import</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <section className="empty-state">
          <h2>Nog geen imports</h2>
          <p>Voeg later een TradeTracker-feed, retailerfeed of CSV-import toe om stagingdata te controleren voordat er publieke offers ontstaan.</p>
        </section>
      )}
    </main>
  );
}

const providerLabels = {
  tradetracker: "TradeTracker",
  retailer_api: "Retailer API",
  retailer_feed: "Retailer feed",
  manual_csv: "Handmatige CSV"
} as const;

const readinessSteps = [
  {
    title: "Raw feed",
    description: "Nieuwe regels blijven onzichtbaar voor bezoekers en worden alleen als bronrecord bekeken."
  },
  {
    title: "Normalisatie",
    description: "Prijs, URL, retailer, beschikbaarheid en beeldkandidaat worden losgetrokken van de ruwe feed."
  },
  {
    title: "Matching",
    description: "De voorgestelde schoenmatch krijgt een zichtbaar confidence-niveau en reviewadvies."
  },
  {
    title: "Admin review",
    description: "Een beheerder beslist per record: goedkeuren voor offer-staging, handmatig matchen, afwijzen of negeren."
  },
  {
    title: "Verified offer",
    description: "Pas na verificatie mag een offer publiek meetellen in prijsvergelijking en productpagina's."
  }
] as const;

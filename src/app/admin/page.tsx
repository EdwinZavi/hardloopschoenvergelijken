import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { logoutAdmin } from "@/app/admin/actions";
import { getAdminAccounts, getAdminAnalytics } from "@/lib/admin-analytics";
import { getAdminWorkspace } from "@/lib/admin-data";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { companyInfo } from "@/lib/company";
import { formatPrice, labels } from "@/lib/labels";
import { getSupabaseHealth } from "@/lib/supabase/health";
import type { ShoeType } from "@/types/product";

const typeOrder: ShoeType[] = ["daily_trainer", "stability", "tempo", "race", "trail", "recovery"];

const severityLabels = {
  high: "Hoog",
  medium: "Middel",
  low: "Laag"
};

const severityClassNames = {
  high: "danger",
  medium: "warning",
  low: "info"
};

export default async function AdminWorkspacePage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const workspace = getAdminWorkspace();
  const analytics = getAdminAnalytics();
  const accounts = getAdminAccounts();
  const supabaseHealth = await getSupabaseHealth();
  const supabaseCounts = supabaseHealth.reachable ? supabaseHealth.tables : null;
  const databaseCounts = [
    { label: "Merken", table: "brands", count: supabaseCounts?.brands ?? workspace.stats.brandCount },
    { label: "Schoenen", table: "shoes", count: supabaseCounts?.shoes ?? workspace.stats.shoeCount },
    { label: "Retailerprijzen", table: "offers", count: supabaseCounts?.offers ?? workspace.stats.offerCount }
  ];
  const databaseSourceLabel = supabaseHealth.configured ? "Supabase gekoppeld" : "Lokale seeddata actief";
  const databaseReadiness = getDatabaseReadinessCopy(supabaseHealth);
  const highIssueCount = workspace.issues.filter((issue) => issue.severity === "high").length;
  const visitorGrowth = analytics.visitorsLastMonth
    ? Math.round(((analytics.visitorsThisMonth - analytics.visitorsLastMonth) / analytics.visitorsLastMonth) * 100)
    : 0;

  return (
    <main className="admin-workspace">
      <section className="admin-topbar" aria-label="Admin navigatie">
        <div>
          <strong>{companyInfo.platformName} Admin</strong>
          <span>Beheer, data, imports en publicatiecontrole</span>
        </div>
        <nav>
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/imports">Feedimports</Link>
          <Link href="/schoenen">Publieke site</Link>
          <Link href="/methodologie">Methodologie</Link>
        </nav>
        <form action={logoutAdmin}>
          <button type="submit">Uitloggen</button>
        </form>
      </section>

      <section className="admin-hero">
        <div>
          <p className="eyebrow">Admin dashboard</p>
          <h1>Stuur {companyInfo.platformName} op data, vertrouwen en groei.</h1>
          <p className="lead">
            Dit dashboard combineert bezoekerssignalen, accountstatus, datakwaliteit en publicatieblokkades. Analytics zijn nu demo-seeddata en worden pas echte metingen na een privacybewuste trackingkeuze.
          </p>
          <div className="actions">
            <Link className="button" href="/admin/imports">
              Open feedimports
            </Link>
            <Link className="button secondary" href="/schoenen">
              Publieke site bekijken
            </Link>
          </div>
        </div>
        <aside className="admin-status-panel">
          <span className={highIssueCount ? "status-dot danger" : "status-dot ok"} />
          <p className="eyebrow">Publicatiestatus</p>
          <h2>{highIssueCount ? "Nog niet publicatieklaar" : "Basis is publicatieklaar"}</h2>
          <p>
            {highIssueCount
              ? `${highIssueCount} hoge prioriteit issue${highIssueCount === 1 ? "" : "s"} blokkeren vertrouwen.`
              : "Er zijn geen hoge prioriteit issues gevonden."}
          </p>
          <p className="admin-demo-note">Bron: {analytics.dataSource === "demo_seed_no_external_tracking" ? "demo-data, geen externe tracking" : analytics.dataSource}</p>
        </aside>
      </section>

      <section className="admin-metric-grid" aria-label="Dashboardstatistieken">
        <MetricCard label="Bezoekers" value={formatNumber(analytics.visitorsThisMonth)} text={`${visitorGrowth >= 0 ? "+" : ""}${visitorGrowth}% t.o.v. vorige maand`} />
        <MetricCard label="Accounts" value={formatNumber(analytics.accountsTotal)} text={`${formatNumber(analytics.accountsNewThisMonth)} nieuw deze maand`} />
        <MetricCard label="Keuzehulp starts" value={formatNumber(analytics.choiceHelperStarts)} text="Belangrijkste productwaarde-signaal" />
        <MetricCard label="Affiliate clicks" value={formatNumber(analytics.affiliateClicks)} text="Demo, nog niet gekoppeld aan echte tracking" />
        <MetricCard label="Schoenen" value={`${workspace.stats.shoeCount}/${workspace.stats.targetShoeCount}`} text="MVP-doel voor marktdekking" />
        <MetricCard label="Merken" value={String(workspace.stats.brandCount)} text="Actieve merken met modellen" />
        <MetricCard label="Verified offers" value={`${workspace.stats.verifiedOfferCount}/${workspace.stats.offerCount}`} text="Publiek toonbare winkelprijzen" />
        <MetricCard label="Afbeeldingen" value={`${workspace.stats.imageCoverage}%`} text="Productfoto-dekking" />
      </section>

      <section className="admin-dashboard-stack" aria-label="Admin dashboard onderdelen">
        <DashboardSection title="Database readiness" eyebrow="Databron" summary={databaseSourceLabel} defaultOpen>
          <div className="admin-grid-two compact">
            <div className="admin-check-list">
              <div className="admin-check-row">
                <span className="check-icon passed" aria-hidden="true" />
                <div>
                  <strong>Databron</strong>
                  <span>{databaseSourceLabel}. De admin toont geen sleutels, project-URL's of technische foutdetails.</span>
                </div>
              </div>
              <div className="admin-check-row">
                <span className={supabaseHealth.reachable ? "check-icon passed" : "check-icon failed"} aria-hidden="true" />
                <div>
                  <strong>Supabase bereikbaar</strong>
                  <span>{databaseReadiness.status}</span>
                </div>
              </div>
              <div className="admin-check-row">
                <span className="check-icon passed" aria-hidden="true" />
                <div>
                  <strong>Eerstvolgende actie</strong>
                  <span>{databaseReadiness.nextAction}</span>
                </div>
              </div>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th scope="col">Onderdeel</th>
                    <th scope="col">Tabel</th>
                    <th scope="col">Records</th>
                  </tr>
                </thead>
                <tbody>
                  {databaseCounts.map((item) => (
                    <tr key={item.table}>
                      <th scope="row">
                        <span>{item.label}</span>
                        <small>Beschikbaar voor admincontrole</small>
                      </th>
                      <td>{item.table}</td>
                      <td>{formatNumber(item.count)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="admin-note-inline">
            Deze check is bedoeld als rustige publicatiecontrole: klopt de bron, is de database bereikbaar en is er genoeg basisdata om schoenen, prijzen en filters te beoordelen?
          </p>
        </DashboardSection>

        <DashboardSection title="Analytics en bezoekersgedrag" eyebrow="Dashboarding" summary={`${formatNumber(analytics.pageViews)} pageviews, ${formatNumber(analytics.comparisonStarts)} vergelijkingstarts`} defaultOpen>
          <div className="admin-grid-two compact">
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th scope="col">Top pagina</th>
                    <th scope="col">Bezoekers</th>
                    <th scope="col">Pageviews</th>
                    <th scope="col">Signaal</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.topPages.map((page) => (
                    <tr key={page.path}>
                      <th scope="row">
                        <span>{page.title}</span>
                        <small>{page.path}</small>
                      </th>
                      <td>{formatNumber(page.visitors)}</td>
                      <td>{formatNumber(page.pageViews)}</td>
                      <td>{analyticsSignalLabels[page.conversionSignal]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="admin-check-list">
              {analytics.funnel.map((step) => (
                <div className="admin-profile-row" key={step.id}>
                  <div>
                    <strong>{step.label}</strong>
                    <span>{step.conversionRateFromPrevious === null ? "Startpunt" : `${Math.round(step.conversionRateFromPrevious * 100)}% vanaf vorige stap`}</span>
                  </div>
                  <div>
                    <strong>{formatNumber(step.visitors)}</strong>
                    <span>sessies</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DashboardSection>

        <DashboardSection title="Admin accounts" eyebrow="Beheer" summary={`${accounts.length} accounts, ${accounts.filter((account) => account.status === "active").length} actief`} defaultOpen>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col">Account</th>
                  <th scope="col">Rol</th>
                  <th scope="col">Status</th>
                  <th scope="col">MFA</th>
                  <th scope="col">Laatste login</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id}>
                    <th scope="row">
                      <span>{account.name}</span>
                      <small>{account.email} · {account.seedStatus === "demo_seed" ? "demo-account" : "account"}</small>
                    </th>
                    <td>{accountRoleLabels[account.role]}</td>
                    <td>{accountStatusLabels[account.status]}</td>
                    <td>{mfaLabels[account.mfaStatus]}</td>
                    <td>{account.lastLoginAt ? formatDate(account.lastLoginAt) : "Nog niet ingelogd"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="admin-note-inline">Het professionele owner-account is als seedrecord aangemaakt. De huidige MVP-login blijft nog wachtwoordgebaseerd; echte gebruikersrollen vragen later database-authenticatie.</p>
        </DashboardSection>

        <DashboardSection title="Issues die vertrouwen raken" eyebrow="Werkvoorraad" summary={`${workspace.issues.length} open issues, ${highIssueCount} hoog`}>
          <div className="admin-issue-list">
            {workspace.issues.map((issue) => (
              <article className="admin-issue" key={issue.id}>
                <div>
                  <span className={`issue-badge ${severityClassNames[issue.severity]}`}>{severityLabels[issue.severity]}</span>
                  <span className="issue-owner">{issue.owner}</span>
                </div>
                <h3>{issue.title}</h3>
                <p>{issue.detail}</p>
              </article>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection title="Minimale kwaliteitschecks" eyebrow="Publicatiepoort" summary={`${workspace.readyChecks.filter((check) => check.passed).length}/${workspace.readyChecks.length} checks geslaagd`}>
          <div className="admin-check-list">
            {workspace.readyChecks.map((check) => (
              <div className="admin-check-row" key={check.label}>
                <span className={check.passed ? "check-icon passed" : "check-icon failed"} aria-hidden="true" />
                <div>
                  <strong>{check.label}</strong>
                  <span>{check.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection title="Spreiding per schoentype" eyebrow="Marktdekking" summary={`${workspace.stats.shoeCount} modellen over ${workspace.stats.brandCount} merken`}>
          <div className="admin-bars">
            {typeOrder.map((type) => {
              const count = workspace.typeCounts[type] ?? 0;
              return (
                <div className="admin-bar-row" key={type}>
                  <div>
                    <strong>{labels.shoeType[type]}</strong>
                    <span>{count} modellen</span>
                  </div>
                  <div aria-hidden="true">
                    <span style={{ width: `${Math.min(100, count * 18)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </DashboardSection>

        <DashboardSection title="Dekking voor kernprofielen" eyebrow="Keuzehulp" summary={`${workspace.recommendationCoverage.length} profielen getest`}>
          <div className="admin-check-list">
            {workspace.recommendationCoverage.map((item) => (
              <div className="admin-profile-row" key={item.label}>
                <div>
                  <strong>{item.label}</strong>
                  <span>{item.topShoe}</span>
                </div>
                <div>
                  <strong>{item.topMatch}%</strong>
                  <span>{item.resultCount} matches</span>
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection title="Redactionele datalijst" eyebrow="Schoenenbeheer" summary={`${workspace.shoes.length} schoenen in beheer`}>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col">Schoen</th>
                  <th scope="col">Type</th>
                  <th scope="col">Score</th>
                  <th scope="col">Datastatus</th>
                  <th scope="col">Scorestatus</th>
                  <th scope="col">Prijs vanaf</th>
                  <th scope="col">Offers</th>
                  <th scope="col">Afbeelding</th>
                  <th scope="col">Actie</th>
                </tr>
              </thead>
              <tbody>
                {workspace.shoes.map((shoe) => (
                  <tr key={shoe.id}>
                    <th scope="row">
                      <span>{shoe.fullName}</span>
                      <small>{shoe.brand} · {shoe.releaseYear}</small>
                    </th>
                    <td>{labels.shoeType[shoe.shoeType]}</td>
                    <td>{shoe.editorialScore.overall.toFixed(1)}</td>
                    <td>{statusLabels.data[shoe.dataStatus]}</td>
                    <td>{statusLabels.score[shoe.scoreStatus]}</td>
                    <td>{formatPrice(shoe.priceFrom)}</td>
                    <td>{shoe.retailerCount}</td>
                    <td>{shoe.imageUrl ? "Aanwezig" : "Mist"}</td>
                    <td>
                      <Link href={`/schoenen/${shoe.slug}`}>Bekijk</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardSection>
      </section>
    </main>
  );
}

const analyticsSignalLabels = {
  choice_helper: "Keuzehulp",
  comparison: "Vergelijken",
  affiliate_click: "Retailerklik",
  newsletter: "Nieuwsbrief",
  content: "Content"
} as const;

const accountRoleLabels = {
  owner: "Eigenaar",
  product_owner: "Product owner",
  editor: "Redactie",
  data_manager: "Databeheer",
  support: "Support"
} as const;

const accountStatusLabels = {
  active: "Actief",
  invited: "Uitgenodigd",
  disabled: "Uitgeschakeld"
} as const;

const mfaLabels = {
  enabled: "Ingeschakeld",
  pending: "Nog instellen",
  disabled: "Uit"
} as const;

const statusLabels = {
  data: {
    draft: "Concept",
    needs_review: "Controle nodig",
    verified: "Geverifieerd"
  },
  score: {
    seed_estimate: "Seed-inschatting",
    editorial_reviewed: "Redactioneel gecontroleerd",
    tested: "Getest"
  }
} as const;

function MetricCard({ label, text, value }: { label: string; text: string; value: string }) {
  return (
    <article className="admin-metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{text}</p>
    </article>
  );
}

function DashboardSection({
  children,
  defaultOpen = false,
  eyebrow,
  summary,
  title
}: {
  children: ReactNode;
  defaultOpen?: boolean;
  eyebrow: string;
  summary: string;
  title: string;
}) {
  return (
    <details className="admin-dashboard-section" open={defaultOpen}>
      <summary>
        <span>
          <small>{eyebrow}</small>
          <strong>{title}</strong>
        </span>
        <em>{summary}</em>
      </summary>
      <div className="admin-dashboard-section-content">{children}</div>
    </details>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("nl-NL").format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("nl-NL", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

function getDatabaseReadinessCopy(supabaseHealth: Awaited<ReturnType<typeof getSupabaseHealth>>) {
  if (!supabaseHealth.configured) {
    return {
      status: "Nog niet gekoppeld. De admin blijft bruikbaar met lokale seeddata voor product- en prijscontrole.",
      nextAction: "Koppel de Supabase-omgeving en herhaal daarna de readiness-check."
    };
  }

  if (!supabaseHealth.reachable) {
    return {
      status: "Supabase is ingesteld, maar de basiscontrole kan de database nu niet bereiken.",
      nextAction: "Controleer de Supabase-instellingen en database-rechten voordat imports of publicatiebeslissingen op echte data leunen."
    };
  }

  return {
    status: "Supabase is bereikbaar. De basiscontrole op de databaseverbinding is geslaagd.",
    nextAction: "Gebruik de record counts om te controleren of seeddata, imports en publieke filters logisch gevuld zijn."
  };
}

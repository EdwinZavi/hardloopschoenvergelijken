import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";
import { reviewFeedRecord } from "@/app/admin/actions";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAdminImport, getAdminImportStaticParams } from "@/lib/admin-imports";
import { getImportReviewState } from "@/lib/admin-review-state";
import { formatPrice } from "@/lib/labels";
import type { AdminImportRow } from "@/lib/admin-imports";
import type { FeedRecordReviewAction, FeedRecordReviewDecision } from "@/types/feed";

type AdminImportDetailProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export function generateStaticParams() {
  return getAdminImportStaticParams();
}

export default async function AdminImportDetailPage({ params, searchParams }: AdminImportDetailProps) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const { id } = await params;
  const query = await searchParams;
  const feedImport = await getAdminImport(id);

  if (!feedImport) notFound();

  const filters = parseImportFilters(query);
  const filterQuery = buildFilterQuery(filters);
  const returnTo = filterQuery ? `/admin/imports/${feedImport.id}?${filterQuery}` : `/admin/imports/${feedImport.id}`;
  const reviewState = await getImportReviewState();
  const reviewDecisions = reviewState[feedImport.id] ?? {};
  const filteredRows = filterImportRows(feedImport.rows, filters);
  const matchReviewRows = filteredRows.filter((row) => row.matchConfidence !== "exact" || row.warnings.length > 0);
  const imageReviewRows = filteredRows.filter((row) => row.imageCandidate || row.warnings.includes("Geen afbeeldingskandidaat"));
  const reviewedVisibleRows = filteredRows.filter((row) => reviewDecisions[recordKeyForRow(row)]).length;

  return (
    <main className="admin-workspace">
      <section className="admin-hero">
        <div>
          <p className="eyebrow">Importdetail</p>
          <h1>{feedImport.sourceName}</h1>
          <p className="lead">
            Bekijk hoe ruwe feedregels worden vertaald naar offer-kandidaten, afbeeldingkandidaten en schoenmatches. Geen record uit deze import staat automatisch publiek; review beschermt de stap naar verified offer.
          </p>
          <div className="actions">
            <Link className="button" href="/admin/imports">
              Terug naar imports
            </Link>
            <Link className="button secondary" href="/admin">
              Dataworkspace
            </Link>
          </div>
        </div>
        <aside className="admin-status-panel">
          <span className={feedImport.stats.warnings ? "status-dot danger" : "status-dot ok"} />
          <p className="eyebrow">Importkwaliteit</p>
          <h2>{feedImport.stats.qualityScore}% kwaliteitsscore</h2>
          <p>
            {feedImport.stats.publishable}/{feedImport.stats.totalRecords} records zijn kandidaat voor offer-staging na controle van match, prijs, URL en bronstatus.
          </p>
          <p>{Object.keys(reviewDecisions).length} record(s) hebben een adminbeslissing in deze sessie.</p>
        </aside>
      </section>

      <section className="admin-grid-two" aria-label="TradeTracker review guardrails">
        <div className="admin-check-list">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Readiness-flow</p>
              <h2>Publicatie blijft geblokkeerd tot review rond is</h2>
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
          <h2>Werk eerst de open reviewregels af</h2>
          <p>
            Start bij records met warnings, lage confidence of ontbrekende match. Keur alleen offer-kandidaten goed wanneer productmatch, retailerlink, prijs en bron betrouwbaar zijn.
          </p>
          <p>Goedkeuren in deze MVP betekent offer-staging, niet publieke publicatie.</p>
        </aside>
      </section>

      <section className="admin-metric-grid" aria-label="Importstatistieken">
        <MetricCard label="Records" value={String(feedImport.stats.totalRecords)} text="Ruwe feedregels" />
        <MetricCard label="Offers" value={String(feedImport.stats.normalizedOffers)} text="Genormaliseerde offers" />
        <MetricCard label="Images" value={String(feedImport.stats.imageCandidates)} text="Afbeeldingkandidaten" />
        <MetricCard label="Warnings" value={String(feedImport.stats.warnings)} text="Controlepunten" />
      </section>

      <section className="admin-grid-two">
        <div className="admin-bars">
          <div className="admin-bar-row">
            <div>
              <strong>Exacte matches</strong>
              <span>{feedImport.stats.exactMatches}</span>
            </div>
            <div aria-hidden="true">
              <span style={{ width: barWidth(feedImport.stats.exactMatches, feedImport.stats.totalRecords) }} />
            </div>
          </div>
          <div className="admin-bar-row">
            <div>
              <strong>Hoge matches</strong>
              <span>{feedImport.stats.highMatches}</span>
            </div>
            <div aria-hidden="true">
              <span style={{ width: barWidth(feedImport.stats.highMatches, feedImport.stats.totalRecords) }} />
            </div>
          </div>
          <div className="admin-bar-row">
            <div>
              <strong>Middel matches</strong>
              <span>{feedImport.stats.mediumMatches}</span>
            </div>
            <div aria-hidden="true">
              <span style={{ width: barWidth(feedImport.stats.mediumMatches, feedImport.stats.totalRecords) }} />
            </div>
          </div>
          <div className="admin-bar-row">
            <div>
              <strong>Lage of geen matches</strong>
              <span>{feedImport.stats.lowMatches + feedImport.stats.noMatches}</span>
            </div>
            <div aria-hidden="true">
              <span style={{ width: barWidth(feedImport.stats.lowMatches + feedImport.stats.noMatches, feedImport.stats.totalRecords) }} />
            </div>
          </div>
        </div>

        <div className="admin-check-list">
          <div className="admin-check-row">
            <span className="check-icon passed" aria-hidden="true" />
            <div>
              <strong>Normalisatie-preview actief</strong>
              <span>Prijs, URL, beschikbaarheid, affiliatebron en afbeeldingkandidaat worden los bekeken.</span>
            </div>
          </div>
          <div className="admin-check-row">
            <span className="check-icon failed" aria-hidden="true" />
            <div>
              <strong>Nog geen publicatieknoppen</strong>
              <span>Deze pagina kan records beoordelen, maar schrijft nog geen publieke offers weg.</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Reviewfilters</p>
            <h2>Vind snel de records die aandacht nodig hebben</h2>
          </div>
          <Link href={`/admin/imports/${feedImport.id}`}>Filters wissen</Link>
        </div>
        <form action={`/admin/imports/${feedImport.id}`} className="admin-filter-form">
          <label>
            <span>Warnings</span>
            <select name="warnings" defaultValue={filters.warnings}>
              <option value="all">Alle records</option>
              <option value="with_warnings">Alleen met warnings</option>
              <option value="without_warnings">Zonder warnings</option>
            </select>
          </label>
          <label>
            <span>Match confidence</span>
            <select name="confidence" defaultValue={filters.confidence}>
              <option value="all">Alle niveaus</option>
              <option value="exact">Exact</option>
              <option value="high">Hoog</option>
              <option value="medium">Middel</option>
              <option value="low">Laag</option>
              <option value="none">Geen match</option>
            </select>
          </label>
          <label>
            <span>Afbeelding</span>
            <select name="image" defaultValue={filters.image}>
              <option value="all">Alle records</option>
              <option value="with_image">Met kandidaat</option>
              <option value="without_image">Zonder kandidaat</option>
            </select>
          </label>
          <label>
            <span>Stagingstatus</span>
            <select name="publishable" defaultValue={filters.publishable}>
              <option value="all">Alle records</option>
              <option value="yes">Kandidaat voor offer-staging</option>
              <option value="no">Geblokkeerd</option>
            </select>
          </label>
          <button className="button" type="submit">
            Filter records
          </button>
          <p>{filteredRows.length}/{feedImport.rows.length} records zichtbaar</p>
        </form>
      </section>

      <section className="admin-review-summary">
        <div>
          <p className="eyebrow">Reviewstatus</p>
          <h2>{reviewedVisibleRows}/{filteredRows.length} zichtbare records beoordeeld</h2>
          <p>
            Deze MVP slaat reviewbeslissingen op in je admin-sessie. Later verplaatsen we dit naar de database met auditlog, rollen en publicatiegeschiedenis voordat TradeTracker live mag publiceren.
          </p>
        </div>
        <div className="admin-review-legend">
          <span><strong>Goedkeuren</strong> Alleen voor staging-kandidaten; dit is nog geen publieke publicatie.</span>
          <span><strong>Handmatig matchen</strong> Voor lage confidence, ontbrekende matches of varianten.</span>
          <span><strong>Afwijzen/negeren</strong> Houdt rommelige feedregels uit de publieke site.</span>
        </div>
      </section>

      <section className="admin-grid-two">
        <div>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Shoe matching</p>
              <h2>Match-review queue</h2>
            </div>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table review-table">
              <thead>
                <tr>
                  <th scope="col">Feedrecord</th>
                  <th scope="col">Voorgestelde match</th>
                  <th scope="col">Confidence</th>
                  <th scope="col">Reviewadvies</th>
                  <th scope="col">Beslissing</th>
                  <th scope="col">Actie</th>
                </tr>
              </thead>
              <tbody>
                {matchReviewRows.length ? matchReviewRows.map((row) => (
                  <tr key={`match-${recordKeyForRow(row)}`}>
                    <th scope="row">
                      <span>{row.record.productName ?? "Naam ontbreekt"}</span>
                      <small>{row.record.brand ?? "Merk onbekend"} · {row.record.model ?? "model onbekend"} {row.record.version ?? ""}</small>
                    </th>
                    <td>
                      <div className="admin-cell-stack">
                        <strong>{row.matchedShoe?.fullName ?? "Geen automatische match"}</strong>
                        <ul className="match-reason-list">
                          {row.matchReasons.map((reason) => (
                            <li key={reason}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                    </td>
                    <td>
                      <span className={`match-badge match-${row.matchConfidence}`}>{matchLabels[row.matchConfidence]}</span>
                    </td>
                    <td>{getMatchReviewAdvice(row)}</td>
                    <td><ReviewDecisionBadge decision={reviewDecisions[recordKeyForRow(row)]} /></td>
                    <td>
                      <ReviewActions row={row} importId={feedImport.id} returnTo={returnTo} />
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6}>Geen matchrecords binnen deze filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Beeldcontrole</p>
              <h2>Image candidate review</h2>
            </div>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table review-table">
              <thead>
                <tr>
                  <th scope="col">Record</th>
                  <th scope="col">Bron</th>
                  <th scope="col">Licentie</th>
                  <th scope="col">Reviewadvies</th>
                </tr>
              </thead>
              <tbody>
                {imageReviewRows.length ? imageReviewRows.map((row) => (
                  <tr key={`image-${row.record.externalId ?? row.index}`}>
                    <th scope="row">
                      <span>{row.record.productName ?? "Naam ontbreekt"}</span>
                      <small>{row.matchedShoe?.fullName ?? "Nog geen schoenmatch"}</small>
                    </th>
                    <td>{row.imageCandidate?.sourceType ?? "Geen kandidaat"}</td>
                    <td>{row.imageCandidate?.licenseStatus ?? "Niet beoordeeld"}</td>
                    <td>{getImageReviewAdvice(row)}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4}>Geen beeldrecords binnen deze filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Normalisatie-preview</p>
            <h2>Feedrecords en publicatieblokkades</h2>
          </div>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table import-table">
            <thead>
              <tr>
                <th scope="col">Raw feedrecord</th>
                <th scope="col">Genormaliseerd offer</th>
                <th scope="col">Match</th>
                <th scope="col">Afbeelding</th>
                <th scope="col">Warnings</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length ? filteredRows.map((row) => (
                <tr key={row.record.externalId ?? row.index}>
                  <th scope="row">
                    <span>{row.record.productName ?? "Naam ontbreekt"}</span>
                    <small>{row.record.brand ?? "Merk onbekend"} · {row.record.externalId ?? `record-${row.index}`}</small>
                  </th>
                  <td>
                    {row.normalizedOffer ? (
                      <div className="admin-cell-stack">
                        <strong>{formatPrice(row.normalizedOffer.price)}</strong>
                        <span>{row.normalizedOffer.retailer}</span>
                        <small>{row.normalizedOffer.availability} · {row.normalizedOffer.sourceType}</small>
                      </div>
                    ) : (
                      <span className="muted-text">Geen offer-kandidaat</span>
                    )}
                  </td>
                  <td>
                    <div className="admin-cell-stack">
                      <strong>{row.matchedShoe?.fullName ?? "Geen match"}</strong>
                      <span className={`match-badge match-${row.matchConfidence}`}>{matchLabels[row.matchConfidence]}</span>
                      <small>{row.matchReasons[0]}</small>
                    </div>
                  </td>
                  <td>
                    {row.imageCandidate ? (
                      <div className="admin-cell-stack">
                        <strong>{row.imageCandidate.imageStatus}</strong>
                        <span>{row.imageCandidate.sourceType}</span>
                        <small>{row.imageCandidate.licenseStatus}</small>
                      </div>
                    ) : (
                      <span className="muted-text">Geen afbeelding</span>
                    )}
                  </td>
                  <td>
                    {row.warnings.length ? (
                      <ul className="admin-warning-list">
                        {row.warnings.map((warning) => (
                          <li key={warning}>{warning}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="muted-text">Geen warnings</span>
                    )}
                  </td>
                  <td>{row.publishable ? "Kandidaat voor offer-staging" : "Geblokkeerd"}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6}>Geen feedrecords binnen deze filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

const matchLabels = {
  none: "Geen",
  low: "Laag",
  medium: "Middel",
  high: "Hoog",
  exact: "Exact"
} as const;

const readinessSteps = [
  {
    title: "Raw feed",
    description: "De oorspronkelijke feedregel blijft zichtbaar als controlebron en wordt niet direct aan bezoekers getoond."
  },
  {
    title: "Normalisatie",
    description: "Prijs, retailer, URL, beschikbaarheid en beeldkandidaat worden als aparte velden beoordeeld."
  },
  {
    title: "Matching",
    description: "Elke schoenmatch toont confidence, redenen en eventuele warnings voordat een beheerder beslist."
  },
  {
    title: "Review",
    description: "De admin kiest per record voor offer-staging, handmatige match, afwijzing of negeren."
  },
  {
    title: "Verified offer",
    description: "Een offer mag pas publiek worden na database-backed verificatie, auditlog en publicatieregel."
  }
] as const;

type ImportFilters = {
  warnings: "all" | "with_warnings" | "without_warnings";
  confidence: "all" | "none" | "low" | "medium" | "high" | "exact";
  image: "all" | "with_image" | "without_image";
  publishable: "all" | "yes" | "no";
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseImportFilters(params: Record<string, string | string[] | undefined>): ImportFilters {
  const warnings = firstValue(params.warnings);
  const confidence = firstValue(params.confidence);
  const image = firstValue(params.image);
  const publishable = firstValue(params.publishable);

  return {
    warnings: warnings === "with_warnings" || warnings === "without_warnings" ? warnings : "all",
    confidence: confidence === "none" || confidence === "low" || confidence === "medium" || confidence === "high" || confidence === "exact" ? confidence : "all",
    image: image === "with_image" || image === "without_image" ? image : "all",
    publishable: publishable === "yes" || publishable === "no" ? publishable : "all"
  };
}

function filterImportRows(rows: AdminImportRow[], filters: ImportFilters) {
  return rows.filter((row) => {
    if (filters.warnings === "with_warnings" && row.warnings.length === 0) return false;
    if (filters.warnings === "without_warnings" && row.warnings.length > 0) return false;
    if (filters.confidence !== "all" && row.matchConfidence !== filters.confidence) return false;
    if (filters.image === "with_image" && !row.imageCandidate) return false;
    if (filters.image === "without_image" && row.imageCandidate) return false;
    if (filters.publishable === "yes" && !row.publishable) return false;
    if (filters.publishable === "no" && row.publishable) return false;
    return true;
  });
}

function buildFilterQuery(filters: ImportFilters) {
  const params = new URLSearchParams();
  if (filters.warnings !== "all") params.set("warnings", filters.warnings);
  if (filters.confidence !== "all") params.set("confidence", filters.confidence);
  if (filters.image !== "all") params.set("image", filters.image);
  if (filters.publishable !== "all") params.set("publishable", filters.publishable);
  return params.toString();
}

function recordKeyForRow(row: AdminImportRow) {
  return row.record.externalId ?? `record-${row.index}`;
}

function barWidth(value: number, total: number) {
  return `${total ? Math.round((value / total) * 100) : 0}%`;
}

function getMatchReviewAdvice(row: AdminImportRow) {
  if (!row.matchedShoe) return "Handmatig aan bestaande schoen koppelen.";
  if (row.warnings.length) return "Los eerst warnings op voordat dit een staging-kandidaat wordt.";
  if (row.matchConfidence === "low") return "Controleer merk, model en versie handmatig.";
  if (row.matchConfidence === "medium") return "Controleer vooral versie en variant.";
  if (row.matchConfidence === "high") return "Kan later snel door review.";
  return "Exacte match, alleen steekproefcontrole nodig.";
}

function getImageReviewAdvice(row: AdminImportRow) {
  if (!row.imageCandidate) return "Geen beeldkandidaat beschikbaar; laat publieke placeholder staan.";
  if (!row.matchedShoe) return "Eerst schoenmatch bepalen voordat beeld beoordeeld wordt.";
  if (row.matchConfidence === "low" || row.matchConfidence === "none") return "Beeld nog niet vertrouwen door zwakke productmatch.";
  return "Controleer model, kleurvariant, uitsnede en feedrechten.";
}

const reviewActionLabels: Record<FeedRecordReviewAction, string> = {
  approve_offer_candidate: "Goedgekeurd voor offer-staging",
  reject_offer_candidate: "Afgewezen",
  needs_manual_match: "Handmatige match nodig",
  ignore_record: "Genegeerd",
  approve_image_candidate: "Beeldkandidaat goedgekeurd",
  reject_image_candidate: "Beeldkandidaat afgewezen"
};

function ReviewDecisionBadge({ decision }: { decision?: FeedRecordReviewDecision }) {
  if (!decision) return <span className="review-decision-badge review-open">Open</span>;

  return (
    <span className={`review-decision-badge review-${decision.action}`}>
      {reviewActionLabels[decision.action]}
    </span>
  );
}

function ReviewActions({ importId, returnTo, row }: { importId: string; returnTo: string; row: AdminImportRow }) {
  const recordKey = recordKeyForRow(row);

  return (
    <div className="review-action-group">
      {row.publishable ? (
        <ReviewActionButton action="approve_offer_candidate" importId={importId} recordKey={recordKey} returnTo={returnTo}>
          Goedkeuren
        </ReviewActionButton>
      ) : (
        <span className="review-action-disabled">Goedkeuren geblokkeerd</span>
      )}
      {row.normalizedOffer ? (
        <ReviewActionButton action="reject_offer_candidate" importId={importId} recordKey={recordKey} returnTo={returnTo}>
          Afwijzen
        </ReviewActionButton>
      ) : null}
      <ReviewActionButton action="needs_manual_match" importId={importId} recordKey={recordKey} returnTo={returnTo}>
        Handmatig
      </ReviewActionButton>
      <ReviewActionButton action="ignore_record" importId={importId} recordKey={recordKey} returnTo={returnTo}>
        Negeren
      </ReviewActionButton>
    </div>
  );
}

function ReviewActionButton({
  action,
  children,
  importId,
  recordKey,
  returnTo
}: {
  action: FeedRecordReviewAction;
  children: ReactNode;
  importId: string;
  recordKey: string;
  returnTo: string;
}) {
  return (
    <form action={reviewFeedRecord}>
      <input name="importId" type="hidden" value={importId} />
      <input name="recordKey" type="hidden" value={recordKey} />
      <input name="action" type="hidden" value={action} />
      <input name="returnTo" type="hidden" value={returnTo} />
      <button type="submit">{children}</button>
    </form>
  );
}

function MetricCard({ label, text, value }: { label: string; text: string; value: string }) {
  return (
    <article className="admin-metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{text}</p>
    </article>
  );
}

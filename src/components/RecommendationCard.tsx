import Link from "next/link";
import { formatPrice } from "@/lib/labels";
import { ShoeVisual } from "@/components/ShoeVisual";
import type { EnrichedShoe } from "@/types/product";
import type { RecommendationResult } from "@/types/recommendation";

type RecommendationCardProps = {
  shoe: EnrichedShoe;
  result: RecommendationResult;
};

export function RecommendationCard({ shoe, result }: RecommendationCardProps) {
  return (
    <article className="product-card recommendation-card">
      <ShoeVisual shoe={shoe} />
      <div className="score-row">
        <span className="match-score">Match {result.matchScore}%</span>
        <span>Voorlopige score {shoe.editorialScore.overall.toFixed(1)}</span>
      </div>
      <h3>{shoe.fullName}</h3>
      <div className="advice-marker">
        <strong>Waarom deze past</strong>
        <span>{result.primaryReason}</span>
      </div>
      <p>{result.secondaryReason}</p>
      <p className="tradeoff"><strong>Let op:</strong> {result.tradeoffNote}</p>
      <div className="card-footer">
        <strong>{result.label}</strong>
        <span>{shoe.priceFrom === null ? formatPrice(shoe.priceFrom) : `Vanaf ${formatPrice(shoe.priceFrom)}`}</span>
      </div>
      <div className="card-actions">
        <Link href={`/schoenen/${shoe.slug}`}>Bekijk uitleg</Link>
        <Link href={`/schoenen?compare=${shoe.id}`}>Vergelijk deze schoen</Link>
      </div>
    </article>
  );
}

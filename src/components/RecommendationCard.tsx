import Link from "next/link";
import Image from "next/image";
import { formatPrice, scoreStatusLabels } from "@/lib/labels";
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
      <span className="product-card-media">
        {shoe.imageUrl ? (
          <Image alt="" fill sizes="(max-width: 820px) 100vw, 280px" src={shoe.imageUrl} />
        ) : (
          <ShoeVisual shoe={shoe} />
        )}
      </span>
      <div className="score-row">
        <span className="match-score">Match {result.matchScore}%</span>
        <span>Score {shoe.editorialScore.overall.toFixed(1)}</span>
        <span className="score-status">{scoreStatusLabels[shoe.scoreStatus]}</span>
      </div>
      <h3>{shoe.fullName}</h3>
      <div className="advice-marker">
        <strong>Waarom deze op je profiel aansluit</strong>
        <span>{result.primaryReason}</span>
      </div>
      <p>{result.secondaryReason}</p>
      <p className="tradeoff"><strong>Let op:</strong> {result.tradeoffNote}</p>
      <div className="card-footer">
        <strong>{result.label}</strong>
        <span className={shoe.priceFrom === null ? "price-state price-state-empty" : "price-state"}>
          {shoe.priceFrom === null ? formatPrice(shoe.priceFrom) : `Vanaf ${formatPrice(shoe.priceFrom)}`}
        </span>
      </div>
      <div className="card-actions">
        <Link href={`/schoenen/${shoe.slug}`}>Bekijk de onderbouwing</Link>
        <Link href={`/schoenen?compare=${shoe.id}`}>Vergelijk deze schoen</Link>
      </div>
    </article>
  );
}

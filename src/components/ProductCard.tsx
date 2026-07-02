import Link from "next/link";
import Image from "next/image";
import { formatPrice, labels, scoreStatusLabels } from "@/lib/labels";
import { ShoeVisual } from "@/components/ShoeVisual";
import type { EnrichedShoe } from "@/types/product";

type ProductCardProps = {
  shoe: EnrichedShoe;
  compareHref?: string;
  compareLabel?: string;
  compareDisabled?: boolean;
};

export function ProductCard({ compareDisabled, compareHref, compareLabel, shoe }: ProductCardProps) {
  return (
    <article className="product-card">
      <span className="product-card-media">
        {shoe.imageUrl ? (
          <Image alt="" fill sizes="(max-width: 820px) 100vw, 280px" src={shoe.imageUrl} />
        ) : (
          <ShoeVisual shoe={shoe} />
        )}
      </span>
      <div>
        <p className="eyebrow">{shoe.brand}</p>
        <h3>{shoe.fullName}</h3>
        <p>{shoe.editorialVerdict.summary}</p>
      </div>
      <div className="advice-marker">
        <strong>Past vooral bij</strong>
        <span>{shoe.editorialVerdict.bestFor}</span>
      </div>
      <dl className="spec-grid">
        <div>
          <dt>Type</dt>
          <dd>{labels.shoeType[shoe.shoeType]}</dd>
        </div>
        <div>
          <dt>Demping</dt>
          <dd>{labels.level[shoe.cushioningLevel]}</dd>
        </div>
        <div>
          <dt>Steun</dt>
          <dd>{labels.supportType[shoe.supportType]}</dd>
        </div>
        <div>
          <dt>Drop</dt>
          <dd>{shoe.heelDropMm} mm</dd>
        </div>
      </dl>
      <div className="card-footer">
        <strong>Redactionele score {shoe.editorialScore.overall.toFixed(1)}</strong>
        <span className="score-status">{scoreStatusLabels[shoe.scoreStatus]}</span>
        <span className={shoe.priceFrom === null ? "price-state price-state-empty" : "price-state"}>
          {shoe.priceFrom === null ? formatPrice(shoe.priceFrom) : `Vanaf ${formatPrice(shoe.priceFrom)}`}
        </span>
        <Link href={`/schoenen/${shoe.slug}`}>Bekijk schoen</Link>
      </div>
      {compareHref && compareLabel && !compareDisabled ? <Link className="compare-link" href={compareHref}>{compareLabel}</Link> : null}
      {compareLabel && compareDisabled ? <span aria-disabled="true" className="compare-link disabled">{compareLabel}</span> : null}
    </article>
  );
}

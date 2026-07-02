import Link from "next/link";
import Image from "next/image";
import { ShoeVisual } from "@/components/ShoeVisual";
import { formatPrice, labels } from "@/lib/labels";
import type { EnrichedShoe } from "@/types/product";

type CompareShoePickerItemProps = {
  shoe: EnrichedShoe;
  isSelected: boolean;
  limitReached: boolean;
  compareHref: string;
  compareLabel: string;
};

const compactScoreStatusLabels: Record<EnrichedShoe["scoreStatus"], string> = {
  editorial_reviewed: "Gecontroleerd",
  seed_estimate: "Voorlopig",
  tested: "Getest"
};

function getPrimaryUseCaseLabel(value: string) {
  if (value in labels.primaryUseCase) {
    return labels.primaryUseCase[value as keyof typeof labels.primaryUseCase];
  }

  return value;
}

export function CompareShoePickerItem({
  compareHref,
  compareLabel,
  isSelected,
  limitReached,
  shoe
}: CompareShoePickerItemProps) {
  const actionDisabled = limitReached && !isSelected;
  const priceLabel = shoe.priceFrom === null ? "Prijs volgt" : `Vanaf ${formatPrice(shoe.priceFrom)}`;
  const selectionLabel = isSelected ? "In vergelijking" : actionDisabled ? "Limiet bereikt" : "Niet geselecteerd";

  return (
    <article
      className="compare-shoe-picker-item"
      data-limit-reached={actionDisabled ? "true" : undefined}
      data-selected={isSelected ? "true" : undefined}
    >
      <span className="compare-shoe-picker-item__media">
        {shoe.imageUrl ? (
          <Image alt="" fill sizes="76px" src={shoe.imageUrl} />
        ) : (
          <ShoeVisual shoe={shoe} size="compact" />
        )}
      </span>

      <div className="compare-shoe-picker-item__main">
        <div className="compare-shoe-picker-item__heading">
          <p className="eyebrow">{shoe.brand}</p>
          <h3>{shoe.fullName}</h3>
          <span className="compare-shoe-picker-item__state">{selectionLabel}</span>
        </div>

        <p className="compare-shoe-picker-item__type">
          {labels.shoeType[shoe.shoeType]} / {getPrimaryUseCaseLabel(shoe.primaryUseCase)}
        </p>

        <div className="compare-shoe-picker-item__meta" aria-label="Belangrijkste eigenschappen">
          <span>Steun: {labels.supportType[shoe.supportType]}</span>
          <span>Demping: {labels.level[shoe.cushioningLevel]}</span>
          <span>Pasvorm: {labels.width[shoe.widthLabel]}</span>
        </div>
      </div>

      <div className="compare-shoe-picker-item__aside">
        <div className="compare-shoe-picker-item__score">
          <strong>{shoe.editorialScore.overall.toFixed(1)}</strong>
          <span>{compactScoreStatusLabels[shoe.scoreStatus]}</span>
        </div>

        <span className={shoe.priceFrom === null ? "price-state price-state-empty" : "price-state"}>{priceLabel}</span>

        {actionDisabled ? (
          <span aria-disabled="true" className="compare-shoe-picker-item__action disabled">
            {compareLabel}
          </span>
        ) : (
          <Link className="compare-shoe-picker-item__action" href={compareHref} aria-label={`${compareLabel}: ${shoe.fullName}`}>
            {compareLabel}
          </Link>
        )}
      </div>
    </article>
  );
}

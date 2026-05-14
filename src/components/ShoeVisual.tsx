type ShoeVisualProps = {
  shoe: {
    fullName: string;
  };
  size?: "card" | "hero" | "compact";
};

export function ShoeVisual({ shoe, size = "card" }: ShoeVisualProps) {
  return (
    <figure aria-hidden="true" className={`shoe-visual ${size}`} data-shoe-name={shoe.fullName}>
      <span className="visual-route" aria-hidden="true" />
      <span className="visual-point visual-point-start" aria-hidden="true" />
      <span className="visual-point visual-point-end" aria-hidden="true" />
    </figure>
  );
}

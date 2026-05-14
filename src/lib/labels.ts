export const labels = {
  shoeType: {
    daily_trainer: "Allround trainingsschoen",
    tempo: "Snelle trainingsschoen",
    race: "Wedstrijdschoen",
    stability: "Schoen met extra steun",
    trail: "Trailschoen",
    recovery: "Schoen voor rustige trainingen"
  },
  surfaceType: {
    road: "Weg",
    track: "Baan",
    trail: "Onverhard",
    mixed: "Gemengd"
  },
  supportType: {
    neutral: "Neutraal",
    light_stability: "Lichte steun",
    stability: "Veel steun"
  },
  level: {
    low: "Laag",
    medium: "Gemiddeld",
    high: "Hoog"
  },
  width: {
    narrow: "Smal",
    regular: "Normaal",
    wide: "Breed"
  },
  availability: {
    in_stock: "Op voorraad",
    low_stock: "Beperkte voorraad",
    out_of_stock: "Niet op voorraad",
    unknown: "Voorraad onbekend"
  }
} as const;

export function formatPrice(price: number | null) {
  if (price === null) return "Nog geen gecontroleerde prijs";
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR"
  }).format(price);
}

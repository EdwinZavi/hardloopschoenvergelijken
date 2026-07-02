import type { ScoreStatus } from "@/types/product";

export const labels = {
  shoeType: {
    daily_trainer: "Allround trainingsschoen",
    tempo: "Snelle trainingsschoen",
    race: "Wedstrijdschoen",
    stability: "Schoen met extra steun",
    trail: "Trailschoen",
    recovery: "Schoen voor rustige trainingen"
  },
  primaryUseCase: {
    daily_trainer: "Dagelijkse training",
    tempo: "Tempo en interval",
    race: "Wedstrijd",
    trail: "Trailrunning",
    recovery: "Herstel en rustige kilometers",
    beginner_daily: "Beginner en eerste trainingen"
  },
  distanceBucket: {
    all_round: "Allround afstanden",
    "5k_10k": "5 km tot 10 km",
    "5k_half_marathon": "5 km tot halve marathon",
    "5k_marathon": "5 km tot marathon",
    "10k_marathon": "10 km tot marathon",
    "10k_ultra": "10 km tot ultra",
    half_marathon_plus: "Halve marathon en langer"
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

export const scoreStatusLabels: Record<ScoreStatus, string> = {
  seed_estimate: "Voorlopige score",
  editorial_reviewed: "Redactioneel gecontroleerd",
  tested: "Getest volgens methode"
};

export const scoreStatusDescriptions: Record<ScoreStatus, string> = {
  seed_estimate: "Gebaseerd op beschikbare productspecificaties en redactionele weging; nog niet volledig brongecontroleerd.",
  editorial_reviewed: "Productspecificaties en redactionele beoordeling zijn gecontroleerd volgens onze methode.",
  tested: "De score is gebaseerd op de gepubliceerde methode en aanvullende praktijk- of testcontrole."
};

export function formatPrice(price: number | null) {
  if (price === null) return "Prijs volgt";
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR"
  }).format(price);
}

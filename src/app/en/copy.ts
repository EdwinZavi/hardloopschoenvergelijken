export const enLabels = {
  shoeType: {
    daily_trainer: "Daily trainer",
    tempo: "Tempo trainer",
    race: "Race shoe",
    stability: "Stability shoe",
    trail: "Trail shoe",
    recovery: "Easy-run shoe"
  },
  surfaceType: {
    road: "Road",
    track: "Track",
    trail: "Trail",
    mixed: "Mixed"
  },
  supportType: {
    neutral: "Neutral",
    light_stability: "Light support",
    stability: "High support"
  },
  level: {
    low: "Low",
    medium: "Medium",
    high: "High"
  },
  width: {
    narrow: "Narrow",
    regular: "Regular",
    wide: "Wide"
  }
} as const;

export function formatEuro(price: number | null) {
  if (price === null) return "No verified price yet";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR"
  }).format(price);
}

export function formatEnglishReleaseLabel(shoe: { releaseDate?: string; releaseDatePrecision?: string; releaseMonth?: number; releaseYear: number }) {
  if (shoe.releaseDatePrecision === "day" && shoe.releaseDate) {
    const timestamp = Date.parse(shoe.releaseDate);

    if (!Number.isNaN(timestamp)) {
      return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(new Date(timestamp));
    }
  }

  if (shoe.releaseDatePrecision === "month" && shoe.releaseMonth) {
    return new Intl.DateTimeFormat("en-GB", {
      month: "long",
      year: "numeric"
    }).format(new Date(Date.UTC(shoe.releaseYear, shoe.releaseMonth - 1, 1)));
  }

  return String(shoe.releaseYear);
}

export const englishPages = {
  methodology: {
    eyebrow: "Methodology",
    title: "How we compare running shoes",
    intro:
      "We separate product characteristics, editorial judgment and retailer information. A shoe can score well and still be a poor fit for a specific runner.",
    bullets: [
      "Product data is structured around use case, cushioning, support, fit, weight, drop and price.",
      "Editorial scores are intended to explain trade-offs, not to crown one universal winner.",
      "Retailer prices are kept separate from product advice."
    ]
  },
  independence: {
    eyebrow: "Independence",
    title: "How we keep advice separate from commercial incentives",
    intro:
      "Hardloopschoenvergelijken.nl may later earn money through retailer links, but that may not determine editorial scores, shoe explanations or recommendation logic.",
    bullets: [
      "Product quality and retailer offers are different signals.",
      "A commission may never hide drawbacks or change a personal match.",
      "Commercial positions must be recognisable when they are used."
    ]
  },
  about: {
    eyebrow: "About",
    title: "Built to make running shoe decisions clearer",
    intro:
      "Hardloopschoenvergelijken.nl helps runners understand which shoes may suit their goals, feet, training and budget.",
    bullets: [
      "The platform focuses on the Dutch market first.",
      "The product promise is clarity, comparison and trust.",
      "The brand is managed by The Power of Trust."
    ]
  },
  contact: {
    eyebrow: "Contact",
    title: "Contact details",
    intro: "Hardloopschoenvergelijken.nl is managed by The Power of Trust.",
    bullets: [
      "Manager: The Power of Trust",
      "Chamber of Commerce number: 76612112",
      "Address: Pelikaanstraat 39, 9713 BW Groningen",
      "Email: info@hardloopschoenvergelijken.nl"
    ]
  },
  privacy: {
    eyebrow: "Privacy",
    title: "Privacy policy",
    intro:
      "We collect as little personal data as possible. The current public flow works without a personal account and uses URL-driven filters, comparisons and shoe finder answers.",
    bullets: [
      "Shoe Finder answers are used to show recommendations in the current flow.",
      "We do not use these answers to make medical diagnoses.",
      "Contact questions can be sent to info@hardloopschoenvergelijken.nl."
    ]
  },
  cookies: {
    eyebrow: "Cookies",
    title: "Cookie policy",
    intro:
      "The site should work without unnecessary tracking. If analytics or marketing cookies are introduced later, they need clear consent and explanation.",
    bullets: [
      "Essential technical cookies may be used for the site to function.",
      "Marketing or tracking cookies require a clear choice.",
      "Users must be able to change or withdraw consent."
    ]
  }
};

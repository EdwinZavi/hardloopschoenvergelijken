import "server-only";

import { existsSync } from "fs";
import { join } from "path";
import { brands, getEnrichedShoes, getOfferStatus, getShoeDataStatus, getShoeScoreStatus, offers, shoes } from "@/lib/data";
import { getRecommendations } from "@/lib/recommendations";
import type { EnrichedShoe, Offer, ShoeType } from "@/types/product";
import type { RecommendationProfile } from "@/types/recommendation";

export type AdminIssue = {
  id: string;
  title: string;
  detail: string;
  severity: "high" | "medium" | "low";
  owner: "Data" | "Redactie" | "Retail" | "Keuzehulp";
  href?: string;
};

const targetShoeCount = 30;
const allowedPrimaryUseCases = ["daily_trainer", "tempo", "race", "trail", "recovery"];
const allowedDistanceBuckets = ["all_round", "10k_marathon", "half_marathon_plus"];

const profileSamples: { label: string; profile: RecommendationProfile }[] = [
  {
    label: "Beginner op de weg",
    profile: {
      experienceLevel: "beginner",
      runningGoal: "start_running",
      targetDistance: "5k",
      weeklyFrequency: "1_2",
      preferredSurface: "road",
      preferredFeel: "balanced",
      supportNeed: "not_sure",
      injurySensitivity: "medium",
      fitPreference: "not_sure",
      budgetMax: 170
    }
  },
  {
    label: "Brede voeten",
    profile: {
      experienceLevel: "recreational",
      runningGoal: "general_fitness",
      targetDistance: "10k",
      weeklyFrequency: "3_4",
      preferredSurface: "road",
      preferredFeel: "soft",
      supportNeed: "not_sure",
      injurySensitivity: "medium",
      fitPreference: "wide",
      budgetMax: 190
    }
  },
  {
    label: "Stabiliteit nodig",
    profile: {
      experienceLevel: "recreational",
      runningGoal: "half_marathon_marathon",
      targetDistance: "half_marathon",
      weeklyFrequency: "3_4",
      preferredSurface: "road",
      preferredFeel: "balanced",
      supportNeed: "stability",
      injurySensitivity: "high",
      fitPreference: "regular",
      budgetMax: 210
    }
  },
  {
    label: "Sneller trainen",
    profile: {
      experienceLevel: "experienced",
      runningGoal: "faster_5k_10k",
      targetDistance: "10k",
      weeklyFrequency: "3_4",
      preferredSurface: "road",
      preferredFeel: "responsive",
      supportNeed: "neutral",
      injurySensitivity: "low",
      fitPreference: "regular",
      budgetMax: 230
    }
  },
  {
    label: "Trail",
    profile: {
      experienceLevel: "recreational",
      runningGoal: "trail_running",
      targetDistance: "trail",
      weeklyFrequency: "1_2",
      preferredSurface: "trail",
      preferredFeel: "balanced",
      supportNeed: "not_sure",
      injurySensitivity: "medium",
      fitPreference: "regular",
      budgetMax: 190
    }
  }
];

function publicFileExists(imageUrl: string) {
  const cleanPath = imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl;
  return existsSync(join(process.cwd(), "public", cleanPath));
}

function uniqueCount<T>(items: T[]) {
  return new Set(items).size;
}

function issueScore(severity: AdminIssue["severity"]) {
  if (severity === "high") return 3;
  if (severity === "medium") return 2;
  return 1;
}

function scoreCompleteness(shoe: EnrichedShoe) {
  const scoreValues = Object.values(shoe.editorialScore);
  return scoreValues.every((score) => Number.isFinite(score) && score >= 0 && score <= 10);
}

function offerIsPlaceholder(offer: Offer) {
  return getOfferStatus(offer) === "placeholder" || offer.url.includes("example.com");
}

function buildIssues(enrichedShoes: EnrichedShoe[]) {
  const issues: AdminIssue[] = [];
  const shoeIds = new Set(shoes.map((shoe) => shoe.id));
  const slugCounts = shoes.reduce<Record<string, number>>((acc, shoe) => {
    acc[shoe.slug] = (acc[shoe.slug] ?? 0) + 1;
    return acc;
  }, {});

  const missingImages = enrichedShoes.filter((shoe) => !shoe.imageUrl);
  if (missingImages.length) {
    issues.push({
      id: "missing-images",
      title: `${missingImages.length} schoenen missen een productafbeelding`,
      detail: missingImages.map((shoe) => shoe.fullName).join(", "),
      severity: "medium",
      owner: "Data"
    });
  }

  const brokenImages = enrichedShoes.filter((shoe) => shoe.imageUrl && !publicFileExists(shoe.imageUrl));
  if (brokenImages.length) {
    issues.push({
      id: "broken-images",
      title: `${brokenImages.length} afbeeldingpaden bestaan niet`,
      detail: brokenImages.map((shoe) => `${shoe.fullName}: ${shoe.imageUrl}`).join(", "),
      severity: "high",
      owner: "Data"
    });
  }

  const noOffers = enrichedShoes.filter((shoe) => shoe.retailerCount === 0);
  if (noOffers.length) {
    issues.push({
      id: "missing-offers",
      title: `${noOffers.length} schoenen hebben geen gecontroleerde retailer offers`,
      detail: noOffers.map((shoe) => shoe.fullName).join(", "),
      severity: "high",
      owner: "Retail"
    });
  }

  const placeholderOffers = offers.filter(offerIsPlaceholder);
  if (placeholderOffers.length) {
    issues.push({
      id: "placeholder-offers",
      title: `${placeholderOffers.length} offers gebruiken placeholderlinks`,
      detail: "Vervang example.com-links voordat je prijsvergelijking als echte kooplaag presenteert.",
      severity: "high",
      owner: "Retail"
    });
  }

  const productsNeedingReview = shoes.filter((shoe) => getShoeDataStatus(shoe) !== "verified");
  if (productsNeedingReview.length) {
    issues.push({
      id: "product-status-review",
      title: `${productsNeedingReview.length} schoenen zijn nog niet data-verified`,
      detail: "Gebruik dataStatus=verified pas wanneer productgegevens brongecontroleerd zijn.",
      severity: "medium",
      owner: "Data"
    });
  }

  const seedScores = shoes.filter((shoe) => getShoeScoreStatus(shoe) === "seed_estimate");
  if (seedScores.length) {
    issues.push({
      id: "seed-score-status",
      title: `${seedScores.length} schoenen hebben voorlopige seed-scores`,
      detail: "Gebruik scoreStatus=editorial_reviewed of tested pas na redactionele controle of echte testbasis.",
      severity: "medium",
      owner: "Redactie"
    });
  }

  const orphanOffers = offers.filter((offer) => !shoeIds.has(offer.shoeId));
  if (orphanOffers.length) {
    issues.push({
      id: "orphan-offers",
      title: `${orphanOffers.length} offers verwijzen naar een onbekende schoen`,
      detail: orphanOffers.map((offer) => `${offer.id} -> ${offer.shoeId}`).join(", "),
      severity: "high",
      owner: "Retail"
    });
  }

  const duplicateSlugs = Object.entries(slugCounts).filter(([, count]) => count > 1);
  if (duplicateSlugs.length) {
    issues.push({
      id: "duplicate-slugs",
      title: `${duplicateSlugs.length} dubbele slugs gevonden`,
      detail: duplicateSlugs.map(([slug]) => slug).join(", "),
      severity: "high",
      owner: "Data"
    });
  }

  const scoreProblems = enrichedShoes.filter((shoe) => !scoreCompleteness(shoe));
  if (scoreProblems.length) {
    issues.push({
      id: "score-problems",
      title: `${scoreProblems.length} schoenen hebben scorewaarden buiten 0-10`,
      detail: scoreProblems.map((shoe) => shoe.fullName).join(", "),
      severity: "high",
      owner: "Redactie"
    });
  }

  const unknownUseCases = enrichedShoes.filter((shoe) => !allowedPrimaryUseCases.includes(shoe.primaryUseCase));
  if (unknownUseCases.length) {
    issues.push({
      id: "unknown-primary-use-cases",
      title: `${unknownUseCases.length} schoenen gebruiken onbekende gebruikswaarden`,
      detail: unknownUseCases.map((shoe) => `${shoe.fullName}: ${shoe.primaryUseCase}`).join(", "),
      severity: "medium",
      owner: "Data"
    });
  }

  const unknownDistanceBuckets = enrichedShoes.filter((shoe) => !allowedDistanceBuckets.includes(shoe.distanceBucket));
  if (unknownDistanceBuckets.length) {
    issues.push({
      id: "unknown-distance-buckets",
      title: `${unknownDistanceBuckets.length} schoenen gebruiken afstandswaarden buiten de aanbevelingslogica`,
      detail: unknownDistanceBuckets.map((shoe) => `${shoe.fullName}: ${shoe.distanceBucket}`).join(", "),
      severity: "medium",
      owner: "Keuzehulp"
    });
  }

  const noStackHeight = enrichedShoes.filter((shoe) => !shoe.stackHeightHeelMm);
  if (noStackHeight.length) {
    issues.push({
      id: "missing-stack-height",
      title: `${noStackHeight.length} schoenen missen stack height`,
      detail: "Stack height helpt bij demping, bescherming en vergelijking voor langere afstanden.",
      severity: "low",
      owner: "Data"
    });
  }

  const shortVerdicts = enrichedShoes.filter(
    (shoe) =>
      shoe.editorialVerdict.summary.length < 70 ||
      shoe.editorialVerdict.bestFor.length < 70 ||
      shoe.editorialVerdict.lessSuitableFor.length < 55
  );
  if (shortVerdicts.length) {
    issues.push({
      id: "thin-verdicts",
      title: `${shortVerdicts.length} schoenen hebben dunne redactionele uitleg`,
      detail: "Verdicts moeten duidelijk uitleggen voor wie een schoen logisch of minder logisch is.",
      severity: "medium",
      owner: "Redactie"
    });
  }

  const typeCounts = countByType(enrichedShoes);
  if ((typeCounts.trail ?? 0) < 3) {
    issues.push({
      id: "trail-coverage",
      title: "Trail-dekking is nog te smal",
      detail: "Voeg minimaal 2 extra trailschoenen toe voordat trailadvies volwassen voelt.",
      severity: "medium",
      owner: "Data"
    });
  }

  if ((typeCounts.race ?? 0) < 3) {
    issues.push({
      id: "race-coverage",
      title: "Wedstrijdschoenen zijn ondervertegenwoordigd",
      detail: "Snelle lopers kunnen nu te weinig echte race-opties vergelijken.",
      severity: "low",
      owner: "Data"
    });
  }

  return issues.sort((a, b) => issueScore(b.severity) - issueScore(a.severity));
}

function countByType(enrichedShoes: EnrichedShoe[]) {
  return enrichedShoes.reduce<Partial<Record<ShoeType, number>>>((acc, shoe) => {
    acc[shoe.shoeType] = (acc[shoe.shoeType] ?? 0) + 1;
    return acc;
  }, {});
}

export function getAdminWorkspace() {
  const enrichedShoes = getEnrichedShoes();
  const issues = buildIssues(enrichedShoes);
  const typeCounts = countByType(enrichedShoes);
  const brandsWithShoes = uniqueCount(enrichedShoes.map((shoe) => shoe.brandId));
  const missingImageCount = enrichedShoes.filter((shoe) => !shoe.imageUrl).length;
  const placeholderOfferCount = offers.filter(offerIsPlaceholder).length;
  const verifiedOfferCount = offers.filter((offer) => getOfferStatus(offer) === "verified" && !offerIsPlaceholder(offer)).length;
  const verifiedProductCount = shoes.filter((shoe) => getShoeDataStatus(shoe) === "verified").length;
  const reviewedScoreCount = shoes.filter((shoe) => getShoeScoreStatus(shoe) !== "seed_estimate").length;
  const recommendationCoverage = profileSamples.map((sample) => {
    const recommendations = getRecommendations(sample.profile);
    const weakExplanationCount = recommendations.filter((item) => item.result.matchedFactors.length < 2).length;
    return {
      label: sample.label,
      resultCount: recommendations.length,
      weakExplanationCount,
      topMatch: recommendations[0]?.result.matchScore ?? 0,
      topShoe: recommendations[0]?.shoe.fullName ?? "Geen resultaat"
    };
  });

  const readyChecks = [
    {
      label: "Minimaal 30 schoenen",
      passed: enrichedShoes.length >= targetShoeCount,
      detail: `${enrichedShoes.length}/${targetShoeCount}`
    },
    {
      label: "Alle schoenen hebben offers",
      passed: enrichedShoes.every((shoe) => shoe.retailerCount > 0),
      detail: `${enrichedShoes.filter((shoe) => shoe.retailerCount > 0).length}/${enrichedShoes.length}`
    },
    {
      label: "Alle productafbeeldingen gevuld",
      passed: missingImageCount === 0,
      detail: `${enrichedShoes.length - missingImageCount}/${enrichedShoes.length}`
    },
    {
      label: "Geen placeholderlinks in offers",
      passed: placeholderOfferCount === 0,
      detail: `${placeholderOfferCount} placeholderlinks`
    },
    {
      label: "Productdata brongecontroleerd",
      passed: verifiedProductCount === enrichedShoes.length,
      detail: `${verifiedProductCount}/${enrichedShoes.length} verified`
    },
    {
      label: "Scores redactioneel gecontroleerd",
      passed: reviewedScoreCount === enrichedShoes.length,
      detail: `${reviewedScoreCount}/${enrichedShoes.length} gecontroleerd`
    },
    {
      label: "Keuzehulp geeft voor kernprofielen resultaat",
      passed: recommendationCoverage.every((item) => item.resultCount >= 3),
      detail: `${recommendationCoverage.filter((item) => item.resultCount >= 3).length}/${recommendationCoverage.length} profielen`
    },
    {
      label: "Aanbevelingen hebben minimaal 2 redenen",
      passed: recommendationCoverage.every((item) => item.weakExplanationCount === 0),
      detail: `${recommendationCoverage.reduce((sum, item) => sum + item.weakExplanationCount, 0)} zwakke uitleggevallen`
    }
  ];

  return {
    brands,
    shoes: enrichedShoes,
    offers,
    issues,
    stats: {
      shoeCount: enrichedShoes.length,
      brandCount: brandsWithShoes,
      offerCount: offers.length,
      imageCoverage: enrichedShoes.length ? Math.round(((enrichedShoes.length - missingImageCount) / enrichedShoes.length) * 100) : 0,
      averageRetailers: enrichedShoes.length ? offers.length / enrichedShoes.length : 0,
      placeholderOfferCount,
      verifiedOfferCount,
      verifiedProductCount,
      reviewedScoreCount,
      targetShoeCount
    },
    typeCounts,
    recommendationCoverage,
    readyChecks
  };
}

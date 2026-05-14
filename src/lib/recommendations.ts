import recommendationRules from "../../data/recommendation-rules.json";
import { getEnrichedShoes } from "@/lib/data";
import type { EnrichedShoe } from "@/types/product";
import type { RecommendationProfile, RecommendationResult } from "@/types/recommendation";

type ScoreBand = {
  min: number;
  label: string;
};

const scoreBands = recommendationRules.scoreModel.scoreBands as ScoreBand[];

function scoreBand(score: number) {
  return scoreBands.find((band) => score >= band.min)?.label ?? "Mogelijke match";
}

function add(condition: boolean, points: number, factors: string[]) {
  return condition ? { points, factors } : { points: 0, factors: [] };
}

function evaluateShoe(shoe: EnrichedShoe, profile: RecommendationProfile): RecommendationResult {
  let score = 0;
  const matchedFactors: string[] = [];
  const tradeoffs: string[] = [];

  const roadOk = profile.preferredSurface === "road" && ["road", "mixed"].includes(shoe.surfaceType);
  const trailOk = profile.preferredSurface === "trail" && shoe.surfaceType === "trail";
  const mixedOk = profile.preferredSurface === "mixed" && ["road", "trail", "mixed"].includes(shoe.surfaceType);
  const surface = add(roadOk || trailOk || mixedOk, 16, ["past bij de ondergrond waarop je loopt"]);
  score += surface.points;
  matchedFactors.push(...surface.factors);
  if (!surface.points) score -= 30;

  if (profile.runningGoal === "start_running") {
    const match = ["daily_trainer", "stability"].includes(shoe.shoeType);
    score += match ? 18 : 0;
    if (match) matchedFactors.push("loopt rustig en voorspelbaar");
    if (shoe.shoeType === "race" || shoe.hasCarbonPlate) {
      score -= 18;
      tradeoffs.push("minder logisch als eerste of enige hardloopschoen");
    }
  }

  if (profile.runningGoal === "general_fitness") {
    const match = shoe.primaryUseCase === "daily_trainer" || shoe.shoeType === "stability";
    score += match ? 18 : 0;
    if (match) matchedFactors.push("geschikt voor gewone trainingen");
  }

  if (profile.runningGoal === "faster_5k_10k") {
    const match = ["tempo", "race"].includes(shoe.shoeType) || shoe.responsivenessLevel === "high";
    score += match ? 18 : 0;
    if (match) matchedFactors.push("helpt bij sneller lopen");
  }

  if (profile.runningGoal === "half_marathon_marathon") {
    const match = ["half_marathon_plus", "10k_marathon"].includes(shoe.distanceBucket);
    score += match ? 18 : 0;
    if (match) matchedFactors.push("geschikt voor langere afstanden");
  }

  if (profile.runningGoal === "trail_running") {
    const match = shoe.shoeType === "trail" && shoe.surfaceType === "trail";
    score += match ? 18 : 0;
    if (match) matchedFactors.push("gemaakt voor onverharde paden");
  }

  const longDistance = ["half_marathon", "marathon"].includes(profile.targetDistance);
  const trailDistance = profile.targetDistance === "trail";
  if (longDistance && ["half_marathon_plus", "10k_marathon"].includes(shoe.distanceBucket)) {
    score += 12;
    matchedFactors.push("genoeg bescherming voor langere trainingen");
  }
  if (trailDistance && shoe.shoeType === "trail" && shoe.surfaceType === "trail") {
    score += 12;
    matchedFactors.push("past bij trailafstanden en onverharde routes");
  }
  if (!longDistance && !trailDistance && ["all_round", "10k_marathon"].includes(shoe.distanceBucket)) {
    score += 12;
    matchedFactors.push("past goed bij 5 tot 10 kilometer");
  }

  if (profile.weeklyFrequency === "3_4" || profile.weeklyFrequency === "5_plus") {
    if (["daily_trainer", "stability"].includes(shoe.shoeType) && shoe.editorialScore.comfort >= 8) {
      score += 6;
      matchedFactors.push("is logisch voor meerdere trainingen per week");
    }
    if (shoe.shoeType === "race") {
      score -= 8;
      tradeoffs.push("minder logisch als schoen voor veel wekelijkse trainingen");
    }
  }

  if (profile.supportNeed === "neutral" && shoe.supportType === "neutral") {
    score += 16;
    matchedFactors.push("geeft geen onnodige extra steun");
  }
  if (["some_support", "not_sure"].includes(profile.supportNeed) && ["neutral", "light_stability", "stability"].includes(shoe.supportType)) {
    score += shoe.supportType === "neutral" ? 10 : 16;
    matchedFactors.push(shoe.supportType === "neutral" ? "voelt niet overdreven corrigerend" : "geeft extra steun");
  }
  if (profile.supportNeed === "stability") {
    if (["stability", "light_stability"].includes(shoe.supportType)) {
      score += 16;
      matchedFactors.push("geeft duidelijke steun");
    } else {
      score -= 16;
      tradeoffs.push("geeft minder steun dan je aangeeft te zoeken");
    }
  }

  if (profile.preferredFeel === "soft" && shoe.cushioningLevel === "high") {
    score += 12;
    matchedFactors.push("voelt zacht en beschermend");
    if (shoe.responsivenessLevel === "low") tradeoffs.push("voelt minder snel en direct");
  }
  if (profile.preferredFeel === "balanced" && shoe.responsivenessLevel === "medium") {
    score += 12;
    matchedFactors.push("voelt niet te zacht en niet te fel");
  }
  if (profile.preferredFeel === "responsive" && shoe.responsivenessLevel === "high") {
    score += 12;
    matchedFactors.push("voelt veerkrachtig bij tempo");
    if (shoe.editorialScore.stability <= 7.2) tradeoffs.push("kan minder rustig en stabiel aanvoelen");
  }

  if (profile.fitPreference === "wide") {
    if (shoe.widthLabel === "wide" || shoe.fitProfile === "roomy") {
      score += 9;
      matchedFactors.push("biedt meer ruimte in de pasvorm");
    }
    if (shoe.widthLabel === "narrow" || shoe.fitProfile === "snug") {
      score -= 14;
      tradeoffs.push("kan te smal voelen bij brede voeten");
    }
  } else if (profile.fitPreference === "narrow" && ["narrow", "regular"].includes(shoe.widthLabel)) {
    score += 9;
    matchedFactors.push("valt wat compacter om de voet");
  } else if (profile.fitPreference === "regular" && shoe.widthLabel === "regular") {
    score += 7;
    matchedFactors.push("heeft een normale pasvorm");
  }

  if (profile.experienceLevel === "beginner") {
    if (["daily_trainer", "stability"].includes(shoe.shoeType)) score += 7;
    if (shoe.hasCarbonPlate || shoe.shoeType === "race") score -= 18;
  }

  if (profile.injurySensitivity === "high") {
    if (shoe.editorialScore.comfort >= 8 && shoe.editorialScore.stability >= 7.5) {
      score += 7;
      matchedFactors.push("scoort goed op comfort en steun");
    } else {
      score -= 8;
      tradeoffs.push("controleer extra of comfort en steun genoeg zijn voor jouw lichaam");
    }
  }

  if (profile.budgetMax && shoe.priceFrom !== null) {
    if (shoe.priceFrom <= profile.budgetMax) {
      score += shoe.editorialScore.valueForMoney >= 7.5 ? 6 : 3;
      matchedFactors.push("past binnen je budget");
    } else {
      score -= 10;
      tradeoffs.push("is duurder dan je opgegeven budget");
    }
  }

  if (shoe.editorialScore.overall >= 8) score += 4;

  const cappedScore = Math.max(0, Math.min(100, Math.round(score)));
  const fallbackTradeoff =
    shoe.editorialVerdict.lessSuitableFor || "controleer of de pasvorm en het gebruik echt bij jou passen";

  return {
    shoeId: shoe.id,
    matchScore: cappedScore,
    label: scoreBand(cappedScore),
    primaryReason: `Deze schoen past goed omdat hij ${matchedFactors.slice(0, 2).join(" en ")}.`,
    secondaryReason: matchedFactors[2] ? `Ook prettig: hij ${matchedFactors.slice(2, 4).join(" en ")}.` : shoe.editorialVerdict.summary,
    tradeoffNote: tradeoffs.length ? tradeoffs[0] : fallbackTradeoff,
    matchedFactors
  };
}

export function getRecommendations(profile: RecommendationProfile) {
  return getEnrichedShoes()
    .map((shoe) => ({
      shoe,
      result: evaluateShoe(shoe, profile)
    }))
    .filter(({ result }) => result.matchScore >= recommendationRules.scoreModel.minimumUsefulScore)
    .sort((a, b) => b.result.matchScore - a.result.matchScore)
    .slice(0, recommendationRules.scoreModel.shortlistSize);
}

export const defaultProfile: RecommendationProfile = {
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
};

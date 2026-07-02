export type RecommendationProfile = {
  experienceLevel: "not_sure" | "beginner" | "recreational" | "experienced";
  runningGoal: "not_sure" | "start_running" | "general_fitness" | "faster_5k_10k" | "half_marathon_marathon" | "trail_running";
  targetDistance: "not_sure" | "5k" | "10k" | "half_marathon" | "marathon" | "trail";
  weeklyFrequency: "not_sure" | "1_2" | "3_4" | "5_plus";
  preferredSurface: "not_sure" | "road" | "trail" | "mixed";
  preferredFeel: "not_sure" | "soft" | "balanced" | "responsive";
  supportNeed: "neutral" | "some_support" | "stability" | "not_sure";
  injurySensitivity: "not_sure" | "low" | "medium" | "high";
  fitPreference: "narrow" | "regular" | "wide" | "not_sure";
  budgetMax?: number;
};

export type RecommendationResult = {
  shoeId: string;
  matchScore: number;
  label: string;
  primaryReason: string;
  secondaryReason: string;
  tradeoffNote: string;
  matchedFactors: string[];
};

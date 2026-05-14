export type RecommendationProfile = {
  experienceLevel: "beginner" | "recreational" | "experienced";
  runningGoal: "start_running" | "general_fitness" | "faster_5k_10k" | "half_marathon_marathon" | "trail_running";
  targetDistance: "5k" | "10k" | "half_marathon" | "marathon" | "trail";
  weeklyFrequency: "1_2" | "3_4" | "5_plus";
  preferredSurface: "road" | "trail" | "mixed";
  preferredFeel: "soft" | "balanced" | "responsive";
  supportNeed: "neutral" | "some_support" | "stability" | "not_sure";
  injurySensitivity: "low" | "medium" | "high";
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

import { intentPages, type IntentPage, type IntentPageSeo } from "@/lib/intent-pages";

type IntentPageCopy = Pick<IntentPage, "title" | "eyebrow" | "intro" | "primaryCta" | "criteria"> &
  IntentPageSeo;

function enHref(href: string) {
  if (href.startsWith("/schoenen")) return href.replace("/schoenen", "/en/shoes");
  if (href.startsWith("/keuzehulp")) return href.replace("/keuzehulp", "/en/shoe-finder");
  if (href.startsWith("/vergelijken")) return href.replace("/vergelijken", "/en/compare");
  return href;
}

const englishIntentPageCopy: Record<string, IntentPageCopy> = {
  beginners: {
    title: "Running shoes for beginners",
    eyebrow: "Start running with confidence",
    intro:
      "If you are starting to run, choose a shoe that feels comfortable, stable and easy to use. A fast race shoe is usually less logical than a reliable daily trainer.",
    primaryCta: "Find my first running shoes",
    criteria: ["calm and predictable ride", "comfort over speed", "no carbon plate needed", "a safer first purchase"],
    metaDescription:
      "Compare running shoes for beginners. Find comfortable, stable daily trainers without jumping straight to expensive race shoes.",
    guidance: [
      {
        title: "Start with comfort and control",
        text: "Beginner runners usually benefit most from a predictable shoe that makes easy running feel calm."
      },
      {
        title: "Do not buy only on price",
        text: "A low price is useful only if the shoe fits your foot and the way you train."
      },
      {
        title: "Leave carbon for later",
        text: "Carbon race shoes are built for speed. Your first shoe should be more forgiving and versatile."
      }
    ],
    faqs: [
      {
        question: "What type of running shoe often suits beginners?",
        answer: "Usually a comfortable daily trainer with enough cushioning and a predictable ride."
      },
      {
        question: "Do beginners need expensive running shoes?",
        answer: "Not necessarily. A reliable fit and use case matter more than the most expensive model."
      },
      {
        question: "How do I know if I need support?",
        answer: "If neutral shoes feel unstable, compare light stability models or use the Shoe Finder."
      }
    ],
    relatedSlugs: ["prijs-kwaliteit", "zachte-demping", "stabiliteit"]
  },
  "brede-voeten": {
    title: "Running shoes for wide feet",
    eyebrow: "Fit first",
    intro:
      "A running shoe can score well and still feel wrong if it pinches. If you have wide feet, focus on toe box room and forefoot comfort.",
    primaryCta: "Find roomier running shoes",
    criteria: ["more forefoot space", "comfortable easy runs", "enough toe room", "not too narrow or tight"],
    metaDescription: "Compare running shoes for wide feet. Find roomy models with more toe box comfort.",
    guidance: [
      {
        title: "Fit matters more than score",
        text: "A highly rated shoe is not a good choice if it creates pressure points."
      },
      {
        title: "Check width options",
        text: "Some models have wide sizes; others feel roomy because of the upper and toe box shape."
      },
      {
        title: "Think about longer runs",
        text: "Feet can swell during running, so a tight shoe often gets worse after a few kilometres."
      }
    ],
    faqs: [
      {
        question: "Which running shoes work for wide feet?",
        answer: "Look for wide sizing, a roomy fit profile or a generous toe box."
      },
      {
        question: "Should I just size up?",
        answer: "Sometimes it helps, but a wider fit is usually better than only buying a longer shoe."
      },
      {
        question: "Are soft shoes better for wide feet?",
        answer: "Not automatically. Upper shape and width are usually more important."
      }
    ],
    relatedSlugs: ["zachte-demping", "neutrale-hardloopschoenen", "beginners"]
  },
  stabiliteit: {
    title: "Compare stability running shoes",
    eyebrow: "More guidance while running",
    intro:
      "Stability shoes add guidance during your stride. A suitable option feels secure and comfortable without becoming heavy or overly corrective.",
    primaryCta: "Find shoes with more support",
    criteria: ["stable base", "comfort on longer runs", "not too heavy for daily use", "clear weight differences"],
    metaDescription: "Compare stability running shoes by support, comfort, cushioning and weight.",
    guidance: [
      {
        title: "Support does not need to feel harsh",
        text: "Modern stability shoes can guide your stride without feeling stiff or controlling."
      },
      {
        title: "Comfort still matters",
        text: "Support only helps if the shoe also feels good enough for regular training."
      },
      {
        title: "Not a substitute for specialist advice",
        text: "A stability shoe can improve running feel, but persistent pain should be checked by a specialist."
      }
    ],
    faqs: [
      {
        question: "When do I need stability shoes?",
        answer: "When you want more guidance, feel unstable in neutral shoes or roll inward a lot."
      },
      {
        question: "Are stability shoes always heavy?",
        answer: "Often slightly, but modern models differ strongly in weight and feel."
      },
      {
        question: "Can beginners use stability shoes?",
        answer: "Yes, especially if the shoe feels calm and comfortable."
      }
    ],
    relatedSlugs: ["beginners", "neutrale-hardloopschoenen", "halve-marathon"]
  },
  "sneller-trainen": {
    title: "Running shoes for faster training",
    eyebrow: "Tempo and speed",
    intro:
      "For tempo runs you often want a lighter, more responsive shoe. Be careful: not every fast shoe is pleasant for easy kilometres.",
    primaryCta: "Compare tempo running shoes",
    criteria: ["responsive feel", "lower weight", "control at pace", "clear difference between training and racing"],
    metaDescription: "Compare tempo running shoes for faster workouts, interval sessions and responsive training.",
    guidance: [
      {
        title: "Responsiveness helps at tempo",
        text: "A tempo shoe should feel direct and energetic without becoming unstable."
      },
      {
        title: "Keep an easy shoe too",
        text: "Many runners use a calmer daily trainer alongside a faster workout shoe."
      },
      {
        title: "Weight is only one signal",
        text: "A light shoe still needs enough comfort and grip for the way you train."
      }
    ],
    faqs: [
      {
        question: "Do I need a tempo shoe?",
        answer: "Only if you regularly run intervals, tempo sessions or faster 5K/10K workouts."
      },
      {
        question: "Can I use a tempo shoe every day?",
        answer: "Sometimes, but many tempo shoes are less forgiving for easy recovery runs."
      },
      {
        question: "Is carbon needed for tempo training?",
        answer: "No. Many non-carbon tempo shoes feel fast enough for training."
      }
    ],
    relatedSlugs: ["5k-10k", "carbon-wedstrijdschoenen", "prijs-kwaliteit"]
  },
  "zachte-demping": {
    title: "Running shoes with soft cushioning",
    eyebrow: "Comfort and protection",
    intro:
      "More cushioning can feel good for easy runs, longer distances or recovery days. A soft shoe is not automatically the most stable or fastest choice.",
    primaryCta: "Find highly cushioned shoes",
    criteria: ["high cushioning", "comfort for easy kilometres", "suitable for longer runs", "not automatically the fastest option"],
    metaDescription: "Compare running shoes with soft cushioning for comfort, easy runs and longer distances.",
    guidance: [
      {
        title: "Cushioning can feel protective",
        text: "Soft cushioning often helps when comfort matters more than speed."
      },
      {
        title: "Soft is not always stable",
        text: "Compare cushioning together with stability and fit before choosing."
      },
      {
        title: "Choose by training goal",
        text: "Easy runs ask for different trade-offs than tempo sessions."
      }
    ],
    faqs: [
      {
        question: "Are highly cushioned shoes better?",
        answer: "Not always. They can be more comfortable, but sometimes less direct or less stable."
      },
      {
        question: "Who benefits from more cushioning?",
        answer: "Runners who value comfort, longer easy runs or recovery days."
      },
      {
        question: "Does cushioning prevent injuries?",
        answer: "Not by itself. Persistent pain should be assessed by a specialist."
      }
    ],
    relatedSlugs: ["halve-marathon", "brede-voeten", "beginners"]
  },
  "halve-marathon": {
    title: "Running shoes for a half marathon",
    eyebrow: "Longer distance",
    intro:
      "For a half marathon you want a shoe that stays comfortable when fatigue builds. The logical choice depends on pace, support needs and how much protection you want.",
    primaryCta: "Find my half-marathon shoe",
    criteria: ["comfort over distance", "stability when tired", "choice between easy and tempo", "fit over weight alone"],
    metaDescription: "Compare half-marathon running shoes for training, race day, comfort and support.",
    guidance: [
      {
        title: "Comfort matters when fatigue sets in",
        text: "Small pressure points become bigger over longer distances."
      },
      {
        title: "Training and race day can differ",
        text: "Some runners train in a daily trainer and race in a faster shoe."
      },
      {
        title: "Fit is not a detail",
        text: "Width, heel hold and upper comfort matter a lot over 21.1 kilometres."
      }
    ],
    faqs: [
      {
        question: "What shoes are good for a half marathon?",
        answer: "Shoes that combine comfort, enough cushioning and the right support for your stride."
      },
      {
        question: "Do I need carbon for a half marathon?",
        answer: "No. Carbon can feel fast, but it is not required to run a good half marathon."
      },
      {
        question: "Can I race in my training shoes?",
        answer: "Yes, if they stay comfortable over longer distances and match your pace."
      }
    ],
    relatedSlugs: ["zachte-demping", "sneller-trainen", "prijs-kwaliteit"]
  },
  "5k-10k": {
    title: "Running shoes for 5K and 10K",
    eyebrow: "Shorter and faster",
    intro:
      "For 5K and 10K you can choose an all-round trainer or a lighter tempo shoe. The trade-off is mainly comfort, weight and how direct the shoe feels.",
    primaryCta: "Find shoes for 5K and 10K",
    criteria: ["shorter distance ready", "balance between comfort and pace", "not too aggressive for beginners", "compare weight and responsiveness"],
    metaDescription: "Compare running shoes for 5K and 10K training, tempo runs and race-day goals.",
    guidance: [
      {
        title: "All-round can be enough",
        text: "Many runners do not need a specialist race shoe for 5K or 10K."
      },
      {
        title: "Direct feel helps speed",
        text: "A responsive shoe can make faster efforts feel easier to hold."
      },
      {
        title: "Avoid overbuying",
        text: "A very aggressive race shoe can be less comfortable for regular training."
      }
    ],
    faqs: [
      {
        question: "What type of shoe works well for 5K?",
        answer: "That depends on your goal. Beginners often do well in a daily trainer; faster runners may prefer a tempo shoe."
      },
      {
        question: "Is a 10K shoe different from a half-marathon shoe?",
        answer: "Often it can be lighter and more direct, but comfort still matters."
      },
      {
        question: "Do I need a race shoe for 10K?",
        answer: "No, but a lighter tempo shoe can be useful if you run faster sessions."
      }
    ],
    relatedSlugs: ["sneller-trainen", "beginners", "carbon-wedstrijdschoenen"]
  },
  "neutrale-hardloopschoenen": {
    title: "Compare neutral running shoes",
    eyebrow: "Without extra correction",
    intro:
      "Neutral running shoes are built for runners who do not need pronounced support. Within that group, shoes still differ strongly in cushioning, fit and speed.",
    primaryCta: "Find neutral running shoes",
    criteria: ["no pronounced stability correction", "many cushioning and feel options", "fit remains decisive", "useful for many recreational runners"],
    metaDescription: "Compare neutral running shoes by cushioning, fit, use case and price.",
    guidance: [
      {
        title: "Neutral means less active guidance",
        text: "A neutral shoe lets your foot move more naturally than a stability shoe."
      },
      {
        title: "Neutral shoes still differ a lot",
        text: "They can be soft, firm, light, wide, fast or very protective."
      },
      {
        title: "Compare support if unsure",
        text: "If you feel unstable, compare neutral shoes with light stability models."
      }
    ],
    faqs: [
      {
        question: "What is a neutral running shoe?",
        answer: "A shoe without a clear stability correction, intended for runners who do not need extra guidance."
      },
      {
        question: "Are neutral shoes good for beginners?",
        answer: "Often yes, as long as the shoe feels comfortable and predictable."
      },
      {
        question: "What is the difference with stability shoes?",
        answer: "Stability shoes add more guidance or support during your stride."
      }
    ],
    relatedSlugs: ["stabiliteit", "zachte-demping", "sneller-trainen"]
  },
  trail: {
    title: "Compare trail running shoes",
    eyebrow: "Off-road running",
    intro:
      "Trail running asks for more grip and protection than road running. Do not look only at cushioning; grip, stability and terrain matter just as much.",
    primaryCta: "Find trail running shoes",
    criteria: ["grip on off-road terrain", "protection over pure speed", "fit when descending", "road and trail shoes are not interchangeable"],
    metaDescription: "Compare trail running shoes by grip, protection, fit and terrain suitability.",
    guidance: [
      {
        title: "Grip is the first signal",
        text: "The right outsole depends on whether you run forest paths, mud, gravel or mountain trails."
      },
      {
        title: "Protection matters off-road",
        text: "Trail shoes often need a firmer upper and more security around the foot."
      },
      {
        title: "Do not use one category for everything",
        text: "A road shoe and trail shoe solve different problems."
      }
    ],
    faqs: [
      {
        question: "Can I use road shoes on trails?",
        answer: "On light gravel sometimes, but for technical terrain a trail shoe gives more grip and protection."
      },
      {
        question: "Are trail shoes waterproof?",
        answer: "Some are, but waterproofing can also feel warmer and less breathable."
      },
      {
        question: "What matters most in a trail shoe?",
        answer: "Grip, fit security, protection and the terrain you run on."
      }
    ],
    relatedSlugs: ["zachte-demping", "stabiliteit", "prijs-kwaliteit"]
  },
  "carbon-wedstrijdschoenen": {
    title: "Carbon running shoes for race day",
    eyebrow: "Race and performance",
    intro:
      "Carbon running shoes can feel fast and efficient, but they are not logical for every run. They often need adaptation and are rarely ideal as a first shoe.",
    primaryCta: "Compare race shoes",
    criteria: ["race-pace focused", "responsive and light", "less suitable for easy beginner runs", "price and durability matter"],
    metaDescription: "Compare carbon running shoes for race day, speed, responsiveness and value.",
    guidance: [
      {
        title: "Carbon is a specialist tool",
        text: "It can help at speed, but it is not designed to replace every training shoe."
      },
      {
        title: "Adaptation matters",
        text: "Some runners need time before a plated shoe feels natural."
      },
      {
        title: "Check value carefully",
        text: "Race shoes can be expensive and less durable than daily trainers."
      }
    ],
    faqs: [
      {
        question: "Do carbon shoes make everyone faster?",
        answer: "No. They can help some runners, but fit, pace and running style still matter."
      },
      {
        question: "Can beginners use carbon shoes?",
        answer: "They can, but it is usually not the most useful first purchase."
      },
      {
        question: "Are carbon shoes durable?",
        answer: "Often less than daily trainers, especially when used for many training kilometres."
      }
    ],
    relatedSlugs: ["sneller-trainen", "5k-10k", "halve-marathon"]
  },
  "prijs-kwaliteit": {
    title: "Best value running shoes",
    eyebrow: "Choose smarter",
    intro:
      "Strong value is not always the lowest price. Look at versatility, durability, comfort and whether you can use the shoe for multiple training types.",
    primaryCta: "Find smart-value shoes",
    criteria: ["versatile use", "good comfort-price balance", "no unnecessary race tech", "logical for recreational runners"],
    metaDescription: "Compare running shoes with strong value for money across comfort, versatility, durability and price.",
    guidance: [
      {
        title: "Cheap is not automatically smart",
        text: "A low price only matters if the shoe matches your goal and keeps working for your training."
      },
      {
        title: "Versatility counts",
        text: "A shoe that covers more training types often gives better value."
      },
      {
        title: "Look for hidden trade-offs",
        text: "A sharp price can come with less cushioning, lower durability or a narrower fit."
      }
    ],
    faqs: [
      {
        question: "What is a good price for running shoes?",
        answer: "It depends on your goal, but a reliable all-round shoe often delivers better value than the lowest-priced option."
      },
      {
        question: "Which shoes often deliver strong value?",
        answer: "Often versatile daily trainers without expensive race-day technology."
      },
      {
        question: "Should I wait for a discount?",
        answer: "Discounts can help, but do not buy a shoe that does not fit your foot or training."
      }
    ],
    relatedSlugs: ["beginners", "neutrale-hardloopschoenen", "zachte-demping"]
  }
};

export const englishIntentPages: IntentPage[] = intentPages.map((page) => {
  const copy = englishIntentPageCopy[page.slug];

  return {
    ...page,
    title: copy.title,
    eyebrow: copy.eyebrow,
    intro: copy.intro,
    primaryCta: copy.primaryCta,
    filterHref: enHref(page.filterHref),
    helperHref: enHref(page.helperHref),
    criteria: copy.criteria
  };
});

export function getEnglishIntentPage(slug: string) {
  return englishIntentPages.find((page) => page.slug === slug);
}

export function getEnglishIntentPageSeo(slug: string) {
  return englishIntentPageCopy[slug];
}

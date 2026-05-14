import type { EnrichedShoe } from "@/types/product";

export type IntentPage = {
  slug: string;
  title: string;
  eyebrow: string;
  intro: string;
  primaryCta: string;
  filterHref: string;
  helperHref: string;
  compareSeed: string[];
  criteria: string[];
  filter: (shoe: EnrichedShoe) => boolean;
  sort: (a: EnrichedShoe, b: EnrichedShoe) => number;
};

export const intentPages: IntentPage[] = [
  {
    slug: "beginners",
    title: "Hardloopschoenen voor beginners",
    eyebrow: "Beginnen met hardlopen",
    intro:
      "Begin je met hardlopen? Kies dan vooral een schoen die comfortabel, stabiel en makkelijk loopt. Een snelle wedstrijdschoen is meestal minder logisch dan een betrouwbare trainingsschoen.",
    primaryCta: "Vind mijn eerste hardloopschoenen",
    filterHref: "/schoenen?shoeType=daily_trainer&sort=value",
    helperHref: "/keuzehulp?runningGoal=start_running&experienceLevel=beginner",
    compareSeed: ["nike-pegasus-41", "hoka-clifton-9", "brooks-ghost-16"],
    criteria: ["loopt rustig en voorspelbaar", "comfort belangrijker dan snelheid", "geen carbonplaat nodig", "goede keuze voor je eerste aankoop"],
    filter: (shoe) => ["daily_trainer", "stability"].includes(shoe.shoeType) && !shoe.hasCarbonPlate,
    sort: (a, b) => b.editorialScore.versatility + b.editorialScore.valueForMoney - (a.editorialScore.versatility + a.editorialScore.valueForMoney)
  },
  {
    slug: "brede-voeten",
    title: "Hardloopschoenen voor brede voeten",
    eyebrow: "Pasvorm eerst",
    intro:
      "Een hardloopschoen kan goed scoren en toch verkeerd voelen als hij knelt. Heb je brede voeten, let dan vooral op ruimte bij je tenen en voorvoet.",
    primaryCta: "Vind hardloopschoenen met meer ruimte",
    filterHref: "/schoenen?widthLabel=wide",
    helperHref: "/keuzehulp?fitPreference=wide",
    compareSeed: ["new-balance-fresh-foam-x-1080v13", "brooks-ghost-16", "brooks-adrenaline-gts-24"],
    criteria: ["meer ruimte bij de voorvoet", "comfort op rustige trainingen", "voldoende teenruimte", "niet te smal of strak"],
    filter: (shoe) => shoe.widthLabel === "wide" || shoe.fitProfile === "roomy",
    sort: (a, b) => b.editorialScore.comfort - a.editorialScore.comfort
  },
  {
    slug: "stabiliteit",
    title: "Stabiliteitsschoenen vergelijken",
    eyebrow: "Meer steun tijdens het lopen",
    intro:
      "Een stabiliteitsschoen geeft extra steun tijdens het lopen. De beste keuze voelt zeker en comfortabel, zonder onnodig zwaar of dwingend te worden.",
    primaryCta: "Vind schoenen met meer steun",
    filterHref: "/schoenen?shoeType=stability",
    helperHref: "/keuzehulp?supportNeed=stability",
    compareSeed: ["asics-gel-kayano-31", "brooks-adrenaline-gts-24", "hoka-arahi-7"],
    criteria: ["stabiele basis", "comfort bij langere trainingen", "niet te zwaar voor dagelijks gebruik", "duidelijk verschil in gewicht"],
    filter: (shoe) => shoe.shoeType === "stability" || shoe.supportType === "stability" || shoe.supportType === "light_stability",
    sort: (a, b) => b.editorialScore.stability - a.editorialScore.stability
  },
  {
    slug: "sneller-trainen",
    title: "Hardloopschoenen voor sneller trainen",
    eyebrow: "Tempo en snelheid",
    intro:
      "Voor tempotraining wil je vaak een lichtere en veerkrachtigere schoen. Let wel op: niet elke snelle hardloopschoen is prettig voor rustige trainingen.",
    primaryCta: "Vergelijk schoenen voor tempo",
    filterHref: "/schoenen?shoeType=tempo&sort=value",
    helperHref: "/keuzehulp?runningGoal=faster_5k_10k&preferredFeel=responsive",
    compareSeed: ["saucony-endorphin-speed-4", "adidas-adizero-boston-12", "adidas-adizero-adios-pro-3"],
    criteria: ["veerkrachtig gevoel", "lager gewicht", "controle bij tempo", "duidelijk verschil tussen training en race"],
    filter: (shoe) => shoe.shoeType === "tempo" || shoe.shoeType === "race" || shoe.responsivenessLevel === "high",
    sort: (a, b) => b.editorialScore.responsiveness - a.editorialScore.responsiveness
  },
  {
    slug: "zachte-demping",
    title: "Hardloopschoenen met veel demping",
    eyebrow: "Comfort en bescherming",
    intro:
      "Veel demping kan prettig zijn als je rustig loopt, langere afstanden maakt of minder belasting wilt voelen. Let wel op dat een zachte schoen niet altijd de meest stabiele of snelle keuze is.",
    primaryCta: "Vind schoenen met veel demping",
    filterHref: "/schoenen?cushioningLevel=high&sort=editorial",
    helperHref: "/keuzehulp?preferredFeel=soft",
    compareSeed: ["asics-gel-nimbus-26", "hoka-clifton-9", "new-balance-fresh-foam-x-1080v13"],
    criteria: ["hoge demping", "comfort bij rustige kilometers", "geschikt voor langere trainingen", "niet automatisch de snelste keuze"],
    filter: (shoe) => shoe.cushioningLevel === "high" && !shoe.hasCarbonPlate,
    sort: (a, b) => b.editorialScore.cushioning + b.editorialScore.comfort - (a.editorialScore.cushioning + a.editorialScore.comfort)
  },
  {
    slug: "halve-marathon",
    title: "Hardloopschoenen voor een halve marathon",
    eyebrow: "Langere afstand",
    intro:
      "Voor een halve marathon wil je meestal een schoen die comfortabel blijft wanneer je vermoeid raakt. De beste keuze hangt af van je tempo, steunbehoefte en hoeveel bescherming je wilt.",
    primaryCta: "Vind mijn halve-marathonschoen",
    filterHref: "/schoenen?sort=editorial",
    helperHref: "/keuzehulp?runningGoal=half_marathon_marathon&targetDistance=half_marathon",
    compareSeed: ["asics-gel-kayano-31", "nike-vomero-17", "saucony-endorphin-speed-4"],
    criteria: ["comfort over langere afstand", "voldoende stabiliteit bij vermoeidheid", "keuze tussen rustig trainen en tempo", "pasvorm belangrijker dan alleen gewicht"],
    filter: (shoe) => shoe.distanceBucket === "half_marathon_plus" || shoe.distanceBucket === "10k_marathon",
    sort: (a, b) => b.editorialScore.comfort + b.editorialScore.versatility - (a.editorialScore.comfort + a.editorialScore.versatility)
  },
  {
    slug: "5k-10k",
    title: "Hardloopschoenen voor 5 km en 10 km",
    eyebrow: "Korter en sneller",
    intro:
      "Voor 5 en 10 kilometer kun je kiezen voor een allround trainingsschoen of juist een lichtere temposchoen. Het verschil zit vooral in comfort, gewicht en hoe direct de schoen aanvoelt.",
    primaryCta: "Vind schoenen voor 5 en 10 km",
    filterHref: "/schoenen?sort=value",
    helperHref: "/keuzehulp?runningGoal=faster_5k_10k&targetDistance=10k",
    compareSeed: ["nike-pegasus-41", "adidas-adizero-boston-12", "saucony-endorphin-speed-4"],
    criteria: ["geschikt voor kortere afstanden", "balans tussen comfort en tempo", "niet onnodig agressief voor beginners", "gewicht en responsiviteit vergelijken"],
    filter: (shoe) => shoe.distanceBucket === "all_round" || shoe.distanceBucket === "10k_marathon",
    sort: (a, b) => b.editorialScore.responsiveness + b.editorialScore.versatility - (a.editorialScore.responsiveness + a.editorialScore.versatility)
  },
  {
    slug: "neutrale-hardloopschoenen",
    title: "Neutrale hardloopschoenen vergelijken",
    eyebrow: "Zonder extra correctie",
    intro:
      "Neutrale hardloopschoenen zijn bedoeld voor lopers die geen uitgesproken extra steun nodig hebben. Binnen die groep verschillen schoenen nog sterk in demping, pasvorm en snelheid.",
    primaryCta: "Vind neutrale schoenen",
    filterHref: "/schoenen?supportType=neutral",
    helperHref: "/keuzehulp?supportNeed=neutral",
    compareSeed: ["nike-pegasus-41", "asics-gel-nimbus-26", "hoka-clifton-9"],
    criteria: ["geen uitgesproken stabiliteitscorrectie", "veel keuze in demping en gevoel", "pasvorm blijft doorslaggevend", "geschikt voor veel recreatieve lopers"],
    filter: (shoe) => shoe.supportType === "neutral",
    sort: (a, b) => b.editorialScore.versatility - a.editorialScore.versatility
  },
  {
    slug: "trail",
    title: "Trailschoenen vergelijken",
    eyebrow: "Onverhard lopen",
    intro:
      "Trailrunning vraagt om meer grip en bescherming dan lopen op asfalt. Kijk niet alleen naar demping, maar vooral naar grip, stabiliteit en de ondergrond waarop je meestal loopt.",
    primaryCta: "Vind trailschoenen",
    filterHref: "/schoenen?shoeType=trail",
    helperHref: "/keuzehulp?runningGoal=trail_running&preferredSurface=trail",
    compareSeed: ["hoka-speedgoat-6", "nike-zegama-2", "brooks-cascadia-18"],
    criteria: ["grip op onverhard terrein", "bescherming belangrijker dan pure snelheid", "let op pasvorm bij afdalen", "weg- en trailschoenen niet zomaar uitwisselen"],
    filter: (shoe) => shoe.shoeType === "trail" || shoe.surfaceType === "trail" || shoe.surfaceType === "mixed",
    sort: (a, b) => b.editorialScore.grip - a.editorialScore.grip
  },
  {
    slug: "carbon-wedstrijdschoenen",
    title: "Carbon hardloopschoenen voor wedstrijden",
    eyebrow: "Wedstrijd en prestatie",
    intro:
      "Carbon hardloopschoenen kunnen efficiënt en snel aanvoelen, maar zijn niet voor iedere training logisch. Ze vragen vaak om gewenning en zijn minder geschikt als eerste hardloopschoen.",
    primaryCta: "Vergelijk wedstrijdschoenen",
    filterHref: "/schoenen?hasCarbonPlate=true",
    helperHref: "/keuzehulp?runningGoal=faster_5k_10k&preferredFeel=responsive",
    compareSeed: ["adidas-adizero-adios-pro-3", "nike-vaporfly-3", "asics-magic-speed-4"],
    criteria: ["gericht op wedstrijdtempo", "responsief en licht", "minder geschikt voor rustige beginnerskilometers", "prijs en duurzaamheid kritisch meenemen"],
    filter: (shoe) => shoe.hasCarbonPlate || shoe.shoeType === "race",
    sort: (a, b) => b.editorialScore.responsiveness - a.editorialScore.responsiveness
  },
  {
    slug: "prijs-kwaliteit",
    title: "Hardloopschoenen met sterke prijs-kwaliteit",
    eyebrow: "Slim kiezen",
    intro:
      "De beste prijs-kwaliteit zit niet altijd bij de goedkoopste schoen. Kijk vooral naar veelzijdigheid, duurzaamheid, comfort en of je de schoen voor meerdere trainingen kunt gebruiken.",
    primaryCta: "Vind slimme keuzes",
    filterHref: "/schoenen?sort=value",
    helperHref: "/keuzehulp?budgetMax=170",
    compareSeed: ["nike-pegasus-41", "brooks-ghost-16", "mizuno-wave-rider-28"],
    criteria: ["veelzijdig inzetbaar", "goede balans tussen comfort en prijs", "geen onnodige wedstrijdtechniek", "logisch voor recreatieve lopers"],
    filter: (shoe) => !shoe.hasCarbonPlate && shoe.shoeType !== "race",
    sort: (a, b) => b.editorialScore.valueForMoney + b.editorialScore.versatility - (a.editorialScore.valueForMoney + a.editorialScore.versatility)
  }
];

export function getIntentPage(slug: string) {
  return intentPages.find((page) => page.slug === slug);
}

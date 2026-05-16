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

export type IntentPageSeo = {
  metaDescription: string;
  guidance: {
    title: string;
    text: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  relatedSlugs: string[];
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

export const intentPageSeo: Record<string, IntentPageSeo> = {
  beginners: {
    metaDescription:
      "Bekijk welke hardloopschoenen logisch zijn voor beginners. Vergelijk comfort, steun, demping en prijs zonder direct naar een wedstrijdschoen te grijpen.",
    guidance: [
      {
        title: "Begin met comfort en rust",
        text: "Als beginner heb je vooral baat bij een schoen die voorspelbaar loopt. Een allround trainingsschoen of lichte stabiliteitsschoen geeft meestal meer vertrouwen dan een agressieve wedstrijdschoen."
      },
      {
        title: "Kijk niet alleen naar de laagste prijs",
        text: "Een goedkope schoen kan prima zijn, maar pasvorm, demping en duurzaamheid bepalen of je hem ook echt blijft gebruiken. Prijs-kwaliteit is belangrijker dan alleen goedkoop."
      },
      {
        title: "Laat carbon voorlopig liggen",
        text: "Carbon wedstrijdschoenen zijn gebouwd voor snelheid en efficiëntie. Voor je eerste kilometers zijn ze vaak minder comfortabel, minder stabiel en onnodig duur."
      }
    ],
    faqs: [
      {
        question: "Welke hardloopschoen is het beste voor beginners?",
        answer: "Meestal een comfortabele daily trainer met voldoende demping en een voorspelbaar loopgevoel. Als je snel naar binnen zakt of onzeker loopt, kan lichte stabiliteit logisch zijn."
      },
      {
        question: "Moet ik als beginner een dure hardloopschoen kopen?",
        answer: "Niet per se. Koop liever een betrouwbare schoen die past bij je voet en trainingen dan een duur topmodel met technieken die je nog niet nodig hebt."
      },
      {
        question: "Hoe weet ik of ik extra steun nodig heb?",
        answer: "Als je twijfelt, start met de keuzehulp of vergelijk neutrale schoenen met lichte stabiliteit. Bij pijnklachten of blessures is persoonlijk advies van een specialist verstandig."
      }
    ],
    relatedSlugs: ["prijs-kwaliteit", "zachte-demping", "stabiliteit"]
  },
  "brede-voeten": {
    metaDescription:
      "Vergelijk hardloopschoenen voor brede voeten. Bekijk ruime modellen, pasvormtips en schoenen met meer teenruimte voor comfortabele trainingen.",
    guidance: [
      {
        title: "Pasvorm gaat boven score",
        text: "Een hoog beoordeelde schoen is geen goede keuze als hij knelt. Let bij brede voeten vooral op ruimte bij de voorvoet en tenen."
      },
      {
        title: "Controleer breedtematen en bovenwerk",
        text: "Sommige modellen zijn beschikbaar in brede maten, andere voelen ruimer door het bovenwerk. Beide kunnen helpen, maar het blijft belangrijk om drukpunten serieus te nemen."
      },
      {
        title: "Neem zwelling tijdens lopen mee",
        text: "Voeten kunnen tijdens langere trainingen iets uitzetten. Een schoen die stilstaand al strak zit, wordt onderweg vaak niet comfortabeler."
      }
    ],
    faqs: [
      {
        question: "Welke hardloopschoenen zijn geschikt voor brede voeten?",
        answer: "Kijk naar modellen met een wide-label, roomy fit of veel teenruimte. Comfort en drukvrij lopen zijn belangrijker dan een theoretisch hoge score."
      },
      {
        question: "Moet ik een maat groter nemen bij brede voeten?",
        answer: "Soms helpt dat, maar het lost breedte niet altijd op. Een bredere leest of wide-uitvoering is vaak beter dan alleen langer kopen."
      },
      {
        question: "Zijn zachte schoenen beter voor brede voeten?",
        answer: "Niet automatisch. Zachte demping kan prettig zijn, maar de breedte en vorm van het bovenwerk bepalen vooral of de schoen niet knelt."
      }
    ],
    relatedSlugs: ["zachte-demping", "neutrale-hardloopschoenen", "beginners"]
  },
  stabiliteit: {
    metaDescription:
      "Vergelijk stabiliteitsschoenen voor hardlopen. Lees wanneer extra steun logisch is en vergelijk modellen op stabiliteit, comfort en gewicht.",
    guidance: [
      {
        title: "Steun hoeft niet hard te corrigeren",
        text: "Moderne stabiliteitsschoenen geven vaak begeleiding zonder zwaar of dwingend te voelen. Vergelijk daarom lichte stabiliteit en duidelijke stabiliteit apart."
      },
      {
        title: "Let op comfort bij langere trainingen",
        text: "Extra steun is pas nuttig als de schoen ook prettig blijft lopen. Gewicht, demping en pasvorm bepalen of je hem vaak wilt gebruiken."
      },
      {
        title: "Gebruik stabiliteit niet als medische diagnose",
        text: "Een stabiliteitsschoen kan helpen bij loopgevoel, maar vervangt geen advies van een fysiotherapeut, podoloog of arts bij pijnklachten."
      }
    ],
    faqs: [
      {
        question: "Wanneer heb ik stabiliteitsschoenen nodig?",
        answer: "Als je meer begeleiding wilt, vaak naar binnen zakt of je met neutrale schoenen onzeker voelt. Bij klachten blijft persoonlijk advies belangrijk."
      },
      {
        question: "Zijn stabiliteitsschoenen altijd zwaarder?",
        answer: "Vaak iets, maar moderne modellen verschillen sterk. Daarom vergelijken we ook gewicht, demping en comfort."
      },
      {
        question: "Kan een beginner stabiliteitsschoenen gebruiken?",
        answer: "Ja, vooral als de schoen rustig en comfortabel loopt. Het hoeft geen zware correctieschoen te zijn."
      }
    ],
    relatedSlugs: ["beginners", "neutrale-hardloopschoenen", "halve-marathon"]
  },
  "zachte-demping": {
    metaDescription:
      "Bekijk hardloopschoenen met veel demping. Vergelijk zachte en comfortabele schoenen voor rustige trainingen, langere afstanden en herstelruns.",
    guidance: [
      {
        title: "Veel demping voelt beschermend",
        text: "Zachte, hoge demping kan prettig zijn bij rustige kilometers, langere trainingen of herstelruns. Het doel is comfort, niet automatisch snelheid."
      },
      {
        title: "Zacht is niet altijd stabiel",
        text: "Een heel zachte schoen kan minder stevig voelen. Vergelijk daarom demping altijd samen met stabiliteit en pasvorm."
      },
      {
        title: "Kies op trainingsdoel",
        text: "Voor dagelijkse rustige trainingen is comfort vaak belangrijker dan gewicht. Voor tempo kan een iets directer gevoel logischer zijn."
      }
    ],
    faqs: [
      {
        question: "Zijn hardloopschoenen met veel demping beter?",
        answer: "Niet altijd. Ze zijn vaak comfortabeler voor rustige of langere trainingen, maar kunnen minder direct of minder stabiel aanvoelen."
      },
      {
        question: "Voor wie is veel demping geschikt?",
        answer: "Voor lopers die comfort, bescherming en rustige kilometers belangrijk vinden. Ook bij herstelruns kan veel demping prettig zijn."
      },
      {
        question: "Is veel demping goed bij blessures?",
        answer: "Demping kan prettig voelen, maar lost blessures niet automatisch op. Laat aanhoudende pijn beoordelen door een specialist."
      }
    ],
    relatedSlugs: ["halve-marathon", "brede-voeten", "beginners"]
  },
  "halve-marathon": {
    metaDescription:
      "Vind hardloopschoenen voor een halve marathon. Vergelijk comfort, steun, tempo en demping voor training en wedstrijddag.",
    guidance: [
      {
        title: "Comfort blijft belangrijk bij vermoeidheid",
        text: "Op een halve marathon merk je pas echt of een schoen blijft zitten, stabiel voelt en voldoende bescherming geeft."
      },
      {
        title: "Training en wedstrijd kunnen verschillen",
        text: "Sommige lopers trainen in een comfortabele daily trainer en lopen de wedstrijd in een snellere schoen. Anderen kiezen liever één veelzijdig model."
      },
      {
        title: "Pasvorm is geen detail",
        text: "Op langere afstanden kunnen kleine drukpunten groot worden. Vergelijk daarom niet alleen score en gewicht, maar ook breedte en comfort."
      }
    ],
    faqs: [
      {
        question: "Welke schoenen zijn goed voor een halve marathon?",
        answer: "Schoenen die comfort, voldoende demping en stabiliteit combineren. Snellere lopers kunnen ook een tempo- of wedstrijdschoen overwegen."
      },
      {
        question: "Heb ik carbon nodig voor een halve marathon?",
        answer: "Nee. Carbon kan voor ervaren lopers snel voelen, maar is niet nodig om goed of comfortabel een halve marathon te lopen."
      },
      {
        question: "Kan ik mijn trainingsschoenen gebruiken voor de halve marathon?",
        answer: "Ja, als ze comfortabel blijven over langere afstanden en passen bij je tempo. Test ze ruim voor de wedstrijddag."
      }
    ],
    relatedSlugs: ["zachte-demping", "sneller-trainen", "prijs-kwaliteit"]
  },
  "neutrale-hardloopschoenen": {
    metaDescription:
      "Vergelijk neutrale hardloopschoenen. Lees voor wie neutrale schoenen geschikt zijn en hoe demping, pasvorm en snelheid verschillen.",
    guidance: [
      {
        title: "Neutraal betekent zonder extra correctie",
        text: "Een neutrale schoen stuurt je voet minder actief dan een stabiliteitsschoen. Dat kan prettig zijn als je geen uitgesproken steun nodig hebt."
      },
      {
        title: "Binnen neutraal zijn de verschillen groot",
        text: "Neutrale schoenen kunnen zacht, stevig, licht, breed of juist snel zijn. Vergelijk daarom altijd het gebruiksdoel en de pasvorm."
      },
      {
        title: "Twijfel je over steun, vergelijk bewust",
        text: "Als je onzeker loopt of blessuregevoelig bent, vergelijk neutrale schoenen met lichte stabiliteit in plaats van blind voor één categorie te kiezen."
      }
    ],
    faqs: [
      {
        question: "Wat is een neutrale hardloopschoen?",
        answer: "Een schoen zonder duidelijke stabiliteitscorrectie. Hij is bedoeld voor lopers die geen extra begeleiding nodig hebben of dat niet prettig vinden."
      },
      {
        question: "Zijn neutrale schoenen geschikt voor beginners?",
        answer: "Vaak wel, zolang de schoen comfortabel en voorspelbaar loopt. Beginners die meer steun willen, kunnen lichte stabiliteit vergelijken."
      },
      {
        question: "Wat is het verschil met stabiliteitsschoenen?",
        answer: "Stabiliteitsschoenen geven meer begeleiding of ondersteuning. Neutrale schoenen laten je voet meer zijn eigen beweging maken."
      }
    ],
    relatedSlugs: ["stabiliteit", "zachte-demping", "sneller-trainen"]
  },
  "prijs-kwaliteit": {
    metaDescription:
      "Vergelijk hardloopschoenen met sterke prijs-kwaliteit. Bekijk veelzijdige modellen die comfort, duurzaamheid en prijs goed combineren.",
    guidance: [
      {
        title: "Goedkoop is niet automatisch slim",
        text: "Een lage prijs is alleen interessant als de schoen past bij je loopdoel en lang genoeg bruikbaar blijft."
      },
      {
        title: "Veelzijdigheid telt zwaar mee",
        text: "Een schoen die geschikt is voor meerdere trainingen levert vaak meer waarde dan een specialistisch model dat je weinig gebruikt."
      },
      {
        title: "Let op verborgen trade-offs",
        text: "Een scherpe prijs kan samengaan met minder demping, minder duurzaamheid of een smallere pasvorm. Vergelijk daarom meerdere signalen."
      }
    ],
    faqs: [
      {
        question: "Wat is een goede prijs voor hardloopschoenen?",
        answer: "Dat hangt af van je doel en gebruik. Voor veel recreatieve lopers is een betrouwbare allround schoen met goede pasvorm waardevoller dan het goedkoopste model."
      },
      {
        question: "Welke hardloopschoenen hebben de beste prijs-kwaliteit?",
        answer: "Meestal veelzijdige daily trainers zonder dure wedstrijdtechniek. We kijken naar comfort, duurzaamheid, inzetbaarheid en prijs."
      },
      {
        question: "Moet ik wachten op korting?",
        answer: "Korting kan interessant zijn, maar koop geen schoen die niet past bij je voet of training. Pasvorm en doel blijven leidend."
      }
    ],
    relatedSlugs: ["beginners", "neutrale-hardloopschoenen", "zachte-demping"]
  }
};

export function getIntentPageSeo(slug: string) {
  return intentPageSeo[slug];
}

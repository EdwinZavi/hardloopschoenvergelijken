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
  decisionFrame?: {
    chooseBy: string;
    lessBy: string;
    commonMistake: string;
    whenNot: string;
  };
  dataNotice?: {
    label: string;
    text: string;
  };
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
      "Begin je met hardlopen? Kies vooral een schoen die comfortabel, stabiel en makkelijk loopt. Een snelle wedstrijdschoen past meestal minder goed bij eerste opbouwkilometers dan een betrouwbare trainingsschoen.",
    primaryCta: "Vind mijn eerste hardloopschoenen",
    filterHref: "/schoenen?shoeType=daily_trainer&sort=value",
    helperHref: "/keuzehulp?experienceLevel=beginner&runningGoal=start_running&targetDistance=5k&preferredSurface=road&preferredFeel=balanced",
    compareSeed: ["nike-pegasus-41", "hoka-clifton-9", "brooks-ghost-16"],
    criteria: ["loopt rustig en voorspelbaar", "comfort belangrijker dan snelheid", "geen carbonplaat nodig", "geschikt als eerste hardloopschoen"],
    decisionFrame: {
      chooseBy: "Comfort, voorspelbaarheid en een pasvorm die niet knelt tijdens rustige opbouwkilometers.",
      lessBy: "Wedstrijdtechniek, carbonplaten of het laagste gewicht; daar heb je bij eerste trainingen meestal weinig aan.",
      commonMistake: "Een snelle schoen kopen omdat hij populair is, terwijl een rustige daily trainer beter past bij starten.",
      whenNot: "Loop je al gericht intervaltraining of wedstrijden, gebruik dan de route voor sneller trainen."
    },
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
    helperHref: "/keuzehulp?fitPreference=wide&preferredSurface=road&preferredFeel=balanced",
    compareSeed: ["new-balance-fresh-foam-x-1080v13", "brooks-ghost-16", "brooks-adrenaline-gts-24"],
    criteria: ["meer ruimte bij de voorvoet", "comfort op rustige trainingen", "voldoende teenruimte", "niet te smal of strak"],
    decisionFrame: {
      chooseBy: "Ruimte bij voorvoet en tenen, plus een bovenwerk dat geen drukpunten maakt.",
      lessBy: "Alleen een hoge totaalscore; pasvorm kan een goed beoordeelde schoen alsnog ongeschikt maken.",
      commonMistake: "Alleen een maat groter nemen terwijl het probleem eigenlijk breedte of teenruimte is.",
      whenNot: "Zoek je vooral steun en niet extra breedte, start dan bij stabiliteit."
    },
    filter: (shoe) => shoe.widthLabel === "wide" || shoe.fitProfile === "roomy",
    sort: (a, b) => b.editorialScore.comfort - a.editorialScore.comfort
  },
  {
    slug: "stabiliteit",
    title: "Stabiliteitsschoenen vergelijken",
    eyebrow: "Meer steun tijdens het lopen",
    intro:
      "Een stabiliteitsschoen geeft extra steun tijdens het lopen. Een passende keuze voelt zeker en comfortabel, zonder onnodig zwaar of dwingend te worden.",
    primaryCta: "Vind schoenen met meer steun",
    filterHref: "/schoenen?shoeType=stability",
    helperHref: "/keuzehulp?supportNeed=stability&preferredSurface=road&preferredFeel=balanced",
    compareSeed: ["asics-gel-kayano-31", "brooks-adrenaline-gts-24", "hoka-arahi-7"],
    criteria: ["stabiele basis", "comfort bij langere trainingen", "niet te zwaar voor dagelijks gebruik", "verschil in gewicht meenemen"],
    decisionFrame: {
      chooseBy: "Hoe de steun voelt bij rustige en langere trainingen, niet alleen hoeveel correctie de schoen belooft.",
      lessBy: "Een zware antipronatieclaim zonder comfort, pasvorm en gewicht mee te nemen.",
      commonMistake: "Stabiliteit gebruiken als diagnose. Bij pijn of klachten blijft persoonlijk advies belangrijk.",
      whenNot: "Gaat je twijfel vooral over druk of breedte, vergelijk dan eerst pasvormroutes in plaats van steunroutes."
    },
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
    helperHref: "/keuzehulp?experienceLevel=recreational&runningGoal=faster_5k_10k&targetDistance=10k&preferredSurface=road&preferredFeel=responsive",
    compareSeed: ["saucony-endorphin-speed-4", "new-balance-fuelcell-rebel-v4", "adidas-adizero-boston-12", "asics-magic-speed-4"],
    criteria: ["veerkrachtig gevoel", "lager gewicht", "controle bij tempo", "verschil tussen training en race"],
    decisionFrame: {
      chooseBy: "Responsiviteit, gewicht en controle wanneer je versnelt.",
      lessBy: "Maximale zachtheid; een temposchoen mag directer voelen dan je rustige duurloopschoen.",
      commonMistake: "Een pure wedstrijdschoen als dagelijkse trainer gebruiken terwijl je vooral tempoblokken loopt.",
      whenNot: "Bouw je rustig op of ben je blessuregevoelig, begin dan bij beginners of zachte demping."
    },
    filter: (shoe) => shoe.shoeType === "tempo" || shoe.shoeType === "race" || shoe.responsivenessLevel === "high",
    sort: (a, b) => b.editorialScore.responsiveness - a.editorialScore.responsiveness
  },
  {
    slug: "zachte-demping",
    title: "Hardloopschoenen met veel demping",
    eyebrow: "Comfort en bescherming",
    intro:
      "Veel demping kan prettig zijn als je rustig loopt, langere afstanden maakt of minder belasting wilt voelen. Let wel op dat een zachte schoen niet per se de meest stabiele of snelle keuze is.",
    primaryCta: "Vind schoenen met veel demping",
    filterHref: "/schoenen?cushioningLevel=high&sort=editorial",
    helperHref: "/keuzehulp?runningGoal=general_fitness&preferredSurface=road&preferredFeel=soft",
    compareSeed: ["asics-gel-nimbus-26", "hoka-clifton-9", "new-balance-fresh-foam-x-1080v13", "brooks-glycerin-21"],
    criteria: ["hoge demping", "comfort bij rustige kilometers", "geschikt voor langere trainingen", "niet automatisch de snelste keuze"],
    decisionFrame: {
      chooseBy: "Comfort, bescherming en hoe stabiel de schoen blijft ondanks de zachte demping.",
      lessBy: "Alleen de hoogste zool of zachtste indruk; te zacht kan minder zeker voelen.",
      commonMistake: "Veel demping verwarren met blessurepreventie. Demping kan prettig voelen, maar lost klachten niet automatisch op.",
      whenNot: "Zoek je juist direct tempo en grondgevoel, bekijk dan de route voor sneller trainen."
    },
    filter: (shoe) => shoe.cushioningLevel === "high" && !shoe.hasCarbonPlate,
    sort: (a, b) => b.editorialScore.cushioning + b.editorialScore.comfort - (a.editorialScore.cushioning + a.editorialScore.comfort)
  },
  {
    slug: "halve-marathon",
    title: "Hardloopschoenen voor een halve marathon",
    eyebrow: "Langere afstand",
    intro:
      "Voor een halve marathon wil je een schoen die comfortabel blijft wanneer je vermoeid raakt. De keuze hangt af van je tempo, steunbehoefte en hoeveel bescherming je wilt.",
    primaryCta: "Vind mijn halve-marathonschoen",
    filterHref: "/schoenen?distanceBucket=half_marathon_plus&sort=editorial",
    helperHref: "/keuzehulp?experienceLevel=recreational&runningGoal=half_marathon_marathon&targetDistance=half_marathon&weeklyFrequency=3_4&preferredSurface=road",
    compareSeed: ["asics-gel-kayano-31", "asics-gel-nimbus-26", "nike-vomero-17", "saucony-endorphin-speed-4"],
    criteria: ["comfort over langere afstand", "voldoende stabiliteit bij vermoeidheid", "keuze tussen rustig trainen en tempo", "pasvorm belangrijker dan alleen gewicht"],
    decisionFrame: {
      chooseBy: "Comfort na veel kilometers, stabiel gevoel bij vermoeidheid en pasvorm zonder drukpunten.",
      lessBy: "Alleen wedstrijdgevoel of gewicht; training en wedstrijddag kunnen verschillende schoenen vragen.",
      commonMistake: "Een schoen pas op de wedstrijddag serieus testen.",
      whenNot: "Loop je vooral tot 5 of 10 kilometer, begin dan bij de kortere-afstandroute."
    },
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
    filterHref: "/schoenen?distanceBucket=5k_half_marathon&sort=value",
    helperHref: "/keuzehulp?runningGoal=faster_5k_10k&targetDistance=10k&preferredSurface=road&preferredFeel=responsive",
    compareSeed: ["nike-pegasus-41", "new-balance-fuelcell-rebel-v4", "saucony-endorphin-speed-4", "adidas-adizero-takumi-sen-10"],
    criteria: ["geschikt voor kortere afstanden", "balans tussen comfort en tempo", "niet onnodig agressief voor beginners", "gewicht en responsiviteit vergelijken"],
    decisionFrame: {
      chooseBy: "Of je vooral comfortabel wilt trainen of sneller wilt lopen op kortere afstanden.",
      lessBy: "Een carbonplaat als standaardoplossing; veel lopers hebben meer aan een allround of temposchoen.",
      commonMistake: "Een te agressieve schoen kiezen terwijl je nog rustige kilometers opbouwt.",
      whenNot: "Train je vooral voor langere duurlopen of een halve marathon, kies dan de halve-marathonroute."
    },
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
    helperHref: "/keuzehulp?supportNeed=neutral&preferredSurface=road&preferredFeel=balanced",
    compareSeed: ["nike-pegasus-41", "asics-gel-nimbus-26", "hoka-clifton-9", "asics-novablast-5"],
    criteria: ["geen uitgesproken stabiliteitscorrectie", "veel keuze in demping en gevoel", "pasvorm blijft doorslaggevend", "geschikt voor veel recreatieve lopers"],
    decisionFrame: {
      chooseBy: "Demping, pasvorm en gebruiksdoel binnen de neutrale categorie.",
      lessBy: "Het label neutraal alleen; neutrale schoenen kunnen alsnog heel verschillend lopen.",
      commonMistake: "Neutraal kiezen terwijl je eigenlijk onzeker loopt en lichte steun wilt vergelijken.",
      whenNot: "Wil je extra begeleiding, vergelijk dan stabiliteitsschoenen of vul de keuzehulp in."
    },
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
    filterHref: "/schoenen?surfaceType=trail&sort=editorial",
    helperHref: "/keuzehulp?runningGoal=trail_running&targetDistance=trail&preferredSurface=trail",
    compareSeed: ["hoka-speedgoat-6", "nike-zegama-2", "brooks-cascadia-18"],
    criteria: ["grip op onverhard terrein", "bescherming belangrijker dan pure snelheid", "let op pasvorm bij afdalen", "weg- en trailschoenen niet zomaar uitwisselen"],
    decisionFrame: {
      chooseBy: "Grip, bescherming en stabiliteit op de ondergrond waar je echt loopt.",
      lessBy: "Wegsnelheid of veel zachte demping zonder profiel; op modder, stenen of bospaden telt grip zwaarder.",
      commonMistake: "Een gewone wegschoen gebruiken op technische trails omdat hij comfortabel voelt op asfalt.",
      whenNot: "Loop je alleen af en toe over een droog schelpenpad, dan kan een gewone wegschoen of mixed keuze genoeg zijn."
    },
    filter: (shoe) => shoe.shoeType === "trail" || shoe.surfaceType === "trail" || shoe.surfaceType === "mixed",
    sort: (a, b) => b.editorialScore.grip - a.editorialScore.grip
  },
  {
    slug: "carbon-wedstrijdschoenen",
    title: "Carbon hardloopschoenen voor wedstrijden",
    eyebrow: "Wedstrijd en prestatie",
    intro:
      "Carbon hardloopschoenen kunnen efficiënt en snel aanvoelen, maar passen niet bij iedere training. Ze vragen vaak om gewenning en zijn minder geschikt als eerste hardloopschoen.",
    primaryCta: "Vergelijk wedstrijdschoenen",
    filterHref: "/schoenen?hasCarbonPlate=true",
    helperHref: "/keuzehulp?experienceLevel=experienced&runningGoal=faster_5k_10k&targetDistance=10k&preferredSurface=road&preferredFeel=responsive",
    compareSeed: ["adidas-adizero-adios-pro-3", "nike-vaporfly-3", "asics-magic-speed-4"],
    criteria: ["gericht op wedstrijdtempo", "responsief en licht", "minder geschikt voor rustige beginnerskilometers", "prijs en duurzaamheid kritisch bekijken"],
    decisionFrame: {
      chooseBy: "Wedstrijdtempo, ervaring met snelle schoenen en of je de schoen echt voor racedagen gebruikt.",
      lessBy: "Dagelijks comfort, duurzaamheid of prijs-kwaliteit; carbon is vaak specialistischer en duurder.",
      commonMistake: "Een carbon wedstrijdschoen kopen als eerste hardloopschoen.",
      whenNot: "Loop je vooral normale trainingen, vergelijk dan temposchoenen of allround trainers zonder carbon."
    },
    filter: (shoe) => shoe.hasCarbonPlate || shoe.shoeType === "race",
    sort: (a, b) => b.editorialScore.responsiveness - a.editorialScore.responsiveness
  },
  {
    slug: "prijs-kwaliteit",
    title: "Hardloopschoenen met sterke prijs-kwaliteit",
    eyebrow: "Slim kiezen",
    intro:
      "Sterke prijs-kwaliteit zit niet vanzelf bij de laagste prijs. Kijk vooral naar veelzijdigheid, duurzaamheid, comfort en of je de schoen voor meerdere trainingen kunt gebruiken.",
    primaryCta: "Vind slimme keuzes",
    filterHref: "/schoenen?sort=value",
    helperHref: "/keuzehulp?runningGoal=general_fitness&preferredSurface=road&preferredFeel=balanced&budgetMax=170",
    compareSeed: ["nike-pegasus-41", "brooks-ghost-16", "mizuno-wave-rider-28", "asics-novablast-5"],
    criteria: ["veelzijdig inzetbaar", "sterke balans tussen comfort en prijs", "geen onnodige wedstrijdtechniek", "geschikt voor recreatieve lopers"],
    decisionFrame: {
      chooseBy: "Veelzijdigheid, comfort, duurzaamheid en of de schoen binnen je echte gebruik past.",
      lessBy: "Alleen de laagste prijs; goedkoop wordt duur als de pasvorm of inzetbaarheid niet klopt.",
      commonMistake: "Een aanbieding kopen die niet past bij je loopdoel, voetbreedte of trainingsfrequentie.",
      whenNot: "Zoek je een wedstrijdschoen, trailschoen of antwoord op een steunvraag, kies dan eerst de inhoudelijke route."
    },
    dataNotice: {
      label: "Voorlopige route: prijsdata in opbouw",
      text:
        "Deze pagina gebruikt nu vooral redactionele waarde-signalen zoals veelzijdigheid en inzetbaarheid. Gecontroleerde winkelprijzen en voorraad zijn nog beperkt, dus controleer de actuele prijs en retourvoorwaarden altijd bij de winkel."
    },
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
      "Bekijk welke hardloopschoenen passen bij beginners. Vergelijk comfort, steun, demping en prijs zonder direct naar een wedstrijdschoen te grijpen.",
    guidance: [
      {
        title: "Begin met comfort en rust",
        text: "Als beginner heb je vooral baat bij een schoen die voorspelbaar loopt. Een allround trainingsschoen of lichte stabiliteitsschoen voelt meestal zekerder dan een agressieve wedstrijdschoen."
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
        question: "Welk type hardloopschoen past vaak bij beginners?",
        answer: "Vaak een comfortabele daily trainer met voldoende demping en een voorspelbaar loopgevoel. Zak je snel naar binnen of loop je onzeker, vergelijk dan ook lichte stabiliteit."
      },
      {
        question: "Moet ik als beginner een dure hardloopschoen kopen?",
        answer: "Nee. Koop liever een betrouwbare schoen die past bij je voet en trainingen dan een duur topmodel met technieken die je nog niet nodig hebt."
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
        text: "Sommige modellen zijn beschikbaar in brede maten, andere voelen ruimer door het bovenwerk. Neem drukpunten serieus, ook als de maat op papier klopt."
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
        answer: "Soms werkt dat, maar het lost breedte niet automatisch op. Een bredere leest of wide-uitvoering is vaak beter dan alleen langer kopen."
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
        text: "Een stabiliteitsschoen kan je loopgevoel rustiger maken, maar vervangt geen advies van een fysiotherapeut, podoloog of arts bij pijnklachten."
      }
    ],
    faqs: [
      {
        question: "Wanneer heb ik stabiliteitsschoenen nodig?",
        answer: "Als je meer begeleiding wilt, vaak naar binnen zakt of je met neutrale schoenen onzeker voelt. Bij pijn of terugkerende klachten blijft persoonlijk advies belangrijk."
      },
      {
        question: "Zijn stabiliteitsschoenen vaak zwaarder?",
        answer: "Vaak iets, maar moderne modellen verschillen sterk. Vergelijk daarom ook gewicht, demping en comfort."
      },
      {
        question: "Kan een beginner stabiliteitsschoenen gebruiken?",
        answer: "Ja, vooral als de schoen rustig en comfortabel loopt. Het hoeft geen zware correctieschoen te zijn."
      }
    ],
    relatedSlugs: ["beginners", "neutrale-hardloopschoenen", "halve-marathon"]
  },
  "sneller-trainen": {
    metaDescription:
      "Vergelijk hardloopschoenen voor sneller trainen. Bekijk temposchoenen op responsiviteit, gewicht, controle en het verschil met wedstrijdschoenen.",
    guidance: [
      {
        title: "Tempo vraagt om controle",
        text: "Een snelle schoen moet niet alleen veerkrachtig voelen, maar ook controle geven wanneer je versnelt of vermoeid raakt."
      },
      {
        title: "Niet elke snelle schoen is een daily trainer",
        text: "Temposchoenen en wedstrijdschoenen kunnen prettig zijn voor blokken en wedstrijden, maar zijn meestal niet bedoeld voor al je rustige kilometers."
      },
      {
        title: "Houd je ervaring mee in beeld",
        text: "Begin je net, dan heb je vaak meer aan een rustige trainingsschoen dan aan een agressiever model dat om gewenning vraagt."
      }
    ],
    faqs: [
      {
        question: "Wanneer kies ik een temposchoen?",
        answer: "Als je regelmatig intervallen, tempoblokken of snelle 5 tot 10 kilometertrainingen loopt en een directer gevoel wilt dan in je dagelijkse trainer."
      },
      {
        question: "Is een wedstrijdschoen geschikt voor training?",
        answer: "Soms voor specifieke snelle trainingen, maar meestal niet als enige trainingsschoen. Let op stabiliteit, duurzaamheid en gewenning."
      },
      {
        question: "Moet een snelle schoen altijd carbon hebben?",
        answer: "Nee. Er zijn ook snelle trainers zonder carbonplaat die lichter en directer voelen, maar breder inzetbaar blijven."
      }
    ],
    relatedSlugs: ["5k-10k", "carbon-wedstrijdschoenen", "prijs-kwaliteit"]
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
        title: "Zacht voelt niet per se stabiel",
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
        text: "Op een halve marathon merk je of een schoen blijft zitten, stabiel voelt en voldoende bescherming geeft."
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
        answer: "Schoenen die comfort, voldoende demping en stabiliteit combineren. Snellere lopers kunnen daarnaast een tempo- of wedstrijdschoen overwegen."
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
  "5k-10k": {
    metaDescription:
      "Vergelijk hardloopschoenen voor 5 km en 10 km. Kies tussen allround trainers en temposchoenen op comfort, gewicht en responsiviteit.",
    guidance: [
      {
        title: "Comfort of tempo eerst",
        text: "Voor rustige 5 en 10 kilometertrainingen is comfort vaak genoeg. Voor snelheid wegen gewicht en responsiviteit zwaarder."
      },
      {
        title: "Korte afstand betekent niet automatisch agressief",
        text: "Veel lopers zijn beter geholpen met een allround of temposchoen dan met een pure wedstrijdschoen."
      },
      {
        title: "Vergelijk het gebruik naast de afstand",
        text: "Een schoen voor één snelle wedstrijd is iets anders dan een model dat je wekelijks voor trainingen gebruikt."
      }
    ],
    faqs: [
      {
        question: "Welke schoen past bij 5 km of 10 km?",
        answer: "Dat hangt af van je doel. Voor rustig trainen werkt vaak een allround schoen; voor sneller lopen kan een temposchoen beter passen."
      },
      {
        question: "Heb ik voor 10 km een carbonplaat nodig?",
        answer: "Nee. Carbon kan snel voelen voor ervaren lopers, maar is geen noodzakelijke keuze voor 10 kilometer."
      },
      {
        question: "Kan ik dezelfde schoen gebruiken voor 5 km en dagelijkse trainingen?",
        answer: "Ja, als de schoen comfortabel genoeg is voor rustige kilometers en niet te specialistisch of instabiel aanvoelt."
      }
    ],
    relatedSlugs: ["sneller-trainen", "beginners", "neutrale-hardloopschoenen"]
  },
  "neutrale-hardloopschoenen": {
    metaDescription:
      "Vergelijk neutrale hardloopschoenen. Lees voor wie neutrale schoenen geschikt zijn en hoe demping, pasvorm en snelheid verschillen.",
    guidance: [
      {
        title: "Neutraal betekent zonder extra correctie",
        text: "Een neutrale schoen stuurt je voet minder actief dan een stabiliteitsschoen. Dat kan prettig zijn wanneer je geen uitgesproken steun nodig hebt."
      },
      {
        title: "Binnen neutraal zijn de verschillen groot",
        text: "Neutrale schoenen kunnen zacht, stevig, licht, breed of juist snel zijn. Vergelijk daarom steeds het gebruiksdoel en de pasvorm."
      },
      {
        title: "Twijfel je over steun, vergelijk bewust",
        text: "Loop je onzeker of ben je blessuregevoelig, vergelijk neutrale schoenen dan met lichte stabiliteit in plaats van blind voor één categorie te kiezen."
      }
    ],
    faqs: [
      {
        question: "Wat is een neutrale hardloopschoen?",
        answer: "Een schoen zonder duidelijke stabiliteitscorrectie. Hij is bedoeld voor lopers die geen extra begeleiding nodig hebben of dat niet prettig vinden."
      },
      {
        question: "Zijn neutrale schoenen geschikt voor beginners?",
        answer: "Vaak wel, zolang de schoen comfortabel en voorspelbaar loopt. Wil je als beginner meer steun, vergelijk dan lichte stabiliteit."
      },
      {
        question: "Wat is het verschil met stabiliteitsschoenen?",
        answer: "Stabiliteitsschoenen geven meer begeleiding of ondersteuning. Neutrale schoenen laten je voet meer zijn eigen beweging maken."
      }
    ],
    relatedSlugs: ["stabiliteit", "zachte-demping", "sneller-trainen"]
  },
  trail: {
    metaDescription:
      "Vergelijk trailschoenen voor onverhard lopen. Lees hoe grip, bescherming, stabiliteit en pasvorm verschillen per trailondergrond.",
    guidance: [
      {
        title: "Grip is de eerste keuzevraag",
        text: "Op bospaden, modder, stenen of gravel heb je meer aan passend profiel en zekerheid dan aan alleen veel demping."
      },
      {
        title: "Bescherming telt op ruwe stukken",
        text: "Trailschoenen kunnen extra bescherming geven tegen stenen, wortels en glijden. Dat maakt ze anders dan gewone wegschoenen."
      },
      {
        title: "Pasvorm moet blijven zitten",
        text: "Bij dalen en bochten is een te ruime of schuivende schoen onrustig. Controleer daarom breedte en lockdown naast grip."
      }
    ],
    faqs: [
      {
        question: "Wanneer heb ik trailschoenen nodig?",
        answer: "Voor regelmatige onverharde routes met modder, bosgrond, stenen of technische paden. Voor licht gravel kan een gewone wegschoen soms volstaan."
      },
      {
        question: "Kan ik met trailschoenen op asfalt lopen?",
        answer: "Korte stukken kunnen vaak wel, maar profiel en zool zijn meestal gebouwd voor onverhard terrein en kunnen op asfalt minder soepel lopen of sneller slijten."
      },
      {
        question: "Waar let ik op bij trailschoenen?",
        answer: "Grip, bescherming, stabiliteit, pasvorm bij afdalen en of de schoen past bij de ondergrond waarop je meestal loopt."
      }
    ],
    relatedSlugs: ["zachte-demping", "prijs-kwaliteit", "halve-marathon"]
  },
  "carbon-wedstrijdschoenen": {
    metaDescription:
      "Vergelijk carbon hardloopschoenen voor wedstrijden. Lees wanneer carbon logisch is en wanneer een tempo- of trainingsschoen verstandiger blijft.",
    guidance: [
      {
        title: "Carbon is specialistisch",
        text: "Een carbonplaat kan snel en efficiënt voelen, maar vraagt meestal om tempo, ervaring en gewenning."
      },
      {
        title: "Neem prijs en duurzaamheid mee",
        text: "Carbon wedstrijdschoenen zijn vaak duurder en minder veelzijdig. Kijk dus of je ze echt voor racedagen gebruikt."
      },
      {
        title: "Niet ideaal als eerste schoen",
        text: "Voor beginners of rustige opbouw is een stabiele trainingsschoen meestal een betere eerste keuze."
      }
    ],
    faqs: [
      {
        question: "Wanneer kies ik carbon hardloopschoenen?",
        answer: "Voor wedstrijden of snelle trainingen als je ervaring hebt met directere schoenen en de schoen echt voor tempo gebruikt."
      },
      {
        question: "Zijn carbon schoenen geschikt voor beginners?",
        answer: "Meestal niet als eerste schoen. Ze zijn specialistischer, duurder en minder geschikt voor rustige opbouwkilometers."
      },
      {
        question: "Is carbon altijd sneller?",
        answer: "Niet voor iedereen. Het voordeel hangt af van tempo, loopstijl, gewenning en of de schoen stabiel genoeg voelt."
      }
    ],
    relatedSlugs: ["sneller-trainen", "5k-10k", "halve-marathon"]
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
        text: "Een schoen die geschikt is voor meerdere trainingen levert vaak meer waarde dan een specialistisch model dat in de kast blijft staan."
      },
      {
        title: "Let op verborgen trade-offs",
        text: "Een scherpe prijs kan samengaan met minder demping, minder duurzaamheid of een smallere pasvorm. Vergelijk daarom meerdere signalen."
      }
    ],
    faqs: [
      {
        question: "Wat is een goede prijs voor hardloopschoenen?",
        answer: "Dat hangt af van je doel en gebruik. Voor veel recreatieve lopers is een betrouwbare allround schoen met goede pasvorm waardevoller dan het laagst geprijsde model."
      },
      {
        question: "Welke hardloopschoenen bieden vaak sterke prijs-kwaliteit?",
        answer: "Vaak veelzijdige daily trainers zonder dure wedstrijdtechniek. Kijk naar comfort, duurzaamheid, inzetbaarheid en prijs."
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

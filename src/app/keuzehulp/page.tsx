import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { RecommendationCard } from "@/components/RecommendationCard";
import { defaultProfile, getRecommendations } from "@/lib/recommendations";
import type { RecommendationProfile } from "@/types/recommendation";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export const metadata: Metadata = {
  title: "Keuzehulp hardloopschoenen | Vind schoenen die bij jou passen",
  description:
    "Beantwoord vragen over loopdoel, ondergrond, steun, pasvorm en budget. Je krijgt schoenen met uitleg, nadelen en controlepunten.",
  alternates: {
    canonical: "/keuzehulp"
  }
};

type Option<T extends string> = {
  value: T;
  label: string;
  description: string;
};

type ProfileQuestionKey = Exclude<keyof RecommendationProfile, "budgetMax">;

type Question<T extends ProfileQuestionKey> = {
  key: T;
  title: string;
  helper: string;
  options: Option<Extract<RecommendationProfile[T], string>>[];
};

const questions: Question<ProfileQuestionKey>[] = [
  {
    key: "experienceLevel",
    title: "Hoeveel ervaring heb je met hardlopen?",
    helper: "Je hoeft dit niet precies te weten. Bij twijfel krijgen voorspelbare trainingsschoenen meer gewicht.",
    options: [
      { value: "not_sure", label: "Weet ik nog niet", description: "Neem een rustige start als uitgangspunt." },
      { value: "beginner", label: "Beginner", description: "Ik bouw net op of loop nog onregelmatig." },
      { value: "recreational", label: "Recreatief", description: "Ik loop geregeld en wil vooral prettig trainen." },
      { value: "experienced", label: "Ervaren", description: "Ik vergelijk bewuster op tempo, gewicht en specifieke eigenschappen." }
    ]
  },
  {
    key: "runningGoal",
    title: "Waarvoor wil je de schoenen vooral gebruiken?",
    helper: "Een rustige training vraagt iets anders dan een snelle 10 kilometer of een rondje door het bos.",
    options: [
      { value: "not_sure", label: "Weet ik nog niet", description: "Geef veelzijdige trainingsschoenen voorrang." },
      { value: "start_running", label: "Rustig beginnen", description: "Ik wil vooral comfortabel en gecontroleerd opbouwen." },
      { value: "general_fitness", label: "Fit blijven", description: "Ik zoek een fijne schoen voor gewone trainingen." },
      { value: "faster_5k_10k", label: "Sneller lopen", description: "Ik wil meer tempo maken op 5 of 10 kilometer." },
      { value: "half_marathon_marathon", label: "Langere afstanden", description: "Ik train voor een halve of hele marathon." },
      { value: "trail_running", label: "Onverhard lopen", description: "Ik loop vooral op bospaden, zand, modder of trailroutes." }
    ]
  },
  {
    key: "targetDistance",
    title: "Welke afstand loop je meestal of wil je opbouwen?",
    helper: "Een 5 kilometer vraagt iets anders dan lange duurlopen. Als je twijfelt, houden we de keuze breed.",
    options: [
      { value: "not_sure", label: "Nog niet zeker", description: "Ik wil eerst een allround advies." },
      { value: "5k", label: "Tot 5 km", description: "Korte rustige rondes of eerste opbouw." },
      { value: "10k", label: "Rond 10 km", description: "Regelmatige trainingen en iets langere rondes." },
      { value: "half_marathon", label: "Halve marathon", description: "Langere duurlopen waarbij comfort zwaarder weegt." },
      { value: "marathon", label: "Marathon", description: "Veel kilometers en langdurige bescherming zijn belangrijk." },
      { value: "trail", label: "Trailafstand", description: "De route en grip wegen zwaarder dan exacte kilometers." }
    ]
  },
  {
    key: "weeklyFrequency",
    title: "Hoe vaak train je meestal per week?",
    helper: "Bij meer trainingen wordt duurzaamheid, comfort en voorspelbaarheid belangrijker.",
    options: [
      { value: "not_sure", label: "Wisselt nog", description: "Ik wil een schoen die breed inzetbaar blijft." },
      { value: "1_2", label: "1-2 keer", description: "Ik loop af en toe of bouw rustig op." },
      { value: "3_4", label: "3-4 keer", description: "Ik train regelmatig en zoek een betrouwbare basisschoen." },
      { value: "5_plus", label: "5+ keer", description: "Ik maak veel kilometers en wil goed kunnen afwisselen." }
    ]
  },
  {
    key: "preferredSurface",
    title: "Waar loop je meestal?",
    helper: "Asfalt en trail vragen om andere zolen, grip en bescherming.",
    options: [
      { value: "not_sure", label: "Nog niet zeker", description: "Neem een veelzijdige weg- of mixed schoen als startpunt." },
      { value: "road", label: "Op de weg", description: "Asfalt, stoep, fietspad of verharde paden." },
      { value: "trail", label: "Op trail", description: "Bos, zand, modder, stenen of smalle paden." },
      { value: "mixed", label: "Gemengd", description: "Ik wissel weg en onverhard af." }
    ]
  },
  {
    key: "supportNeed",
    title: "Hoeveel steun wil je van je schoen?",
    helper: "Twijfel je? Dan krijgen stabiele, makkelijk lopende opties meer gewicht.",
    options: [
      { value: "not_sure", label: "Weet ik niet", description: "Geef stabiele, voorspelbare modellen voorrang." },
      { value: "neutral", label: "Neutraal", description: "Ik heb geen extra stabiliteit nodig." },
      { value: "some_support", label: "Wat extra steun", description: "Ik wil stabiliteit zonder zware correctie." },
      { value: "stability", label: "Veel steun", description: "Ik zoek duidelijke steun tijdens het lopen." }
    ]
  },
  {
    key: "injurySensitivity",
    title: "Moeten we extra voorzichtig zijn met pijntjes of blessuregevoeligheid?",
    helper: "Dit is geen medische diagnose. Bij pijn of terugkerende klachten blijft advies van een specialist belangrijk.",
    options: [
      { value: "not_sure", label: "Weet ik niet", description: "Gebruik geen medische aanname in het advies." },
      { value: "low", label: "Niet bijzonder", description: "Ik heb geen extra voorzichtigheid nodig." },
      { value: "medium", label: "Soms gevoelig", description: "Comfort en steun mogen zwaarder meewegen." },
      { value: "high", label: "Extra voorzichtig", description: "Geef rustige steun- en comfortsignalen voorrang." }
    ]
  },
  {
    key: "preferredFeel",
    title: "Hoe wil je dat de schoen voelt?",
    helper: "Dit gaat over het gevoel onder je voet: zacht, normaal of juist snel.",
    options: [
      { value: "not_sure", label: "Weet ik niet", description: "Kies een neutraal loopgevoel als uitgangspunt." },
      { value: "balanced", label: "Normaal en stabiel", description: "Niet te zacht en niet te fel." },
      { value: "soft", label: "Zacht en comfortabel", description: "Prettig voor rustige kilometers." },
      { value: "responsive", label: "Snel en veerkrachtig", description: "Meer energie bij tempo en intervallen." }
    ]
  },
  {
    key: "fitPreference",
    title: "Hoe breed moet de schoen voelen?",
    helper: "Een goede hardloopschoen moet niet knellen. Pasvorm kan belangrijker zijn dan een hoge score.",
    options: [
      { value: "not_sure", label: "Weet ik niet", description: "Gebruik een normale pasvorm als startpunt." },
      { value: "regular", label: "Normaal", description: "Standaard pasvorm werkt meestal goed voor mij." },
      { value: "wide", label: "Ruimer", description: "Ik heb bredere voeten of wil meer ruimte bij mijn tenen." },
      { value: "narrow", label: "Smaller", description: "Ik wil dat de schoen wat strakker om mijn voet zit." }
    ]
  }
];

const totalSteps = questions.length + 1;

const profileValueOptions = {
  experienceLevel: ["not_sure", "beginner", "recreational", "experienced"],
  runningGoal: ["not_sure", "start_running", "general_fitness", "faster_5k_10k", "half_marathon_marathon", "trail_running"],
  targetDistance: ["not_sure", "5k", "10k", "half_marathon", "marathon", "trail"],
  weeklyFrequency: ["not_sure", "1_2", "3_4", "5_plus"],
  preferredSurface: ["not_sure", "road", "trail", "mixed"],
  preferredFeel: ["not_sure", "soft", "balanced", "responsive"],
  supportNeed: ["neutral", "some_support", "stability", "not_sure"],
  injurySensitivity: ["not_sure", "low", "medium", "high"],
  fitPreference: ["narrow", "regular", "wide", "not_sure"]
} as const satisfies { [K in ProfileQuestionKey]: readonly RecommendationProfile[K][] };

const profileSummaryOrder = [
  "experienceLevel",
  "runningGoal",
  "targetDistance",
  "weeklyFrequency",
  "preferredSurface",
  "supportNeed",
  "injurySensitivity",
  "preferredFeel",
  "fitPreference"
] as const satisfies readonly ProfileQuestionKey[];

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function readProfileValue<K extends ProfileQuestionKey>(
  searchParams: Record<string, string | string[] | undefined>,
  key: K,
  fallback: RecommendationProfile[K]
) {
  const rawValue = firstValue(searchParams[key]);
  return rawValue && (profileValueOptions[key] as readonly string[]).includes(rawValue) ? (rawValue as RecommendationProfile[K]) : fallback;
}

function readBudget(searchParams: Record<string, string | string[] | undefined>) {
  const rawValue = firstValue(searchParams.budgetMax);
  if (!rawValue?.trim()) return undefined;
  const budget = Number(rawValue);
  return Number.isFinite(budget) && budget > 0 ? budget : undefined;
}

function getStep(searchParams: Record<string, string | string[] | undefined>) {
  const step = Number(firstValue(searchParams.step) ?? "0");
  return Number.isFinite(step) ? Math.max(0, Math.min(step, totalSteps)) : 0;
}

function getProfile(searchParams: Record<string, string | string[] | undefined>): RecommendationProfile {
  return {
    ...defaultProfile,
    experienceLevel: readProfileValue(searchParams, "experienceLevel", defaultProfile.experienceLevel),
    runningGoal: readProfileValue(searchParams, "runningGoal", defaultProfile.runningGoal),
    targetDistance: readProfileValue(searchParams, "targetDistance", defaultProfile.targetDistance),
    weeklyFrequency: readProfileValue(searchParams, "weeklyFrequency", defaultProfile.weeklyFrequency),
    preferredSurface: readProfileValue(searchParams, "preferredSurface", defaultProfile.preferredSurface),
    preferredFeel: readProfileValue(searchParams, "preferredFeel", defaultProfile.preferredFeel),
    supportNeed: readProfileValue(searchParams, "supportNeed", defaultProfile.supportNeed),
    injurySensitivity: readProfileValue(searchParams, "injurySensitivity", defaultProfile.injurySensitivity),
    fitPreference: readProfileValue(searchParams, "fitPreference", defaultProfile.fitPreference),
    budgetMax: readBudget(searchParams)
  };
}

function makeHref(profile: RecommendationProfile, step: number, patch: Partial<RecommendationProfile> = {}) {
  const nextProfile = { ...profile, ...patch };
  const params = new URLSearchParams();
  params.set("step", String(step));
  Object.entries(nextProfile).forEach(([key, value]) => {
    if (value !== undefined) params.set(key, String(value));
  });
  return `/keuzehulp?${params.toString()}#keuzehulp-vraag`;
}

function makeSkipHref(profile: RecommendationProfile, step: number, question?: Question<ProfileQuestionKey>) {
  return question ? makeHref(profile, step + 1, { [question.key]: "not_sure" } as Partial<RecommendationProfile>) : makeHref(profile, step + 1);
}

function makeCompareHref(ids: string[]) {
  const selectedIds = [...new Set(ids)].slice(0, 4);
  return selectedIds.length >= 2 ? `/vergelijken?ids=${selectedIds.join(",")}` : "/vergelijken";
}

function profileValueLabel(profile: RecommendationProfile, key: ProfileQuestionKey) {
  switch (key) {
    case "experienceLevel":
      return {
        not_sure: "Onbekend, daarom rustig uitgangspunt",
        beginner: "Beginner",
        recreational: "Recreatief",
        experienced: "Ervaren"
      }[profile.experienceLevel];
    case "runningGoal":
      return {
        not_sure: "Nog geen vast doel",
        start_running: "Rustig beginnen",
        general_fitness: "Fit blijven",
        faster_5k_10k: "Sneller op 5 of 10 km",
        half_marathon_marathon: "Langere afstanden",
        trail_running: "Onverhard lopen"
      }[profile.runningGoal];
    case "targetDistance":
      return {
        not_sure: "Nog niet zeker",
        "5k": "Tot 5 km",
        "10k": "Rond 10 km",
        half_marathon: "Halve marathon",
        marathon: "Marathon",
        trail: "Trailafstand"
      }[profile.targetDistance];
    case "weeklyFrequency":
      return {
        not_sure: "Wisselt nog",
        "1_2": "1-2 keer per week",
        "3_4": "3-4 keer per week",
        "5_plus": "5+ keer per week"
      }[profile.weeklyFrequency];
    case "preferredSurface":
      return {
        not_sure: "Nog niet zeker",
        road: "Weg en verhard",
        trail: "Trail en onverhard",
        mixed: "Gemengd"
      }[profile.preferredSurface];
    case "supportNeed":
      return {
        not_sure: "Weet ik niet",
        neutral: "Neutraal",
        some_support: "Wat extra steun",
        stability: "Veel steun"
      }[profile.supportNeed];
    case "injurySensitivity":
      return {
        not_sure: "Geen medische aanname",
        low: "Niet bijzonder",
        medium: "Soms gevoelig",
        high: "Extra voorzichtig"
      }[profile.injurySensitivity];
    case "preferredFeel":
      return {
        not_sure: "Neutraal uitgangspunt",
        soft: "Zacht en comfortabel",
        balanced: "Normaal en stabiel",
        responsive: "Snel en veerkrachtig"
      }[profile.preferredFeel];
    case "fitPreference":
      return {
        not_sure: "Weet ik niet",
        narrow: "Smaller",
        regular: "Normaal",
        wide: "Ruimer"
      }[profile.fitPreference];
  }
}

function profileFieldLabel(key: ProfileQuestionKey) {
  return {
    experienceLevel: "Ervaring",
    runningGoal: "Doel",
    targetDistance: "Afstand",
    weeklyFrequency: "Training",
    preferredSurface: "Ondergrond",
    supportNeed: "Steun",
    injurySensitivity: "Pijntjes",
    preferredFeel: "Gevoel",
    fitPreference: "Pasvorm"
  }[key];
}

function profileSummaryItems(profile: RecommendationProfile) {
  return [
    ...profileSummaryOrder.map((key) => ({
      label: profileFieldLabel(key),
      value: profileValueLabel(profile, key)
    })),
    {
      label: "Budget",
      value: profile.budgetMax ? `Maximaal €${profile.budgetMax}` : "Geen harde budgetgrens"
    }
  ];
}

export default async function ChoiceHelperPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const step = getStep(params);
  const profile = getProfile(params);
  const isBudgetStep = step === questions.length;
  const isResultsStep = step >= totalSteps;
  const isIntroStep = step === 0 && !isResultsStep;
  const currentQuestion = questions[step];
  const recommendations = isResultsStep ? getRecommendations(profile) : [];
  const compareHref = makeCompareHref(recommendations.map(({ shoe }) => shoe.id));
  const summaryItems = profileSummaryItems(profile);

  return (
    <main className="page-helper">
      {isIntroStep ? (
        <section className="page-hero-with-visual image-hero image-hero-surfaces">
          <div>
            <p className="eyebrow">Keuzehulp hardloopschoenen</p>
            <h1>Welke hardloopschoen past bij jou?</h1>
            <p className="lead">
              Beantwoord korte vragen over ervaring, doel, afstand, training, ondergrond, steun, pijntjes, gevoel, pasvorm en budget. Weet je iets niet, dan nemen we geen harde aanname.
            </p>
          </div>
          <div className="page-hero-visual page-hero-visual-portrait">
            <Image
              alt="Hardloper op een rustige weg als beeld voor persoonlijk passend hardloopschoenadvies"
              fill
              priority
              sizes="(max-width: 820px) 100vw, 360px"
              src="/images/home/choice-road-runner.png"
            />
          </div>
        </section>
      ) : (
        <section className="helper-compact-intro">
          <p className="eyebrow">Keuzehulp hardloopschoenen</p>
          <h1>Welke hardloopschoen past bij jou?</h1>
        </section>
      )}

      {!isResultsStep ? (
        <section className="helper-shell helper-shell-visual" id="keuzehulp-vraag" aria-label="Keuzehulp vragen">
          <div className="helper-progress">
            <span>
              Stap {Math.min(step + 1, totalSteps)} van {totalSteps} · onbekend mag ook
            </span>
            <div aria-hidden="true">
              <span style={{ width: `${(Math.min(step + 1, totalSteps) / totalSteps) * 100}%` }} />
            </div>
          </div>

          <div className="helper-flow-layout">
            <div className="helper-flow-main">
              {currentQuestion && !isBudgetStep ? (
                <div>
                  <p className="eyebrow">Vraag</p>
                  <h2>{currentQuestion.title}</h2>
                  <p>{currentQuestion.helper}</p>
                  <div className="option-grid">
                    {currentQuestion.options.map((option) => {
                      const selected = profile[currentQuestion.key] === option.value;
                      return (
                        <Link
                          aria-current={selected ? "true" : undefined}
                          className={selected ? "option-card selected" : "option-card"}
                          href={makeHref(profile, step + 1, { [currentQuestion.key]: option.value })}
                          key={option.value}
                        >
                          <strong>{option.label}</strong>
                          <span>{option.description}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <form action="/keuzehulp" className="budget-form">
                  <input name="step" type="hidden" value={totalSteps} />
                  {Object.entries(profile).map(([key, value]) =>
                    key === "budgetMax" || value === undefined ? null : <input key={key} name={key} type="hidden" value={String(value)} />
                  )}
                  <p className="eyebrow">Budget</p>
                  <h2>Wat wil je maximaal uitgeven?</h2>
                  <p>Vul alleen een harde grens in als je die hebt. Budget mag ordenen, maar pasvorm, steun en rustig gebruik blijven belangrijker.</p>
                  <label className="budget-control">
                    <span>Maximaal budget in euro</span>
                    <input name="budgetMax" type="number" min="80" max="300" step="10" placeholder="Bijvoorbeeld 170" defaultValue={profile.budgetMax ?? ""} />
                  </label>
                  <div className="helper-actions">
                    <Link className="button secondary" href={makeHref(profile, step - 1)}>
                      Vorige
                    </Link>
                    <Link className="button secondary" href={makeHref(profile, totalSteps, { budgetMax: undefined })}>
                      Geen budgetgrens
                    </Link>
                    <button className="button" type="submit">
                      Bekijk mijn advies
                    </button>
                  </div>
                </form>
              )}

              {!isBudgetStep ? (
                <div className="helper-actions">
                  {step > 0 ? (
                    <Link className="button secondary" href={makeHref(profile, step - 1)}>
                      Vorige
                    </Link>
                  ) : (
                    <span />
                  )}
                  <Link className="button secondary" href={makeSkipHref(profile, step, currentQuestion)}>
                    Weet ik niet
                  </Link>
                </div>
              ) : null}
            </div>

            <aside className="helper-flow-card" aria-label="Profielcontext">
              <span>Profiel in opbouw</span>
              <strong>{Math.min(step + 1, totalSteps)} van {totalSteps} stappen</strong>
              <p>We gebruiken onbekende antwoorden voorzichtig. Het advies blijft een shortlist, geen medische conclusie.</p>
              <div>
                {summaryItems.slice(0, 5).map((item) => (
                  <small key={item.label}>
                    <b>{item.label}</b>
                    <em>{item.value}</em>
                  </small>
                ))}
              </div>
            </aside>
          </div>
        </section>
      ) : (
        <section aria-label="Keuzehulp resultaten">
          <div className="result-header">
            <div>
              <p className="eyebrow">Jouw advies</p>
              <h2>Deze hardloopschoenen sluiten aan op je antwoorden</h2>
              <p>
                De matchscore gaat over jouw antwoorden. De redactionele score en prijsinformatie blijven apart, zodat productkwaliteit, pasvorm en koopinformatie niet door elkaar lopen.
              </p>
            </div>
            <div className="helper-actions">
              <Link className="button secondary" href="/keuzehulp">
                Keuzehulp opnieuw doen
              </Link>
              <Link className="button" href={compareHref}>
                Vergelijk aanbevolen schoenen
              </Link>
            </div>
          </div>

          <section className="decision-panel" aria-label="Je antwoorden">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Je antwoorden</p>
                <h2>Dit profiel gebruiken we voor je match</h2>
                <p>
                  Onbekende antwoorden blijven zichtbaar. We gebruiken ze als voorzichtige standaard, niet als harde aanname over je lichaam of loopstijl.
                </p>
              </div>
            </div>
            <div className="policy-summary">
              {summaryItems.map((item) => (
                <article key={item.label}>
                  <strong>{item.label}</strong>
                  <span>{item.value}</span>
                </article>
              ))}
            </div>
          </section>

          <div className="grid">
            {recommendations.map(({ shoe, result }) => (
              <RecommendationCard key={shoe.id} shoe={shoe} result={result} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

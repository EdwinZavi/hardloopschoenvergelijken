import Link from "next/link";
import Image from "next/image";
import { RecommendationCard } from "@/components/RecommendationCard";
import { defaultProfile, getRecommendations } from "@/lib/recommendations";
import type { RecommendationProfile } from "@/types/recommendation";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type Option<T extends string> = {
  value: T;
  label: string;
  description: string;
};

type Question<T extends keyof RecommendationProfile> = {
  key: T;
  title: string;
  helper: string;
  options: Option<Extract<RecommendationProfile[T], string>>[];
};

const questions: Question<keyof RecommendationProfile>[] = [
  {
    key: "runningGoal",
    title: "Waarvoor wil je de schoenen vooral gebruiken?",
    helper: "Een rustige training vraagt iets anders dan een snelle 10 kilometer of een rondje door het bos.",
    options: [
      { value: "start_running", label: "Rustig beginnen", description: "Ik wil vooral comfortabel en veilig opbouwen." },
      { value: "general_fitness", label: "Fit blijven", description: "Ik zoek een fijne schoen voor gewone trainingen." },
      { value: "faster_5k_10k", label: "Sneller lopen", description: "Ik wil meer tempo maken op 5 of 10 kilometer." },
      { value: "half_marathon_marathon", label: "Langere afstanden", description: "Ik train voor een halve of hele marathon." },
      { value: "trail_running", label: "Onverhard lopen", description: "Ik loop vooral op bospaden, zand, modder of trailroutes." }
    ]
  },
  {
    key: "preferredSurface",
    title: "Waar loop je meestal?",
    helper: "Asfalt en trail vragen om andere zolen, grip en bescherming.",
    options: [
      { value: "road", label: "Op de weg", description: "Asfalt, stoep, fietspad of verharde paden." },
      { value: "trail", label: "Op trail", description: "Bos, zand, modder, stenen of smalle paden." },
      { value: "mixed", label: "Gemengd", description: "Ik wissel weg en onverhard af." }
    ]
  },
  {
    key: "supportNeed",
    title: "Hoeveel steun wil je van je schoen?",
    helper: "Twijfel je? Dan kiezen we liever schoenen die stabiel en makkelijk lopen.",
    options: [
      { value: "not_sure", label: "Weet ik niet", description: "Kies dan voor veilige, stabiele opties." },
      { value: "neutral", label: "Neutraal", description: "Ik heb geen extra stabiliteit nodig." },
      { value: "some_support", label: "Wat extra steun", description: "Ik wil een stabiel gevoel zonder zware correctie." },
      { value: "stability", label: "Veel steun", description: "Ik zoek duidelijke steun tijdens het lopen." }
    ]
  },
  {
    key: "preferredFeel",
    title: "Hoe wil je dat de schoen voelt?",
    helper: "Dit gaat over het gevoel onder je voet: zacht, normaal of juist snel.",
    options: [
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
      { value: "not_sure", label: "Weet ik niet", description: "Dan kiezen we voor een normale pasvorm." },
      { value: "regular", label: "Normaal", description: "Standaard pasvorm werkt meestal goed voor mij." },
      { value: "wide", label: "Ruimer", description: "Ik heb bredere voeten of wil meer ruimte bij mijn tenen." },
      { value: "narrow", label: "Smaller", description: "Ik wil dat de schoen wat strakker om mijn voet zit." }
    ]
  }
];

const totalSteps = questions.length + 1;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getStep(searchParams: Record<string, string | string[] | undefined>) {
  const step = Number(firstValue(searchParams.step) ?? "0");
  return Number.isFinite(step) ? Math.max(0, Math.min(step, totalSteps)) : 0;
}

function getProfile(searchParams: Record<string, string | string[] | undefined>): RecommendationProfile {
  return {
    ...defaultProfile,
    experienceLevel: (firstValue(searchParams.experienceLevel) as RecommendationProfile["experienceLevel"]) ?? defaultProfile.experienceLevel,
    runningGoal: (firstValue(searchParams.runningGoal) as RecommendationProfile["runningGoal"]) ?? defaultProfile.runningGoal,
    targetDistance: (firstValue(searchParams.targetDistance) as RecommendationProfile["targetDistance"]) ?? defaultProfile.targetDistance,
    weeklyFrequency: (firstValue(searchParams.weeklyFrequency) as RecommendationProfile["weeklyFrequency"]) ?? defaultProfile.weeklyFrequency,
    preferredSurface: (firstValue(searchParams.preferredSurface) as RecommendationProfile["preferredSurface"]) ?? defaultProfile.preferredSurface,
    preferredFeel: (firstValue(searchParams.preferredFeel) as RecommendationProfile["preferredFeel"]) ?? defaultProfile.preferredFeel,
    supportNeed: (firstValue(searchParams.supportNeed) as RecommendationProfile["supportNeed"]) ?? defaultProfile.supportNeed,
    injurySensitivity: (firstValue(searchParams.injurySensitivity) as RecommendationProfile["injurySensitivity"]) ?? defaultProfile.injurySensitivity,
    fitPreference: (firstValue(searchParams.fitPreference) as RecommendationProfile["fitPreference"]) ?? defaultProfile.fitPreference,
    budgetMax: Number(firstValue(searchParams.budgetMax) ?? defaultProfile.budgetMax)
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

export default async function ChoiceHelperPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const step = getStep(params);
  const profile = getProfile(params);
  const isBudgetStep = step === questions.length;
  const isResultsStep = step >= totalSteps;
  const isIntroStep = step === 0 && !isResultsStep;
  const currentQuestion = questions[step];
  const recommendations = isResultsStep ? getRecommendations(profile) : [];

  return (
    <main className="page-helper">
      {isIntroStep ? (
        <section className="page-hero-with-visual">
          <div>
            <p className="eyebrow">Keuzehulp hardloopschoenen</p>
            <h1>Welke hardloopschoen past bij jou?</h1>
            <p className="lead">
              Beantwoord een paar eenvoudige vragen. Daarna zie je welke hardloopschoenen het beste passen bij jouw doel, voeten, ondergrond en budget.
            </p>
          </div>
          <div className="page-hero-visual page-hero-visual-portrait">
            <Image
              alt="Hardloper op de weg als beeld voor persoonlijk passend hardloopschoenadvies"
              fill
              priority
              sizes="(max-width: 820px) 100vw, 360px"
              src="/images/home/running-surfaces-triptych.png"
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
              Stap {Math.min(step + 1, totalSteps)} van {totalSteps} · je mag vragen overslaan
            </span>
            <div aria-hidden="true">
              <span style={{ width: `${(Math.min(step + 1, totalSteps) / totalSteps) * 100}%` }} />
            </div>
          </div>

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
              <p>We letten op je budget, maar kiezen niet automatisch de goedkoopste schoen. Een schoen moet eerst goed passen bij jouw gebruik.</p>
              <label className="budget-control">
                <span>Maximaal budget in euro</span>
                <input name="budgetMax" type="number" min="80" max="300" step="10" defaultValue={profile.budgetMax ?? 170} />
              </label>
              <div className="helper-actions">
                <Link className="button secondary" href={makeHref(profile, step - 1)}>
                  Vorige
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
              <Link className="button secondary" href={makeHref(profile, step + 1)}>
                Ik weet het niet, sla over
              </Link>
            </div>
          ) : null}
        </section>
      ) : (
        <section aria-label="Keuzehulp resultaten">
          <div className="result-header">
            <div>
              <p className="eyebrow">Jouw advies</p>
              <h2>Deze hardloopschoenen passen het best bij je antwoorden</h2>
              <p>
                De matchscore is persoonlijk. De voorlopige redactionele score blijft apart, zodat je ziet wat de kwaliteit van de schoen is en wat bij jouw situatie past.
              </p>
            </div>
            <Link className="button secondary" href="/keuzehulp">
              Keuzehulp opnieuw doen
            </Link>
          </div>

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

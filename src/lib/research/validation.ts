import type {
  HedgeRatio,
  HorizonYears,
  ScenarioMode,
  StudyMode,
  StudyRequest,
  SupportedCurrency,
  SupportedFrequency,
} from "@/types/research";

const CURRENCIES: SupportedCurrency[] = ["CHF", "EUR", "USD"];
const FREQUENCIES: SupportedFrequency[] = ["daily", "monthly"];
const HEDGE_RATIOS: HedgeRatio[] = [0, 0.5, 1];
const HORIZONS: HorizonYears[] = [5, 10, 15];
const SCENARIOS: ScenarioMode[] = ["neutral", "rates_up", "growth_down"];

type ValidationResult =
  | { ok: true; value: StudyRequest }
  | { ok: false; error: string };

function isIsoDate(value: unknown): value is string {
  if (typeof value !== "string") return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function asStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  if (value.some((item) => typeof item !== "string")) return null;
  return value as string[];
}

export function validateStudyRequest(expectedMode: StudyMode, payload: unknown): ValidationResult {
  if (!payload || typeof payload !== "object") {
    return { ok: false, error: "Request body must be a JSON object." };
  }

  const input = payload as Partial<StudyRequest>;

  if (input.mode !== expectedMode) {
    return {
      ok: false,
      error: `Invalid mode. Expected '${expectedMode}'.`,
    };
  }

  const seriesIds = asStringArray(input.seriesIds);
  if (!seriesIds || !seriesIds.length) {
    return { ok: false, error: "seriesIds must contain at least one series id." };
  }

  if (!CURRENCIES.includes(input.baseCurrency as SupportedCurrency)) {
    return { ok: false, error: "baseCurrency must be one of CHF, EUR, USD." };
  }

  if (!HEDGE_RATIOS.includes(input.hedgeRatio as HedgeRatio)) {
    return { ok: false, error: "hedgeRatio must be one of 0, 0.5, 1." };
  }

  if (!FREQUENCIES.includes(input.frequency as SupportedFrequency)) {
    return { ok: false, error: "frequency must be one of daily or monthly." };
  }

  if (input.scenario && !SCENARIOS.includes(input.scenario)) {
    return { ok: false, error: "scenario must be one of neutral, rates_up, growth_down." };
  }

  if (expectedMode === "ex_ante") {
    const horizon = input.horizonYears ?? 10;
    if (!HORIZONS.includes(horizon)) {
      return { ok: false, error: "horizonYears must be 5, 10, or 15 for ex-ante studies." };
    }
  }

  if (expectedMode === "ex_post") {
    if (input.startDate && !isIsoDate(input.startDate)) {
      return { ok: false, error: "startDate must use YYYY-MM-DD format." };
    }
    if (input.endDate && !isIsoDate(input.endDate)) {
      return { ok: false, error: "endDate must use YYYY-MM-DD format." };
    }
    if (
      input.rollingWindowMonths !== undefined &&
      (!Number.isInteger(input.rollingWindowMonths) || input.rollingWindowMonths <= 0)
    ) {
      return { ok: false, error: "rollingWindowMonths must be a positive integer." };
    }
  }

  const sanitized: StudyRequest = {
    mode: expectedMode,
    seriesIds,
    baseCurrency: input.baseCurrency as SupportedCurrency,
    hedgeRatio: input.hedgeRatio as HedgeRatio,
    frequency: input.frequency as SupportedFrequency,
    scenario: input.scenario ?? "neutral",
    horizonYears: input.horizonYears,
    startDate: input.startDate,
    endDate: input.endDate,
    rollingWindowMonths: input.rollingWindowMonths,
  };

  return { ok: true, value: sanitized };
}

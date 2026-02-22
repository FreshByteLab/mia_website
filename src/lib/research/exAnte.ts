import cmaAssumptionsFile from "@/data/cmaAssumptions.json";
import { getSeriesByIds } from "@/lib/data/getSeries";
import { sharpeRatio } from "@/lib/research/metrics";
import type {
  CmaAssumptionsFile,
  CmaSeriesAssumption,
  ScenarioMode,
  StudyOutput,
  StudyRequest,
  SupportedCurrency,
} from "@/types/research";

const cmaAssumptions = cmaAssumptionsFile as CmaAssumptionsFile;

const HORIZON_VOL_SCALER: Record<5 | 10 | 15, number> = {
  5: 1.05,
  10: 1,
  15: 0.95,
};

const SCENARIO_RETURN_ADJUSTMENT: Record<ScenarioMode, Record<string, number>> = {
  neutral: {
    Equities: 0,
    "Government Bonds": 0,
    "Investment Grade Credit": 0,
  },
  rates_up: {
    Equities: -0.004,
    "Government Bonds": -0.01,
    "Investment Grade Credit": -0.006,
  },
  growth_down: {
    Equities: -0.015,
    "Government Bonds": 0.004,
    "Investment Grade Credit": -0.01,
  },
};

const SCENARIO_VOL_ADJUSTMENT: Record<ScenarioMode, Record<string, number>> = {
  neutral: {
    Equities: 0,
    "Government Bonds": 0,
    "Investment Grade Credit": 0,
  },
  rates_up: {
    Equities: 0.01,
    "Government Bonds": 0.008,
    "Investment Grade Credit": 0.009,
  },
  growth_down: {
    Equities: 0.02,
    "Government Bonds": 0.003,
    "Investment Grade Credit": 0.015,
  },
};

const LONG_RUN_FX_PREMIUM: Record<
  SupportedCurrency,
  Partial<Record<SupportedCurrency, { returnAdj: number; volAdj: number }>>
> = {
  CHF: {
    EUR: { returnAdj: -0.001, volAdj: 0.03 },
    USD: { returnAdj: -0.002, volAdj: 0.045 },
  },
  EUR: {
    CHF: { returnAdj: 0.001, volAdj: 0.03 },
    USD: { returnAdj: -0.001, volAdj: 0.04 },
  },
  USD: {
    CHF: { returnAdj: 0.002, volAdj: 0.045 },
    EUR: { returnAdj: 0.001, volAdj: 0.04 },
  },
};

function getFxAdjustment(
  seriesCurrency: SupportedCurrency,
  baseCurrency: SupportedCurrency,
  hedgeRatio: number
): { returnAdj: number; volAdj: number } {
  if (seriesCurrency === baseCurrency) return { returnAdj: 0, volAdj: 0 };
  const fx = LONG_RUN_FX_PREMIUM[baseCurrency][seriesCurrency];
  if (!fx) return { returnAdj: 0, volAdj: 0 };
  const unhedgedShare = 1 - hedgeRatio;
  return {
    returnAdj: fx.returnAdj * unhedgedShare,
    volAdj: fx.volAdj * unhedgedShare,
  };
}

function getBaseCorrelation(seriesId: string, benchmarkId: string): number {
  return cmaAssumptions.baseCorrelation[seriesId]?.[benchmarkId] ?? 0;
}

function scenarioCorrelationAdjustment(scenario: ScenarioMode, leftAssetClass: string, rightAssetClass: string): number {
  if (scenario === "neutral") return 0;
  const pair = [leftAssetClass, rightAssetClass].sort().join("|");
  if (scenario === "rates_up" && pair.includes("Government Bonds|Equities")) return 0.08;
  if (scenario === "growth_down" && pair.includes("Government Bonds|Equities")) return -0.04;
  if (scenario === "growth_down" && pair.includes("Equities|Investment Grade Credit")) return 0.06;
  return 0;
}

function getAssumption(seriesId: string): CmaSeriesAssumption {
  const assumption = cmaAssumptions.bySeries[seriesId];
  if (!assumption) {
    return {
      expectedReturn: 0.03,
      expectedVol: 0.1,
      carry: 0,
      rolldown: 0,
      spread: 0,
      expectedLoss: 0,
      fxImpact: 0,
    };
  }
  return assumption;
}

export async function runExAnteStudy(request: StudyRequest): Promise<StudyOutput> {
  const series = await getSeriesByIds(request.seriesIds);
  if (!series.length) {
    throw new Error("No matching series were found for the selected universe.");
  }

  const horizon = request.horizonYears ?? 10;
  const scenario = request.scenario ?? "neutral";
  const benchmarkId = request.seriesIds[0];

  const assumptionsPerSeries: StudyOutput["assumptions"] = {
    perSeries: {},
  };

  const perSeries = series.map((seriesItem) => {
    const base = getAssumption(seriesItem.id);
    const fxAdjustment = getFxAdjustment(seriesItem.currency, request.baseCurrency, request.hedgeRatio);
    const scenarioReturnAdj = SCENARIO_RETURN_ADJUSTMENT[scenario][seriesItem.assetClass] ?? 0;
    const scenarioVolAdj = SCENARIO_VOL_ADJUSTMENT[scenario][seriesItem.assetClass] ?? 0;

    const annReturn = base.expectedReturn + scenarioReturnAdj + fxAdjustment.returnAdj;
    const annVol =
      base.expectedVol * HORIZON_VOL_SCALER[horizon] +
      scenarioVolAdj +
      fxAdjustment.volAdj;

    assumptionsPerSeries.perSeries[seriesItem.id] = {
      carry: base.carry,
      rolldown: base.rolldown,
      spread: base.spread,
      expectedLoss: base.expectedLoss,
      fxImpact: fxAdjustment.returnAdj + base.fxImpact * (1 - request.hedgeRatio),
    };

    return {
      seriesId: seriesItem.id,
      annReturn,
      annVol,
      sharpe: sharpeRatio(annReturn, annVol, 0),
      maxDrawdown: null,
      worstPeriod: null,
      correlationWithBenchmark: getBaseCorrelation(seriesItem.id, benchmarkId),
    };
  });

  const correlationMatrixSeriesIds = series.map((item) => item.id);
  const matrix = correlationMatrixSeriesIds.map((leftId) =>
    correlationMatrixSeriesIds.map((rightId) => {
      const leftSeries = series.find((item) => item.id === leftId);
      const rightSeries = series.find((item) => item.id === rightId);
      const baseCorrelation = getBaseCorrelation(leftId, rightId);
      const adjustment = scenarioCorrelationAdjustment(
        scenario,
        leftSeries?.assetClass ?? "",
        rightSeries?.assetClass ?? ""
      );
      const adjusted = Math.max(-1, Math.min(1, baseCorrelation + adjustment));
      return adjusted;
    })
  );

  return {
    meta: {
      ...request,
      requestedAt: new Date().toISOString(),
      computedAt: new Date().toISOString(),
      notes: [
        cmaAssumptions.note,
        "FX and hedging effects are approximated in this MVP and should be replaced by market-implied inputs.",
      ],
    },
    perSeries,
    correlationMatrix: {
      seriesIds: correlationMatrixSeriesIds,
      matrix,
    },
    assumptions: assumptionsPerSeries,
  };
}

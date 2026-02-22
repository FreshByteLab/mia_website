export type StudyMode = "ex_ante" | "ex_post";
export type SupportedCurrency = "CHF" | "EUR" | "USD";
export type SupportedFrequency = "daily" | "monthly";
export type HedgeRatio = 0 | 0.5 | 1;
export type HorizonYears = 5 | 10 | 15;
export type ScenarioMode = "neutral" | "rates_up" | "growth_down";

export interface AssetSeries {
  id: string;
  name: string;
  assetClass: string;
  currency: SupportedCurrency;
  frequency: SupportedFrequency;
  source: string;
}

export interface StudyRequest {
  mode: StudyMode;
  seriesIds: string[];
  baseCurrency: SupportedCurrency;
  hedgeRatio: HedgeRatio;
  horizonYears?: HorizonYears;
  startDate?: string;
  endDate?: string;
  rollingWindowMonths?: number;
  frequency: SupportedFrequency;
  scenario?: ScenarioMode;
}

export interface WorstPeriod {
  period: "month" | "quarter";
  label: string;
  value: number;
}

export interface SeriesStudyStats {
  seriesId: string;
  annReturn: number;
  annVol: number;
  sharpe: number;
  maxDrawdown: number | null;
  worstPeriod: WorstPeriod | null;
  correlationWithBenchmark: number | null;
}

export interface CorrelationMatrix {
  seriesIds: string[];
  matrix: number[][];
}

export interface TimeseriesStudyData {
  dates: string[];
  navBySeries: Record<string, number[]>;
  drawdownBySeries?: Record<string, number[]>;
  rollingVolBySeries?: Record<string, number[]>;
}

export interface AssumptionComponents {
  carry: number;
  rolldown: number;
  spread: number;
  expectedLoss: number;
  fxImpact: number;
}

export interface AssumptionsStudyData {
  perSeries: Record<string, AssumptionComponents>;
}

export interface StudyOutput {
  meta: StudyRequest & {
    requestedAt: string;
    computedAt: string;
    notes: string[];
  };
  perSeries: SeriesStudyStats[];
  correlationMatrix: CorrelationMatrix;
  timeseries?: TimeseriesStudyData;
  assumptions?: AssumptionsStudyData;
}

export interface PricePoint {
  date: string;
  value: number;
}

export type PriceSeries = PricePoint[];

export interface Fxpairs {
  USDCHF: PriceSeries;
  USDEUR: PriceSeries;
}

export interface FxRatesFile {
  note: string;
  pairs: Fxpairs;
}

export interface CmaSeriesAssumption extends AssumptionComponents {
  expectedReturn: number;
  expectedVol: number;
}

export interface CmaAssumptionsFile {
  generatedAt: string;
  note: string;
  bySeries: Record<string, CmaSeriesAssumption>;
  baseCorrelation: Record<string, Record<string, number>>;
}

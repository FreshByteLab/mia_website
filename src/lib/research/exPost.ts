import { getPricesBySeriesIds } from "@/lib/data/getPrices";
import { getSeriesByIds } from "@/lib/data/getSeries";
import { applyCurrencyConversion, getFxReturnsByDate } from "@/lib/research/fx";
import {
  annualizedReturn,
  annualizedVolatility,
  correlationMatrix,
  drawdownSeries,
  maxDrawdownFromNav,
  rollingAnnualizedVolatility,
  sharpeRatio,
  worstMonth,
  worstQuarter,
} from "@/lib/research/metrics";
import {
  alignReturnSeriesByDate,
  buildNavIndex,
  filterPriceSeriesByDateRange,
  toSimpleReturns,
  type ReturnSeries,
} from "@/lib/research/returns";
import type { StudyOutput, StudyRequest, WorstPeriod } from "@/types/research";

const PERIODS_PER_YEAR: Record<StudyRequest["frequency"], number> = {
  daily: 252,
  monthly: 12,
};

function pickWorstPeriod(month: WorstPeriod | null, quarter: WorstPeriod | null): WorstPeriod | null {
  if (!month && !quarter) return null;
  if (!month) return quarter;
  if (!quarter) return month;
  return month.value <= quarter.value ? month : quarter;
}

function correlationWithBenchmark(
  matrix: number[][],
  seriesIds: string[],
  seriesId: string,
  benchmarkId: string
): number | null {
  const rowIndex = seriesIds.indexOf(seriesId);
  const colIndex = seriesIds.indexOf(benchmarkId);
  if (rowIndex === -1 || colIndex === -1) return null;
  return matrix[rowIndex]?.[colIndex] ?? null;
}

export async function runExPostStudy(request: StudyRequest): Promise<StudyOutput> {
  const series = await getSeriesByIds(request.seriesIds);
  if (!series.length) {
    throw new Error("No matching series were found for the selected universe.");
  }

  const pricesBySeriesId = await getPricesBySeriesIds(request.seriesIds);
  const localReturnsBySeriesId: Record<string, ReturnSeries> = {};

  for (const seriesItem of series) {
    const prices = pricesBySeriesId[seriesItem.id];
    if (!prices?.length) continue;
    const filtered = filterPriceSeriesByDateRange(prices, request.startDate, request.endDate);
    const returns = toSimpleReturns(filtered);
    if (returns.length) {
      localReturnsBySeriesId[seriesItem.id] = returns;
    }
  }

  const alignedLocal = alignReturnSeriesByDate(localReturnsBySeriesId);
  if (alignedLocal.dates.length < 3) {
    throw new Error("Not enough observations for the selected date range and universe.");
  }

  const periodsPerYear = PERIODS_PER_YEAR[request.frequency] ?? 12;
  const rollingWindowMonths = request.rollingWindowMonths ?? 36;

  const convertedReturnsBySeries: Record<string, number[]> = {};
  for (const seriesItem of series) {
    const localAlignedReturns = alignedLocal.valuesById[seriesItem.id] ?? [];
    if (!localAlignedReturns.length) continue;

    const fxReturns = getFxReturnsByDate(seriesItem.currency, request.baseCurrency, alignedLocal.dates);
    convertedReturnsBySeries[seriesItem.id] = applyCurrencyConversion(
      localAlignedReturns,
      fxReturns,
      request.hedgeRatio
    );
  }

  const correlation = correlationMatrix(convertedReturnsBySeries);
  const benchmarkId = request.seriesIds[0];

  const navBySeries: Record<string, number[]> = {};
  const drawdownBySeries: Record<string, number[]> = {};
  const rollingVolBySeries: Record<string, number[]> = {};

  const perSeries = series
    .map((seriesItem) => {
      const returns = convertedReturnsBySeries[seriesItem.id];
      if (!returns?.length) return null;

      const annReturn = annualizedReturn(returns, periodsPerYear);
      const annVol = annualizedVolatility(returns, periodsPerYear);
      const sharpe = sharpeRatio(annReturn, annVol, 0);
      const nav = buildNavIndex(returns, 100);
      const drawdown = drawdownSeries(nav);
      const maxDrawdown = maxDrawdownFromNav(nav);
      const monthWorst = worstMonth(returns, alignedLocal.dates);
      const quarterWorst = worstQuarter(returns, alignedLocal.dates);
      const worst = pickWorstPeriod(monthWorst, quarterWorst);

      navBySeries[seriesItem.id] = nav;
      drawdownBySeries[seriesItem.id] = drawdown;
      rollingVolBySeries[seriesItem.id] = rollingAnnualizedVolatility(
        returns,
        rollingWindowMonths,
        periodsPerYear
      );

      return {
        seriesId: seriesItem.id,
        annReturn,
        annVol,
        sharpe,
        maxDrawdown,
        worstPeriod: worst,
        correlationWithBenchmark: correlationWithBenchmark(
          correlation.matrix,
          correlation.seriesIds,
          seriesItem.id,
          benchmarkId
        ),
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return {
    meta: {
      ...request,
      requestedAt: new Date().toISOString(),
      computedAt: new Date().toISOString(),
      notes: [
        "Ex-post metrics are based on monthly simple returns for the selected sample.",
        "Hedge cost is set to zero in this MVP.",
      ],
    },
    perSeries,
    correlationMatrix: correlation,
    timeseries: {
      dates: alignedLocal.dates,
      navBySeries,
      drawdownBySeries,
      rollingVolBySeries,
    },
  };
}

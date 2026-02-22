import { getFxRates } from "@/lib/data/getPrices";
import { toSimpleReturns } from "@/lib/research/returns";
import type { PriceSeries, SupportedCurrency } from "@/types/research";

function inverseSeries(series: PriceSeries): PriceSeries {
  return series.map((point) => ({
    date: point.date,
    value: point.value === 0 ? 0 : 1 / point.value,
  }));
}

function combineSeries(numerator: PriceSeries, denominator: PriceSeries): PriceSeries {
  const denominatorByDate = new Map(denominator.map((point) => [point.date, point.value]));
  return numerator
    .map((point) => {
      const denominatorValue = denominatorByDate.get(point.date);
      if (!denominatorValue || denominatorValue === 0) return null;
      return {
        date: point.date,
        value: point.value / denominatorValue,
      };
    })
    .filter((point): point is NonNullable<typeof point> => Boolean(point));
}

function getFxLevelSeries(localCurrency: SupportedCurrency, baseCurrency: SupportedCurrency): PriceSeries {
  if (localCurrency === baseCurrency) return [];

  const fxRates = getFxRates();
  const usdChf = fxRates.pairs.USDCHF;
  const usdEur = fxRates.pairs.USDEUR;

  if (localCurrency === "USD" && baseCurrency === "CHF") return usdChf;
  if (localCurrency === "CHF" && baseCurrency === "USD") return inverseSeries(usdChf);
  if (localCurrency === "USD" && baseCurrency === "EUR") return usdEur;
  if (localCurrency === "EUR" && baseCurrency === "USD") return inverseSeries(usdEur);
  if (localCurrency === "CHF" && baseCurrency === "EUR") return combineSeries(usdEur, usdChf);
  if (localCurrency === "EUR" && baseCurrency === "CHF") return combineSeries(usdChf, usdEur);

  return [];
}

export function getFxReturnsByDate(
  localCurrency: SupportedCurrency,
  baseCurrency: SupportedCurrency,
  dates: string[]
): number[] {
  if (localCurrency === baseCurrency) return new Array<number>(dates.length).fill(0);

  const fxLevels = getFxLevelSeries(localCurrency, baseCurrency);
  const fxReturns = toSimpleReturns(fxLevels);
  const fxLookup = new Map(fxReturns.map((point) => [point.date, point.value]));

  return dates.map((date) => fxLookup.get(date) ?? 0);
}

export function applyCurrencyConversion(
  localReturns: number[],
  fxReturns: number[],
  hedgeRatio: number
): number[] {
  const output: number[] = [];
  const effectiveUnhedged = 1 - hedgeRatio;

  for (let i = 0; i < localReturns.length; i += 1) {
    const local = localReturns[i] ?? 0;
    const fx = fxReturns[i] ?? 0;
    const effectiveFx = effectiveUnhedged * fx;
    output.push((1 + local) * (1 + effectiveFx) - 1);
  }

  return output;
}

import type { PriceSeries } from "@/types/research";

export interface ReturnPoint {
  date: string;
  value: number;
}

export type ReturnSeries = ReturnPoint[];

export function toSimpleReturns(priceSeries: PriceSeries): ReturnSeries {
  if (priceSeries.length < 2) return [];

  const returns: ReturnSeries = [];
  for (let i = 1; i < priceSeries.length; i += 1) {
    const prev = priceSeries[i - 1]?.value ?? 0;
    const curr = priceSeries[i]?.value ?? 0;
    if (prev <= 0) continue;
    returns.push({
      date: priceSeries[i].date,
      value: curr / prev - 1,
    });
  }
  return returns;
}

export function filterPriceSeriesByDateRange(
  priceSeries: PriceSeries,
  startDate?: string,
  endDate?: string
): PriceSeries {
  return priceSeries.filter((point) => {
    if (startDate && point.date < startDate) return false;
    if (endDate && point.date > endDate) return false;
    return true;
  });
}

export function alignReturnSeriesByDate(
  seriesById: Record<string, ReturnSeries>
): { dates: string[]; valuesById: Record<string, number[]> } {
  const entries = Object.entries(seriesById);
  if (!entries.length) return { dates: [], valuesById: {} };

  const dateSets = entries.map(([, returns]) => new Set(returns.map((point) => point.date)));
  const commonDates = dateSets.slice(1).reduce(
    (acc, curr) => new Set([...acc].filter((date) => curr.has(date))),
    dateSets[0] ?? new Set<string>()
  );

  const orderedDates = [...commonDates].sort((a, b) => (a < b ? -1 : 1));
  const valuesById = Object.fromEntries(
    entries.map(([seriesId, returns]) => {
      const lookup = new Map(returns.map((point) => [point.date, point.value]));
      const values = orderedDates.map((date) => lookup.get(date) ?? 0);
      return [seriesId, values];
    })
  );

  return {
    dates: orderedDates,
    valuesById,
  };
}

export function buildNavIndex(returns: number[], startValue = 100): number[] {
  if (!returns.length) return [];

  const nav: number[] = [];
  let value = startValue;
  for (const ret of returns) {
    value *= 1 + ret;
    nav.push(value);
  }
  return nav;
}

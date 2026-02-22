import type { WorstPeriod } from "@/types/research";

function mean(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((acc, curr) => acc + curr, 0) / values.length;
}

function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const avg = mean(values);
  const variance =
    values.reduce((acc, curr) => acc + (curr - avg) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

export function annualizedReturn(returns: number[], periodsPerYear: number): number {
  if (!returns.length) return 0;
  const cumulative = returns.reduce((acc, curr) => acc * (1 + curr), 1);
  return cumulative ** (periodsPerYear / returns.length) - 1;
}

export function annualizedVolatility(returns: number[], periodsPerYear: number): number {
  if (!returns.length) return 0;
  return stdDev(returns) * Math.sqrt(periodsPerYear);
}

export function sharpeRatio(annReturn: number, annVol: number, riskFreeRate = 0): number {
  if (!Number.isFinite(annVol) || annVol === 0) return 0;
  return (annReturn - riskFreeRate) / annVol;
}

export function maxDrawdownFromNav(nav: number[]): number {
  if (!nav.length) return 0;
  let peak = nav[0];
  let maxDrawdown = 0;

  for (const value of nav) {
    peak = Math.max(peak, value);
    const drawdown = value / peak - 1;
    maxDrawdown = Math.min(maxDrawdown, drawdown);
  }

  return maxDrawdown;
}

export function drawdownSeries(nav: number[]): number[] {
  if (!nav.length) return [];
  let peak = nav[0];
  const drawdowns: number[] = [];

  for (const value of nav) {
    peak = Math.max(peak, value);
    drawdowns.push(value / peak - 1);
  }

  return drawdowns;
}

export function rollingAnnualizedVolatility(
  returns: number[],
  rollingWindowMonths: number,
  periodsPerYear: number
): number[] {
  if (!returns.length) return [];
  const output = new Array<number>(returns.length).fill(0);
  if (rollingWindowMonths <= 1) return returns.map((ret) => Math.abs(ret) * Math.sqrt(periodsPerYear));

  for (let i = rollingWindowMonths - 1; i < returns.length; i += 1) {
    const window = returns.slice(i - rollingWindowMonths + 1, i + 1);
    output[i] = annualizedVolatility(window, periodsPerYear);
  }

  return output;
}

function quarterLabel(date: string): string {
  const year = date.slice(0, 4);
  const month = Number(date.slice(5, 7));
  const quarter = Math.ceil(month / 3);
  return `${year}-Q${quarter}`;
}

export function worstMonth(returns: number[], dates: string[]): WorstPeriod | null {
  if (!returns.length || returns.length !== dates.length) return null;

  let minValue = Number.POSITIVE_INFINITY;
  let minIndex = -1;
  for (let i = 0; i < returns.length; i += 1) {
    if (returns[i] < minValue) {
      minValue = returns[i];
      minIndex = i;
    }
  }

  if (minIndex === -1) return null;
  return {
    period: "month",
    label: dates[minIndex],
    value: minValue,
  };
}

export function worstQuarter(returns: number[], dates: string[]): WorstPeriod | null {
  if (!returns.length || returns.length !== dates.length) return null;

  const grouped = new Map<string, number[]>();
  for (let i = 0; i < returns.length; i += 1) {
    const label = quarterLabel(dates[i]);
    const bucket = grouped.get(label) ?? [];
    bucket.push(returns[i]);
    grouped.set(label, bucket);
  }

  let worst: WorstPeriod | null = null;
  for (const [label, quarterReturns] of grouped.entries()) {
    const value = quarterReturns.reduce((acc, curr) => acc * (1 + curr), 1) - 1;
    if (!worst || value < worst.value) {
      worst = {
        period: "quarter",
        label,
        value,
      };
    }
  }

  return worst;
}

export function correlationMatrix(valuesById: Record<string, number[]>): {
  seriesIds: string[];
  matrix: number[][];
} {
  const seriesIds = Object.keys(valuesById);
  const matrix = seriesIds.map((leftId) =>
    seriesIds.map((rightId) => correlation(valuesById[leftId] ?? [], valuesById[rightId] ?? []))
  );

  return { seriesIds, matrix };
}

function correlation(left: number[], right: number[]): number {
  if (!left.length || !right.length || left.length !== right.length) return 0;
  const leftMean = mean(left);
  const rightMean = mean(right);

  let covariance = 0;
  let leftVariance = 0;
  let rightVariance = 0;
  for (let i = 0; i < left.length; i += 1) {
    const dx = left[i] - leftMean;
    const dy = right[i] - rightMean;
    covariance += dx * dy;
    leftVariance += dx * dx;
    rightVariance += dy * dy;
  }

  if (leftVariance === 0 || rightVariance === 0) return 0;
  return covariance / Math.sqrt(leftVariance * rightVariance);
}

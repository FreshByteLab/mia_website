import chfGovBondsChf from "@/data/prices/chf_gov_bonds_chf.json";
import globalEquitiesUsd from "@/data/prices/global_equities_usd.json";
import globalGovBondsUsd from "@/data/prices/global_gov_bonds_usd.json";
import globalIgCreditUsd from "@/data/prices/global_ig_credit_usd.json";
import fxRatesFile from "@/data/fxRates.json";
import type { FxRatesFile, PriceSeries } from "@/types/research";

const PRICE_SERIES: Record<string, PriceSeries> = {
  global_equities_usd: globalEquitiesUsd as PriceSeries,
  global_gov_bonds_usd: globalGovBondsUsd as PriceSeries,
  global_ig_credit_usd: globalIgCreditUsd as PriceSeries,
  chf_gov_bonds_chf: chfGovBondsChf as PriceSeries,
};

export async function getPriceSeries(seriesId: string): Promise<PriceSeries | null> {
  return PRICE_SERIES[seriesId] ?? null;
}

export async function getPricesBySeriesIds(seriesIds: string[]): Promise<Record<string, PriceSeries>> {
  const entries = seriesIds
    .map((seriesId) => [seriesId, PRICE_SERIES[seriesId]] as const)
    .filter((entry): entry is readonly [string, PriceSeries] => Boolean(entry[1]));

  return Object.fromEntries(entries);
}

export function getAllPrices(): Record<string, PriceSeries> {
  return PRICE_SERIES;
}

export function getAvailableDateRange(): { startDate: string; endDate: string } {
  const firstSeries = Object.values(PRICE_SERIES)[0];
  const startDate = firstSeries?.[0]?.date ?? "";
  const endDate = firstSeries?.[firstSeries.length - 1]?.date ?? "";
  return { startDate, endDate };
}

export function getFxRates(): FxRatesFile {
  return fxRatesFile as FxRatesFile;
}

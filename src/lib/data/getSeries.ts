import registry from "@/data/seriesRegistry.json";
import type { AssetSeries } from "@/types/research";

const typedRegistry = registry as AssetSeries[];

export async function getSeriesRegistry(): Promise<AssetSeries[]> {
  return typedRegistry;
}

export async function getSeriesByIds(seriesIds: string[]): Promise<AssetSeries[]> {
  const series = typedRegistry.filter((item) => seriesIds.includes(item.id));
  return series;
}

export function getSeriesMap(): Record<string, AssetSeries> {
  return typedRegistry.reduce<Record<string, AssetSeries>>((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});
}

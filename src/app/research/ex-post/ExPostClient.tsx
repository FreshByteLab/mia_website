"use client";

import { useEffect, useMemo, useState } from "react";
import globalEquitiesUsd from "@/data/prices/global_equities_usd.json";
import seriesRegistryData from "@/data/seriesRegistry.json";
import CorrelationView from "@/components/research/CorrelationView";
import DrawdownChart from "@/components/research/DrawdownChart";
import ExportButtons from "@/components/research/ExportButtons";
import KpiRow from "@/components/research/KpiRow";
import RollingVolChart from "@/components/research/RollingVolChart";
import SeriesTable from "@/components/research/SeriesTable";
import StudyControls from "@/components/research/StudyControls";
import TimeseriesChart from "@/components/research/TimeseriesChart";
import { formatNumber, formatPercent } from "@/lib/research/format";
import type { AssetSeries, PriceSeries, StudyOutput, StudyRequest, SupportedCurrency } from "@/types/research";

type WindowPreset = "3y" | "5y" | "10y" | "max" | "custom";

const SERIES_REGISTRY = seriesRegistryData as AssetSeries[];
const DEFAULT_SERIES = SERIES_REGISTRY.slice(0, 3).map((series) => series.id);
const EQUITIES = globalEquitiesUsd as PriceSeries;
const DEFAULT_END_DATE = EQUITIES[EQUITIES.length - 1]?.date ?? "2025-12-31";

function subtractYears(date: string, years: number): string {
  const [year, month, day] = date.split("-").map((value) => Number(value));
  return `${String(year - years).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getStartDateForPreset(preset: WindowPreset, endDate: string): string | undefined {
  if (preset === "max") return undefined;
  if (preset === "3y") return subtractYears(endDate, 3);
  if (preset === "5y") return subtractYears(endDate, 5);
  if (preset === "10y") return subtractYears(endDate, 10);
  return undefined;
}

export default function ExPostClient() {
  const [seriesIds, setSeriesIds] = useState<string[]>(DEFAULT_SERIES);
  const [baseCurrency, setBaseCurrency] = useState<SupportedCurrency>("USD");
  const [hedgeRatio, setHedgeRatio] = useState<0 | 0.5 | 1>(0);
  const [windowPreset, setWindowPreset] = useState<WindowPreset>("5y");
  const [customStartDate, setCustomStartDate] = useState<string>(subtractYears(DEFAULT_END_DATE, 5));
  const [customEndDate, setCustomEndDate] = useState<string>(DEFAULT_END_DATE);
  const [rollingWindowMonths, setRollingWindowMonths] = useState<12 | 36 | 60>(36);
  const [output, setOutput] = useState<StudyOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const seriesNameById = useMemo(
    () =>
      SERIES_REGISTRY.reduce<Record<string, string>>((acc, item) => {
        acc[item.id] = item.name;
        return acc;
      }, {}),
    []
  );

  const startDate =
    windowPreset === "custom"
      ? customStartDate || undefined
      : getStartDateForPreset(windowPreset, DEFAULT_END_DATE);
  const endDate = windowPreset === "custom" ? customEndDate || undefined : DEFAULT_END_DATE;

  const requestPayload: StudyRequest = useMemo(
    () => ({
      mode: "ex_post",
      seriesIds,
      baseCurrency,
      hedgeRatio,
      startDate,
      endDate,
      rollingWindowMonths,
      frequency: "monthly",
    }),
    [baseCurrency, endDate, hedgeRatio, rollingWindowMonths, seriesIds, startDate]
  );

  const requestKey = JSON.stringify(requestPayload);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchStudy() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/research/ex-post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestKey,
          signal: controller.signal,
        });
        const body = (await response.json()) as StudyOutput | { error: string };
        if (!response.ok) {
          throw new Error("error" in body ? body.error : "Unable to run ex-post study.");
        }
        setOutput(body as StudyOutput);
      } catch (err) {
        if (controller.signal.aborted) return;
        const message = err instanceof Error ? err.message : "Unexpected ex-post study error.";
        setError(message);
        setOutput(null);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchStudy();
    return () => controller.abort();
  }, [requestKey]);

  const benchmarkSeries = output?.perSeries[0] ?? null;

  const toggleSeries = (seriesId: string) => {
    setSeriesIds((previous) => {
      if (previous.includes(seriesId)) {
        if (previous.length === 1) return previous;
        return previous.filter((id) => id !== seriesId);
      }
      return [...previous, seriesId];
    });
  };

  return (
    <div className="space-y-7">
      <StudyControls
        title="Ex-Post: Historical Risk & Return"
        description="Realized performance and risk analytics over configurable sample windows."
        actions={<ExportButtons output={output} filePrefix="research-ex-post" seriesNameById={seriesNameById} />}
      >
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-3">
            <p className="mb-2 text-xs uppercase tracking-[0.24em] text-accent/70">Universe</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {SERIES_REGISTRY.map((series) => (
                <label
                  key={series.id}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-white/80"
                >
                  <input
                    type="checkbox"
                    className="accent-accent"
                    checked={seriesIds.includes(series.id)}
                    onChange={() => toggleSeries(series.id)}
                  />
                  <span>{series.name}</span>
                  <span className="ml-auto text-xs text-white/45">{series.currency}</span>
                </label>
              ))}
            </div>
          </div>

          <label className="flex flex-col gap-2 text-sm text-white/75">
            Base Currency
            <select
              value={baseCurrency}
              onChange={(event) => setBaseCurrency(event.target.value as SupportedCurrency)}
              className="rounded-lg border border-white/15 bg-ink px-3 py-2 text-white"
            >
              <option value="CHF">CHF</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm text-white/75">
            Hedge Ratio
            <select
              value={hedgeRatio}
              onChange={(event) => setHedgeRatio(Number(event.target.value) as 0 | 0.5 | 1)}
              className="rounded-lg border border-white/15 bg-ink px-3 py-2 text-white"
            >
              <option value={0}>0%</option>
              <option value={0.5}>50%</option>
              <option value={1}>100%</option>
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm text-white/75">
            Frequency
            <select disabled className="rounded-lg border border-white/15 bg-ink px-3 py-2 text-white/70">
              <option value="monthly">Monthly</option>
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm text-white/75">
            Sample Window
            <select
              value={windowPreset}
              onChange={(event) => setWindowPreset(event.target.value as WindowPreset)}
              className="rounded-lg border border-white/15 bg-ink px-3 py-2 text-white"
            >
              <option value="3y">3y</option>
              <option value="5y">5y</option>
              <option value="10y">10y</option>
              <option value="max">Max</option>
              <option value="custom">Custom</option>
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm text-white/75">
            Rolling Window
            <select
              value={rollingWindowMonths}
              onChange={(event) => setRollingWindowMonths(Number(event.target.value) as 12 | 36 | 60)}
              className="rounded-lg border border-white/15 bg-ink px-3 py-2 text-white"
            >
              <option value={12}>1y</option>
              <option value={36}>3y</option>
              <option value={60}>5y</option>
            </select>
          </label>

          {windowPreset === "custom" ? (
            <>
              <label className="flex flex-col gap-2 text-sm text-white/75">
                Start Date
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(event) => setCustomStartDate(event.target.value)}
                  className="rounded-lg border border-white/15 bg-ink px-3 py-2 text-white"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-white/75">
                End Date
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(event) => setCustomEndDate(event.target.value)}
                  className="rounded-lg border border-white/15 bg-ink px-3 py-2 text-white"
                />
              </label>
            </>
          ) : null}
        </div>
      </StudyControls>

      {error ? (
        <div className="glass-panel border border-rose-400/25 p-4 text-sm text-rose-200">{error}</div>
      ) : null}
      {loading ? <div className="glass-panel p-4 text-sm text-white/60">Running ex-post study...</div> : null}

      {output ? (
        <>
          <KpiRow
            title="Summary KPIs"
            items={[
              { label: "Realized Return (ann.)", value: formatPercent(benchmarkSeries?.annReturn ?? null) },
              { label: "Realized Vol (ann.)", value: formatPercent(benchmarkSeries?.annVol ?? null) },
              { label: "Sharpe (rf=0)", value: formatNumber(benchmarkSeries?.sharpe ?? null, 2) },
              { label: "Max Drawdown", value: formatPercent(benchmarkSeries?.maxDrawdown ?? null) },
              {
                label: "Worst Month/Quarter",
                value: benchmarkSeries?.worstPeriod
                  ? `${benchmarkSeries.worstPeriod.label} ${formatPercent(benchmarkSeries.worstPeriod.value)}`
                  : "N/A",
              },
            ]}
          />

          {output.timeseries ? (
            <div className="space-y-6">
              <TimeseriesChart
                dates={output.timeseries.dates}
                navBySeries={output.timeseries.navBySeries}
                seriesNameById={seriesNameById}
              />
              {output.timeseries.rollingVolBySeries ? (
                <RollingVolChart
                  dates={output.timeseries.dates}
                  rollingVolBySeries={output.timeseries.rollingVolBySeries}
                  seriesNameById={seriesNameById}
                />
              ) : null}
              {output.timeseries.drawdownBySeries ? (
                <DrawdownChart
                  dates={output.timeseries.dates}
                  drawdownBySeries={output.timeseries.drawdownBySeries}
                  seriesNameById={seriesNameById}
                />
              ) : null}
            </div>
          ) : null}

          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <CorrelationView data={output.correlationMatrix} seriesNameById={seriesNameById} />
            <SeriesTable rows={output.perSeries} seriesNameById={seriesNameById} />
          </div>
        </>
      ) : null}
    </div>
  );
}

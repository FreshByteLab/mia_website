"use client";

import { useEffect, useMemo, useState } from "react";
import seriesRegistryData from "@/data/seriesRegistry.json";
import CorrelationView from "@/components/research/CorrelationView";
import ExportButtons from "@/components/research/ExportButtons";
import KpiRow from "@/components/research/KpiRow";
import SeriesTable from "@/components/research/SeriesTable";
import StudyControls from "@/components/research/StudyControls";
import { formatNumber, formatPercent } from "@/lib/research/format";
import type { AssetSeries, ScenarioMode, StudyOutput, StudyRequest, SupportedCurrency } from "@/types/research";

const SERIES_REGISTRY = seriesRegistryData as AssetSeries[];
const DEFAULT_SERIES = SERIES_REGISTRY.slice(0, 3).map((series) => series.id);

function averagePairwiseCorrelation(output: StudyOutput | null): number | null {
  if (!output) return null;
  const values: number[] = [];
  for (let row = 0; row < output.correlationMatrix.matrix.length; row += 1) {
    for (let col = row + 1; col < output.correlationMatrix.matrix[row].length; col += 1) {
      values.push(output.correlationMatrix.matrix[row][col]);
    }
  }
  if (!values.length) return null;
  return values.reduce((acc, curr) => acc + curr, 0) / values.length;
}

function ExpectedReturnChart({
  output,
  seriesNameById,
}: {
  output: StudyOutput;
  seriesNameById: Record<string, string>;
}) {
  const maxAbs = Math.max(...output.perSeries.map((item) => Math.abs(item.annReturn)), 0.01);

  return (
    <section className="glass-panel p-6">
      <h3 className="mb-5 font-display text-lg font-semibold text-white">Expected Return by Asset</h3>
      <div className="space-y-4">
        {output.perSeries.map((series) => {
          const width = `${Math.max(6, (Math.abs(series.annReturn) / maxAbs) * 100)}%`;
          const positive = series.annReturn >= 0;
          return (
            <div key={series.seriesId}>
              <div className="mb-1 flex items-center justify-between text-xs text-white/70">
                <span>{seriesNameById[series.seriesId] ?? series.seriesId}</span>
                <span>{formatPercent(series.annReturn)}</span>
              </div>
              <div className="h-3 rounded-full bg-white/10">
                <div
                  className="h-3 rounded-full"
                  style={{ width, background: positive ? "#6a9fd8" : "#ff8d7a" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function ExAnteClient() {
  const [seriesIds, setSeriesIds] = useState<string[]>(DEFAULT_SERIES);
  const [baseCurrency, setBaseCurrency] = useState<SupportedCurrency>("USD");
  const [hedgeRatio, setHedgeRatio] = useState<0 | 0.5 | 1>(0);
  const [horizonYears, setHorizonYears] = useState<5 | 10 | 15>(10);
  const [scenario, setScenario] = useState<ScenarioMode>("neutral");
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

  const requestPayload: StudyRequest = useMemo(
    () => ({
      mode: "ex_ante",
      seriesIds,
      baseCurrency,
      hedgeRatio,
      horizonYears,
      frequency: "monthly",
      scenario,
    }),
    [baseCurrency, hedgeRatio, horizonYears, scenario, seriesIds]
  );

  const requestKey = JSON.stringify(requestPayload);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchStudy() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/research/ex-ante", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestKey,
          signal: controller.signal,
        });
        const body = (await response.json()) as StudyOutput | { error: string };
        if (!response.ok) {
          throw new Error("error" in body ? body.error : "Unable to run ex-ante study.");
        }
        setOutput(body as StudyOutput);
      } catch (err) {
        if (controller.signal.aborted) return;
        const message = err instanceof Error ? err.message : "Unexpected ex-ante study error.";
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
  const avgCorrelation = averagePairwiseCorrelation(output);

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
        title="Ex-Ante: Capital Market Assumptions (CMA)"
        description="Forward-looking assumptions with configurable currency, hedge ratio, horizon, and scenario overlays."
        actions={<ExportButtons output={output} filePrefix="research-ex-ante" seriesNameById={seriesNameById} />}
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
            Horizon
            <select
              value={horizonYears}
              onChange={(event) => setHorizonYears(Number(event.target.value) as 5 | 10 | 15)}
              className="rounded-lg border border-white/15 bg-ink px-3 py-2 text-white"
            >
              <option value={5}>5y</option>
              <option value={10}>10y</option>
              <option value={15}>15y</option>
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm text-white/75">
            Frequency
            <select disabled className="rounded-lg border border-white/15 bg-ink px-3 py-2 text-white/70">
              <option value="monthly">Monthly</option>
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm text-white/75">
            Scenario
            <select
              value={scenario}
              onChange={(event) => setScenario(event.target.value as ScenarioMode)}
              className="rounded-lg border border-white/15 bg-ink px-3 py-2 text-white"
            >
              <option value="neutral">Neutral</option>
              <option value="rates_up">Rates Up</option>
              <option value="growth_down">Growth Down</option>
            </select>
          </label>
        </div>
      </StudyControls>

      {error ? (
        <div className="glass-panel border border-rose-400/25 p-4 text-sm text-rose-200">{error}</div>
      ) : null}

      {loading ? <div className="glass-panel p-4 text-sm text-white/60">Running ex-ante study...</div> : null}

      {output ? (
        <>
          <KpiRow
            title="Summary KPIs"
            items={[
              { label: "Expected Return (ann.)", value: formatPercent(benchmarkSeries?.annReturn ?? null) },
              { label: "Expected Vol (ann.)", value: formatPercent(benchmarkSeries?.annVol ?? null) },
              { label: "Sharpe (rf=0)", value: formatNumber(benchmarkSeries?.sharpe ?? null, 2) },
              { label: "Max Drawdown Proxy", value: "N/A", hint: "Ex-ante output" },
              { label: "Avg Correlation", value: formatNumber(avgCorrelation, 2) },
            ]}
          />

          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <ExpectedReturnChart output={output} seriesNameById={seriesNameById} />
            <CorrelationView data={output.correlationMatrix} seriesNameById={seriesNameById} />
          </div>

          <SeriesTable
            rows={output.perSeries}
            seriesNameById={seriesNameById}
            assumptionBreakdown={output.assumptions?.perSeries}
          />
        </>
      ) : null}
    </div>
  );
}

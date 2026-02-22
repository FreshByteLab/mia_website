import { formatNumber, formatPercent } from "@/lib/research/format";
import type { AssumptionComponents, SeriesStudyStats } from "@/types/research";

interface SeriesTableProps {
  rows: SeriesStudyStats[];
  seriesNameById: Record<string, string>;
  assumptionBreakdown?: Record<string, AssumptionComponents>;
}

function worstLabel(row: SeriesStudyStats): string {
  if (!row.worstPeriod) return "N/A";
  return `${row.worstPeriod.label} (${formatPercent(row.worstPeriod.value)})`;
}

function assumptionLabel(assumption?: AssumptionComponents): string {
  if (!assumption) return "N/A";
  return [
    `carry ${formatPercent(assumption.carry)}`,
    `rolldown ${formatPercent(assumption.rolldown)}`,
    `spread ${formatPercent(assumption.spread)}`,
    `loss ${formatPercent(assumption.expectedLoss)}`,
    `fx ${formatPercent(assumption.fxImpact)}`,
  ].join(" · ");
}

export default function SeriesTable({ rows, seriesNameById, assumptionBreakdown }: SeriesTableProps) {
  return (
    <section className="glass-panel overflow-hidden">
      <div className="border-b border-white/10 px-5 py-4">
        <h3 className="font-display text-lg font-semibold text-white">Per-Series Metrics</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-white/75">
          <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-accent/70">
            <tr>
              <th className="px-5 py-3 font-medium">Series</th>
              <th className="px-5 py-3 font-medium">Ann. Return</th>
              <th className="px-5 py-3 font-medium">Ann. Vol</th>
              <th className="px-5 py-3 font-medium">Sharpe</th>
              <th className="px-5 py-3 font-medium">Max DD</th>
              <th className="px-5 py-3 font-medium">Worst Period</th>
              <th className="px-5 py-3 font-medium">Corr. vs Benchmark</th>
              <th className="px-5 py-3 font-medium">Assumptions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.seriesId} className="border-t border-white/8">
                <td className="px-5 py-3 text-white">{seriesNameById[row.seriesId] ?? row.seriesId}</td>
                <td className="px-5 py-3">{formatPercent(row.annReturn)}</td>
                <td className="px-5 py-3">{formatPercent(row.annVol)}</td>
                <td className="px-5 py-3">{formatNumber(row.sharpe, 2)}</td>
                <td className="px-5 py-3">{formatPercent(row.maxDrawdown)}</td>
                <td className="px-5 py-3">{worstLabel(row)}</td>
                <td className="px-5 py-3">{formatNumber(row.correlationWithBenchmark, 2)}</td>
                <td className="px-5 py-3 text-xs text-white/60">
                  {assumptionLabel(assumptionBreakdown?.[row.seriesId])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

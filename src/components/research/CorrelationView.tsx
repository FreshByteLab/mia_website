import type { CorrelationMatrix } from "@/types/research";

interface CorrelationViewProps {
  data: CorrelationMatrix;
  seriesNameById: Record<string, string>;
}

function cellBackground(value: number): string {
  const normalized = Math.max(-1, Math.min(1, value));
  if (normalized >= 0) {
    const alpha = 0.15 + normalized * 0.35;
    return `rgba(106, 159, 216, ${alpha.toFixed(3)})`;
  }
  const alpha = 0.15 + Math.abs(normalized) * 0.35;
  return `rgba(255, 141, 122, ${alpha.toFixed(3)})`;
}

export default function CorrelationView({ data, seriesNameById }: CorrelationViewProps) {
  return (
    <section className="glass-panel overflow-hidden">
      <div className="border-b border-white/10 px-5 py-4">
        <h3 className="font-display text-lg font-semibold text-white">Correlation Matrix</h3>
      </div>
      <div className="overflow-x-auto p-4">
        <table className="min-w-full border-separate border-spacing-1 text-center text-xs text-white/80">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-accent/70">Series</th>
              {data.seriesIds.map((seriesId) => (
                <th key={seriesId} className="px-3 py-2 text-accent/70">
                  {seriesNameById[seriesId] ?? seriesId}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.matrix.map((row, rowIndex) => {
              const rowSeriesId = data.seriesIds[rowIndex];
              return (
                <tr key={rowSeriesId}>
                  <td className="px-3 py-2 text-left text-white/75">
                    {seriesNameById[rowSeriesId] ?? rowSeriesId}
                  </td>
                  {row.map((value, colIndex) => (
                    <td
                      key={`${rowSeriesId}-${data.seriesIds[colIndex]}`}
                      className="rounded px-2 py-2 font-medium"
                      style={{ backgroundColor: cellBackground(value) }}
                    >
                      {value.toFixed(2)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

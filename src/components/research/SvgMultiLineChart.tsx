import { formatDateLabel } from "@/lib/research/format";

const CHART_COLORS = ["#6a9fd8", "#f6c768", "#89d4a6", "#d58cff", "#ff8d7a"];

interface SvgMultiLineChartProps {
  title: string;
  dates: string[];
  series: Record<string, number[]>;
  labels?: Record<string, string>;
  yLabelFormatter?: (value: number) => string;
  minValue?: number;
  maxValue?: number;
}

function linePath(values: number[], minY: number, maxY: number, width: number, height: number): string {
  if (!values.length) return "";
  const usableWidth = width - 70;
  const usableHeight = height - 50;
  const xOffset = 50;
  const yOffset = 15;
  const range = maxY - minY || 1;

  const points = values.map((value, index) => {
    const x = xOffset + (index / Math.max(values.length - 1, 1)) * usableWidth;
    const y = yOffset + usableHeight - ((value - minY) / range) * usableHeight;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  return `M ${points.join(" L ")}`;
}

export default function SvgMultiLineChart({
  title,
  dates,
  series,
  labels,
  yLabelFormatter,
  minValue,
  maxValue,
}: SvgMultiLineChartProps) {
  const width = 920;
  const height = 340;

  const seriesIds = Object.keys(series);
  const allValues = seriesIds.flatMap((seriesId) => series[seriesId]).filter((value) => Number.isFinite(value));
  const rawMin = allValues.length ? Math.min(...allValues) : 0;
  const rawMax = allValues.length ? Math.max(...allValues) : 1;

  const computedMin = minValue ?? rawMin - (rawMax - rawMin || 1) * 0.08;
  const computedMax = maxValue ?? rawMax + (rawMax - rawMin || 1) * 0.08;

  const ticks = 4;
  const yTicks = new Array(ticks + 1).fill(0).map((_, index) => {
    const ratio = index / ticks;
    const value = computedMin + (computedMax - computedMin) * (1 - ratio);
    const y = 15 + ratio * (height - 50);
    return { value, y };
  });

  const xLabels = [
    dates[0],
    dates[Math.floor(dates.length / 2)] ?? "",
    dates[dates.length - 1] ?? "",
  ];

  return (
    <div className="glass-panel p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
        <div className="flex flex-wrap gap-3 text-xs text-white/60">
          {seriesIds.map((seriesId, index) => (
            <span key={seriesId} className="inline-flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
              />
              {labels?.[seriesId] ?? seriesId}
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-[320px] min-w-[760px] w-full">
          <rect x="0" y="0" width={width} height={height} fill="transparent" />

          {yTicks.map((tick) => (
            <g key={tick.y}>
              <line x1="50" y1={tick.y} x2={width - 20} y2={tick.y} stroke="rgba(229,231,235,0.08)" />
              <text x="8" y={tick.y + 4} fill="rgba(229,231,235,0.55)" fontSize="11">
                {yLabelFormatter ? yLabelFormatter(tick.value) : tick.value.toFixed(2)}
              </text>
            </g>
          ))}

          {seriesIds.map((seriesId, index) => (
            <path
              key={seriesId}
              d={linePath(series[seriesId] ?? [], computedMin, computedMax, width, height)}
              fill="none"
              stroke={CHART_COLORS[index % CHART_COLORS.length]}
              strokeWidth="2.4"
            />
          ))}

          <text x="50" y={height - 8} fill="rgba(229,231,235,0.6)" fontSize="11">
            {formatDateLabel(xLabels[0] ?? "")}
          </text>
          <text x={width / 2 - 35} y={height - 8} fill="rgba(229,231,235,0.6)" fontSize="11">
            {formatDateLabel(xLabels[1] ?? "")}
          </text>
          <text x={width - 85} y={height - 8} fill="rgba(229,231,235,0.6)" fontSize="11">
            {formatDateLabel(xLabels[2] ?? "")}
          </text>
        </svg>
      </div>
    </div>
  );
}

import SvgMultiLineChart from "@/components/research/SvgMultiLineChart";

interface DrawdownChartProps {
  dates: string[];
  drawdownBySeries: Record<string, number[]>;
  seriesNameById: Record<string, string>;
}

export default function DrawdownChart({
  dates,
  drawdownBySeries,
  seriesNameById,
}: DrawdownChartProps) {
  return (
    <SvgMultiLineChart
      title="Drawdown (Underwater)"
      dates={dates}
      series={drawdownBySeries}
      labels={seriesNameById}
      yLabelFormatter={(value) => `${(value * 100).toFixed(1)}%`}
      maxValue={0}
    />
  );
}

import SvgMultiLineChart from "@/components/research/SvgMultiLineChart";

interface TimeseriesChartProps {
  dates: string[];
  navBySeries: Record<string, number[]>;
  seriesNameById: Record<string, string>;
}

export default function TimeseriesChart({ dates, navBySeries, seriesNameById }: TimeseriesChartProps) {
  return (
    <SvgMultiLineChart
      title="Total Return Index (Normalized)"
      dates={dates}
      series={navBySeries}
      labels={seriesNameById}
      yLabelFormatter={(value) => value.toFixed(0)}
    />
  );
}

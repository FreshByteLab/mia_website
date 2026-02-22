import SvgMultiLineChart from "@/components/research/SvgMultiLineChart";

interface RollingVolChartProps {
  dates: string[];
  rollingVolBySeries: Record<string, number[]>;
  seriesNameById: Record<string, string>;
}

export default function RollingVolChart({
  dates,
  rollingVolBySeries,
  seriesNameById,
}: RollingVolChartProps) {
  return (
    <SvgMultiLineChart
      title="Rolling Volatility (Annualized)"
      dates={dates}
      series={rollingVolBySeries}
      labels={seriesNameById}
      yLabelFormatter={(value) => `${(value * 100).toFixed(1)}%`}
      minValue={0}
    />
  );
}

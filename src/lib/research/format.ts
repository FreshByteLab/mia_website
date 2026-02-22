export function formatPercent(value: number | null, digits = 2): string {
  if (value === null || !Number.isFinite(value)) return "N/A";
  return `${(value * 100).toFixed(digits)}%`;
}

export function formatNumber(value: number | null, digits = 2): string {
  if (value === null || !Number.isFinite(value)) return "N/A";
  return value.toFixed(digits);
}

export function formatDateLabel(date: string): string {
  if (!date) return "";
  const [year, month] = date.split("-");
  return `${year}-${month}`;
}

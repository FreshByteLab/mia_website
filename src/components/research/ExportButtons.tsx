"use client";

import type { StudyOutput } from "@/types/research";

interface ExportButtonsProps {
  output: StudyOutput | null;
  filePrefix: string;
  seriesNameById: Record<string, string>;
}

function downloadBlob(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function buildCsv(output: StudyOutput, seriesNameById: Record<string, string>): string {
  const header = [
    "seriesId",
    "seriesName",
    "annReturn",
    "annVol",
    "sharpe",
    "maxDrawdown",
    "worstPeriodLabel",
    "worstPeriodValue",
    "corrWithBenchmark",
  ];

  const rows = output.perSeries.map((series) => [
    series.seriesId,
    seriesNameById[series.seriesId] ?? series.seriesId,
    series.annReturn.toString(),
    series.annVol.toString(),
    series.sharpe.toString(),
    (series.maxDrawdown ?? "").toString(),
    series.worstPeriod?.label ?? "",
    (series.worstPeriod?.value ?? "").toString(),
    (series.correlationWithBenchmark ?? "").toString(),
  ]);

  const correlationHeader = ["", ...output.correlationMatrix.seriesIds].join(",");
  const correlationRows = output.correlationMatrix.matrix.map((row, rowIndex) => [
    output.correlationMatrix.seriesIds[rowIndex],
    ...row.map((value) => value.toString()),
  ]);

  return [
    header.join(","),
    ...rows.map((row) => row.join(",")),
    "",
    "CorrelationMatrix",
    correlationHeader,
    ...correlationRows.map((row) => row.join(",")),
  ].join("\n");
}

export default function ExportButtons({ output, filePrefix, seriesNameById }: ExportButtonsProps) {
  const timestamp = new Date().toISOString().slice(0, 19).replaceAll(":", "-");

  const onJsonExport = () => {
    if (!output) return;
    downloadBlob(
      `${filePrefix}-${timestamp}.json`,
      JSON.stringify(output, null, 2),
      "application/json"
    );
  };

  const onCsvExport = () => {
    if (!output) return;
    downloadBlob(
      `${filePrefix}-${timestamp}.csv`,
      buildCsv(output, seriesNameById),
      "text/csv;charset=utf-8"
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={onJsonExport}
        disabled={!output}
        className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-wider text-white/70 transition hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Export JSON
      </button>
      <button
        type="button"
        onClick={onCsvExport}
        disabled={!output}
        className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-wider text-white/70 transition hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Export CSV
      </button>
    </div>
  );
}

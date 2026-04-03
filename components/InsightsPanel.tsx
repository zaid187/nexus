"use client";

export default function InsightsPanel(props: {
  rows?: any[] | null;
  numericColumns: string[];
  categoricalColumns: string[];
}) {
  const { rows, numericColumns, categoricalColumns } = props;

  if (!rows || rows.length === 0) {
    return (
      <div className="bg-[#1a1d24] p-4 sm:p-6 rounded-xl border border-[#14ffec]/20">
        <h2 className="text-lg sm:text-xl text-[#14ffec] mb-2">
          Smart Insights
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">
          Upload a dataset to automatically generate narrative insights about your data.
        </p>
      </div>
    );
  }

  const rowCount = rows.length;

  // simple numeric stats on first numeric column
  let numericSummary: { col: string; min: number; max: number; mean: number } | null =
    null;
  if (numericColumns.length > 0) {
    const col = numericColumns[0];
    const values = rows
      .map((r) => Number(r[col]))
      .filter((v) => !isNaN(v));

    if (values.length > 0) {
      const min = Math.min(...values);
      const max = Math.max(...values);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      numericSummary = { col, min, max, mean };
    }
  }

  // simple categorical stats on first categorical column
  let topCategory: { col: string; value: string; count: number } | null = null;
  if (categoricalColumns.length > 0) {
    const col = categoricalColumns[0];
    const counts: Record<string, number> = {};
    rows.forEach((r) => {
      const v = r[col];
      if (v !== undefined && v !== null && v !== "") {
        const key = String(v);
        counts[key] = (counts[key] || 0) + 1;
      }
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (sorted.length > 0) {
      topCategory = { col, value: sorted[0][0], count: sorted[0][1] };
    }
  }

  return (
    <div className="bg-[#1a1d24] p-4 sm:p-6 rounded-xl border border-[#14ffec]/20">
      <h2 className="text-lg sm:text-xl text-[#14ffec] mb-2 flex items-center gap-2">
        Smart Insights
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#14ffec]/10 text-[#14ffec]">
          Unique feature
        </span>
      </h2>

      <p className="text-xs sm:text-sm text-gray-400 mb-3">
        Auto-generated narrative summary of your data, computed directly in the
        browser. No cloud, no login, unlike Power BI&apos;s paid Smart Narrative.
      </p>

      <ul className="list-disc list-inside text-xs sm:text-sm text-gray-300 space-y-1">
        <li>
          The dataset contains <span className="text-[#14ffec]">{rowCount}</span>{" "}
          rows and{" "}
          <span className="text-[#14ffec]">
            {numericColumns.length + categoricalColumns.length}
          </span>{" "}
          detected useful columns (
          {numericColumns.length} numeric, {categoricalColumns.length} text).
        </li>

        {numericSummary && (
          <li>
            Numeric column{" "}
            <span className="text-[#14ffec]">{numericSummary.col}</span> ranges
            approximately from{" "}
            <span className="text-[#14ffec]">
              {numericSummary.min.toFixed(2)}
            </span>{" "}
            to{" "}
            <span className="text-[#14ffec]">
              {numericSummary.max.toFixed(2)}
            </span>
            , with an average around{" "}
            <span className="text-[#14ffec]">
              {numericSummary.mean.toFixed(2)}
            </span>
            .
          </li>
        )}

        {topCategory && (
          <li>
            In column{" "}
            <span className="text-[#14ffec]">{topCategory.col}</span>, the most
            common value is{" "}
            <span className="text-[#14ffec]">&quot;{topCategory.value}&quot;</span>{" "}
            appearing <span className="text-[#14ffec]}">{topCategory.count}</span>{" "}
            times.
          </li>
        )}

        {!numericSummary && (
          <li>No numeric columns were found for statistical summaries.</li>
        )}

        {!topCategory && (
          <li>No categorical columns were found for frequency analysis.</li>
        )}
      </ul>
    </div>
  );
}

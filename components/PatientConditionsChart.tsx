"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function PatientConditionsChart(props: {
  rows?: any[] | null;
  column?: string | null;
}) {
  const { rows, column } = props;

  if (!rows || rows.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-gray-500 text-sm">
        Upload a CSV to generate category distribution.
      </div>
    );
  }

  const firstRow = rows[0];

  // allow undefined at first
  let categoricalColumn: string | undefined = column ?? undefined;

  // auto-detect first non-numeric column
  if (!categoricalColumn) {
    categoricalColumn = Object.keys(firstRow).find(
      (key) => isNaN(Number(firstRow[key]))
    );
  }

  if (!categoricalColumn) {
    return (
      <div className="h-full w-full flex items-center justify-center text-gray-500 text-sm">
        No categorical columns detected in the dataset.
      </div>
    );
  }

  const counts: Record<string, number> = {};

  rows.forEach((row) => {
    const val = row[categoricalColumn!]; // <-- FIXED HERE
    if (val !== undefined && val !== null && val !== "") {
      const key = String(val);
      counts[key] = (counts[key] || 0) + 1;
    }
  });

  const data = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([category, count]) => ({ category, count }));

  if (data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-gray-500 text-sm">
        Categorical column has no values to chart.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 10, right: 20, left: 40, bottom: 10 }}
      >
        <CartesianGrid stroke="#1f2933" strokeDasharray="3 3" />
        <XAxis
          type="number"
          tick={{ fill: "#9CA3AF", fontSize: 10 }}
          tickLine={false}
          axisLine={{ stroke: "#374151" }}
        />
        <YAxis
          type="category"
          dataKey="category"
          tick={{ fill: "#9CA3AF", fontSize: 10 }}
          tickLine={false}
          axisLine={{ stroke: "#374151" }}
          width={100}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#111827",
            border: "1px solid #14ffec66",
            borderRadius: 8,
            fontSize: 12,
          }}
          formatter={(val) => [`${val}`, "Count"]}
        />
        <Bar dataKey="count" fill="#14ffec" radius={[4, 4, 4, 4]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

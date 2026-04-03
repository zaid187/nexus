"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function BillingTrendChart(props: {
  rows?: any[] | null;
  column?: string | null;
}) {
  const { rows, column } = props;

  if (!rows || rows.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-gray-500 text-sm">
        Upload a CSV to generate numeric trend chart.
      </div>
    );
  }

  const firstRow = rows[0];

  // column to use: user-selected or auto-detected
  let numericColumn = column || "";

  if (!numericColumn) {
    numericColumn = Object.keys(firstRow).find((key) =>
      !isNaN(Number(firstRow[key]))
    ) as string | undefined;
  }

  if (!numericColumn) {
    return (
      <div className="h-full w-full flex items-center justify-center text-gray-500 text-sm">
        No numeric columns detected in the dataset.
      </div>
    );
  }

  const data = rows
    .slice(0, 100)
    .map((row, idx) => ({
      index: idx + 1,
      value: Number(row[numericColumn!]),
    }))
    .filter((d) => !isNaN(d.value));

  if (data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-gray-500 text-sm">
        Selected numeric column has no valid values to chart.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
        <CartesianGrid stroke="#1f2933" strokeDasharray="3 3" />
        <XAxis
          dataKey="index"
          tick={{ fill: "#9CA3AF", fontSize: 10 }}
          label={{
            value: "Row index",
            position: "insideBottom",
            offset: -10,
            fill: "#9CA3AF",
            fontSize: 10,
          }}
        />
        <YAxis
          tick={{ fill: "#9CA3AF", fontSize: 10 }}
          tickLine={false}
          axisLine={{ stroke: "#374151" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#111827",
            border: "1px solid #14ffec66",
            borderRadius: 8,
            fontSize: 12,
          }}
          labelFormatter={(v) => `Row ${v}`}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#14ffec"
          strokeWidth={2}
          dot={{ r: 3, stroke: "#14ffec", fill: "#14ffec" }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

"use client";

import PieChartView from "@/components/charts/PieChartView";
import { groupByCount, groupBySum } from "@/lib/dataEngine";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type ChartType = "line" | "bar" | "pie";

export type ChartRendererProps = {
  type: ChartType;
  data: any[] | null | undefined;
  xKey: string;
  yKey: string;
};

export default function ChartRenderer(props: ChartRendererProps) {
  const { type, data, xKey, yKey } = props;

  const transformed = useMemo(() => {
    if (!data || data.length === 0) return [];

    if (type === "pie") {
      return groupByCount(data, xKey).slice(0, 12);
    }

    if (type === "bar") {
      return groupBySum(data, xKey, yKey)
        .slice(0, 12)
        .map((d) => ({ category: d.name, value: d.value }));
    }

    // line: keep raw rows (no grouping), just project to x/y
    return data
      .slice(0, 400)
      .map((row: any, idx) => {
        const x = xKey === "__index__" ? idx + 1 : row?.[xKey];
        const y = Number(row?.[yKey]);
        return { x, y };
      })
      .filter((d) => d.x !== undefined && d.x !== null && Number.isFinite(d.y));
  }, [data, type, xKey, yKey]);

  if (type === "pie") {
    return <PieChartView data={transformed} />;
  }

  if (type === "bar") {
    return (
      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={transformed} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
            <CartesianGrid stroke="#1f2933" strokeDasharray="3 3" />
            <XAxis
              dataKey="category"
              tick={{ fill: "#9CA3AF", fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: "#374151" }}
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
              formatter={(val) => [`${val}`, "Sum"]}
            />
            <Bar dataKey="value" fill="#14ffec" radius={[4, 4, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // line
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={transformed} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
          <CartesianGrid stroke="#1f2933" strokeDasharray="3 3" />
          <XAxis
            dataKey="x"
            tick={{ fill: "#9CA3AF", fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: "#374151" }}
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
          />
          <Line
            type="monotone"
            dataKey="y"
            stroke="#14ffec"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

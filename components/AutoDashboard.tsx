"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useMemo } from "react";

type AutoDashboardProps = {
  headers: string[];
  rows: any[];
};

const COLORS = ["#14ffec", "#0ea5e9", "#a855f7", "#f97316", "#22c55e"];

export default function AutoDashboard({ headers, rows }: AutoDashboardProps) {
  const { numericCols, categoricalCols } = useMemo(() => {
    const nums: string[] = [];
    const cats: string[] = [];

    headers.forEach((h) => {
      const values = rows
        .map((r) => r[h])
        .filter((v) => v !== null && v !== undefined && v !== "");
      const numericCount = values.filter((v) => !isNaN(parseFloat(v))).length;
      if (values.length > 0 && numericCount / values.length > 0.8) {
        nums.push(h);
      } else {
        cats.push(h);
      }
    });

    return { numericCols: nums, categoricalCols: cats };
  }, [headers, rows]);

  const firstNumeric = numericCols[0];
  const secondNumeric = numericCols[1];
  const firstCategory = categoricalCols[0];

  // KPI calculations
  const rowCount = rows.length;
  const avgFirstNumeric =
    firstNumeric && rowCount > 0
      ? rows.reduce((sum, r) => sum + (parseFloat(r[firstNumeric]) || 0), 0) /
        rowCount
      : null;

  // Chart data
  const lineData =
    firstNumeric && rowCount > 0
      ? rows.slice(0, 50).map((r, i) => ({
          index: i + 1,
          value: parseFloat(r[firstNumeric]) || 0,
        }))
      : [];

  const categoryCountData =
    firstCategory && rowCount > 0
      ? (() => {
          const counts: Record<string, number> = {};
          rows.forEach((r) => {
            const key = r[firstCategory] || "Unknown";
            counts[key] = (counts[key] || 0) + 1;
          });
          return Object.entries(counts)
            .map(([name, count]) => ({ name, value: count }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 6);
        })()
      : [];

  const barData =
    firstCategory && secondNumeric
      ? (() => {
          const sums: Record<string, { sum: number; count: number }> = {};
          rows.forEach((r) => {
            const cat = r[firstCategory] || "Unknown";
            const val = parseFloat(r[secondNumeric]);
            if (!isNaN(val)) {
              if (!sums[cat]) sums[cat] = { sum: 0, count: 0 };
              sums[cat].sum += val;
              sums[cat].count += 1;
            }
          });
          return Object.entries(sums)
            .map(([name, { sum, count }]) => ({
              name,
              value: sum / count,
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 6);
        })()
      : [];

  return (
    <div className="mt-6 flex flex-col gap-6">
      {/* Dynamic subtitle */}
      <p className="text-sm text-gray-400">
        Detected <span className="text-[#14ffec] font-semibold">{rowCount}</span> rows ·{" "}
        <span className="text-[#14ffec] font-semibold">{headers.length}</span> columns ·{" "}
        <span className="text-[#14ffec] font-semibold">{numericCols.length}</span> numeric ·{" "}
        <span className="text-[#14ffec] font-semibold">{categoricalCols.length}</span> categorical
        columns
      </p>

      {/* Dynamic KPIs based on dataset */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-[#1a1d24] p-5 rounded-xl border border-[#14ffec]/20">
          <p className="text-sm text-gray-400">Rows</p>
          <p className="text-3xl font-bold text-[#14ffec]">{rowCount}</p>
        </div>

        <div className="bg-[#1a1d24] p-5 rounded-xl border border-[#14ffec]/20">
          <p className="text-sm text-gray-400">Columns</p>
          <p className="text-3xl font-bold text-[#14ffec]">{headers.length}</p>
        </div>

        <div className="bg-[#1a1d24] p-5 rounded-xl border border-[#14ffec]/20">
          <p className="text-sm text-gray-400">Numeric Columns</p>
          <p className="text-3xl font-bold text-[#14ffec]">{numericCols.length}</p>
        </div>

        <div className="bg-[#1a1d24] p-5 rounded-xl border border-[#14ffec]/20">
          <p className="text-sm text-gray-400">Categorical Columns</p>
          <p className="text-3xl font-bold text-[#14ffec]">{categoricalCols.length}</p>
        </div>
      </div>

      {/* Charts grid like reference UI */}
      <div className="grid grid-cols-3 gap-6 mt-4">
        {/* Line chart */}
        <div className="col-span-2 bg-[#1a1d24] p-6 rounded-xl border border-[#14ffec]/20 h-80">
          <h3 className="text-lg mb-4 text-[#14ffec]">
            {firstNumeric ? `Trend of ${firstNumeric}` : "Numeric Trend"}
          </h3>
          {firstNumeric ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262b3a" />
                <XAxis dataKey="index" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: "1px solid #14ffec",
                  }}
                  labelStyle={{ color: "#e5e7eb" }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#14ffec"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-sm">No numeric column detected for trend chart.</p>
          )}
        </div>

        {/* Right side column with pie + bar */}
        <div className="flex flex-col gap-6">
          {/* Pie chart */}
          <div className="bg-[#1a1d24] p-4 rounded-xl border border-[#14ffec]/20 h-40">
            <h3 className="text-sm mb-2 text-[#14ffec]">
              {firstCategory ? `Category Share (${firstCategory})` : "Category Share"}
            </h3>
            {categoryCountData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={categoryCountData}
                    innerRadius={25}
                    outerRadius={40}
                    paddingAngle={3}
                  >
                    {categoryCountData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-xs">No categorical data for pie chart.</p>
            )}
          </div>

          {/* Bar chart */}
          <div className="bg-[#1a1d24] p-4 rounded-xl border border-[#14ffec]/20 h-40">
            <h3 className="text-sm mb-2 text-[#14ffec]">
              {firstCategory && secondNumeric
                ? `Avg ${secondNumeric} by ${firstCategory}`
                : "Category vs Value"}
            </h3>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#262b3a" />
                  <XAxis type="number" stroke="#9ca3af" />
                  <YAxis type="category" dataKey="name" stroke="#9ca3af" width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      border: "1px solid #14ffec",
                    }}
                    labelStyle={{ color: "#e5e7eb" }}
                  />
                  <Bar dataKey="value" fill="#14ffec" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-xs">
                Need at least one category and one numeric column for this chart.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import MainLayout from "@/components/layout/MainLayout";
import { useDataset } from "@/context/DatasetContext";

import ChartRenderer from "@/components/charts/ChartRenderer";
import { useEffect, useRef, useState } from "react";

type UiChartType = "line" | "bar" | "pie";

type ChartConfig = {
  id: number;
  type: UiChartType;
  numeric: string;
  category: string;
};

export default function ChartsPage() {
  const { rows, numericColumns, categoricalColumns } = useDataset();

  const nextIdRef = useRef(2);

  const [charts, setCharts] = useState<ChartConfig[]>([
    {
      id: 1,
      type: "line",
      numeric: numericColumns[0] || "",
      category: categoricalColumns[0] || "",
    },
  ]);

  useEffect(() => {
    if (numericColumns.length === 0 && categoricalColumns.length === 0) return;
    setCharts((prev) =>
      prev.map((c) => ({
        ...c,
        numeric: c.numeric || numericColumns[0] || "",
        category: c.category || categoricalColumns[0] || "",
      }))
    );
  }, [numericColumns, categoricalColumns]);

  const canShowNumericSelector = (t: UiChartType) => t === "line";
  const canShowCategorySelector = (t: UiChartType) => t === "bar" || t === "pie";

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#14ffec]">Charts</h1>
        <p className="text-sm text-gray-400">
          Visual analysis of your dataset (Power BI–style).
        </p>
      </div>

      {/* Add Chart */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-400">
          Add multiple charts and configure each independently.
        </div>
        <button
          type="button"
          onClick={() => {
            const id = nextIdRef.current++;
            setCharts((prev) => [
              ...prev,
              {
                id,
                type: "line",
                numeric: numericColumns[0] || "",
                category: categoricalColumns[0] || "",
              },
            ]);
          }}
          className="px-4 py-2 rounded-md bg-[#14ffec]/10 border border-[#14ffec]/30 text-[#14ffec] hover:bg-[#14ffec]/15 transition text-sm"
        >
          + Add Chart
        </button>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">
        {charts.map((chart) => {
          return (
            <ChartCard key={chart.id} title={`Chart #${chart.id}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Selector
                  label="Chart Type"
                  value={chart.type}
                  options={[
                    { value: "line", label: "Line" },
                    { value: "bar", label: "Bar" },
                    { value: "pie", label: "Pie" },
                  ]}
                  onChange={(v) => {
                    setCharts((prev) =>
                      prev.map((c) =>
                        c.id === chart.id ? { ...c, type: v as UiChartType } : c
                      )
                    );
                  }}
                />

                <Selector
                  label="Numeric Column"
                  value={chart.numeric}
                  options={numericColumns.map((c) => ({ value: c, label: c }))}
                  disabled={!canShowNumericSelector(chart.type)}
                  onChange={(v) => {
                    setCharts((prev) =>
                      prev.map((c) => (c.id === chart.id ? { ...c, numeric: v } : c))
                    );
                  }}
                />

                <Selector
                  label="Categorical Column"
                  value={chart.category}
                  options={categoricalColumns.map((c) => ({ value: c, label: c }))}
                  disabled={!canShowCategorySelector(chart.type)}
                  onChange={(v) => {
                    setCharts((prev) =>
                      prev.map((c) =>
                        c.id === chart.id ? { ...c, category: v } : c
                      )
                    );
                  }}
                />
              </div>

              <div className="h-[320px]">
                {chart.type === "line" && (
                  <ChartRenderer
                    type="line"
                    data={rows ?? []}
                    xKey="__index__"
                    yKey={chart.numeric}
                  />
                )}
                {chart.type === "bar" && (
                  <ChartRenderer
                    type="bar"
                    data={rows ?? []}
                    xKey={chart.category}
                    yKey={chart.numeric}
                  />
                )}
                {chart.type === "pie" && (
                  <ChartRenderer
                    type="pie"
                    data={rows ?? []}
                    xKey={chart.category}
                    yKey={chart.numeric}
                  />
                )}
              </div>
            </ChartCard>
          );
        })}
      </div>

      {/* Insight hint */}
      <div className="bg-[#1a1d24] p-6 rounded-xl border border-[#14ffec]/20">
        <h3 className="text-lg text-[#14ffec] mb-2">Why separate Charts?</h3>
        <p className="text-sm text-gray-400">
          Just like Power BI, dashboards show KPIs, while charts pages focus purely
          on deep visual analysis and comparisons.
        </p>
      </div>
    </MainLayout>
  );
}

/* ---------------- Reusable UI ---------------- */

function Selector({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="bg-[#1a1d24] p-6 rounded-xl border border-[#14ffec]/20">
      <h3 className="text-[#14ffec] mb-3">{label}</h3>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full bg-[#0b1018] border border-gray-700 rounded-md px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="">Select column</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#1a1d24] p-6 rounded-xl border border-[#14ffec]/20 h-[420px]">
      <h3 className="text-xl text-[#14ffec] mb-4">{title}</h3>
      {children}
    </div>
  );
}

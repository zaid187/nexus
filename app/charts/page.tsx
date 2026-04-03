"use client";

import MainLayout from "@/components/layout/MainLayout";
import { useDataset } from "@/context/DatasetContext";
import BillingTrendChart from "@/components/BillingTrendChart";
import PatientConditionsChart from "@/components/PatientConditionsChart";
import LineChartView from "@/components/charts/LineChartView";
import PieChartView from "@/components/charts/PieChartView";

import { useState, useEffect, useMemo } from "react";

export default function ChartsPage() {
  const { rows, numericColumns, categoricalColumns } = useDataset();

  const [numericCol, setNumericCol] = useState<string>("");
  const [categoryCol, setCategoryCol] = useState<string>("");

  // Auto-select defaults
  useEffect(() => {
    if (!numericCol && numericColumns.length > 0) {
      setNumericCol(numericColumns[0]);
    }
  }, [numericColumns, numericCol]);

  useEffect(() => {
    if (!categoryCol && categoricalColumns.length > 0) {
      setCategoryCol(categoricalColumns[0]);
    }
  }, [categoricalColumns, categoryCol]);

  // ---- Pie chart data prep ----
  const pieData = useMemo(() => {
    if (!rows || !categoryCol) return [];

    const map: Record<string, number> = {};
    rows.forEach((row: any) => {
      const key = row[categoryCol];
      if (key) map[key] = (map[key] || 0) + 1;
    });

    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }));
  }, [rows, categoryCol]);

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#14ffec]">Charts</h1>
        <p className="text-sm text-gray-400">
          Visual analysis of your dataset (Power BI–style).
        </p>
      </div>

      {/* Column Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Selector
          label="Numeric Column"
          value={numericCol}
          options={numericColumns}
          onChange={setNumericCol}
        />

        <Selector
          label="Category Column"
          value={categoryCol}
          options={categoricalColumns}
          onChange={setCategoryCol}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">
        {/* Existing charts */}
        <ChartCard title="Trend Analysis">
          <BillingTrendChart rows={rows} column={numericCol || null} />
        </ChartCard>

        <ChartCard title="Category Distribution">
          <PatientConditionsChart rows={rows} column={categoryCol || null} />
        </ChartCard>

        {/* NEW: Line Chart */}
        <ChartCard title="Line Chart (Detailed)">
          <LineChartView rows={rows} column={numericCol || null} />
        </ChartCard>

        {/* NEW: Pie Chart */}
        <ChartCard title="Pie Chart">
          <PieChartView data={pieData.slice(0, 6)} />
        </ChartCard>
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
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="bg-[#1a1d24] p-6 rounded-xl border border-[#14ffec]/20">
      <h3 className="text-[#14ffec] mb-3">{label}</h3>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#0b1018] border border-gray-700 rounded-md px-3 py-2 text-sm"
      >
        <option value="">Select column</option>
        {options.map((col) => (
          <option key={col} value={col}>
            {col}
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

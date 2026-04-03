"use client";

import MainLayout from "@/components/layout/MainLayout";
import { useDataset } from "@/context/DatasetContext";
import DataUploader from "@/components/DataUploader";
import BillingTrendChart from "@/components/BillingTrendChart";
import PatientConditionsChart from "@/components/PatientConditionsChart";
import InsightsPanel from "@/components/InsightsPanel";
import { useState, useMemo, useEffect } from "react";

export default function DashboardPage() {
  const { headers, rows, setDataset, numericColumns, categoricalColumns } =
    useDataset();

  // ---------------- Metadata ----------------
  const totalRows = rows?.length ?? 0;
  const totalCols = headers?.length ?? 0;

  // ---------------- Missing Values ----------------
  const { missingCount, missingPercent } = useMemo(() => {
    if (!headers || !rows) return { missingCount: 0, missingPercent: 0 };

    let missing = 0;
    const totalCells = rows.length * headers.length;

    for (const row of rows) {
      for (const h of headers) {
        if (row[h] === "" || row[h] == null) missing++;
      }
    }

    return {
      missingCount: missing,
      missingPercent: totalCells ? (missing / totalCells) * 100 : 0,
    };
  }, [headers, rows]);

  // ---------------- Data Health Score ----------------
  const dataHealthScore = useMemo(() => {
    if (!headers || !rows) return 0;

    let score = 100;
    score -= Math.min(40, missingPercent * 0.5);
    if (numericColumns.length === 0) score -= 20;
    if (categoricalColumns.length === 0) score -= 20;

    return Math.max(0, Math.min(100, Math.round(score)));
  }, [missingPercent, numericColumns.length, categoricalColumns.length]);

  // ---------------- Column Selectors ----------------
  const [selectedNumeric, setSelectedNumeric] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    if (!selectedNumeric && numericColumns.length > 0) {
      setSelectedNumeric(numericColumns[0]);
    }
  }, [numericColumns]);

  useEffect(() => {
    if (!selectedCategory && categoricalColumns.length > 0) {
      setSelectedCategory(categoricalColumns[0]);
    }
  }, [categoricalColumns]);

  // ---------------- RENDER ----------------
  return (
    <MainLayout>
      {/* 🔥 Global wrapper to prevent overflow */}
      <div className="w-full max-w-full overflow-x-hidden flex flex-col gap-10">

        {/* ---------- Page Title ---------- */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-[#14ffec]">Dataset Analytics</h1>
          <p className="text-sm text-gray-400">
            Upload any CSV dataset to explore structure, quality, KPIs & smart insights.
          </p>
        </div>

        {/* ---------- Upload Section ---------- */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#14ffec]">Upload Dataset</h2>

          <DataUploader
            onDataLoaded={(h, r) => {
              setDataset(h, r);
              setSelectedNumeric("");
              setSelectedCategory("");
            }}
          />
        </section>

        {/* ---------- Preview Table ---------- */}
        {headers && rows && (
          <div className="bg-[#1a1d24] p-6 rounded-xl border border-[#14ffec]/20">
            <h2 className="text-xl text-[#14ffec] mb-4">
              Preview <span className="text-sm text-gray-400">(first 10 rows)</span>
            </h2>

            {/* 🔥 Fix table overflow */}
            <div className="w-full overflow-x-auto rounded-lg">
              <table className="min-w-max text-xs">
                <thead>
                  <tr>
                    {headers.map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2 border-b border-gray-700 text-left text-gray-300 bg-[#111827] sticky top-0"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {rows.slice(0, 10).map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/5">
                      {headers.map((h) => (
                        <td key={h} className="px-3 py-2 border-b border-gray-800">
                          {row[h]?.toString()}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------- KPI CARDS ---------- */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Total Records" value={totalRows} />
          <KpiCard label="Total Columns" value={totalCols} />
          <KpiCard label="Numeric Columns" value={numericColumns.length} />
          <KpiCard label="Text Columns" value={categoricalColumns.length} />
        </div>

        {/* ---------- Data Health ---------- */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <DataHealthCard score={dataHealthScore} />

          <KpiCard
            label="Missing Values"
            value={missingCount}
            subtitle={`${missingPercent.toFixed(1)}%`}
          />

          <div className="bg-[#1a1d24] p-6 rounded-xl border border-[#14ffec]/20">
            <h3 className="text-lg text-gray-300 mb-3">Column Types</h3>
            <p className="text-sm text-gray-300">
              <strong>Numeric:</strong> {numericColumns.join(", ") || "None"}
            </p>
            <p className="text-sm text-gray-300 mt-2">
              <strong>Text:</strong> {categoricalColumns.join(", ") || "None"}
            </p>
          </div>
        </div>

        {/* ---------- Column Selectors ---------- */}
        {rows && (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <ColumnSelector
              label="Trend Column (numeric)"
              value={selectedNumeric}
              onChange={setSelectedNumeric}
              options={numericColumns}
            />

            <ColumnSelector
              label="Category Column (text)"
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={categoricalColumns}
            />
          </div>
        )}

        {/* ---------- Charts ---------- */}
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">

          {/* 🔥 Chart overflow fix */}
          <div className="w-full overflow-x-auto">
            <div className="min-w-[600px]">
              <ChartCard title="Trend Chart">
                <BillingTrendChart
                  rows={rows}
                  column={selectedNumeric || null}
                />
              </ChartCard>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <div className="min-w-[600px]">
              <ChartCard title="Category Distribution">
                <PatientConditionsChart
                  rows={rows}
                  column={selectedCategory || null}
                />
              </ChartCard>
            </div>
          </div>

        </div>

        {/* ---------- Smart Insights ---------- */}
        <InsightsPanel
          rows={rows}
          numericColumns={numericColumns}
          categoricalColumns={categoricalColumns}
        />
      </div>
    </MainLayout>
  );
}

/* ------------------------------------------
   Reusable Components
------------------------------------------- */

/* ------------------------------------------
   Reusable Components (TypeScript Safe)
------------------------------------------- */

interface KpiCardProps {
  label: string;
  value: number;
  subtitle?: string;
}

function KpiCard({ label, value, subtitle }: KpiCardProps) {
  return (
    <div className="bg-[#1a1d24] p-6 rounded-xl border border-[#14ffec]/20">
      <h2 className="text-lg text-gray-300">{label}</h2>
      <p className="text-4xl font-bold text-[#14ffec] mt-1">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}

interface DataHealthCardProps {
  score: number;
}

function DataHealthCard({ score }: DataHealthCardProps) {
  return (
    <div className="bg-[#1a1d24] p-6 rounded-xl border border-[#14ffec]/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg text-gray-300">Data Health Score</h3>
        <span className="text-xs text-gray-500">Unique feature 🔥</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 rounded-full border-4 border-gray-800" />
          <div className="absolute inset-0 rounded-full border-4 border-[#14ffec]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-[#14ffec]">{score}</span>
          </div>
        </div>

        <p className="text-sm text-gray-400">
          Higher score = cleaner data.  
          Calculated from missing values & column structure.
        </p>
      </div>
    </div>
  );
}

interface ColumnSelectorProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}

function ColumnSelector({
  label,
  value,
  onChange,
  options,
}: ColumnSelectorProps) {
  return (
    <div className="bg-[#1a1d24] p-6 rounded-xl border border-[#14ffec]/20">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg text-[#14ffec]">{label}</h3>

        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-[#0b1018] border border-gray-700 text-sm rounded-md px-2 py-1"
        >
          <option value="">Auto Detect</option>
          {options.map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="bg-[#1a1d24] p-6 rounded-xl border border-[#14ffec]/20 h-[350px] overflow-hidden">
      <h3 className="text-xl mb-4 text-[#14ffec]">{title}</h3>
      {children}
    </div>
  );
}


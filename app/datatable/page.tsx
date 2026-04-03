"use client";

import MainLayout from "@/components/layout/MainLayout";
import { useDataset } from "@/context/DatasetContext";
import { useState, useMemo } from "react";

export default function DataTablePage() {
  const { headers, rows } = useDataset();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const rowsPerPage = 15;

  if (!rows || !headers) {
    return (
      <MainLayout>
        <p className="text-gray-400 mt-10">Upload a dataset first.</p>
      </MainLayout>
    );
  }

  const filtered = useMemo(() => {
    if (!search) return rows;

    return rows.filter((row) =>
      Object.values(row).some((v: any) =>
        v?.toString().toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [rows, search]);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold text-[#14ffec] mb-4">Data Table</h1>

      {/* Search */}
      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        placeholder="Search any value..."
        className="w-full bg-[#0b1018] border border-gray-700 rounded-md px-3 py-2 mb-4"
      />

      {/* Table */}
      <div className="overflow-auto rounded-lg border border-[#14ffec]/20">
        <table className="min-w-full text-xs">
          <thead className="bg-[#111827] sticky top-0">
            <tr>
              {headers?.map((h) => (
                <th key={h} className="px-3 py-2 text-left text-gray-300 border-b border-gray-700">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((row, idx) => (
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

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 bg-[#1a1d24] border border-gray-700 rounded-md disabled:opacity-30"
        >
          Prev
        </button>

        <span className="text-gray-400 text-sm">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 bg-[#1a1d24] border border-gray-700 rounded-md disabled:opacity-30"
        >
          Next
        </button>
      </div>
    </MainLayout>
  );
}

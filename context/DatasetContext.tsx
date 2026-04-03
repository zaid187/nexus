"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type DatasetContextType = {
  headers: string[] | null;
  rows: any[] | null;
  numericColumns: string[];
  categoricalColumns: string[];
  setDataset: (h: string[] | null, r: any[] | null) => void;
};

const DatasetContext = createContext<DatasetContextType>({
  headers: null,
  rows: null,
  numericColumns: [],
  categoricalColumns: [],
  setDataset: () => {},
});

export function DatasetProvider({ children }: { children: React.ReactNode }) {
  const [headers, setHeaders] = useState<string[] | null>(null);
  const [rows, setRows] = useState<any[] | null>(null);

  function setDataset(h: string[] | null, r: any[] | null) {
    setHeaders(h);
    setRows(r);
  }

  //* Auto detect numeric columns
  const numericColumns = useMemo(() => {
    if (!headers || !rows) return [];
    return headers.filter((h) => {
      const sample = rows.find((r) => r[h] !== "" && r[h] != null);
      return sample && !isNaN(Number(sample[h]));
    });
  }, [headers, rows]);

  //* Auto detect text columns
  const categoricalColumns = useMemo(() => {
    if (!headers || !rows) return [];
    return headers.filter((h) => {
      const sample = rows.find((r) => r[h] !== "" && r[h] != null);
      return sample && isNaN(Number(sample[h]));
    });
  }, [headers, rows]);

  return (
    <DatasetContext.Provider
      value={{
        headers,
        rows,
        numericColumns,
        categoricalColumns,
        setDataset,
      }}
    >
      {children}
    </DatasetContext.Provider>
  );
}

export const useDataset = () => useContext(DatasetContext);

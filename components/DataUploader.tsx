"use client";

import { useCallback } from "react";
import Papa from "papaparse";
import { UploadCloud } from "lucide-react";

type DataUploaderProps = {
  onDataLoaded: (headers: string[], rows: any[]) => void;
};

type PapaResult = {
  data: any[];
  meta: { fields?: string[] };
};

export default function DataUploader({ onDataLoaded }: DataUploaderProps) {
  const handleFile = useCallback(
    (file: File) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result: PapaResult) => {
          const rows = result.data.filter((r) => Object.keys(r).length > 0);
          const headers = result.meta.fields || [];
          onDataLoaded(headers, rows);
        },
      });
    },
    [onDataLoaded]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div id="upload-section" className="w-full">
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="relative group rounded-2xl bg-gradient-to-r from-cyan-500/30 via-teal-400/20 to-emerald-400/30 p-[1px] shadow-[0_0_40px_rgba(20,255,236,0.25)]"
      >
        <div className="relative rounded-2xl bg-[#050816]/90 backdrop-blur-md flex flex-col items-center justify-center gap-3 py-10 px-6 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-40 w-40 bg-[#14ffec]/10 rounded-full blur-2xl" />
          <div className="absolute -left-24 -bottom-24 h-48 w-48 bg-cyan-500/5 rounded-full blur-3xl" />

          <UploadCloud className="text-[#14ffec] group-hover:scale-110 transition-transform" size={40} />
          <p className="text-[#14ffec] font-semibold text-lg">Upload Dataset</p>
          <p className="text-sm text-gray-400 text-center max-w-md">
            Drag & drop a CSV file here, or click to browse. The dashboard will update automatically
            based on your data.
          </p>

          <label className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#14ffec]/40 text-sm text-[#14ffec] cursor-pointer hover:bg-[#14ffec]/10 transition">
            <span>Choose CSV file</span>
            <input
              type="file"
              accept=".csv"
              onChange={onInputChange}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}

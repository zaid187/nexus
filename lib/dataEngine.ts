export type DataRow = Record<string, unknown>;

export type GroupByCountDatum = {
  name: string;
  value: number;
};

export type GroupBySumDatum = {
  name: string;
  value: number;
};

function toNonEmptyString(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s.length ? s : null;
}

function toFiniteNumber(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  const n = typeof v === "number" ? v : Number(String(v).replaceAll(",", ""));
  return Number.isFinite(n) ? n : null;
}

export function groupByCount<T extends DataRow>(
  data: readonly T[] | null | undefined,
  key: string | null | undefined
): GroupByCountDatum[] {
  if (!data || data.length === 0 || !key) return [];

  const counts = new Map<string, number>();
  for (const row of data) {
    const k = toNonEmptyString(row[key]);
    if (!k) continue;
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));
}

export function groupBySum<T extends DataRow>(
  data: readonly T[] | null | undefined,
  category: string | null | undefined,
  numeric: string | null | undefined
): GroupBySumDatum[] {
  if (!data || data.length === 0 || !category || !numeric) return [];

  const sums = new Map<string, number>();
  for (const row of data) {
    const cat = toNonEmptyString(row[category]);
    const n = toFiniteNumber(row[numeric]);
    if (!cat || n === null) continue;
    sums.set(cat, (sums.get(cat) ?? 0) + n);
  }

  return Array.from(sums.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));
}

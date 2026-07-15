import type {
  Clinic,
  ClinicSummary,
  DayGroup,
  Entry,
  MonthTotal,
  RatedEntry,
} from "./types";

/**
 * Effective hourly rate for an entry: the rate frozen on the entry when it was
 * saved, or (for older entries without one) the clinic's current rate.
 */
export function rateFor(clinics: Clinic[], entry: Entry): number {
  if (typeof entry.rate === "number") return entry.rate;
  const clinic = clinics.find((c) => c.id === entry.clinicId);
  return clinic?.rates[entry.specialty] ?? 0;
}

/** Resolve an entry against its rate, computing its line total. */
export function rateEntry(clinics: Clinic[], entry: Entry): RatedEntry {
  const rate = rateFor(clinics, entry);
  return { ...entry, rate, total: Number(entry.hours) * rate };
}

/** Per-clinic rollup (hours, billed total, and rated rows) for one month. */
export function monthlySummary(
  clinics: Clinic[],
  entries: Entry[],
  monthKey: string,
): ClinicSummary[] {
  return clinics.map((clinic) => {
    const rows = entries
      .filter((e) => e.clinicId === clinic.id && e.date.startsWith(monthKey))
      .map((e) => rateEntry(clinics, e));
    const hours = rows.reduce((s, r) => s + Number(r.hours), 0);
    const total = rows.reduce((s, r) => s + r.total, 0);
    return { clinic, hours, total, rows };
  });
}

/** Billed total across all clinics for a set of summaries. */
export function summaryTotal(summaries: ClinicSummary[]): number {
  return summaries.reduce((s, r) => s + r.total, 0);
}

/** Month-by-month totals across all clinics, newest first. */
export function monthlyTotals(
  clinics: Clinic[],
  entries: Entry[],
): MonthTotal[] {
  const map: Record<string, MonthTotal> = {};
  entries.forEach((e) => {
    const key = e.date.slice(0, 7);
    if (!map[key]) map[key] = { key, hours: 0, total: 0 };
    map[key].hours += Number(e.hours);
    map[key].total += Number(e.hours) * rateFor(clinics, e);
  });
  return Object.values(map).sort((a, b) => b.key.localeCompare(a.key));
}

export interface MonthDetail {
  days: DayGroup[];
  hours: number;
  total: number;
}

/** Day-by-day breakdown for a single month, newest day first. */
export function monthDetail(
  clinics: Clinic[],
  entries: Entry[],
  monthKey: string,
): MonthDetail {
  const rows = entries
    .filter((e) => e.date.startsWith(monthKey))
    .map((e) => rateEntry(clinics, e));

  const map: Record<string, DayGroup> = {};
  rows.forEach((r) => {
    if (!map[r.date]) map[r.date] = { date: r.date, hours: 0, total: 0, items: [] };
    map[r.date].hours += Number(r.hours);
    map[r.date].total += r.total;
    map[r.date].items.push(r);
  });

  const days = Object.values(map).sort((a, b) => (a.date < b.date ? 1 : -1));
  const hours = rows.reduce((s, r) => s + Number(r.hours), 0);
  const total = rows.reduce((s, r) => s + r.total, 0);
  return { days, hours, total };
}

/** Total hours logged on a specific ISO date. */
export function hoursOn(entries: Entry[], isoDate: string): number {
  return entries
    .filter((e) => e.date === isoDate)
    .reduce((s, e) => s + Number(e.hours), 0);
}

/** Billed total across all clinics for a single month ("YYYY-MM"). */
export function monthTotal(clinics: Clinic[], entries: Entry[], monthKey: string): number {
  return entries
    .filter((e) => e.date.startsWith(monthKey))
    .reduce((s, e) => s + Number(e.hours) * rateFor(clinics, e), 0);
}

/** The month key immediately before the given one ("2026-07" → "2026-06"). */
export function previousMonthKey(monthKey: string): string {
  const [y, m] = monthKey.split("-").map(Number);
  const prev = m === 1 ? { y: y - 1, m: 12 } : { y, m: m - 1 };
  return `${prev.y}-${String(prev.m).padStart(2, "0")}`;
}

// Domain models for the hours-tracking core. No React, no framework — this is
// the stable heart of the modular monolith that feature modules build on.

export type Specialty = string;

export interface Clinic {
  id: string;
  name: string;
  color: string;
  /** Hourly rate (COP) per specialty. Its keys are the clinic's specialties. */
  rates: Record<Specialty, number>;
  /** Default hourly rate applied when a new specialty is added to this clinic. */
  defaultRate?: number;
}

export interface Entry {
  id: string;
  clinicId: string;
  specialty: Specialty;
  /** ISO date, "YYYY-MM-DD". */
  date: string;
  hours: number;
  notes: string;
}

/** An entry resolved against its clinic's rate. */
export interface RatedEntry extends Entry {
  rate: number;
  total: number;
}

/** Per-clinic rollup for a given month. */
export interface ClinicSummary {
  clinic: Clinic;
  hours: number;
  total: number;
  rows: RatedEntry[];
}

/** Per-month rollup across all clinics. */
export interface MonthTotal {
  key: string; // "YYYY-MM"
  hours: number;
  total: number;
}

/** One day's worth of entries inside a month detail view. */
export interface DayGroup {
  date: string;
  hours: number;
  total: number;
  items: RatedEntry[];
}

/** Shape of the "register / edit entry" form (hours kept as string input). */
export interface EntryForm {
  clinicId: string;
  specialty: Specialty;
  date: string;
  hours: string;
  notes: string;
}

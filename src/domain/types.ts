// Domain models for the hours-tracking core. No React, no framework — this is
// the stable heart of the modular monolith that feature modules build on.

export type Specialty = string;

export interface Clinic {
  id: string;
  name: string;
  color: string;
  /** Departamento / ciudad where the clinic is located (from the catalog). */
  department?: string;
  city?: string;
  /** NIT de la clínica (para la cuenta de cobro). */
  nit?: string;
  /** Hourly rate (COP) per specialty. Its keys are the clinic's specialties. */
  rates: Record<Specialty, number>;
  /** Default hourly rate applied when a new specialty is added to this clinic. */
  defaultRate?: number;
}

/** Payload for creating a clinic from the catalog (or a manual name). */
export interface NewClinicInput {
  name: string;
  department?: string;
  city?: string;
}

/** Datos fiscales del médico, usados en la cuenta de cobro. */
export interface Perfil {
  nombre: string;
  documento: string; // cédula o NIT
  direccion: string;
  ciudad: string;
  telefono: string;
  email: string;
  banco: string;
  tipoCuenta: string; // "Ahorros" | "Corriente"
  numeroCuenta: string;
  consecutivo: number; // próximo número de cuenta de cobro
}

export const emptyPerfil: Perfil = {
  nombre: "",
  documento: "",
  direccion: "",
  ciudad: "",
  telefono: "",
  email: "",
  banco: "",
  tipoCuenta: "Ahorros",
  numeroCuenta: "",
  consecutivo: 1,
};

export interface Entry {
  id: string;
  clinicId: string;
  specialty: Specialty;
  /** ISO date, "YYYY-MM-DD". */
  date: string;
  hours: number;
  notes: string;
  /**
   * Hourly rate (COP) frozen at the moment the entry was saved. Historical
   * records keep their rate even if the clinic's rate later changes.
   * Optional for backward compatibility: older entries fall back to the
   * clinic's current rate.
   */
  rate?: number;
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

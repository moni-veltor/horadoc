import { theme } from "@/core/theme";
import type { Clinic, Entry } from "./types";

// Demo seed data. When persistence lands this gets replaced by the data layer;
// modules only ever import the typed shapes above, never these literals.
// Each clinic carries its own set of specialties (the keys of `rates`).

export const initialClinics: Clinic[] = [
  {
    id: "c1",
    name: "Clínica Country",
    color: theme.primary,
    rates: { "Cardiología": 80000, "Medicina interna": 75000, "Urgencias": 70000 },
    defaultRate: 75000,
  },
  {
    id: "c2",
    name: "Hospital San Rafael",
    color: theme.accent,
    rates: { "Cardiología": 68000, "Medicina interna": 60000, "Urgencias": 65000 },
    defaultRate: 64000,
  },
];

export const initialEntries: Entry[] = [
  // Mayo 2026
  { id: "m1", clinicId: "c1", specialty: "Cardiología", date: "2026-05-04", hours: 6, notes: "" },
  { id: "m2", clinicId: "c1", specialty: "Medicina interna", date: "2026-05-11", hours: 5, notes: "" },
  { id: "m3", clinicId: "c2", specialty: "Urgencias", date: "2026-05-18", hours: 12, notes: "" },
  { id: "m4", clinicId: "c2", specialty: "Cardiología", date: "2026-05-25", hours: 8, notes: "" },
  // Junio 2026
  { id: "j1", clinicId: "c1", specialty: "Cardiología", date: "2026-06-03", hours: 7, notes: "" },
  { id: "j2", clinicId: "c1", specialty: "Cardiología", date: "2026-06-10", hours: 6, notes: "" },
  { id: "j3", clinicId: "c2", specialty: "Urgencias", date: "2026-06-14", hours: 10, notes: "" },
  { id: "j4", clinicId: "c2", specialty: "Medicina interna", date: "2026-06-21", hours: 4, notes: "" },
  { id: "j5", clinicId: "c1", specialty: "Medicina interna", date: "2026-06-27", hours: 5, notes: "" },
  // Julio 2026
  { id: "e1", clinicId: "c1", specialty: "Cardiología", date: "2026-07-02", hours: 6, notes: "" },
  { id: "e2", clinicId: "c1", specialty: "Cardiología", date: "2026-07-05", hours: 8, notes: "" },
  { id: "e3", clinicId: "c2", specialty: "Urgencias", date: "2026-07-06", hours: 10, notes: "Turno nocturno" },
  { id: "e4", clinicId: "c1", specialty: "Medicina interna", date: "2026-07-09", hours: 4, notes: "" },
  { id: "e5", clinicId: "c2", specialty: "Urgencias", date: "2026-07-11", hours: 12, notes: "" },
];

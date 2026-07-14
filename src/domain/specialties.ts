import type { Clinic, Specialty } from "./types";

// Catálogo maestro de especialidades: la lista de la que el médico selecciona
// al configurar cada clínica. Ampliable sin tocar los módulos que la consumen.
export const SPECIALTY_CATALOG: Specialty[] = [
  "Cardiología",
  "Medicina interna",
  "Urgencias",
  "Medicina general",
  "Pediatría",
  "Ginecología y obstetricia",
  "Cirugía general",
  "Anestesiología",
  "Ortopedia y traumatología",
  "Dermatología",
  "Neurología",
  "Psiquiatría",
  "Radiología",
  "Oftalmología",
  "Otorrinolaringología",
  "Endocrinología",
  "Gastroenterología",
  "Neumología",
  "Nefrología",
  "Oncología",
  "Urología",
  "Reumatología",
  "Infectología",
  "Cuidados intensivos",
  "Medicina física y rehabilitación",
];

/** Especialidades configuradas para una clínica (las llaves de sus tarifas). */
export function clinicSpecialties(clinic: Clinic): Specialty[] {
  return Object.keys(clinic.rates);
}

/** Especialidades del catálogo que la clínica aún no tiene agregadas. */
export function availableSpecialties(clinic: Clinic): Specialty[] {
  const yaTiene = new Set(clinicSpecialties(clinic));
  return SPECIALTY_CATALOG.filter((s) => !yaTiene.has(s));
}

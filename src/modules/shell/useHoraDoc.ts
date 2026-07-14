import { useMemo, useState } from "react";
import { CURRENT_MONTH, TODAY } from "@/core/clock";
import { clinicPalette } from "@/core/theme";
import { hoursOn, monthlySummary } from "@/domain/calculations";
import { initialClinics, initialEntries } from "@/domain/seed";
import { clinicSpecialties } from "@/domain/specialties";
import type { Clinic, Entry, EntryForm, NewClinicInput, Specialty } from "@/domain/types";

export interface Toast {
  type: "ok" | "error";
  text: string;
}

const emptyFormPatch = { hours: "", notes: "" };
const firstSpecialty = clinicSpecialties(initialClinics[0])[0] ?? "";

/**
 * Owns all HoraDoc data (clinics, entries, form draft, toasts) and the actions
 * that mutate it. UI navigation stays in the shell; actions that should trigger
 * a screen change return a boolean the caller can act on.
 */
export function useHoraDoc() {
  const [clinics, setClinics] = useState<Clinic[]>(initialClinics);
  const [entries, setEntries] = useState<Entry[]>(initialEntries);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [form, setForm] = useState<EntryForm>({
    clinicId: initialClinics[0].id,
    specialty: firstSpecialty,
    date: TODAY,
    hours: "",
    notes: "",
  });

  const resumen = useMemo(
    () => monthlySummary(clinics, entries, CURRENT_MONTH),
    [clinics, entries],
  );

  const hoyTotal = useMemo(() => hoursOn(entries, TODAY), [entries]);

  /** Returns true on success so the form can reset and close. */
  function agregarClinica({ name, department, city, tarifaBase }: NewClinicInput): boolean {
    if (!name.trim() || !tarifaBase || Number(tarifaBase) <= 0) {
      setToast({
        type: "error",
        text: "Selecciona una clínica e ingresa una tarifa válida.",
      });
      return false;
    }
    const yaExiste = clinics.some(
      (c) => c.name.toLowerCase() === name.trim().toLowerCase() && c.city === city,
    );
    if (yaExiste) {
      setToast({ type: "error", text: "Esa clínica ya está agregada." });
      return false;
    }
    // La clínica nace sin especialidades; el médico las agrega desde su tarjeta.
    // La tarifa base queda como valor por defecto de cada especialidad nueva.
    setClinics((prev) => [
      ...prev,
      {
        id: "c" + Date.now(),
        name: name.trim(),
        department,
        city,
        rates: {},
        defaultRate: Number(tarifaBase),
        color: clinicPalette[prev.length % clinicPalette.length],
      },
    ]);
    setToast({
      type: "ok",
      text: "Clínica agregada. Agrégale especialidades para registrar horas.",
    });
    return true;
  }

  function actualizarTarifa(clinicId: string, specialty: string, valor: string) {
    setClinics((prev) =>
      prev.map((c) =>
        c.id === clinicId
          ? { ...c, rates: { ...c.rates, [specialty]: Number(valor) || 0 } }
          : c,
      ),
    );
  }

  function agregarEspecialidad(clinicId: string, specialty: Specialty) {
    if (!specialty) return;
    setClinics((prev) =>
      prev.map((c) => {
        if (c.id !== clinicId || c.rates[specialty] !== undefined) return c;
        return { ...c, rates: { ...c.rates, [specialty]: c.defaultRate ?? 0 } };
      }),
    );
    setToast({ type: "ok", text: `${specialty} agregada. Ajusta su tarifa si aplica.` });
  }

  function eliminarEspecialidad(clinicId: string, specialty: Specialty) {
    const enUso = entries.some(
      (e) => e.clinicId === clinicId && e.specialty === specialty,
    );
    if (enUso) {
      setToast({
        type: "error",
        text: "No puedes eliminar una especialidad con horas registradas.",
      });
      return;
    }
    setClinics((prev) =>
      prev.map((c) => {
        if (c.id !== clinicId) return c;
        const rest = { ...c.rates };
        delete rest[specialty];
        return { ...c, rates: rest };
      }),
    );
    setToast({ type: "ok", text: "Especialidad eliminada." });
  }

  /** Returns true on success so the caller can navigate away. */
  function guardarRegistro(): boolean {
    if (!form.specialty) {
      setToast({
        type: "error",
        text: "Selecciona una especialidad para esta clínica.",
      });
      return false;
    }
    if (!form.hours || Number(form.hours) <= 0) {
      setToast({ type: "error", text: "Ingresa un número de horas válido." });
      return false;
    }
    if (editingId) {
      setEntries((prev) =>
        prev.map((e) =>
          e.id === editingId ? { ...e, ...form, hours: Number(form.hours) } : e,
        ),
      );
      setToast({ type: "ok", text: "Registro actualizado." });
    } else {
      setEntries((prev) => [
        ...prev,
        { id: "e" + Date.now(), ...form, hours: Number(form.hours) },
      ]);
      setToast({ type: "ok", text: "Horas registradas." });
    }
    setEditingId(null);
    setForm((f) => ({ ...f, ...emptyFormPatch }));
    return true;
  }

  function editarRegistro(entry: Entry) {
    setEditingId(entry.id);
    setForm({
      clinicId: entry.clinicId,
      specialty: entry.specialty,
      date: entry.date,
      hours: String(entry.hours),
      notes: entry.notes || "",
    });
  }

  function eliminarRegistro(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setToast({ type: "ok", text: "Registro eliminado." });
  }

  function cancelarEdicion() {
    setEditingId(null);
    setForm((f) => ({ ...f, ...emptyFormPatch }));
  }

  return {
    clinics,
    entries,
    form,
    setForm,
    editingId,
    toast,
    resumen,
    hoyTotal,
    agregarClinica,
    actualizarTarifa,
    agregarEspecialidad,
    eliminarEspecialidad,
    guardarRegistro,
    editarRegistro,
    eliminarRegistro,
    cancelarEdicion,
  };
}

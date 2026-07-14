import { useMemo, useState } from "react";
import { CURRENT_MONTH, TODAY } from "@/core/clock";
import { clinicPalette } from "@/core/theme";
import { hoursOn, monthlySummary } from "@/domain/calculations";
import { initialClinics, initialEntries, specialties } from "@/domain/seed";
import type { Clinic, Entry, EntryForm } from "@/domain/types";

export interface Toast {
  type: "ok" | "error";
  text: string;
}

const emptyFormPatch = { hours: "", notes: "" };

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
    specialty: specialties[0],
    date: TODAY,
    hours: "",
    notes: "",
  });

  const resumen = useMemo(
    () => monthlySummary(clinics, entries, CURRENT_MONTH),
    [clinics, entries],
  );

  const hoyTotal = useMemo(() => hoursOn(entries, TODAY), [entries]);

  function agregarClinica(nombre: string, tarifaBase: string) {
    if (!nombre.trim() || !tarifaBase || Number(tarifaBase) <= 0) {
      setToast({ type: "error", text: "Ingresa nombre y tarifa válidos." });
      return;
    }
    const rates: Record<string, number> = {};
    specialties.forEach((s) => (rates[s] = Number(tarifaBase)));
    setClinics((prev) => [
      ...prev,
      {
        id: "c" + Date.now(),
        name: nombre,
        rates,
        color: clinicPalette[prev.length % clinicPalette.length],
      },
    ]);
    setToast({
      type: "ok",
      text: "Clínica agregada. Ajusta la tarifa por especialidad si varía.",
    });
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

  /** Returns true on success so the caller can navigate away. */
  function guardarRegistro(): boolean {
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
    guardarRegistro,
    editarRegistro,
    eliminarRegistro,
    cancelarEdicion,
  };
}

import { useEffect, useMemo, useRef, useState } from "react";
import { CURRENT_MONTH, TODAY } from "@/core/clock";
import { clinicPalette } from "@/core/theme";
import {
  hoursOn,
  monthTotal,
  monthlySummary,
  previousMonthKey,
} from "@/domain/calculations";
import { clinicSpecialties } from "@/domain/specialties";
import { emptyPerfil } from "@/domain/types";
import type {
  Clinic,
  Entry,
  EntryForm,
  NewClinicInput,
  Perfil,
  Specialty,
} from "@/domain/types";

export interface Toast {
  type: "ok" | "error";
  text: string;
}

const emptyFormPatch = { hours: "", notes: "" };

/**
 * Owns all HoraDoc data (clinics, entries, form draft, toasts) and the actions
 * that mutate it. Data is loaded from and persisted to the server per doctor:
 * a new user starts blank. UI navigation stays in the shell; actions that
 * should trigger a screen change return a boolean the caller can act on.
 */
export function useHoraDoc() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [perfil, setPerfil] = useState<Perfil>(emptyPerfil);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [form, setForm] = useState<EntryForm>({
    clinicId: "",
    specialty: "",
    date: TODAY,
    hours: "",
    notes: "",
  });

  const loadedRef = useRef(false);
  const skipSaveRef = useRef(false);

  // Cargar el estado del médico una vez al entrar.
  useEffect(() => {
    let active = true;
    fetch("/api/state")
      .then((r) => (r.ok ? r.json() : { clinics: [], entries: [] }))
      .then((data) => {
        if (!active) return;
        setClinics(Array.isArray(data.clinics) ? data.clinics : []);
        setEntries(Array.isArray(data.entries) ? data.entries : []);
        setPerfil({ ...emptyPerfil, ...(data.perfil ?? {}) });
        skipSaveRef.current = true; // no re-guardar lo recién cargado
        loadedRef.current = true;
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // Guardar (con debounce) cada vez que cambian los datos, ya cargado.
  useEffect(() => {
    if (!loadedRef.current) return;
    if (skipSaveRef.current) {
      skipSaveRef.current = false;
      return;
    }
    const body = JSON.stringify({ clinics, entries, perfil });
    const t = setTimeout(() => {
      fetch("/api/state", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }, 500);
    return () => clearTimeout(t);
  }, [clinics, entries, perfil]);

  // Descargar los últimos cambios si el usuario cierra/recarga antes del debounce.
  useEffect(() => {
    function flush() {
      if (!loadedRef.current) return;
      fetch("/api/state", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinics, entries, perfil }),
        keepalive: true,
      }).catch(() => {});
    }
    window.addEventListener("beforeunload", flush);
    return () => window.removeEventListener("beforeunload", flush);
  }, [clinics, entries, perfil]);

  // Mantener el formulario apuntando a una clínica Y especialidad válidas.
  useEffect(() => {
    setForm((f) => {
      const clinic = clinics.find((c) => c.id === f.clinicId);
      if (clinic) {
        // Clínica válida: asegura que la especialidad también lo sea.
        const espec = clinicSpecialties(clinic);
        if (f.specialty && espec.includes(f.specialty)) return f;
        return { ...f, specialty: espec[0] ?? "" };
      }
      // Clínica inválida (o vacía): toma la primera disponible.
      const first = clinics[0];
      if (!first) {
        return f.clinicId || f.specialty ? { ...f, clinicId: "", specialty: "" } : f;
      }
      const espec = clinicSpecialties(first);
      return { ...f, clinicId: first.id, specialty: espec[0] ?? "" };
    });
  }, [clinics]);

  const resumen = useMemo(
    () => monthlySummary(clinics, entries, CURRENT_MONTH),
    [clinics, entries],
  );

  const hoyTotal = useMemo(() => hoursOn(entries, TODAY), [entries]);

  const todayEntries = useMemo(
    () => entries.filter((e) => e.date === TODAY),
    [entries],
  );

  const totalMesAnterior = useMemo(
    () => monthTotal(clinics, entries, previousMonthKey(CURRENT_MONTH)),
    [clinics, entries],
  );

  /** Returns true on success so the form can reset and close. */
  function agregarClinica({ name, department, city }: NewClinicInput): boolean {
    if (!name.trim()) {
      setToast({ type: "error", text: "Selecciona una clínica." });
      return false;
    }
    const yaExiste = clinics.some(
      (c) => c.name.toLowerCase() === name.trim().toLowerCase() && c.city === city,
    );
    if (yaExiste) {
      setToast({ type: "error", text: "Esa clínica ya está agregada." });
      return false;
    }
    // La clínica nace sin especialidades; el médico las agrega (con su tarifa)
    // desde la tarjeta de la clínica.
    setClinics((prev) => [
      ...prev,
      {
        id: "c" + Date.now(),
        name: name.trim(),
        department,
        city,
        rates: {},
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

  function actualizarNit(clinicId: string, nit: string) {
    setClinics((prev) => prev.map((c) => (c.id === clinicId ? { ...c, nit } : c)));
  }

  function actualizarPerfil(patch: Partial<Perfil>) {
    setPerfil((p) => ({ ...p, ...patch }));
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
    if (!form.clinicId) {
      setToast({ type: "error", text: "Selecciona una clínica." });
      return false;
    }
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
    // Congela la tarifa vigente de la clínica/especialidad en el registro.
    const clinic = clinics.find((c) => c.id === form.clinicId);
    const rate = clinic?.rates[form.specialty] ?? 0;
    if (editingId) {
      setEntries((prev) =>
        prev.map((e) =>
          e.id === editingId
            ? { ...e, ...form, hours: Number(form.hours), rate }
            : e,
        ),
      );
      setToast({ type: "ok", text: "Registro actualizado." });
    } else {
      setEntries((prev) => [
        ...prev,
        { id: "e" + Date.now(), ...form, hours: Number(form.hours), rate },
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
    perfil,
    loading,
    form,
    setForm,
    editingId,
    toast,
    resumen,
    hoyTotal,
    todayEntries,
    totalMesAnterior,
    agregarClinica,
    actualizarTarifa,
    actualizarNit,
    actualizarPerfil,
    agregarEspecialidad,
    eliminarEspecialidad,
    guardarRegistro,
    editarRegistro,
    eliminarRegistro,
    cancelarEdicion,
  };
}

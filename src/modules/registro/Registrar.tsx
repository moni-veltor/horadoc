import type { Dispatch, SetStateAction } from "react";
import { clinicSpecialties } from "@/domain/specialties";
import type { Clinic, EntryForm } from "@/domain/types";
import { fontDisplay, fontMono, theme } from "@/core/theme";

export function Registrar({
  clinics,
  form,
  setForm,
  onGuardar,
  editingId,
  onCancelarEdicion,
}: {
  clinics: Clinic[];
  form: EntryForm;
  setForm: Dispatch<SetStateAction<EntryForm>>;
  onGuardar: () => void;
  editingId: string | null;
  onCancelarEdicion: () => void;
}) {
  // El dropdown de especialidad depende de la clínica seleccionada.
  const selectedClinic = clinics.find((c) => c.id === form.clinicId);
  const especialidades = selectedClinic ? clinicSpecialties(selectedClinic) : [];
  const sinEspecialidades = especialidades.length === 0;

  function onClinicChange(clinicId: string) {
    const next = clinics.find((c) => c.id === clinicId);
    const espec = next ? clinicSpecialties(next) : [];
    // Conserva la especialidad si la nueva clínica también la tiene; si no, toma la primera.
    const specialty = espec.includes(form.specialty) ? form.specialty : espec[0] ?? "";
    setForm({ ...form, clinicId, specialty });
  }

  if (clinics.length === 0) {
    return (
      <div>
        <div className="text-lg mb-4" style={fontDisplay}>Registrar horas</div>
        <div
          className="rounded-lg px-3 py-3 text-sm"
          style={{ background: theme.accentLight, color: theme.accent }}
        >
          Aún no tienes clínicas. Agrega tu primera clínica en la pestaña
          Clínicas para empezar a registrar horas.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg" style={fontDisplay}>
          {editingId ? "Editar registro" : "Registrar horas"}
        </div>
        {editingId && (
          <button onClick={onCancelarEdicion} className="text-xs" style={{ color: theme.muted }}>
            Cancelar edición
          </button>
        )}
      </div>

      <label className="text-xs" style={{ color: theme.muted }}>Clínica</label>
      <select
        className="w-full mb-3 p-3 rounded-lg border text-sm"
        style={{ borderColor: theme.primaryLight, background: theme.surface }}
        value={form.clinicId}
        onChange={(e) => onClinicChange(e.target.value)}
      >
        {clinics.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <label className="text-xs" style={{ color: theme.muted }}>Especialidad</label>
      <select
        className="w-full mb-3 p-3 rounded-lg border text-sm"
        style={{ borderColor: theme.primaryLight, background: theme.surface }}
        value={form.specialty}
        disabled={sinEspecialidades}
        onChange={(e) => setForm({ ...form, specialty: e.target.value })}
      >
        {sinEspecialidades ? (
          <option value="">Sin especialidades</option>
        ) : (
          especialidades.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))
        )}
      </select>
      {sinEspecialidades && (
        <div
          className="rounded-lg px-3 py-2 mb-3 text-xs"
          style={{ background: theme.accentLight, color: theme.accent }}
        >
          Esta clínica aún no tiene especialidades. Agrégalas en la pestaña
          Clínicas para poder registrar horas.
        </div>
      )}

      <label className="text-xs" style={{ color: theme.muted }}>Fecha</label>
      <input
        type="date"
        className="w-full mb-3 p-3 rounded-lg border text-sm"
        style={{ borderColor: theme.primaryLight, background: theme.surface, ...fontMono }}
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
      />

      <label className="text-xs" style={{ color: theme.muted }}>Horas trabajadas</label>
      <input
        type="number"
        placeholder="0"
        className="w-full mb-3 p-3 rounded-lg border text-sm"
        style={{ borderColor: theme.primaryLight, background: theme.surface, ...fontMono }}
        value={form.hours}
        onChange={(e) => setForm({ ...form, hours: e.target.value })}
      />

      <label className="text-xs" style={{ color: theme.muted }}>Notas (opcional)</label>
      <input
        type="text"
        placeholder="Ej: turno nocturno"
        className="w-full mb-4 p-3 rounded-lg border text-sm"
        style={{ borderColor: theme.primaryLight, background: theme.surface }}
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
      />

      <button
        onClick={onGuardar}
        disabled={sinEspecialidades}
        className="w-full py-3 rounded-xl font-medium text-sm"
        style={{
          background: sinEspecialidades ? theme.muted : theme.primary,
          color: "#fff",
          opacity: sinEspecialidades ? 0.6 : 1,
        }}
      >
        {editingId ? "Guardar cambios" : "Guardar registro"}
      </button>
    </div>
  );
}

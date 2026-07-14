import type { Dispatch, SetStateAction } from "react";
import { specialties } from "@/domain/seed";
import type { Clinic, Entry, EntryForm } from "@/domain/types";
import { fontDisplay, fontMono, theme } from "@/core/theme";
import { Card } from "@/shared/ui/Card";

export function Registrar({
  clinics,
  entries,
  form,
  setForm,
  onGuardar,
  editingId,
  onEditar,
  onEliminar,
  onCancelarEdicion,
}: {
  clinics: Clinic[];
  entries: Entry[];
  form: EntryForm;
  setForm: Dispatch<SetStateAction<EntryForm>>;
  onGuardar: () => void;
  editingId: string | null;
  onEditar: (entry: Entry) => void;
  onEliminar: (id: string) => void;
  onCancelarEdicion: () => void;
}) {
  const clinicName = (id: string) => clinics.find((c) => c.id === id)?.name || "—";
  const recientes = [...entries].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 8);

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
        onChange={(e) => setForm({ ...form, clinicId: e.target.value })}
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
        onChange={(e) => setForm({ ...form, specialty: e.target.value })}
      >
        {specialties.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

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
        className="w-full py-3 rounded-xl font-medium text-sm"
        style={{ background: theme.primary, color: "#fff" }}
      >
        {editingId ? "Guardar cambios" : "Guardar registro"}
      </button>

      <div
        className="text-xs uppercase tracking-wide mt-6 mb-2"
        style={{ color: theme.muted, letterSpacing: "0.06em" }}
      >
        Registros recientes
      </div>
      {recientes.map((r) => (
        <Card key={r.id}>
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-medium">{clinicName(r.clinicId)}</div>
              <div className="text-xs" style={{ color: theme.muted }}>
                {r.date} · {r.specialty} · <span style={fontMono}>{r.hours}h</span>
              </div>
              {r.notes && (
                <div className="text-xs mt-0.5" style={{ color: theme.muted }}>&quot;{r.notes}&quot;</div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => onEditar(r)}
                className="text-xs font-medium"
                style={{ color: theme.primary }}
              >
                Editar
              </button>
              <button
                onClick={() => onEliminar(r.id)}
                className="text-xs font-medium"
                style={{ color: theme.danger }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

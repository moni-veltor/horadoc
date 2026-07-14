import { useState } from "react";
import { money } from "@/core/format";
import { specialties } from "@/domain/seed";
import type { Clinic, ClinicSummary } from "@/domain/types";
import { fontDisplay, fontMono, theme } from "@/core/theme";
import { Card } from "@/shared/ui/Card";

export function Clinicas({
  clinics,
  resumen,
  onAgregar,
  onActualizarTarifa,
}: {
  clinics: Clinic[];
  resumen: ClinicSummary[];
  onAgregar: (nombre: string, tarifa: string) => void;
  onActualizarTarifa: (clinicId: string, specialty: string, valor: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState("");
  const [tarifa, setTarifa] = useState("");

  return (
    <div>
      <div className="text-lg mb-4" style={fontDisplay}>Clínicas</div>
      {clinics.map((c) => {
        const r = resumen.find((x) => x.clinic.id === c.id);
        return (
          <Card key={c.id}>
            <div className="flex justify-between items-start mb-2">
              <div className="font-medium">{c.name}</div>
              <div className="text-xs" style={{ color: theme.accent, ...fontMono }}>
                {r?.hours ?? 0}h · {money(r?.total ?? 0)}
              </div>
            </div>
            <div className="text-xs mb-2" style={{ color: theme.muted }}>
              Tarifa por hora, según especialidad
            </div>
            {specialties.map((s) => (
              <div key={s} className="flex justify-between items-center py-1">
                <span className="text-xs">{s}</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs" style={{ color: theme.muted }}>$</span>
                  <input
                    type="number"
                    className="w-24 p-1.5 rounded-md border text-xs text-right"
                    style={{ borderColor: theme.primaryLight, ...fontMono }}
                    value={c.rates[s] ?? 0}
                    onChange={(e) => onActualizarTarifa(c.id, s, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </Card>
        );
      })}

      {showForm ? (
        <Card>
          <label className="text-xs" style={{ color: theme.muted }}>Nombre de la clínica</label>
          <input
            type="text"
            className="w-full mb-2 p-2.5 rounded-lg border text-sm"
            style={{ borderColor: theme.primaryLight }}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Clínica del Country"
          />
          <label className="text-xs" style={{ color: theme.muted }}>Tarifa base por hora (COP)</label>
          <input
            type="number"
            className="w-full mb-1 p-2.5 rounded-lg border text-sm"
            style={{ borderColor: theme.primaryLight, ...fontMono }}
            value={tarifa}
            onChange={(e) => setTarifa(e.target.value)}
            placeholder="70000"
          />
          <div className="text-xs mb-3" style={{ color: theme.muted }}>
            Se aplica a todas las especialidades; luego puedes ajustarla una por una.
          </div>
          <div className="flex gap-2">
            <button
              className="flex-1 py-2.5 rounded-lg text-sm font-medium"
              style={{ background: theme.primary, color: "#fff" }}
              onClick={() => {
                onAgregar(nombre, tarifa);
                setNombre("");
                setTarifa("");
                setShowForm(false);
              }}
            >
              Guardar
            </button>
            <button
              className="flex-1 py-2.5 rounded-lg text-sm"
              style={{ color: theme.muted }}
              onClick={() => setShowForm(false)}
            >
              Cancelar
            </button>
          </div>
        </Card>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 rounded-xl mt-1 font-medium text-sm border"
          style={{ borderColor: theme.primary, color: theme.primary, background: "transparent" }}
        >
          + Nueva clínica
        </button>
      )}
    </div>
  );
}

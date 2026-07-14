import { useState } from "react";
import { X } from "lucide-react";
import { money } from "@/core/format";
import {
  OTRA_CLINICA,
  ciudadesDe,
  clinicasDe,
  departamentos,
} from "@/domain/colombia";
import { availableSpecialties, clinicSpecialties } from "@/domain/specialties";
import type { Clinic, ClinicSummary, NewClinicInput } from "@/domain/types";
import { fontDisplay, fontMono, theme } from "@/core/theme";
import { Card } from "@/shared/ui/Card";

const selectStyle = { borderColor: theme.primaryLight, background: theme.surface };

export function Clinicas({
  clinics,
  resumen,
  onAgregar,
  onActualizarTarifa,
  onAgregarEspecialidad,
  onEliminarEspecialidad,
}: {
  clinics: Clinic[];
  resumen: ClinicSummary[];
  onAgregar: (input: NewClinicInput) => boolean;
  onActualizarTarifa: (clinicId: string, specialty: string, valor: string) => void;
  onAgregarEspecialidad: (clinicId: string, specialty: string) => void;
  onEliminarEspecialidad: (clinicId: string, specialty: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [departamento, setDepartamento] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [clinica, setClinica] = useState("");
  const [clinicaManual, setClinicaManual] = useState("");
  const [tarifa, setTarifa] = useState("");

  const ciudades = departamento ? ciudadesDe(departamento) : [];
  const clinicasCiudad = departamento && ciudad ? clinicasDe(departamento, ciudad) : [];
  const esOtra = clinica === OTRA_CLINICA;
  const nombreResuelto = esOtra ? clinicaManual.trim() : clinica;
  const puedeGuardar = Boolean(nombreResuelto && tarifa && Number(tarifa) > 0);

  function resetForm() {
    setDepartamento("");
    setCiudad("");
    setClinica("");
    setClinicaManual("");
    setTarifa("");
  }

  function guardarClinica() {
    const ok = onAgregar({
      name: nombreResuelto,
      department: departamento,
      city: ciudad,
      tarifaBase: tarifa,
    });
    if (ok) {
      resetForm();
      setShowForm(false);
    }
  }

  return (
    <div>
      <div className="text-lg mb-4" style={fontDisplay}>Clínicas</div>
      {clinics.map((c) => {
        const r = resumen.find((x) => x.clinic.id === c.id);
        const especialidades = clinicSpecialties(c);
        const disponibles = availableSpecialties(c);
        return (
          <Card key={c.id}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-medium">{c.name}</div>
                {(c.city || c.department) && (
                  <div className="text-xs" style={{ color: theme.muted }}>
                    {[c.city, c.department].filter(Boolean).join(", ")}
                  </div>
                )}
              </div>
              <div className="text-xs" style={{ color: theme.accent, ...fontMono }}>
                {r?.hours ?? 0}h · {money(r?.total ?? 0)}
              </div>
            </div>
            <div className="text-xs mb-2" style={{ color: theme.muted }}>
              Tarifa por hora, según especialidad
            </div>

            {especialidades.length === 0 && (
              <div className="text-xs mb-2" style={{ color: theme.muted }}>
                Aún no has agregado especialidades a esta clínica.
              </div>
            )}

            {especialidades.map((s) => (
              <div key={s} className="flex justify-between items-center py-1">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onEliminarEspecialidad(c.id, s)}
                    className="flex items-center justify-center rounded-full"
                    style={{ color: theme.muted }}
                    aria-label={`Quitar ${s}`}
                    title={`Quitar ${s}`}
                  >
                    <X size={14} />
                  </button>
                  <span className="text-xs">{s}</span>
                </div>
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

            {disponibles.length > 0 ? (
              <select
                className="w-full mt-2 p-2.5 rounded-lg border text-sm"
                style={{ borderColor: theme.primary, color: theme.primary, background: "transparent" }}
                value=""
                onChange={(e) => {
                  if (e.target.value) onAgregarEspecialidad(c.id, e.target.value);
                }}
              >
                <option value="">+ Agregar especialidad</option>
                {disponibles.map((s) => (
                  <option key={s} value={s} style={{ color: theme.ink }}>{s}</option>
                ))}
              </select>
            ) : (
              <div className="text-xs mt-2" style={{ color: theme.muted }}>
                Todas las especialidades del catálogo están agregadas.
              </div>
            )}
          </Card>
        );
      })}

      {showForm ? (
        <Card>
          <label className="text-xs" style={{ color: theme.muted }}>Departamento</label>
          <select
            className="w-full mb-3 p-2.5 rounded-lg border text-sm"
            style={selectStyle}
            value={departamento}
            onChange={(e) => {
              setDepartamento(e.target.value);
              setCiudad("");
              setClinica("");
              setClinicaManual("");
            }}
          >
            <option value="">Selecciona un departamento</option>
            {departamentos().map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <label className="text-xs" style={{ color: theme.muted }}>Ciudad</label>
          <select
            className="w-full mb-3 p-2.5 rounded-lg border text-sm"
            style={selectStyle}
            value={ciudad}
            disabled={!departamento}
            onChange={(e) => {
              setCiudad(e.target.value);
              setClinica("");
              setClinicaManual("");
            }}
          >
            <option value="">
              {departamento ? "Selecciona una ciudad" : "Elige un departamento primero"}
            </option>
            {ciudades.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <label className="text-xs" style={{ color: theme.muted }}>Clínica</label>
          <select
            className="w-full mb-3 p-2.5 rounded-lg border text-sm"
            style={selectStyle}
            value={clinica}
            disabled={!ciudad}
            onChange={(e) => {
              setClinica(e.target.value);
              if (e.target.value !== OTRA_CLINICA) setClinicaManual("");
            }}
          >
            <option value="">
              {ciudad ? "Selecciona una clínica" : "Elige una ciudad primero"}
            </option>
            {clinicasCiudad.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
            {ciudad && <option value={OTRA_CLINICA}>Otra clínica…</option>}
          </select>

          {esOtra && (
            <input
              type="text"
              className="w-full mb-3 p-2.5 rounded-lg border text-sm"
              style={{ borderColor: theme.primaryLight }}
              value={clinicaManual}
              onChange={(e) => setClinicaManual(e.target.value)}
              placeholder="Nombre de la clínica"
            />
          )}

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
            Será la tarifa por defecto de las especialidades que agregues a esta clínica.
          </div>
          <div className="flex gap-2">
            <button
              className="flex-1 py-2.5 rounded-lg text-sm font-medium"
              style={{
                background: puedeGuardar ? theme.primary : theme.muted,
                color: "#fff",
                opacity: puedeGuardar ? 1 : 0.6,
              }}
              disabled={!puedeGuardar}
              onClick={guardarClinica}
            >
              Guardar
            </button>
            <button
              className="flex-1 py-2.5 rounded-lg text-sm"
              style={{ color: theme.muted }}
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
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

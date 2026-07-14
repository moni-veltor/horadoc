import { Trash2 } from "lucide-react";
import { TODAY } from "@/core/clock";
import { dayMonthLabel, money } from "@/core/format";
import { summaryTotal } from "@/domain/calculations";
import type { Clinic, ClinicSummary, Entry } from "@/domain/types";
import { fontDisplay, fontMono, theme } from "@/core/theme";
import { Card } from "@/shared/ui/Card";
import { PulseDivider } from "@/shared/ui/PulseDivider";

export function Inicio({
  hoyTotal,
  resumen,
  todayEntries,
  clinics,
  totalMesAnterior,
  onRegistrar,
  onEditar,
  onEliminar,
}: {
  hoyTotal: number;
  resumen: ClinicSummary[];
  todayEntries: Entry[];
  clinics: Clinic[];
  totalMesAnterior: number;
  onRegistrar: () => void;
  onEditar: (entry: Entry) => void;
  onEliminar: (id: string) => void;
}) {
  const totalMes = summaryTotal(resumen);
  const clinicName = (id: string) => clinics.find((c) => c.id === id)?.name || "—";
  const deltaPct =
    totalMesAnterior > 0
      ? Math.round(((totalMes - totalMesAnterior) / totalMesAnterior) * 100)
      : null;

  return (
    <div>
      <div className="mt-2 mb-1" style={fontDisplay}>
        <div className="text-sm" style={{ color: theme.muted }}>
          Hoy, {dayMonthLabel(TODAY)}
        </div>
        <div className="text-4xl mt-1" style={{ color: theme.ink }}>
          {hoyTotal}h
        </div>
      </div>

      {todayEntries.length === 0 ? (
        <div
          className="rounded-lg px-3 py-2 mb-3 text-xs"
          style={{ background: theme.accentLight, color: theme.accent }}
        >
          Aún no registras horas hoy. Hazlo antes de terminar tu turno para no olvidarlo.
        </div>
      ) : (
        <div className="mb-3">
          <div
            className="text-[11px] mb-1"
            style={{ color: theme.muted }}
          >
            Toca un registro para editarlo
          </div>
          {todayEntries.map((e) => (
            <div key={e.id} className="flex items-center gap-2 mb-2">
              <button
                onClick={() => onEditar(e)}
                className="flex-1 text-left rounded-xl p-3 shadow-sm"
                style={{ background: theme.surface }}
              >
                <div className="text-sm font-medium">{clinicName(e.clinicId)}</div>
                <div className="text-xs" style={{ color: theme.muted }}>
                  {e.specialty} · <span style={fontMono}>{e.hours}h</span>
                  {e.notes ? ` · "${e.notes}"` : ""}
                </div>
              </button>
              <button
                onClick={() => onEliminar(e.id)}
                className="p-2"
                aria-label="Eliminar registro"
                style={{ color: theme.danger }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <Card style={{ background: theme.gradient }}>
        <div className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.85)" }}>
          Llevas facturado este mes
        </div>
        <div className="text-3xl" style={{ ...fontMono, color: "#fff" }}>
          {money(totalMes)}
        </div>
        {deltaPct !== null && (
          <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.85)" }}>
            {deltaPct >= 0 ? "▲" : "▼"} {Math.abs(deltaPct)}% vs. mes anterior
          </div>
        )}
      </Card>

      <PulseDivider />
      <div
        className="text-xs uppercase tracking-wide mb-2"
        style={{ color: theme.muted, letterSpacing: "0.06em" }}
      >
        Este mes por clínica
      </div>
      {resumen.map(({ clinic, hours }) => (
        <Card key={clinic.id}>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">{clinic.name}</div>
              <div className="text-xs" style={{ color: theme.muted }}>
                {hours}h registradas
              </div>
            </div>
            <div className="w-2 h-8 rounded-full" style={{ background: clinic.color }} />
          </div>
        </Card>
      ))}
      <button
        onClick={onRegistrar}
        className="w-full py-3 rounded-xl mt-2 font-medium text-sm"
        style={{ background: theme.primary, color: "#fff" }}
      >
        + Registrar horas de hoy
      </button>
    </div>
  );
}

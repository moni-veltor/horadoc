import { TODAY } from "@/core/clock";
import { dayMonthLabel, money } from "@/core/format";
import { summaryTotal } from "@/domain/calculations";
import type { ClinicSummary } from "@/domain/types";
import { fontDisplay, fontMono, theme } from "@/core/theme";
import { Card } from "@/shared/ui/Card";
import { PulseDivider } from "@/shared/ui/PulseDivider";

export function Inicio({
  hoyTotal,
  resumen,
  onRegistrar,
}: {
  hoyTotal: number;
  resumen: ClinicSummary[];
  onRegistrar: () => void;
}) {
  const totalMes = summaryTotal(resumen);
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
      {hoyTotal === 0 && (
        <div
          className="rounded-lg px-3 py-2 mb-3 text-xs"
          style={{ background: theme.accentLight, color: theme.accent }}
        >
          Aún no registras horas hoy. Hazlo antes de terminar tu turno para no olvidarlo.
        </div>
      )}

      <Card style={{ background: theme.gradient }}>
        <div className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.85)" }}>
          Llevas facturado este mes
        </div>
        <div className="text-3xl" style={{ ...fontMono, color: "#fff" }}>
          {money(totalMes)}
        </div>
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

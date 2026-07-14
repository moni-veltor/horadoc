import { monthLabel, money } from "@/core/format";
import { monthlyTotals } from "@/domain/calculations";
import type { Clinic, Entry } from "@/domain/types";
import { fontDisplay, fontMono, theme } from "@/core/theme";
import { Card } from "@/shared/ui/Card";

export function Historico({
  clinics,
  entries,
  onVolver,
  onSeleccionarMes,
}: {
  clinics: Clinic[];
  entries: Entry[];
  onVolver: () => void;
  onSeleccionarMes: (key: string) => void;
}) {
  const meses = monthlyTotals(clinics, entries);
  const maxTotal = Math.max(...meses.map((m) => m.total), 1);

  return (
    <div>
      <button onClick={onVolver} className="text-xs mb-3" style={{ color: theme.muted }}>
        ← Volver al resumen
      </button>
      <div className="text-lg mb-1" style={fontDisplay}>Histórico mensual</div>
      <div className="text-xs mb-4" style={{ color: theme.muted }}>
        Todo lo facturado, mes a mes. Toca un mes para ver el detalle por día.
      </div>

      {meses.map((m) => (
        <button key={m.key} onClick={() => onSeleccionarMes(m.key)} className="w-full text-left">
          <Card>
            <div className="flex justify-between items-center mb-2">
              <div className="font-medium text-sm">{monthLabel(m.key)}</div>
              <div className="text-sm" style={{ ...fontMono, color: theme.primary }}>
                {money(m.total)}
              </div>
            </div>
            <div className="text-xs mb-2" style={{ color: theme.muted }}>
              {m.hours} horas trabajadas
            </div>
            <div className="w-full h-2 rounded-full" style={{ background: theme.primaryLight }}>
              <div
                className="h-2 rounded-full"
                style={{ width: `${(m.total / maxTotal) * 100}%`, background: theme.gradient }}
              />
            </div>
          </Card>
        </button>
      ))}

      {meses.length === 0 && (
        <div className="text-sm text-center mt-6" style={{ color: theme.muted }}>
          Aún no hay registros para mostrar histórico.
        </div>
      )}
    </div>
  );
}

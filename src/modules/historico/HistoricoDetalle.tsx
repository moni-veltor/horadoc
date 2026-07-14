import { monthLabel, money } from "@/core/format";
import { monthDetail } from "@/domain/calculations";
import type { Clinic, Entry } from "@/domain/types";
import { fontDisplay, fontMono, theme } from "@/core/theme";
import { Card } from "@/shared/ui/Card";
import { PulseDivider } from "@/shared/ui/PulseDivider";

export function HistoricoDetalle({
  clinics,
  entries,
  mesKey,
  onVolver,
}: {
  clinics: Clinic[];
  entries: Entry[];
  mesKey: string;
  onVolver: () => void;
}) {
  const clinicName = (id: string) => clinics.find((c) => c.id === id)?.name || "—";
  const { days, hours, total } = monthDetail(clinics, entries, mesKey);

  return (
    <div>
      <button onClick={onVolver} className="text-xs mb-3" style={{ color: theme.muted }}>
        ← Volver al histórico
      </button>
      <div className="text-lg mb-1" style={fontDisplay}>{monthLabel(mesKey)}</div>
      <div className="text-3xl mb-1" style={{ ...fontMono, color: theme.primary }}>
        {money(total)}
      </div>
      <div className="text-xs mb-4" style={{ color: theme.muted }}>
        {hours} horas registradas · {days.length} días trabajados
      </div>

      <PulseDivider />

      <div
        className="text-xs uppercase tracking-wide mb-2"
        style={{ color: theme.muted, letterSpacing: "0.06em" }}
      >
        Detalle por día
      </div>
      {days.map((d) => (
        <Card key={d.date}>
          <div className="flex justify-between items-center mb-1.5">
            <div className="text-sm font-medium">{d.date}</div>
            <div className="text-sm" style={fontMono}>{money(d.total)}</div>
          </div>
          {d.items.map((it) => (
            <div
              key={it.id}
              className="flex justify-between text-xs py-1"
              style={{ color: theme.muted }}
            >
              <span>{clinicName(it.clinicId)} · {it.specialty}</span>
              <span style={fontMono}>{it.hours}h</span>
            </div>
          ))}
        </Card>
      ))}

      {days.length === 0 && (
        <div className="text-sm text-center mt-6" style={{ color: theme.muted }}>
          No hay registros en este mes.
        </div>
      )}
    </div>
  );
}

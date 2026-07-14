import { CURRENT_MONTH } from "@/core/clock";
import { monthName, money } from "@/core/format";
import { summaryTotal } from "@/domain/calculations";
import type { ClinicSummary } from "@/domain/types";
import { fontDisplay, fontMono, theme } from "@/core/theme";
import { Card } from "@/shared/ui/Card";
import { PulseDivider } from "@/shared/ui/PulseDivider";

export function Resumen({
  resumen,
  onVerFactura,
  onVerHistorico,
}: {
  resumen: ClinicSummary[];
  onVerFactura: (clinicId: string) => void;
  onVerHistorico: () => void;
}) {
  const totalMes = summaryTotal(resumen);
  return (
    <div>
      <div className="text-lg mb-1" style={fontDisplay}>
        Resumen de {monthName(CURRENT_MONTH)}
      </div>
      <div className="text-3xl mb-2" style={{ ...fontMono, color: theme.accent }}>
        {money(totalMes)}
      </div>
      <button
        onClick={onVerHistorico}
        className="text-xs font-medium mb-2"
        style={{ color: theme.primary }}
      >
        Ver histórico por meses →
      </button>
      <PulseDivider color={theme.accent} />
      {resumen.map(({ clinic, hours, total }) => (
        <Card key={clinic.id}>
          <div className="flex justify-between items-center mb-2">
            <div className="font-medium">{clinic.name}</div>
            <div className="text-sm" style={fontMono}>{money(total)}</div>
          </div>
          <div className="text-xs mb-3" style={{ color: theme.muted }}>
            {hours} horas trabajadas
          </div>
          <button
            onClick={() => onVerFactura(clinic.id)}
            className="text-xs font-medium px-3 py-2 rounded-lg"
            style={{ background: theme.accentLight, color: theme.accent }}
          >
            Ver borrador de cuenta de cobro →
          </button>
        </Card>
      ))}
    </div>
  );
}

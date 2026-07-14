import { useState } from "react";
import { FileText } from "lucide-react";
import { money } from "@/core/format";
import type { Clinic, ClinicSummary } from "@/domain/types";
import { fontDisplay, fontMono, theme } from "@/core/theme";
import { Card } from "@/shared/ui/Card";
import { PulseDivider } from "@/shared/ui/PulseDivider";

export function Factura({
  clinics,
  resumen,
  selected,
  setSelected,
  onVolver,
}: {
  clinics: Clinic[];
  resumen: ClinicSummary[];
  selected: string;
  setSelected: (id: string) => void;
  onVolver: () => void;
}) {
  const [retencionPct, setRetencionPct] = useState<string | number>(11);
  const data = resumen.find((r) => r.clinic.id === selected);
  if (!data) return null;

  const valorRetencion = data.total * (Number(retencionPct) / 100);
  const totalNeto = data.total - valorRetencion;

  return (
    <div>
      <button onClick={onVolver} className="text-xs mb-3 no-print" style={{ color: theme.muted }}>
        ← Volver al resumen
      </button>
      <div className="text-lg mb-3" style={fontDisplay}>Borrador de cuenta de cobro</div>

      <select
        className="w-full mb-4 p-3 rounded-lg border text-sm no-print"
        style={{ borderColor: theme.primaryLight, background: theme.surface }}
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
      >
        {clinics.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <Card>
        <div className="flex justify-between mb-1">
          <span className="text-xs" style={{ color: theme.muted }}>Dirigido a</span>
        </div>
        <div className="font-medium mb-3">{data.clinic.name}</div>

        <div className="text-xs mb-2" style={{ color: theme.muted }}>Detalle de horas — julio 2026</div>
        {data.rows.map((r) => (
          <div
            key={r.id}
            className="flex justify-between text-xs py-1.5 border-b"
            style={{ borderColor: theme.primaryLight }}
          >
            <span>{r.date} · {r.specialty}</span>
            <span style={fontMono}>{r.hours}h × {money(r.rate)}</span>
          </div>
        ))}

        <div className="flex justify-between mt-3">
          <span className="text-sm">Subtotal</span>
          <span className="text-sm" style={fontMono}>{money(data.total)}</span>
        </div>

        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">Retención en la fuente</span>
            <input
              type="number"
              className="w-14 p-1 rounded-md border text-xs text-center"
              style={{ borderColor: theme.primaryLight, ...fontMono }}
              value={retencionPct}
              onChange={(e) => setRetencionPct(e.target.value)}
            />
            <span className="text-xs" style={{ color: theme.muted }}>%</span>
          </div>
          <span className="text-sm" style={{ ...fontMono, color: theme.danger }}>
            −{money(valorRetencion)}
          </span>
        </div>

        <PulseDivider color={theme.accent} />

        <div className="flex justify-between">
          <span className="font-medium">Total neto a pagar</span>
          <span className="font-medium" style={{ ...fontMono, color: theme.accent }}>
            {money(totalNeto)}
          </span>
        </div>
      </Card>

      <div
        className="rounded-lg px-3 py-2 mb-3 text-xs no-print"
        style={{ background: theme.primaryLight, color: theme.primary }}
      >
        El % de retención es un valor sugerido y editable. Confírmalo con tu contador antes de enviar el documento.
      </div>

      <button
        onClick={() => window.print()}
        className="w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 no-print"
        style={{ background: theme.primary, color: "#fff" }}
      >
        <FileText size={16} /> Generar PDF
      </button>
      <div className="text-xs mt-2 text-center" style={{ color: theme.muted }}>
        Documento informativo. Confírmalo con tu contador antes de enviarlo.
      </div>
    </div>
  );
}

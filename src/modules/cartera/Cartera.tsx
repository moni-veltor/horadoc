import { TODAY } from "@/core/clock";
import { monthLabel, money } from "@/core/format";
import type { Cuenta } from "@/domain/types";
import { fontDisplay, fontMono, theme } from "@/core/theme";
import { Card } from "@/shared/ui/Card";

function diasDesde(fecha: string): number {
  return Math.max(0, Math.floor((Date.parse(TODAY) - Date.parse(fecha)) / 86400000));
}

function colorAntiguedad(dias: number): string {
  if (dias > 60) return theme.danger;
  if (dias > 30) return theme.accent;
  return theme.muted;
}

export function Cartera({
  cuentas,
  onMarcarPagada,
  onVolver,
}: {
  cuentas: Cuenta[];
  onMarcarPagada: (id: string) => void;
  onVolver: () => void;
}) {
  const pendientes = cuentas
    .filter((c) => c.estado === "emitida")
    .sort((a, b) => (a.fechaEmision < b.fechaEmision ? -1 : 1)); // más antiguas primero
  const pagadas = cuentas
    .filter((c) => c.estado === "pagada")
    .sort((a, b) => ((a.fechaPago ?? "") < (b.fechaPago ?? "") ? 1 : -1));
  const totalPendiente = pendientes.reduce((s, c) => s + c.total, 0);

  return (
    <div>
      <button onClick={onVolver} className="text-xs mb-3" style={{ color: theme.muted }}>
        ← Volver al resumen
      </button>
      <div className="text-lg mb-1" style={fontDisplay}>Cartera</div>
      <div className="text-xs mb-3" style={{ color: theme.muted }}>
        Cuentas de cobro emitidas y su estado de pago.
      </div>

      {cuentas.length === 0 && (
        <div className="text-sm text-center mt-6" style={{ color: theme.muted }}>
          Aún no has emitido cuentas de cobro. Emítelas desde el borrador en
          Resumen → &quot;Ver borrador de cuenta de cobro&quot;.
        </div>
      )}

      {pendientes.length > 0 && (
        <>
          <Card style={{ background: theme.gradient }}>
            <div className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.85)" }}>
              Te deben en {pendientes.length} cuenta{pendientes.length > 1 ? "s" : ""}
            </div>
            <div className="text-3xl" style={{ ...fontMono, color: "#fff" }}>
              {money(totalPendiente)}
            </div>
          </Card>

          <div
            className="text-xs uppercase tracking-wide mb-2 mt-1"
            style={{ color: theme.muted, letterSpacing: "0.06em" }}
          >
            Pendientes de pago
          </div>
          {pendientes.map((c) => {
            const d = diasDesde(c.fechaEmision);
            return (
              <Card key={c.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{c.clinicName}</div>
                    <div className="text-xs" style={{ color: theme.muted }}>
                      {monthLabel(c.mes)} · N° {c.numero}
                    </div>
                  </div>
                  <div className="text-sm" style={fontMono}>{money(c.total)}</div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs" style={{ color: colorAntiguedad(d) }}>
                    Emitida hace {d} día{d === 1 ? "" : "s"}
                  </span>
                  <button
                    onClick={() => onMarcarPagada(c.id)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg"
                    style={{ background: theme.primaryLight, color: theme.primary }}
                  >
                    Marcar pagada
                  </button>
                </div>
              </Card>
            );
          })}
        </>
      )}

      {pagadas.length > 0 && (
        <>
          <div
            className="text-xs uppercase tracking-wide mb-2 mt-3"
            style={{ color: theme.muted, letterSpacing: "0.06em" }}
          >
            Pagadas
          </div>
          {pagadas.map((c) => (
            <Card key={c.id}>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-sm">{c.clinicName}</div>
                  <div className="text-xs" style={{ color: theme.muted }}>
                    {monthLabel(c.mes)} · N° {c.numero}
                    {c.fechaPago ? ` · pagada ${c.fechaPago}` : ""}
                  </div>
                </div>
                <div className="text-sm" style={{ ...fontMono, color: theme.muted }}>
                  {money(c.total)}
                </div>
              </div>
            </Card>
          ))}
        </>
      )}
    </div>
  );
}

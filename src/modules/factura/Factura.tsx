import { useState } from "react";
import { FileText } from "lucide-react";
import { CURRENT_MONTH, TODAY } from "@/core/clock";
import { longDate, monthLabel, money } from "@/core/format";
import type { Clinic, ClinicSummary, Cuenta, Perfil } from "@/domain/types";
import { fontDisplay, fontMono, theme } from "@/core/theme";
import { Card } from "@/shared/ui/Card";

export function Factura({
  clinics,
  resumen,
  selected,
  setSelected,
  perfil,
  cuentas,
  onVolver,
  onVerPerfil,
  onEmitir,
}: {
  clinics: Clinic[];
  resumen: ClinicSummary[];
  selected: string;
  setSelected: (id: string) => void;
  perfil: Perfil;
  cuentas: Cuenta[];
  onVolver: () => void;
  onVerPerfil: () => void;
  onEmitir: (input: {
    clinicId: string;
    clinicName: string;
    mes: string;
    subtotal: number;
    retencionPct: number;
  }) => Cuenta;
}) {
  const data = resumen.find((r) => r.clinic.id === selected);
  const [retencionLocal, setRetencionLocal] = useState<string | number>(11);

  if (!data) return null;

  const cuenta = cuentas.find(
    (c) => c.clinicId === selected && c.mes === CURRENT_MONTH,
  );
  const emitida = !!cuenta;

  const numero = cuenta ? cuenta.numero : perfil.consecutivo;
  const retPct = cuenta ? cuenta.retencionPct : Number(retencionLocal);
  const subtotal = cuenta ? cuenta.subtotal : data.total;
  const valorRetencion = cuenta ? cuenta.retencion : subtotal * (retPct / 100);
  const totalNeto = cuenta ? cuenta.total : subtotal - valorRetencion;
  const perfilIncompleto = !perfil.nombre || !perfil.documento;

  function generar() {
    if (!emitida) {
      onEmitir({
        clinicId: selected,
        clinicName: data!.clinic.name,
        mes: CURRENT_MONTH,
        subtotal: data!.total,
        retencionPct: Number(retencionLocal),
      });
    }
    window.print();
  }

  const rotulo = { color: theme.muted, letterSpacing: "0.06em" };

  return (
    <div>
      {/* ---- Controles (no se imprimen) ---- */}
      <button onClick={onVolver} className="text-xs mb-3 no-print" style={{ color: theme.muted }}>
        ← Volver al resumen
      </button>
      <div className="text-lg mb-3 no-print" style={fontDisplay}>Cuenta de cobro</div>

      {perfilIncompleto && (
        <div
          className="rounded-lg px-3 py-2 mb-3 text-xs no-print"
          style={{ background: theme.accentLight, color: theme.accent }}
        >
          Completa tus datos (nombre y cédula/NIT) en{" "}
          <button onClick={onVerPerfil} className="underline font-medium">Mi perfil</button>{" "}
          para que la cuenta de cobro salga completa.
        </div>
      )}

      <select
        className="w-full mb-3 p-3 rounded-lg border text-sm no-print"
        style={{ borderColor: theme.primaryLight, background: theme.surface }}
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
      >
        {clinics.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      {emitida ? (
        <div
          className="rounded-lg px-3 py-2 mb-4 text-xs no-print"
          style={{ background: theme.primaryLight, color: theme.primary }}
        >
          Cuenta N° {cuenta!.numero} ya emitida
          {cuenta!.estado === "pagada" ? " · pagada" : " · pendiente de pago"}. Puedes reimprimirla.
        </div>
      ) : (
        <div className="mb-4 no-print">
          <label className="text-xs" style={{ color: theme.muted }}>Retención en la fuente (%)</label>
          <input
            type="number"
            className="w-full p-2 rounded-lg border text-sm"
            style={{ borderColor: theme.primaryLight, ...fontMono }}
            value={retencionLocal}
            onChange={(e) => setRetencionLocal(e.target.value)}
          />
        </div>
      )}

      {/* ---- Documento (esto es lo que se imprime) ---- */}
      <Card>
        <div className="text-center mb-3">
          <div className="text-lg" style={{ ...fontDisplay, color: theme.ink }}>CUENTA DE COBRO</div>
          <div className="text-sm" style={fontMono}>N° {numero}</div>
          <div className="text-xs mt-1" style={{ color: theme.muted }}>
            {perfil.ciudad ? `${perfil.ciudad}, ` : ""}
            {longDate(cuenta ? cuenta.fechaEmision : TODAY)}
          </div>
        </div>

        <div className="text-[11px] uppercase mb-1" style={rotulo}>Debe a:</div>
        <div className="text-sm font-medium">{perfil.nombre || "—"}</div>
        <div className="text-xs" style={{ color: theme.muted }}>
          {perfil.documento ? `C.C./NIT: ${perfil.documento}` : ""}
          {perfil.direccion ? ` · ${perfil.direccion}` : ""}
          {perfil.ciudad ? ` · ${perfil.ciudad}` : ""}
        </div>
        {(perfil.telefono || perfil.email) && (
          <div className="text-xs" style={{ color: theme.muted }}>
            {perfil.telefono}
            {perfil.telefono && perfil.email ? " · " : ""}
            {perfil.email}
          </div>
        )}

        <div className="text-[11px] uppercase mt-3 mb-1" style={rotulo}>La suma de:</div>
        <div className="text-sm font-medium">{data.clinic.name}</div>
        <div className="text-xs" style={{ color: theme.muted }}>
          {data.clinic.nit ? `NIT: ${data.clinic.nit}` : "NIT: —"}
          {data.clinic.city ? ` · ${data.clinic.city}` : ""}
        </div>

        <div className="text-xs mt-3 mb-2" style={{ color: theme.ink }}>
          Por concepto de servicios profesionales médicos prestados durante{" "}
          {monthLabel(CURRENT_MONTH)}.
        </div>

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
          <span className="text-sm" style={fontMono}>{money(subtotal)}</span>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-sm">Retención en la fuente ({retPct}%)</span>
          <span className="text-sm" style={{ ...fontMono, color: theme.danger }}>
            −{money(valorRetencion)}
          </span>
        </div>
        <div className="flex justify-between mt-2 pt-2 border-t" style={{ borderColor: theme.primaryLight }}>
          <span className="font-medium">Total a pagar</span>
          <span className="font-medium" style={{ ...fontMono, color: theme.accent }}>
            {money(totalNeto)}
          </span>
        </div>

        {(perfil.banco || perfil.numeroCuenta) && (
          <div className="text-xs mt-3" style={{ color: theme.ink }}>
            <span style={rotulo}>Forma de pago: </span>
            {perfil.banco} {perfil.tipoCuenta} N° {perfil.numeroCuenta}
          </div>
        )}

        <div className="text-[11px] mt-3" style={{ color: theme.muted }}>
          El suscrito declara que no es responsable de IVA y no está obligado a
          expedir factura de venta.
        </div>

        <div className="mt-6">
          <div style={{ borderTop: `1px solid ${theme.ink}`, width: "60%" }} />
          <div className="text-xs mt-1 font-medium">{perfil.nombre || "—"}</div>
          {perfil.documento && (
            <div className="text-xs" style={{ color: theme.muted }}>C.C. {perfil.documento}</div>
          )}
        </div>
      </Card>

      <button
        onClick={generar}
        className="w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 no-print"
        style={{ background: theme.primary, color: "#fff" }}
      >
        <FileText size={16} /> {emitida ? "Generar PDF (reimprimir)" : "Emitir y generar PDF"}
      </button>
      <div className="text-xs mt-2 text-center no-print" style={{ color: theme.muted }}>
        Documento informativo. Confírmalo con tu contador antes de enviarlo.
      </div>
    </div>
  );
}

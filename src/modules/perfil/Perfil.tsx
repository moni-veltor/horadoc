import { useEffect } from "react";
import { useSession } from "next-auth/react";
import type { Perfil as PerfilData } from "@/domain/types";
import { fontDisplay, theme } from "@/core/theme";

const fieldClass = "w-full mb-3 p-3 rounded-lg border text-sm";
const fieldStyle = { borderColor: theme.primaryLight, background: theme.surface };

export function Perfil({
  perfil,
  onActualizar,
  onVolver,
}: {
  perfil: PerfilData;
  onActualizar: (patch: Partial<PerfilData>) => void;
  onVolver: () => void;
}) {
  const { data: session } = useSession();

  // Prefill nombre/email desde la cuenta la primera vez.
  useEffect(() => {
    const patch: Partial<PerfilData> = {};
    if (!perfil.nombre && session?.user?.name) patch.nombre = session.user.name;
    if (!perfil.email && session?.user?.email) patch.email = session.user.email;
    if (Object.keys(patch).length) onActualizar(patch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const Label = ({ children }: { children: string }) => (
    <label className="text-xs" style={{ color: theme.muted }}>
      {children}
    </label>
  );

  return (
    <div>
      <button onClick={onVolver} className="text-xs mb-3" style={{ color: theme.muted }}>
        ← Volver
      </button>
      <div className="text-lg mb-1" style={fontDisplay}>Mi perfil</div>
      <div className="text-xs mb-4" style={{ color: theme.muted }}>
        Estos datos aparecen en tus cuentas de cobro. Se guardan automáticamente.
      </div>

      <div
        className="text-xs uppercase tracking-wide mb-2"
        style={{ color: theme.muted, letterSpacing: "0.06em" }}
      >
        Datos del médico
      </div>
      <Label>Nombre completo</Label>
      <input
        className={fieldClass}
        style={fieldStyle}
        value={perfil.nombre}
        onChange={(e) => onActualizar({ nombre: e.target.value })}
        placeholder="Dra. Ana Gómez"
      />
      <Label>Cédula o NIT</Label>
      <input
        className={fieldClass}
        style={fieldStyle}
        value={perfil.documento}
        onChange={(e) => onActualizar({ documento: e.target.value })}
        placeholder="Ej: 52123456"
      />
      <Label>Dirección</Label>
      <input
        className={fieldClass}
        style={fieldStyle}
        value={perfil.direccion}
        onChange={(e) => onActualizar({ direccion: e.target.value })}
        placeholder="Calle 00 # 00-00"
      />
      <Label>Ciudad</Label>
      <input
        className={fieldClass}
        style={fieldStyle}
        value={perfil.ciudad}
        onChange={(e) => onActualizar({ ciudad: e.target.value })}
        placeholder="Bogotá"
      />
      <Label>Teléfono</Label>
      <input
        className={fieldClass}
        style={fieldStyle}
        value={perfil.telefono}
        onChange={(e) => onActualizar({ telefono: e.target.value })}
        placeholder="3001234567"
      />
      <Label>Email</Label>
      <input
        className={fieldClass}
        style={fieldStyle}
        value={perfil.email}
        onChange={(e) => onActualizar({ email: e.target.value })}
        placeholder="tu@correo.com"
      />

      <div
        className="text-xs uppercase tracking-wide mt-3 mb-2"
        style={{ color: theme.muted, letterSpacing: "0.06em" }}
      >
        Datos para el pago
      </div>
      <Label>Banco</Label>
      <input
        className={fieldClass}
        style={fieldStyle}
        value={perfil.banco}
        onChange={(e) => onActualizar({ banco: e.target.value })}
        placeholder="Bancolombia"
      />
      <Label>Tipo de cuenta</Label>
      <select
        className={fieldClass}
        style={fieldStyle}
        value={perfil.tipoCuenta}
        onChange={(e) => onActualizar({ tipoCuenta: e.target.value })}
      >
        <option value="Ahorros">Ahorros</option>
        <option value="Corriente">Corriente</option>
      </select>
      <Label>Número de cuenta</Label>
      <input
        className={fieldClass}
        style={fieldStyle}
        value={perfil.numeroCuenta}
        onChange={(e) => onActualizar({ numeroCuenta: e.target.value })}
        placeholder="000-000000-00"
      />

      <div
        className="text-xs uppercase tracking-wide mt-3 mb-2"
        style={{ color: theme.muted, letterSpacing: "0.06em" }}
      >
        Cuenta de cobro
      </div>
      <Label>Próximo número consecutivo</Label>
      <input
        type="number"
        className={fieldClass}
        style={fieldStyle}
        value={perfil.consecutivo}
        onChange={(e) => onActualizar({ consecutivo: Number(e.target.value) || 1 })}
        placeholder="1"
      />

      <button
        onClick={onVolver}
        className="w-full py-3 rounded-xl font-medium text-sm mt-1"
        style={{ background: theme.primary, color: "#fff" }}
      >
        Listo
      </button>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SPECIALTY_CATALOG } from "@/domain/specialties";
import { theme } from "@/core/theme";
import { AuthShell, authFieldClass, authFieldStyle } from "./AuthShell";

const initial = {
  name: "",
  email: "",
  password: "",
  especialidad: "",
  registroMedico: "",
};

export function SignUpForm() {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update(key: keyof typeof initial, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/sign-in?registered=1");
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error || "No se pudo crear la cuenta.");
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Crea tu cuenta"
      subtitle="Registra tus datos como médico para empezar."
      footer={
        <>
          ¿Ya tienes cuenta?{" "}
          <Link href="/sign-in" style={{ color: theme.primary, fontWeight: 600 }}>
            Inicia sesión
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit}>
        <label className="text-xs" style={{ color: theme.muted }}>Nombre completo</label>
        <input
          type="text"
          className={authFieldClass}
          style={authFieldStyle}
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Dra. Ana Gómez"
          required
        />

        <label className="text-xs" style={{ color: theme.muted }}>Email</label>
        <input
          type="email"
          className={authFieldClass}
          style={authFieldStyle}
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="tu@correo.com"
          required
        />

        <label className="text-xs" style={{ color: theme.muted }}>Contraseña</label>
        <input
          type="password"
          className={authFieldClass}
          style={authFieldStyle}
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          placeholder="Mínimo 8 caracteres"
          minLength={8}
          required
        />

        <label className="text-xs" style={{ color: theme.muted }}>Especialidad principal</label>
        <select
          className={authFieldClass}
          style={authFieldStyle}
          value={form.especialidad}
          onChange={(e) => update("especialidad", e.target.value)}
        >
          <option value="">Selecciona una especialidad</option>
          {SPECIALTY_CATALOG.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <label className="text-xs" style={{ color: theme.muted }}>Registro médico (tarjeta profesional)</label>
        <input
          type="text"
          className={authFieldClass}
          style={authFieldStyle}
          value={form.registroMedico}
          onChange={(e) => update("registroMedico", e.target.value)}
          placeholder="Ej: 123456"
        />

        {error && (
          <div
            className="rounded-lg px-3 py-2 mb-3 text-sm"
            style={{ background: "#F6E4E1", color: theme.danger }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-medium text-sm mt-1"
          style={{ background: theme.primary, color: "#fff", opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Creando cuenta…" : "Crear cuenta"}
        </button>
      </form>
    </AuthShell>
  );
}

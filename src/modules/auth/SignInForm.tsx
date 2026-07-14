"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { theme } from "@/core/theme";
import { AuthShell, authFieldClass, authFieldStyle } from "./AuthShell";

export function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const justRegistered = params.get("registered") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.ok) {
      router.push("/");
      router.refresh();
    } else {
      setError("Email o contraseña incorrectos.");
    }
  }

  return (
    <AuthShell
      title="Inicia sesión"
      subtitle="Ingresa a tu cuenta para registrar tus horas."
      footer={
        <>
          ¿No tienes cuenta?{" "}
          <Link href="/sign-up" style={{ color: theme.primary, fontWeight: 600 }}>
            Regístrate
          </Link>
        </>
      }
    >
      {justRegistered && (
        <div
          className="rounded-lg px-3 py-2 mb-4 text-sm"
          style={{ background: theme.primaryLight, color: theme.primary }}
        >
          Cuenta creada. Ahora inicia sesión.
        </div>
      )}

      <form onSubmit={onSubmit}>
        <label className="text-xs" style={{ color: theme.muted }}>Email</label>
        <input
          type="email"
          className={authFieldClass}
          style={authFieldStyle}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.com"
          required
        />

        <label className="text-xs" style={{ color: theme.muted }}>Contraseña</label>
        <input
          type="password"
          className={authFieldClass}
          style={authFieldStyle}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Tu contraseña"
          required
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
          {loading ? "Ingresando…" : "Iniciar sesión"}
        </button>
      </form>
    </AuthShell>
  );
}

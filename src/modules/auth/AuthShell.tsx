import type { ReactNode } from "react";
import { Stethoscope } from "lucide-react";
import { fontBody, fontDisplay, theme } from "@/core/theme";
import { GradientText } from "@/shared/ui/GradientText";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex justify-center"
      style={{ background: theme.bg, color: theme.ink, ...fontBody }}
    >
      <div className="w-full max-w-sm min-h-screen flex flex-col justify-center px-5 py-8">
        <div className="flex items-center gap-2 mb-6">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: theme.gradient }}
          >
            <Stethoscope size={16} color="#fff" />
          </div>
          <span className="text-xl" style={fontDisplay}>
            Hora<GradientText>Doc</GradientText>
          </span>
        </div>

        <h1 className="text-2xl mb-1" style={{ ...fontDisplay, color: theme.ink }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm mb-5" style={{ color: theme.muted }}>
            {subtitle}
          </p>
        )}

        {children}

        {footer && (
          <div className="mt-5 text-sm text-center" style={{ color: theme.muted }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// Estilos compartidos por los campos de los formularios de auth.
export const authFieldClass = "w-full mb-3 p-3 rounded-lg border text-sm";
export const authFieldStyle = { borderColor: theme.primaryLight, background: theme.surface };

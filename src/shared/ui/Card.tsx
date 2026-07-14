import type { CSSProperties, ReactNode } from "react";
import { theme } from "@/core/theme";

export function Card({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div className="rounded-xl p-4 mb-3 shadow-sm" style={{ background: theme.surface, ...style }}>
      {children}
    </div>
  );
}

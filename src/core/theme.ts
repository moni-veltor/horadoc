import type { CSSProperties } from "react";

// ---- Identidad de marca HoraDoc ----
// Cross-cutting design tokens. Kept framework-agnostic so any module can import
// them without pulling in React state.
export const theme = {
  ink: "#14213D",
  bg: "#F4F6FB",
  surface: "#FFFFFF",
  primary: "#2563EB",
  primaryLight: "#DCE6FB",
  cyan: "#00D4FF",
  purple: "#7B3FF2",
  pink: "#FF4D8D",
  accent: "#FF8A00",
  accentLight: "#FFE7CC",
  muted: "#64748B",
  danger: "#FF4D8D",
  gradient:
    "linear-gradient(90deg, #2563EB 0%, #7B3FF2 45%, #FF4D8D 75%, #FF8A00 100%)",
} as const;

// Poppins is loaded once via next/font in the root layout and exposed through
// the `--font-poppins` CSS variable, so these reference the variable rather
// than triggering a render-blocking @import.
const family = "var(--font-poppins), sans-serif";

export const fontDisplay: CSSProperties = { fontFamily: family, fontWeight: 600 };
export const fontBody: CSSProperties = { fontFamily: family, fontWeight: 400 };
export const fontMono: CSSProperties = {
  fontFamily: family,
  fontWeight: 600,
  fontVariantNumeric: "tabular-nums",
};

// Rotating palette used when the user adds a new clinic.
export const clinicPalette = [
  theme.primary,
  theme.accent,
  theme.purple,
  theme.pink,
] as const;

import { theme } from "@/core/theme";

// Electrocardiogram-style divider — the app's distinctive section separator.
export function PulseDivider({ color }: { color?: string }) {
  const c = color || theme.primary;
  return (
    <svg viewBox="0 0 300 24" className="w-full h-4 my-2" preserveAspectRatio="none">
      <polyline
        points="0,12 90,12 100,4 110,20 120,12 300,12"
        fill="none"
        stroke={c}
        strokeWidth="1.5"
        opacity="0.55"
      />
    </svg>
  );
}

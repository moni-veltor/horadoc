// Single source of truth for "now", in the doctor's local time.
// Computed once when the client bundle loads (the app renders its date-aware
// screens only after data loads on the client, so there's no SSR mismatch).

function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const TODAY = todayIso();
export const CURRENT_MONTH = TODAY.slice(0, 7); // "YYYY-MM"

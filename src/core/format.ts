// Locale-aware formatting helpers (Colombian peso, Spanish month names).

export const nombresMes = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export const money = (n: number): string =>
  "$" + Math.round(n).toLocaleString("es-CO");

// "2026-07" -> "Julio 2026"
export function monthLabel(key: string): string {
  const [y, m] = key.split("-");
  return `${nombresMes[Number(m) - 1]} ${y}`;
}

// "2026-07" -> "julio"
export function monthName(key: string): string {
  const [, m] = key.split("-");
  return nombresMes[Number(m) - 1].toLowerCase();
}

// "2026-07-13" -> "13 de julio"
export function dayMonthLabel(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${Number(d)} de ${nombresMes[Number(m) - 1].toLowerCase()}`;
}

// "2026-07-13" -> "13 de julio de 2026"
export function longDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${Number(d)} de ${nombresMes[Number(m) - 1].toLowerCase()} de ${y}`;
}

// Single source of truth for "now". The seed data is anchored to July 2026, so
// the demo pins the clock here. When persistence lands, replace these with a
// real clock (or server-provided time) and everything downstream follows.
export const TODAY = "2026-07-13";
export const CURRENT_MONTH = TODAY.slice(0, 7); // "2026-07"

/** Semanas en texto corto: entero si aplica, si no 1 decimal (nunca 8.166666…). */
export function formatSem(n: number): string {
  if (!Number.isFinite(n)) return "—"
  const rounded = Math.round(n * 10) / 10
  if (Math.abs(rounded - Math.round(rounded)) < 0.05) {
    return String(Math.round(rounded))
  }
  return rounded.toFixed(1)
}

/** VAN (NPV) y TIR (IRR) */

export function npv(rate: number, flows: number[]): number {
  return flows.reduce((sum, cf, t) => sum + cf / Math.pow(1 + rate, t), 0)
}

/** TIR por bisección — flujos con al menos un cambio de signo */
export function irr(flows: number[]): number | null {
  if (flows.length < 2) return null
  let lo = -0.99
  let hi = 5
  const npvAt = (r: number) => npv(r, flows)

  if (npvAt(lo) * npvAt(hi) > 0) {
    hi = 20
    if (npvAt(lo) * npvAt(hi) > 0) return null
  }

  for (let i = 0; i < 120; i++) {
    const mid = (lo + hi) / 2
    const v = npvAt(mid)
    if (Math.abs(v) < 1e-6) return mid
    if (v * npvAt(lo) > 0) lo = mid
    else hi = mid
  }
  return (lo + hi) / 2
}

export function formatPct(rate: number | null): string {
  if (rate == null || !Number.isFinite(rate)) return "—"
  return `${(rate * 100).toFixed(2)}%`
}

export function formatMoney(n: number, decimals = 0): string {
  if (!Number.isFinite(n)) return "—"
  return n.toLocaleString("es-CL", { maximumFractionDigits: decimals })
}

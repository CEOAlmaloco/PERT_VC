/** Φ(z) — probabilidad acumulada N(0,1), redondeo a 4 decimales */
function phi(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z))
  const d = 0.3989423 * Math.exp((-z * z) / 2)
  const p =
    d *
    t *
    (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
  const v = z >= 0 ? 1 - p : p
  return Math.round(v * 10000) / 10000
}

export function buildNormalTableRows(): { z: number; decimals: number[] }[] {
  const rows: { z: number; decimals: number[] }[] = []
  for (let zInt = 0; zInt <= 24; zInt++) {
    const zRow = zInt / 10
    const decimals: number[] = []
    for (let d = 0; d <= 9; d++) {
      decimals.push(phi(zRow + d / 100))
    }
    rows.push({ z: zRow, decimals })
  }
  return rows
}

/** Depreciación lineal y amortización de intangibles */

export type AssetDepreciation = {
  annualDepreciation: number
  /** GND por período (negativo) */
  gndPerPeriod: number[]
}

/** Depreciación lineal: (VC − VR) / n */
export function straightLineDepreciation(
  cost: number,
  residual: number,
  lifeYears: number,
  projectPeriods: number,
): AssetDepreciation {
  if (lifeYears <= 0 || projectPeriods <= 0) {
    return { annualDepreciation: 0, gndPerPeriod: Array(projectPeriods).fill(0) }
  }
  const annual = (cost - residual) / lifeYears
  const gndPerPeriod: number[] = []
  for (let t = 0; t < projectPeriods; t++) {
    const yearIndex = t // 1 período = 1 año en plantilla
    gndPerPeriod.push(yearIndex < lifeYears && yearIndex >= 0 ? -annual : 0)
  }
  return { annualDepreciation: annual, gndPerPeriod }
}

export function intangibleAmortization(
  cost: number,
  lifeYears: number,
  projectPeriods: number,
): number[] {
  if (lifeYears <= 0) return Array(projectPeriods).fill(0)
  const annual = cost / lifeYears
  return Array.from({ length: projectPeriods }, (_, t) => (t < lifeYears ? -annual : 0))
}

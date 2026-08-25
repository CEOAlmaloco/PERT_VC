import {
  computeCashFlow,
  ensureFinanceLines,
  syncFinanceFromParams,
  type FinanceInputs,
} from "../finance/cashFlow"

/** Presupuesto techo Caso 6: $100M CLP (rango $50–100M), proyecto público-social */
const DRIVER_DEFAULTS = {
  periods: 5,
  discountRate: 0.12,
  taxRate: 0.27,
  withLoan: false,
  autoSync: true,
  // Aporte/beneficio social modelado como “ingresos” de valor público (fondos ya asignados)
  revenues: [0, 20_000_000, 22_000_000, 24_000_000, 25_000_000],
  variableCosts: [0, -6_000_000, -6_500_000, -7_000_000, -7_500_000],
  fixedCosts: [0, -5_000_000, -5_000_000, -5_500_000, -5_500_000],
  equipment: { cost: 35_000_000, residual: 5_000_000, lifeYears: 5 }, // sensores/instalación
  furniture: { cost: 8_000_000, residual: 0, lifeYears: 5 }, // hosting/infra
  intangible: { cost: 40_000_000, lifeYears: 5 }, // desarrollo software Scrum
  period0: {
    investEquipment: -35_000_000,
    investFurniture: -8_000_000,
    workingCapital: -7_000_000,
  },
  loan: {
    principal: 0,
    periodRate: 0.01,
    periods: 5,
  },
}

function baseFinance(partial: Partial<FinanceInputs>): FinanceInputs {
  const merged: FinanceInputs = {
    projectName: "Monitoreo de puentes — Municipalidad Biobío (Caso 6)",
    organization: "Municipalidad Región del Biobío",
    lines: [],
    ...DRIVER_DEFAULTS,
    ...partial,
  }
  return syncFinanceFromParams(merged)
}

/** Plantilla financiera del piloto de puentes (techo ~$100M) */
export function defaultFinanceInputs(): FinanceInputs {
  return baseFinance({
    projectName: "Monitoreo de puentes — Municipalidad Biobío (Caso 6)",
    organization: "Municipalidad Región del Biobío",
    withLoan: false,
  })
}

export function financeWithLoan(base?: FinanceInputs): FinanceInputs {
  const b = base ?? defaultFinanceInputs()
  return syncFinanceFromParams({ ...b, withLoan: true })
}

/** Plantilla vacía para otro proyecto — ceros y rubros listos para completar */
export function blankFinanceInputs(): FinanceInputs {
  const periods = 5
  const zeros = Array(periods).fill(0)
  const draft: FinanceInputs = {
    projectName: "Nuevo proyecto",
    organization: "",
    periods,
    discountRate: 0.15,
    taxRate: 0.27,
    withLoan: false,
    autoSync: true,
    revenues: [...zeros],
    variableCosts: [...zeros],
    fixedCosts: [...zeros],
    equipment: { cost: 0, residual: 0, lifeYears: 5 },
    furniture: { cost: 0, residual: 0, lifeYears: 5 },
    intangible: { cost: 0, lifeYears: 5 },
    period0: { investEquipment: 0, investFurniture: 0, workingCapital: 0 },
    loan: { principal: 0, periodRate: 0.01, periods: 5 },
    lines: [],
  }
  const computed = computeCashFlow(draft)
  return { ...draft, lines: computed.lines }
}

export function normalizeFinance(f: Partial<FinanceInputs> | undefined): FinanceInputs {
  if (!f?.periods) return defaultFinanceInputs()
  const merged = ensureFinanceLines({
    projectName: f.projectName ?? "Proyecto",
    organization: f.organization ?? "",
    periods: f.periods ?? 5,
    discountRate: f.discountRate ?? 0.15,
    taxRate: f.taxRate ?? 0.27,
    withLoan: f.withLoan ?? false,
    autoSync: f.autoSync ?? false,
    revenues: f.revenues ?? [],
    variableCosts: f.variableCosts ?? [],
    fixedCosts: f.fixedCosts ?? [],
    equipment: f.equipment ?? { cost: 0, residual: 0, lifeYears: 5 },
    furniture: f.furniture ?? { cost: 0, residual: 0, lifeYears: 5 },
    intangible: f.intangible ?? { cost: 0, lifeYears: 5 },
    period0: f.period0 ?? { investEquipment: 0, investFurniture: 0, workingCapital: 0 },
    loan: f.loan ?? { principal: 0, periodRate: 0.01, periods: 5 },
    lines: f.lines ?? [],
  })
  return merged
}

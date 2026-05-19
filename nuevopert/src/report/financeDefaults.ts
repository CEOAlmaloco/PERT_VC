import {
  computeCashFlow,
  ensureFinanceLines,
  syncFinanceFromParams,
  type FinanceInputs,
} from "../finance/cashFlow"

const DRIVER_DEFAULTS = {
  periods: 5,
  discountRate: 0.16,
  taxRate: 0.27,
  withLoan: false,
  autoSync: true,
  revenues: [0, 45_000_000, 50_000_000, 55_000_000, 60_000_000],
  variableCosts: [0, -12_000_000, -13_000_000, -14_000_000, -15_000_000],
  fixedCosts: [0, -8_000_000, -8_500_000, -9_000_000, -9_500_000],
  equipment: { cost: 80_000_000, residual: 0, lifeYears: 5 },
  furniture: { cost: 25_000_000, residual: 0, lifeYears: 5 },
  intangible: { cost: 10_000_000, lifeYears: 5 },
  period0: {
    investEquipment: -80_000_000,
    investFurniture: -25_000_000,
    workingCapital: -10_000_000,
  },
  loan: {
    principal: 48_000_000,
    periodRate: 0.012,
    periods: 5,
  },
}

function baseFinance(partial: Partial<FinanceInputs>): FinanceInputs {
  const merged: FinanceInputs = {
    projectName: "SIGPI — Municipalidad Valle del Sol",
    organization: "Municipalidad Valle del Sol",
    lines: [],
    ...DRIVER_DEFAULTS,
    ...partial,
  }
  return syncFinanceFromParams(merged)
}

/** Plantilla SIGPI con datos de ejemplo (2.5.4 / 2.5.5) */
export function defaultFinanceInputs(): FinanceInputs {
  return baseFinance({
    projectName: "SIGPI — Municipalidad Valle del Sol",
    organization: "Municipalidad Valle del Sol",
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

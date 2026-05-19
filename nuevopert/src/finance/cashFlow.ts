import { buildAmortizationSchedule } from "./amortization"
import { intangibleAmortization, straightLineDepreciation } from "./depreciation"
import { irr, npv } from "./indicators"

export type CashFlowLineId =
  | "revenue"
  | "variableCosts"
  | "fixedCosts"
  | "gndEquipment"
  | "gndFurniture"
  | "gndIntangible"
  | "interest"
  | "benefitsBeforeTax"
  | "taxes"
  | "netAfterTax"
  | "investEquipment"
  | "investFurniture"
  | "workingCapital"
  | "gndAdjustment"
  | "loanPrincipal"
  | "loanPayment"
  | "cashFlow"
  | "accumulatedCashFlow"

export type CashFlowLine = {
  id: CashFlowLineId
  label: string
  values: number[]
  bold?: boolean
}

export type FinanceInputs = {
  /** Nombre del proyecto (plantilla reutilizable) */
  projectName: string
  organization: string
  periods: number
  discountRate: number
  taxRate: number
  withLoan: boolean
  /** Si true, los rubros se recalculan al cambiar parámetros e ingresos base */
  autoSync: boolean
  revenues: number[]
  variableCosts: number[]
  fixedCosts: number[]
  equipment: { cost: number; residual: number; lifeYears: number }
  furniture: { cost: number; residual: number; lifeYears: number }
  intangible: { cost: number; lifeYears: number }
  period0: {
    investEquipment: number
    investFurniture: number
    workingCapital: number
  }
  loan: {
    principal: number
    periodRate: number
    periods: number
  }
  /** Estado editable del estado de flujos (todas las celdas) */
  lines: CashFlowLine[]
}

export type FinanceResult = {
  lines: CashFlowLine[]
  amortization: ReturnType<typeof buildAmortizationSchedule>
  van: number
  tir: number | null
  pri: number | null
}

const LINE_LABELS: Record<CashFlowLineId, string> = {
  revenue: "Ingresos (beneficios por venta / contrato)",
  variableCosts: "Costos variables",
  fixedCosts: "Costos fijos (administración, sueldos, arriendos)",
  gndEquipment: "GND — depreciación equipos",
  gndFurniture: "GND — depreciación muebles / activos",
  gndIntangible: "GND — amortización intangibles (licencias)",
  interest: "Pago de intereses (préstamo)",
  benefitsBeforeTax: "Beneficio antes de impuesto (BAI)",
  taxes: "Impuestos",
  netAfterTax: "Utilidad después de impuestos (UAI)",
  investEquipment: "Inversión equipos (período 0)",
  investFurniture: "Inversión muebles (período 0)",
  workingCapital: "Capital de trabajo (período 0)",
  gndAdjustment: "Ajuste GND (+ depreciación y amortización)",
  loanPrincipal: "Préstamo recibido / amortización capital",
  loanPayment: "Cuota total préstamo (referencia)",
  cashFlow: "Flujo de caja (FC)",
  accumulatedCashFlow: "Flujo de caja acumulado (FCA)",
}

function padArray(arr: number[], len: number): number[] {
  const out = [...arr]
  while (out.length < len) out.push(0)
  return out.slice(0, len)
}

export function computeCashFlow(input: FinanceInputs): FinanceResult {
  const n = Math.max(1, input.periods)
  const rev = padArray(input.revenues, n)
  const varC = padArray(input.variableCosts, n)
  const fixC = padArray(input.fixedCosts, n)

  const equipDep = straightLineDepreciation(
    input.equipment.cost,
    input.equipment.residual,
    input.equipment.lifeYears,
    n,
  )
  const furnDep = straightLineDepreciation(
    input.furniture.cost,
    input.furniture.residual,
    input.furniture.lifeYears,
    n,
  )
  const intangGnd = intangibleAmortization(input.intangible.cost, input.intangible.lifeYears, n)

  const gndEquip = equipDep.gndPerPeriod
  const gndFurn = furnDep.gndPerPeriod

  const amort =
    input.withLoan && input.loan.principal > 0
      ? buildAmortizationSchedule(input.loan.principal, input.loan.periodRate, input.loan.periods)
      : []

  const interest = Array(n).fill(0)
  const loanPrincipal = Array(n).fill(0)
  const loanPayment = Array(n).fill(0)

  if (input.withLoan && amort.length > 0) {
    const loanPeriods = Math.min(input.loan.periods, n)
    for (let p = 1; p <= loanPeriods; p++) {
      const row = amort[p]
      if (!row) continue
      interest[p - 1] = row.interest
      loanPrincipal[p - 1] = row.principal
      loanPayment[p - 1] = row.payment
    }
    if (n > 0) loanPrincipal[0] = input.loan.principal
  }

  const benefitsBeforeTax = Array(n).fill(0)
  const taxes = Array(n).fill(0)
  const netAfterTax = Array(n).fill(0)
  const gndAdjustment = Array(n).fill(0)

  for (let t = 0; t < n; t++) {
    const bai =
      rev[t] +
      varC[t] +
      fixC[t] +
      gndEquip[t] +
      gndFurn[t] +
      intangGnd[t] +
      interest[t]
    benefitsBeforeTax[t] = bai
    taxes[t] = bai > 0 ? -input.taxRate * bai : 0
    netAfterTax[t] = bai + taxes[t]
    gndAdjustment[t] = -(gndEquip[t] + gndFurn[t] + intangGnd[t])
  }

  const investEquipment = Array(n).fill(0)
  const investFurniture = Array(n).fill(0)
  const workingCapital = Array(n).fill(0)
  if (n > 0) {
    investEquipment[0] = input.period0.investEquipment
    investFurniture[0] = input.period0.investFurniture
    workingCapital[0] = input.period0.workingCapital
  }

  const cashFlow = Array(n).fill(0)
  for (let t = 0; t < n; t++) {
    cashFlow[t] =
      netAfterTax[t] +
      gndAdjustment[t] +
      (input.withLoan ? loanPrincipal[t] : 0) +
      investEquipment[t] +
      investFurniture[t] +
      workingCapital[t]
  }

  const accumulatedCashFlow = cashFlow.reduce<number[]>((acc, cf) => {
    const prev = acc.length ? acc[acc.length - 1] : 0
    acc.push(prev + cf)
    return acc
  }, [])

  const lines: CashFlowLine[] = [
    { id: "revenue", label: LINE_LABELS.revenue, values: rev },
    { id: "variableCosts", label: LINE_LABELS.variableCosts, values: varC },
    { id: "fixedCosts", label: LINE_LABELS.fixedCosts, values: fixC },
    { id: "gndEquipment", label: LINE_LABELS.gndEquipment, values: gndEquip },
    { id: "gndFurniture", label: LINE_LABELS.gndFurniture, values: gndFurn },
    { id: "gndIntangible", label: LINE_LABELS.gndIntangible, values: intangGnd },
    { id: "interest", label: LINE_LABELS.interest, values: interest },
    { id: "benefitsBeforeTax", label: LINE_LABELS.benefitsBeforeTax, values: benefitsBeforeTax, bold: true },
    { id: "taxes", label: LINE_LABELS.taxes, values: taxes },
    { id: "netAfterTax", label: LINE_LABELS.netAfterTax, values: netAfterTax, bold: true },
    { id: "investEquipment", label: LINE_LABELS.investEquipment, values: investEquipment },
    { id: "investFurniture", label: LINE_LABELS.investFurniture, values: investFurniture },
    { id: "workingCapital", label: LINE_LABELS.workingCapital, values: workingCapital },
    { id: "gndAdjustment", label: LINE_LABELS.gndAdjustment, values: gndAdjustment },
  ]

  if (input.withLoan) {
    lines.push({ id: "loanPrincipal", label: LINE_LABELS.loanPrincipal, values: loanPrincipal })
    lines.push({ id: "loanPayment", label: LINE_LABELS.loanPayment, values: loanPayment })
  }

  lines.push(
    { id: "cashFlow", label: LINE_LABELS.cashFlow, values: cashFlow, bold: true },
    { id: "accumulatedCashFlow", label: LINE_LABELS.accumulatedCashFlow, values: accumulatedCashFlow, bold: true },
  )

  const van = npv(input.discountRate, cashFlow)
  const tir = irr(cashFlow)
  const totalInvest = Math.abs(
    input.period0.investEquipment + input.period0.investFurniture + input.period0.workingCapital,
  )
  const pri = totalInvest > 0 && van > 0 ? totalInvest / van : null

  return { lines, amortization: amort, van, tir, pri }
}

/** Asegura líneas persistidas; si faltan, las calcula desde parámetros */
export function ensureFinanceLines(input: FinanceInputs): FinanceInputs {
  if (input.lines?.length) {
    return resizeFinanceLines(input, input.periods)
  }
  const computed = computeCashFlow(input)
  return { ...input, lines: computed.lines }
}

function resizeFinanceLines(input: FinanceInputs, periods: number): FinanceInputs {
  const n = Math.max(1, periods)
  const lines = input.lines.map((line) => {
    const values = [...line.values]
    while (values.length < n) values.push(0)
    return { ...line, values: values.slice(0, n) }
  })
  return { ...input, periods: n, lines }
}

/** Recalcula todas las filas desde parámetros (sobrescribe ediciones manuales) */
export function syncFinanceFromParams(input: FinanceInputs): FinanceInputs {
  const computed = computeCashFlow({ ...input, lines: [] })
  return { ...input, lines: computed.lines, autoSync: true }
}

/** VAN / TIR desde la fila FC editable */
export function indicatorsFromLines(
  lines: CashFlowLine[],
  discountRate: number,
): { van: number; tir: number | null; fcaFinal: number } {
  const cf = lines.find((l) => l.id === "cashFlow")?.values ?? []
  const fca = lines.find((l) => l.id === "accumulatedCashFlow")?.values ?? []
  return {
    van: npv(discountRate, cf),
    tir: irr(cf),
    fcaFinal: fca.length ? fca[fca.length - 1] : 0,
  }
}

/** Tabla de amortización — sistema francés (cuota fija) */

export type AmortizationRow = {
  period: number
  payment: number
  interest: number
  principal: number
  balance: number
}

/** Cuota periódica: C = P · [r(1+r)^n] / [(1+r)^n − 1] */
export function periodicPayment(principal: number, periodRate: number, periods: number): number {
  if (periods <= 0 || principal <= 0) return 0
  if (periodRate === 0) return principal / periods
  const f = Math.pow(1 + periodRate, periods)
  return (principal * periodRate * f) / (f - 1)
}

export function buildAmortizationSchedule(
  principal: number,
  periodRate: number,
  periods: number,
): AmortizationRow[] {
  const rows: AmortizationRow[] = []
  if (principal <= 0 || periods <= 0) return rows

  const payment = periodicPayment(principal, periodRate, periods)
  let balance = principal

  rows.push({ period: 0, payment: 0, interest: 0, principal: 0, balance })

  for (let p = 1; p <= periods; p++) {
    const interest = balance * periodRate
    const principalPay = payment - interest
    balance = Math.max(0, balance - principalPay)
    rows.push({
      period: p,
      payment: -payment,
      interest: -interest,
      principal: -principalPay,
      balance,
    })
  }

  return rows
}

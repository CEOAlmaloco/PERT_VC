import { useMemo, type ReactNode } from "react"
import type { CSSProperties } from "react"
import {
  computeCashFlow,
  ensureFinanceLines,
  indicatorsFromLines,
  syncFinanceFromParams,
  type CashFlowLine,
  type CashFlowLineId,
  type FinanceInputs,
} from "../finance/cashFlow"
import { formatMoney, formatPct } from "../finance/indicators"
import { blankFinanceInputs, defaultFinanceInputs, financeWithLoan } from "./financeDefaults"
import { HelpButton, LabelWithHelp } from "./ContextHelp"
import { FinanceGlossaryPanel } from "./FinanceGlossaryPanel"
import { card, colors, sectionLead, sectionTitle } from "./theme"

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "6px 8px",
  border: `1px solid ${colors.border}`,
  borderRadius: 6,
  fontSize: 12,
  fontFamily: "inherit",
}

const th: CSSProperties = {
  padding: "8px 10px",
  fontSize: 11,
  fontWeight: 700,
  textAlign: "right",
  background: colors.surface,
  borderBottom: `2px solid ${colors.border}`,
  color: colors.navy,
  whiteSpace: "nowrap",
}

const td: CSSProperties = {
  padding: "4px 6px",
  fontSize: 11,
  textAlign: "right",
  borderBottom: `1px solid ${colors.border}`,
  fontVariantNumeric: "tabular-nums",
}

const tdLabel: CSSProperties = {
  ...td,
  textAlign: "left",
  minWidth: 220,
  fontWeight: 500,
  color: colors.text,
  verticalAlign: "middle",
}

const btn: CSSProperties = {
  border: `1px solid ${colors.navy}`,
  background: colors.white,
  padding: "8px 14px",
  fontSize: 12,
  borderRadius: 8,
  cursor: "pointer",
  color: colors.navy,
}

const btnPrimary: CSSProperties = {
  ...btn,
  background: colors.navy,
  color: colors.white,
  fontWeight: 600,
}

const subTitle: CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  margin: "0 0 12px",
  color: colors.navy,
}

const grid3: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: 12,
}

type Props = {
  finance: FinanceInputs
  onChange: (f: FinanceInputs) => void
  onOpenGlossary?: () => void
}

function num(v: string): number {
  const n = parseFloat(v.replace(/\./g, "").replace(",", "."))
  return Number.isFinite(n) ? n : 0
}

function pctInput(rate: number): string {
  return (rate * 100).toFixed(2)
}

export function TabFinanceSection({ finance, onChange, onOpenGlossary }: Props) {
  const amortResult = useMemo(() => computeCashFlow(finance), [finance])
  const indicators = useMemo(
    () => indicatorsFromLines(finance.lines, finance.discountRate),
    [finance.lines, finance.discountRate],
  )
  const n = finance.periods
  const periodHeaders = Array.from({ length: n }, (_, i) => i)

  const patch = (p: Partial<FinanceInputs>) => {
    let next = { ...finance, ...p }
    const syncKeys = new Set([
      "revenues",
      "variableCosts",
      "fixedCosts",
      "equipment",
      "furniture",
      "intangible",
      "period0",
      "loan",
      "withLoan",
      "periods",
      "taxRate",
    ])
    if (next.autoSync && Object.keys(p).some((k) => syncKeys.has(k))) {
      next = syncFinanceFromParams(next)
    } else if (p.periods != null) {
      next = ensureFinanceLines(next)
    }
    onChange(next)
  }

  const setPeriodValue = (field: "revenues" | "variableCosts" | "fixedCosts", idx: number, value: number) => {
    const arr = [...finance[field]]
    while (arr.length < n) arr.push(0)
    arr[idx] = value
    patch({ [field]: arr.slice(0, n) })
  }

  const resizePeriods = (periods: number) => {
    const pad = (arr: number[]) => {
      const out = [...arr]
      while (out.length < periods) out.push(0)
      return out.slice(0, periods)
    }
    patch({
      periods,
      revenues: pad(finance.revenues),
      variableCosts: pad(finance.variableCosts),
      fixedCosts: pad(finance.fixedCosts),
    })
  }

  const setLineValue = (lineId: CashFlowLineId, period: number, value: number) => {
    const lines = finance.lines.map((line) => {
      if (line.id !== lineId) return line
      const values = [...line.values]
      while (values.length < n) values.push(0)
      values[period] = value
      return { ...line, values: values.slice(0, n) }
    })
    onChange({ ...finance, lines, autoSync: false })
  }

  const setLineLabel = (lineId: CashFlowLineId, label: string) => {
    const lines = finance.lines.map((line) => (line.id === lineId ? { ...line, label } : line))
    onChange({ ...finance, lines, autoSync: false })
  }

  const recalculateAll = () => {
    if (!confirm("¿Recalcular todo el estado de flujos desde los parámetros? Se perderán ediciones manuales en la tabla.")) return
    onChange(syncFinanceFromParams(finance))
  }

  const applyTemplate = (next: FinanceInputs) => {
    if (finance.lines.some((l) => l.values.some((v) => v !== 0)) && !confirm("¿Cargar plantilla? Se reemplazarán los datos financieros actuales.")) return
    onChange(next)
  }

  return (
    <section>
      <h2 style={{ ...sectionTitle, display: "flex", alignItems: "center", gap: 10 }}>
        Flujo de caja y amortización
        <HelpButton topicId="finance-overview" />
      </h2>
      <p style={sectionLead}>
        Plantilla tipo Excel: <strong>todas las celdas del estado de flujos son editables</strong>. Use «Nuevo proyecto
        vacío» para empezar otro caso, o las plantillas SIGPI del curso. «Recalcular» aplica fórmulas 2.5.4 / 2.5.5 desde
        los parámetros.
      </p>

      <div style={{ ...card, marginBottom: 16 }}>
        <h3 style={subTitle}>Identificación del proyecto financiero</h3>
        <div style={grid3}>
          <Field label="Nombre del proyecto">
            <input
              value={finance.projectName}
              onChange={(e) => patch({ projectName: e.target.value })}
              style={inputStyle}
              placeholder="Ej. SIGPI — Municipalidad Valle del Sol"
            />
          </Field>
          <Field label="Organización / cliente">
            <input
              value={finance.organization}
              onChange={(e) => patch({ organization: e.target.value })}
              style={inputStyle}
              placeholder="Ej. Municipalidad, empresa, etc."
            />
          </Field>
          <Field label="Modo">
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, marginTop: 6 }}>
              <input
                type="checkbox"
                checked={finance.autoSync}
                onChange={(e) => {
                  const autoSync = e.target.checked
                  onChange(autoSync ? syncFinanceFromParams({ ...finance, autoSync }) : { ...finance, autoSync })
                }}
              />
              Sincronizar rubros al editar parámetros
            </label>
          </Field>
        </div>
      </div>

      <FinanceGlossaryPanel onOpenFullGlossary={onOpenGlossary} />

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16, alignItems: "center" }}>
        <button type="button" onClick={() => applyTemplate(blankFinanceInputs())} style={btnPrimary}>
          Nuevo proyecto (vacío)
        </button>
        <button type="button" onClick={() => applyTemplate(defaultFinanceInputs())} style={btn}>
          Plantilla SIGPI sin préstamo
        </button>
        <button type="button" onClick={() => applyTemplate(financeWithLoan())} style={btn}>
          Plantilla SIGPI con préstamo
        </button>
        <button type="button" onClick={recalculateAll} style={btn}>
          Recalcular desde parámetros
        </button>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, marginLeft: 4 }}>
          <input
            type="checkbox"
            checked={finance.withLoan}
            onChange={(e) => patch({ withLoan: e.target.checked })}
          />
          Incluir préstamo
        </label>
      </div>

      <div style={{ ...card, marginBottom: 16 }}>
        <h3 style={subTitle}>Parámetros generales</h3>
        <div style={grid3}>
          <Field label="Nº períodos">
            <input
              type="number"
              min={1}
              max={24}
              value={finance.periods}
              onChange={(e) => resizePeriods(Math.max(1, parseInt(e.target.value, 10) || 1))}
              style={inputStyle}
            />
          </Field>
          <Field label="Tasa descuento TD (% anual)" helpId="finance-td">
            <input
              type="number"
              step={0.1}
              value={pctInput(finance.discountRate)}
              onChange={(e) => patch({ discountRate: num(e.target.value) / 100 })}
              style={inputStyle}
            />
          </Field>
          <Field label="Impuesto (% sobre BAI)" helpId="finance-impuesto">
            <input
              type="number"
              step={0.1}
              value={pctInput(finance.taxRate)}
              onChange={(e) => patch({ taxRate: num(e.target.value) / 100 })}
              style={inputStyle}
            />
          </Field>
        </div>

        <h3 style={{ ...subTitle, marginTop: 20, display: "flex", alignItems: "center", gap: 8 }}>
          Activos e inversión período 0
          <HelpButton topicId="finance-depreciacion" />
        </h3>
        <div style={grid3}>
          <Field label="Equipos — valor (VC)" helpId="finance-equipos-p0">
            <input
              type="number"
              value={finance.equipment.cost}
              onChange={(e) => patch({ equipment: { ...finance.equipment, cost: num(e.target.value) } })}
              style={inputStyle}
            />
          </Field>
          <Field label="Equipos — vida (años)">
            <input
              type="number"
              value={finance.equipment.lifeYears}
              onChange={(e) => patch({ equipment: { ...finance.equipment, lifeYears: num(e.target.value) } })}
              style={inputStyle}
            />
          </Field>
          <Field label="Inversión equipos P0" helpId="finance-equipos-p0">
            <input
              type="number"
              value={finance.period0.investEquipment}
              onChange={(e) => patch({ period0: { ...finance.period0, investEquipment: num(e.target.value) } })}
              style={inputStyle}
            />
          </Field>
          <Field label="Muebles — valor (VC)">
            <input
              type="number"
              value={finance.furniture.cost}
              onChange={(e) => patch({ furniture: { ...finance.furniture, cost: num(e.target.value) } })}
              style={inputStyle}
            />
          </Field>
          <Field label="Muebles — vida (años)">
            <input
              type="number"
              value={finance.furniture.lifeYears}
              onChange={(e) => patch({ furniture: { ...finance.furniture, lifeYears: num(e.target.value) } })}
              style={inputStyle}
            />
          </Field>
          <Field label="Inversión muebles P0">
            <input
              type="number"
              value={finance.period0.investFurniture}
              onChange={(e) => patch({ period0: { ...finance.period0, investFurniture: num(e.target.value) } })}
              style={inputStyle}
            />
          </Field>
          <Field label="Intangibles — costo" helpId="finance-depreciacion">
            <input
              type="number"
              value={finance.intangible.cost}
              onChange={(e) => patch({ intangible: { ...finance.intangible, cost: num(e.target.value) } })}
              style={inputStyle}
            />
          </Field>
          <Field label="Intangibles — vida">
            <input
              type="number"
              value={finance.intangible.lifeYears}
              onChange={(e) => patch({ intangible: { ...finance.intangible, lifeYears: num(e.target.value) } })}
              style={inputStyle}
            />
          </Field>
          <Field label="Capital de trabajo P0" helpId="finance-kt">
            <input
              type="number"
              value={finance.period0.workingCapital}
              onChange={(e) => patch({ period0: { ...finance.period0, workingCapital: num(e.target.value) } })}
              style={inputStyle}
            />
          </Field>
        </div>

        {finance.withLoan && (
          <>
            <h3 style={{ ...subTitle, marginTop: 20, display: "flex", alignItems: "center", gap: 8 }}>
              Préstamo (sistema francés — 2.4.3)
              <HelpButton topicId="finance-prestamo" />
            </h3>
            <div style={grid3}>
              <Field label="Monto préstamo">
                <input
                  type="number"
                  value={finance.loan.principal}
                  onChange={(e) => patch({ loan: { ...finance.loan, principal: num(e.target.value) } })}
                  style={inputStyle}
                />
              </Field>
              <Field label="Tasa por período (decimal)">
                <input
                  type="number"
                  step={0.001}
                  value={finance.loan.periodRate}
                  onChange={(e) => patch({ loan: { ...finance.loan, periodRate: num(e.target.value) } })}
                  style={inputStyle}
                />
              </Field>
              <Field label="Plazo (períodos)">
                <input
                  type="number"
                  value={finance.loan.periods}
                  onChange={(e) => patch({ loan: { ...finance.loan, periods: Math.max(1, num(e.target.value)) } })}
                  style={inputStyle}
                />
              </Field>
            </div>
          </>
        )}
      </div>

      <div style={{ ...card, marginBottom: 16, overflowX: "auto" }}>
        <h3 style={{ ...subTitle, display: "flex", alignItems: "center", gap: 8 }}>
          Ingresos y costos base (alimentan el recálculo)
          <HelpButton topicId="finance-recalcular" />
        </h3>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
          <thead>
            <tr>
              <th style={{ ...th, textAlign: "left" }}>Concepto</th>
              {periodHeaders.map((p) => (
                <th key={p} style={th}>
                  P{p}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(
              [
                ["Ingresos", "revenues"],
                ["Costos variables", "variableCosts"],
                ["Costos fijos", "fixedCosts"],
              ] as const
            ).map(([label, key]) => (
              <tr key={key}>
                <td style={tdLabel}>
                  <LabelWithHelp
                    topicId={
                      key === "fixedCosts"
                        ? "finance-costo-fijo"
                        : key === "variableCosts"
                          ? "finance-costo-variable"
                          : "finance-ingresos"
                    }
                  >
                    {label}
                  </LabelWithHelp>
                </td>
                {periodHeaders.map((p) => (
                  <td key={p} style={td}>
                    <input
                      type="number"
                      value={finance[key][p] ?? 0}
                      onChange={(e) => setPeriodValue(key, p, num(e.target.value))}
                      style={{ ...inputStyle, textAlign: "right", width: 110 }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {finance.withLoan && amortResult.amortization.length > 0 && (
        <div style={{ ...card, marginBottom: 16, overflowX: "auto" }}>
          <h3 style={subTitle}>Tabla de amortización (referencia 2.4.3)</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "center" }}>Per.</th>
                <th style={th}>Cuota</th>
                <th style={th}>Interés</th>
                <th style={th}>Amort. capital</th>
                <th style={th}>Saldo</th>
              </tr>
            </thead>
            <tbody>
              {amortResult.amortization.map((row) => (
                <tr key={row.period}>
                  <td style={{ ...td, textAlign: "center" }}>{row.period}</td>
                  <td style={td}>{formatMoney(row.payment)}</td>
                  <td style={td}>{formatMoney(row.interest)}</td>
                  <td style={td}>{formatMoney(row.principal)}</td>
                  <td style={td}>{formatMoney(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ ...card, marginBottom: 16, overflowX: "auto" }}>
        <h3 style={{ ...subTitle, display: "flex", alignItems: "center", gap: 8 }}>
          Estado de flujos de caja — editable (2.5.4 / 2.5.5)
          <HelpButton topicId="finance-flujo-caja" />
        </h3>
        <p style={{ fontSize: 11, color: colors.muted, margin: "0 0 12px" }}>
          Edite cualquier celda o el nombre del rubro. VAN y TIR se calculan desde la fila «Flujo de caja».
        </p>
        <EditableCashFlowTable
          lines={finance.lines}
          periodHeaders={periodHeaders}
          onValueChange={setLineValue}
          onLabelChange={setLineLabel}
        />
      </div>

      <div
        style={{
          ...card,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 16,
        }}
      >
        <Kpi
          label="VAN (TD)"
          value={formatMoney(indicators.van)}
          accent={indicators.van >= 0 ? colors.success : colors.danger}
          helpId="finance-van-tir"
        />
        <Kpi label="TIR" value={formatPct(indicators.tir)} helpId="finance-van-tir" />
        <Kpi label="FCA final" value={formatMoney(indicators.fcaFinal)} helpId="finance-flujo-caja" />
        <Kpi label="Períodos" value={String(n)} />
        <Kpi label="Proyecto" value={finance.projectName || "—"} small />
      </div>
    </section>
  )
}

function EditableCashFlowTable({
  lines,
  periodHeaders,
  onValueChange,
  onLabelChange,
}: {
  lines: CashFlowLine[]
  periodHeaders: number[]
  onValueChange: (id: CashFlowLineId, period: number, value: number) => void
  onLabelChange: (id: CashFlowLineId, label: string) => void
}) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}>
      <thead>
        <tr>
          <th style={{ ...th, textAlign: "left", minWidth: 240 }}>Rubro (editable)</th>
          {periodHeaders.map((p) => (
            <th key={p} style={th}>
              P{p}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {lines.map((line) => (
          <tr
            key={line.id}
            style={
              line.bold
                ? { background: line.id === "cashFlow" ? colors.skyLight : colors.orangeLight }
                : undefined
            }
          >
            <td style={tdLabel}>
              <input
                value={line.label}
                onChange={(e) => onLabelChange(line.id, e.target.value)}
                style={{
                  ...inputStyle,
                  fontWeight: line.bold ? 700 : 500,
                  width: "100%",
                  maxWidth: 320,
                }}
              />
            </td>
            {periodHeaders.map((p) => (
              <td key={p} style={td}>
                <input
                  type="number"
                  value={line.values[p] ?? 0}
                  onChange={(e) => onValueChange(line.id, p, num(e.target.value))}
                  style={{
                    ...inputStyle,
                    textAlign: "right",
                    width: 108,
                    fontWeight: line.bold ? 700 : 400,
                  }}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Field({
  label,
  children,
  helpId,
}: {
  label: string
  children: ReactNode
  helpId?: string
}) {
  return (
    <label style={{ display: "block" }}>
      <span
        style={{
          fontSize: 11,
          color: colors.muted,
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 4,
        }}
      >
        {label}
        {helpId ? <HelpButton topicId={helpId} /> : null}
      </span>
      {children}
    </label>
  )
}

function Kpi({
  label,
  value,
  accent,
  small,
  helpId,
}: {
  label: string
  value: string
  accent?: string
  small?: boolean
  helpId?: string
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          color: colors.muted,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        {label}
        {helpId ? <HelpButton topicId={helpId} /> : null}
      </div>
      <div
        style={{
          fontSize: small ? 13 : 22,
          fontWeight: 700,
          color: accent ?? colors.navy,
          marginTop: 4,
          lineHeight: 1.3,
        }}
      >
        {value}
      </div>
    </div>
  )
}

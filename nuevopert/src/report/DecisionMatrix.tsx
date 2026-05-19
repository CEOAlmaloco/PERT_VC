import { Fragment } from "react"
import type { CSSProperties } from "react"
import type { DecisionAlt, DecisionCriterion } from "./types"
import { card, colors } from "./theme"

const EQUIV = [
  { score: 1, pct: "0%", label: "Muy bajo" },
  { score: 2, pct: "30%", label: "Bajo" },
  { score: 3, pct: "60%", label: "Medio" },
  { score: 4, pct: "80%", label: "Alto" },
  { score: 5, pct: "100%", label: "Muy alto" },
]

type Props = {
  title: string
  project: string
  alts: DecisionAlt[]
  criteria: DecisionCriterion[]
  reading: string
  recommendation: string
  interpretation?: string
  onChange: (patch: Partial<{
    title: string
    project: string
    reading: string
    recommendation: string
    interpretation: string
    criteria: DecisionCriterion[]
    alts: DecisionAlt[]
  }>) => void
}

export function DecisionMatrix({
  title,
  project,
  alts,
  criteria,
  reading,
  recommendation,
  interpretation,
  onChange,
}: Props) {
  const totals = alts.map((alt) => {
    let sumScore = 0
    let sumWeighted = 0
    for (const c of criteria) {
      const sc = c.scores[alt.id] ?? 0
      sumScore += sc
      sumWeighted += sc * c.weight
    }
    return { sumScore, sumWeighted }
  })
  const bestIdx = totals.reduce((bi, t, i) => (t.sumWeighted > totals[bi].sumWeighted ? i : bi), 0)

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          borderCollapse: "collapse",
          fontSize: 12,
          minWidth: 720,
          border: `1px solid ${colors.navy}`,
          width: "100%",
        }}
      >
        <thead>
          <tr style={{ background: colors.navy, color: "#fff" }}>
            <th colSpan={2 + alts.length * 2} style={{ ...th, color: "#fff" }}>
              MATRIZ DE DECISIÓN — {title}
            </th>
          </tr>
          <tr>
            <td colSpan={2} style={tdLabel}>
              Proyecto evaluado
            </td>
            <td colSpan={alts.length * 2} style={tdVal}>
              <input style={inpFull} value={project} onChange={(e) => onChange({ project: e.target.value })} />
            </td>
          </tr>
          <tr style={{ background: "#fafafa" }}>
            <th style={th}>CRITERIO</th>
            <th style={th}>PONDER. (%)</th>
            {alts.map((a) => (
              <th key={a.id} colSpan={2} style={th}>
                {a.name}
              </th>
            ))}
          </tr>
          <tr style={{ background: "#f0f0f0", fontSize: 10 }}>
            <th style={th} />
            <th style={th} />
            {alts.flatMap((a) => [
              <th key={`${a.id}-p`} style={th}>
                Puntaje
              </th>,
              <th key={`${a.id}-t`} style={th}>
                Total
              </th>,
            ])}
          </tr>
        </thead>
        <tbody>
          {criteria.map((c) => (
            <tr key={c.id}>
              <td style={tdLabel}>{c.name}</td>
              <td style={tdCenter}>
                <input
                  style={inpNum}
                  value={c.weight}
                  onChange={(e) => {
                    const w = Number(e.target.value)
                    onChange({
                      criteria: criteria.map((x) => (x.id === c.id ? { ...x, weight: w } : x)),
                    })
                  }}
                />
              </td>
              {alts.map((alt) => {
                const sc = c.scores[alt.id] ?? 0
                const total = sc * c.weight
                return (
                  <Fragment key={alt.id}>
                    <td style={tdCenter}>
                      <input
                        style={inpNum}
                        value={sc}
                        min={1}
                        max={5}
                        onChange={(e) => {
                          const v = Math.min(5, Math.max(1, Number(e.target.value) || 1))
                          onChange({
                            criteria: criteria.map((x) =>
                              x.id === c.id ? { ...x, scores: { ...x.scores, [alt.id]: v } } : x,
                            ),
                          })
                        }}
                      />
                    </td>
                    <td style={tdCenter}>{total}</td>
                  </Fragment>
                )
              })}
            </tr>
          ))}
          <tr style={{ background: "#e8f4fc", fontWeight: 700 }}>
            <td colSpan={2} style={tdLabel}>
              TOTAL PONDERADO
            </td>
            {alts.map((alt, i) => (
              <Fragment key={alt.id}>
                <td style={tdCenter}>{totals[i].sumScore}</td>
                <td
                  style={{
                    ...tdCenter,
                    background: i === bestIdx ? "#fef3c7" : undefined,
                    fontWeight: 700,
                  }}
                >
                  {totals[i].sumWeighted}
                </td>
              </Fragment>
            ))}
          </tr>
          <tr>
            <td colSpan={2} style={tdLabel}>
              LECTURA DEL RESULTADO
            </td>
            <td colSpan={alts.length * 2} style={tdVal}>
              <input style={inpFull} value={reading} onChange={(e) => onChange({ reading: e.target.value })} />
            </td>
          </tr>
          <tr>
            <td colSpan={2} style={tdLabel}>
              Decisión recomendada
            </td>
            <td colSpan={alts.length * 2} style={tdVal}>
              <textarea
                style={{ ...inpFull, minHeight: 48, resize: "vertical" }}
                value={recommendation}
                onChange={(e) => onChange({ recommendation: e.target.value })}
              />
            </td>
          </tr>
          {interpretation != null && (
            <tr>
              <td colSpan={2} style={tdLabel}>
                Interpretación del equipo
              </td>
              <td colSpan={alts.length * 2} style={tdVal}>
                <textarea
                  style={{ ...inpFull, minHeight: 56, resize: "vertical" }}
                  value={interpretation}
                  onChange={(e) => onChange({ interpretation: e.target.value })}
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <table style={{ marginTop: 16, borderCollapse: "collapse", fontSize: 11, border: "1px solid #ccc" }}>
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th style={th}>EQUIVALENCIAS</th>
            <th style={th}>Puntaje</th>
            <th style={th}>%</th>
            <th style={th}>Nivel</th>
          </tr>
        </thead>
        <tbody>
          {EQUIV.map((e) => (
            <tr key={e.score}>
              <td style={tdLabel} />
              <td style={tdCenter}>{e.score}</td>
              <td style={tdCenter}>{e.pct}</td>
              <td style={tdVal}>{e.label}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ ...card, marginTop: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: colors.navy, marginBottom: 8 }}>Alternativas</div>
        {alts.map((a) => (
          <p key={a.id} style={{ margin: "6px 0", fontSize: 12, color: colors.text }}>
            <strong>{a.name}:</strong> {a.description}
          </p>
        ))}
      </div>
    </div>
  )
}

const th: CSSProperties = {
  border: "1px solid #ccc",
  padding: "6px 8px",
  textAlign: "center",
  fontWeight: 600,
}

const tdLabel: CSSProperties = {
  border: "1px solid #ddd",
  padding: "6px 8px",
  background: "#f8fafc",
  fontWeight: 600,
}

const tdVal: CSSProperties = {
  border: "1px solid #ddd",
  padding: "4px",
}

const tdCenter: CSSProperties = {
  border: "1px solid #ddd",
  padding: "6px",
  textAlign: "center",
  fontFamily: "ui-monospace, monospace",
}

const inpFull: CSSProperties = {
  width: "100%",
  border: "none",
  padding: "6px 8px",
  fontSize: 12,
  fontFamily: "inherit",
}

const inpNum: CSSProperties = {
  width: 48,
  border: "1px solid #ccc",
  padding: "4px",
  textAlign: "center",
  fontFamily: "ui-monospace, monospace",
}

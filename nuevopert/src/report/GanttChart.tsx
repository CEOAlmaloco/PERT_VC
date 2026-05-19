import type { CSSProperties } from "react"
import type { GanttTask } from "./types"
import { colors } from "./theme"

type Props = {
  weeks: number
  tasks: GanttTask[]
  title?: string
  unitLabel?: string
}

function unitLabelPlural(unitLabel: string): string {
  const u = unitLabel.toLowerCase()
  if (u === "semana") return "semanas"
  if (u === "mes") return "meses"
  return `${u}es`
}

export function GanttChart({ weeks, tasks, title, unitLabel = "Semana" }: Props) {
  const phases = [...new Set(tasks.map((t) => t.phase))]
  const unitPlural = unitLabelPlural(unitLabel)

  return (
    <div
      style={{
        overflowX: "auto",
        border: `1px solid ${colors.navy}`,
        borderRadius: 12,
        background: "#fff",
        boxShadow: "0 2px 8px rgba(15, 39, 68, 0.08)",
      }}
    >
      {title && (
        <div
          style={{
            background: `linear-gradient(90deg, ${colors.navy}, ${colors.blue})`,
            color: "#fff",
            padding: "12px 16px",
            fontSize: 13,
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          {title}
        </div>
      )}
      <p style={{ margin: "8px 12px 0", fontSize: 10, color: "#64748b" }}>
        Cada columna = 1 semana. Las barras marcan las semanas en que la actividad está activa según ES y EF del CPM.
      </p>
      <table style={{ borderCollapse: "collapse", fontSize: 11, minWidth: weeks * 32 + 300 }}>
        <thead>
          <tr style={{ background: colors.ganttPhase }}>
            <th style={{ ...th, minWidth: 130, position: "sticky", left: 0, zIndex: 2, background: colors.ganttPhase }}>
              Fase
            </th>
            <th style={{ ...th, minWidth: 240, position: "sticky", left: 130, zIndex: 2, background: colors.ganttPhase }}>
              Actividad
            </th>
            <th colSpan={weeks} style={{ ...th, textAlign: "center" }}>
              Cronograma por {unitPlural}
            </th>
          </tr>
          <tr style={{ background: "#eff6ff" }}>
            <th style={{ position: "sticky", left: 0, background: "#eff6ff", borderBottom: "1px solid #93c5fd" }} />
            <th style={{ position: "sticky", left: 130, background: "#eff6ff", borderBottom: "1px solid #93c5fd" }} />
            {Array.from({ length: weeks }, (_, i) => (
              <th key={i} style={thWeek}>
                {unitLabel} {i + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {phases.map((phase) => {
            const phaseTasks = tasks.filter((t) => t.phase === phase)
            return phaseTasks.map((t, idx) => (
              <tr key={t.id}>
                <td
                  style={{
                    ...td,
                    position: "sticky",
                    left: 0,
                    background: idx === 0 ? "#e0f2fe" : "#f8fafc",
                    fontWeight: idx === 0 ? 700 : 400,
                    color: colors.navy,
                    verticalAlign: "top",
                    fontSize: 10,
                  }}
                >
                  {idx === 0 ? phase : ""}
                </td>
                <td style={{ ...td, position: "sticky", left: 130, background: "#fff", minWidth: 240 }}>
                  {t.activity}
                </td>
                {Array.from({ length: weeks }, (_, w) => {
                  const period = w + 1
                  const active = period >= t.startWeek && period <= t.endWeek
                  return (
                    <td
                      key={period}
                      style={{
                        ...cell,
                        background: active ? "#fef9c3" : "#f8fafc",
                        padding: 0,
                      }}
                    >
                      {active ? (
                        <div
                          style={{
                            height: 20,
                            margin: 2,
                            background: `linear-gradient(90deg, ${colors.amber}, ${colors.ganttBar})`,
                            borderRadius: 3,
                          }}
                        />
                      ) : null}
                    </td>
                  )
                })}
              </tr>
            ))
          })}
        </tbody>
      </table>
    </div>
  )
}

const th: CSSProperties = {
  border: "1px solid #93c5fd",
  padding: "8px 10px",
  textAlign: "left",
  fontWeight: 600,
}

const thWeek: CSSProperties = {
  border: "1px solid #93c5fd",
  padding: "4px 2px",
  width: 30,
  textAlign: "center",
  fontSize: 9,
  fontWeight: 600,
}

const td: CSSProperties = {
  border: "1px solid #e2e8f0",
  padding: "6px 8px",
  verticalAlign: "middle",
}

const cell: CSSProperties = {
  border: "1px solid #e2e8f0",
  width: 30,
}

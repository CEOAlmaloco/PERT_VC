import type { CSSProperties } from "react"
import { HelpButton } from "./ContextHelp"
import { buildNormalTableRows } from "./normalTable"

const ROWS = buildNormalTableRows()

type Props = {
  highlightZ?: number | null
}

export function NormalDistributionTable({ highlightZ }: Props) {
  const hiRow = highlightZ != null && highlightZ >= 0 ? Math.floor(highlightZ * 10) / 10 : null
  const hiCol = highlightZ != null && highlightZ >= 0 ? Math.round((highlightZ - (hiRow ?? 0)) * 100) : null

  return (
    <div style={{ overflowX: "auto" }}>
      <p style={{ margin: "0 0 8px", fontSize: 12, color: "#444", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span>
          <strong>Tabla de la distribución normal estándar</strong> — valores = P(Z ≤ z). En PERT: Z = (x − μ) / σ.
        </span>
        <HelpButton topicId="pert-z-tabla" />
      </p>
      <table style={{ borderCollapse: "collapse", fontSize: 10, border: "1px solid #111" }}>
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th style={th}>z</th>
            {Array.from({ length: 10 }, (_, i) => (
              <th key={i} style={th}>
                .{String(i).padStart(2, "0")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.z}>
              <td style={{ ...th, textAlign: "right", background: "#fafafa" }}>{row.z.toFixed(1)}</td>
              {row.decimals.map((p, colIdx) => {
                const isHi =
                  hiRow != null && Math.abs(row.z - hiRow) < 0.001 && hiCol === colIdx
                return (
                  <td
                    key={colIdx}
                    style={{
                      border: "1px solid #ddd",
                      padding: "2px 4px",
                      textAlign: "center",
                      fontFamily: "ui-monospace, monospace",
                      background: isHi ? "#fef08a" : "#fff",
                      fontWeight: isHi ? 700 : 400,
                    }}
                  >
                    {p.toFixed(4)}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const th: CSSProperties = {
  border: "1px solid #ccc",
  padding: "4px 6px",
  fontWeight: 600,
}

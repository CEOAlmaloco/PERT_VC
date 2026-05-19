import type { CSSProperties } from "react"
import { HelpButton, LabelWithHelp } from "./report/ContextHelp"
import { previewPertFromRow, type Row } from "./cpmEngine"

type Props = {
  rows: Row[]
  onChange: (rows: Row[]) => void
}

const phAct = "ej. A"
const phNom = "ej. Comprar ingredientes"
const phProc = "-  o  A;B"

export function ActivityTable({ rows, onChange }: Props) {
  const update = (id: string, field: keyof Omit<Row, "id">, value: string) => {
    onChange(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
  }

  const addRow = () => {
    const id = String(Date.now())
    onChange([
      ...rows,
      { id, actividad: "", nombre: "", procedencia: "", optimista: "", probable: "", pesimista: "" },
    ])
  }

  const removeRow = (id: string) => {
    if (rows.length <= 1) return
    onChange(rows.filter((r) => r.id !== id))
  }

  return (
    <section>
      <h2 style={{ fontSize: 15, margin: "0 0 8px", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
        Tabla (editable)
        <HelpButton topicId="pert-overview" />
      </h2>
      <p style={{ margin: "0 0 8px", fontSize: 12, color: "#444" }}>
        <LabelWithHelp topicId="pert-formula-te">
          <strong>a, m, b</strong>
        </LabelWithHelp>{" "}
        = optimista, probable, pesimista (sem). <strong>Te</strong> = (a+4m+b)/6 alimenta el CPM.{" "}
        <LabelWithHelp topicId="pert-procedencia">
          <strong>Procedencia</strong>
        </LabelWithHelp>{" "}
        = predecesores (<code>;</code> o <code>,</code>).
      </p>
      <div style={{ overflowX: "auto", border: "1px solid #111" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th style={{ ...th, minWidth: 56 }}>Act.</th>
              <th style={{ ...th, minWidth: 120 }}>Nombre</th>
              <th style={{ ...th, minWidth: 88 }}>Proc.</th>
              <th style={{ ...th, minWidth: 52 }}>a</th>
              <th style={{ ...th, minWidth: 52 }}>m</th>
              <th style={{ ...th, minWidth: 52 }}>b</th>
              <th style={{ ...th, minWidth: 52 }}>Te</th>
              <th style={{ ...th, minWidth: 52 }}>σ²</th>
              <th style={{ ...th, width: 44 }} />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const prev = previewPertFromRow(r)
              return (
                <tr key={r.id}>
                  <td style={td}>
                    <input
                      style={inp}
                      value={r.actividad}
                      placeholder={phAct}
                      onChange={(e) => update(r.id, "actividad", e.target.value)}
                      aria-label="Actividad"
                    />
                  </td>
                  <td style={td}>
                    <input
                      style={inp}
                      value={r.nombre}
                      placeholder={phNom}
                      onChange={(e) => update(r.id, "nombre", e.target.value)}
                      aria-label="Nombre"
                    />
                  </td>
                  <td style={td}>
                    <input
                      style={inp}
                      value={r.procedencia}
                      placeholder={phProc}
                      onChange={(e) => update(r.id, "procedencia", e.target.value)}
                      aria-label="Procedencia"
                    />
                  </td>
                  <td style={td}>
                    <input
                      style={inp}
                      value={r.optimista}
                      placeholder="a"
                      onChange={(e) => update(r.id, "optimista", e.target.value)}
                      aria-label="Tiempo optimista"
                    />
                  </td>
                  <td style={td}>
                    <input
                      style={inp}
                      value={r.probable}
                      placeholder="m"
                      onChange={(e) => update(r.id, "probable", e.target.value)}
                      aria-label="Tiempo probable"
                    />
                  </td>
                  <td style={td}>
                    <input
                      style={inp}
                      value={r.pesimista}
                      placeholder="b"
                      onChange={(e) => update(r.id, "pesimista", e.target.value)}
                      aria-label="Tiempo pesimista"
                    />
                  </td>
                  <td style={tdCalc}>{prev ? prev.te.toFixed(2) : "—"}</td>
                  <td style={tdCalc}>{prev ? prev.variance.toFixed(2) : "—"}</td>
                  <td style={td}>
                    <button type="button" style={btn} onClick={() => removeRow(r.id)}>
                      ✕
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <button type="button" style={{ ...btn, marginTop: 8 }} onClick={addRow}>
        + Fila
      </button>
    </section>
  )
}

const th: CSSProperties = {
  textAlign: "left",
  padding: "8px 8px",
  borderBottom: "1px solid #111",
  fontWeight: 600,
  fontSize: 11,
}

const td: CSSProperties = {
  padding: 0,
  borderBottom: "1px solid #ddd",
  verticalAlign: "middle",
}

const tdCalc: CSSProperties = {
  ...td,
  padding: "8px 8px",
  fontFamily: "ui-monospace, monospace",
  fontSize: 12,
  color: "#333",
  background: "#fafafa",
}

const inp: CSSProperties = {
  width: "100%",
  border: "none",
  padding: "8px 8px",
  fontSize: 13,
  fontFamily: "inherit",
  background: "#fff",
}

const btn: CSSProperties = {
  border: "1px solid #111",
  background: "#fff",
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: 12,
}

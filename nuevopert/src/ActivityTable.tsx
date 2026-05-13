import type { CSSProperties } from "react"
import type { Row } from "./cpmEngine"

type Props = {
  rows: Row[]
  onChange: (rows: Row[]) => void
}

const phAct = "ej. A"
const phNom = "ej. Comprar ingredientes"
const phProc = "-  o  A;B"
const phDur = "6"

export function ActivityTable({ rows, onChange }: Props) {
  const update = (id: string, field: keyof Omit<Row, "id">, value: string) => {
    onChange(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
  }

  const addRow = () => {
    const id = String(Date.now())
    onChange([...rows, { id, actividad: "", nombre: "", procedencia: "", duracion: "" }])
  }

  const removeRow = (id: string) => {
    if (rows.length <= 1) return
    onChange(rows.filter((r) => r.id !== id))
  }

  return (
    <section>
      <h2 style={{ fontSize: 15, margin: "0 0 8px", fontWeight: 600 }}>Tabla (editable)</h2>
      <p style={{ margin: "0 0 8px", fontSize: 12, color: "#444" }}>
        <strong>Actividad</strong> = código único (clave). <strong>Nombre</strong> = descripción.{" "}
        <strong>Procedencia</strong> = códigos que deben terminar antes (separar con <code>;</code> o <code>,</code>).{" "}
        <strong>Duración</strong> = semanas (número; admite texto tipo «8 sem»).
      </p>
      <div style={{ overflowX: "auto", border: "1px solid #111" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th style={{ ...th, minWidth: 72 }}>Actividad</th>
              <th style={{ ...th, minWidth: 160 }}>Nombre</th>
              <th style={{ ...th, minWidth: 100 }}>Procedencia</th>
              <th style={{ ...th, minWidth: 88 }}>Duración (sem)</th>
              <th style={{ ...th, width: 52 }} />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
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
                    value={r.duracion}
                    placeholder={phDur}
                    onChange={(e) => update(r.id, "duracion", e.target.value)}
                    aria-label="Duración en semanas"
                  />
                </td>
                <td style={td}>
                  <button type="button" style={btn} onClick={() => removeRow(r.id)}>
                    ✕
                  </button>
                </td>
              </tr>
            ))}
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
  padding: "8px 10px",
  borderBottom: "1px solid #111",
  fontWeight: 600,
  fontSize: 12,
}

const td: CSSProperties = {
  padding: 0,
  borderBottom: "1px solid #ddd",
  verticalAlign: "middle",
}

const inp: CSSProperties = {
  width: "100%",
  border: "none",
  padding: "10px 10px",
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

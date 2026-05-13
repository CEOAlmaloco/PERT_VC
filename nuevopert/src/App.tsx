import { useMemo, useState } from "react"
import type { CSSProperties } from "react"
import { ActivityQuadrants } from "./ActivityQuadrants"
import { ActivityTable } from "./ActivityTable"
import {
  computeCpmFromRows,
  defaultRows,
  exampleLinearRows,
  exampleParallelRows,
  examplePizzaRows,
  exampleSoftwareRows,
  layoutPositions,
  matchesClassicAoA8Pattern,
  type Row,
} from "./cpmEngine"
import { ClassicAoA8Diagram } from "./ClassicAoA8Diagram"
import { PertDiagram } from "./PertDiagram"
import "./index.css"

const btn: CSSProperties = {
  border: "1px solid #111",
  background: "#fff",
  padding: "6px 12px",
  cursor: "pointer",
  fontSize: 12,
  marginRight: 8,
  marginTop: 6,
}

const btnPrimary: CSSProperties = {
  ...btn,
  background: "#111",
  color: "#fff",
  fontWeight: 600,
  padding: "8px 18px",
}

function cloneRows(r: Row[]): Row[] {
  return r.map((x) => ({ ...x }))
}

export default function App() {
  const [rows, setRows] = useState<Row[]>(() => defaultRows())
  const [committedRows, setCommittedRows] = useState<Row[]>(() => cloneRows(defaultRows()))

  const result = useMemo(() => computeCpmFromRows(committedRows), [committedRows])

  const positions = useMemo(() => {
    if (result.errors.length || result.activities.length === 0) {
      return { x: {}, y: {}, width: 400, height: 320 }
    }
    return layoutPositions(result)
  }, [result])

  const ok = result.errors.length === 0 && result.activities.length > 0
  const showClassicAoA = ok && matchesClassicAoA8Pattern(committedRows)

  const dirty = useMemo(() => JSON.stringify(rows) !== JSON.stringify(committedRows), [rows, committedRows])

  const applyTable = () => setCommittedRows(cloneRows(rows))

  const loadExample = (next: Row[]) => {
    setRows(next)
    setCommittedRows(cloneRows(next))
  }

  return (
    <div style={{ textAlign: "left" }}>
      <header style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, margin: "0 0 6px", fontWeight: 700 }}>PERT / CPM — tabla y diagrama (semanas)</h1>
        <p style={{ margin: 0, fontSize: 13, color: "#333", maxWidth: 820 }}>
          La <strong>procedencia</strong> en la tabla es la fuente de verdad (FS). Si el proyecto es el{" "}
          <strong>clásico A–H</strong> (mismas dependencias que el diagrama de eventos 1–8), verás la vista{" "}
          <strong>actividad en flecha (AoA)</strong> con <strong>inicio en el evento 1</strong>, fin en el{" "}
          <strong>8</strong> y <strong>ficticias</strong> en discontinuo (2→3 y 6→5). En otros casos se usa{" "}
          <strong>AoN</strong> (círculo = actividad). Pulsa <strong>ACTUALIZAR</strong> tras editar la tabla (como
          en Excel) para recalcular sin estados a medias. El camino crítico se marca en rojo según el CPM.
        </p>
        <div style={{ marginTop: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 600, marginRight: 8 }}>Ejemplos:</span>
          <button type="button" style={btn} onClick={() => loadExample(defaultRows())}>
            Proyecto A–H
          </button>
          <button type="button" style={btn} onClick={() => loadExample(examplePizzaRows())}>
            Pizza
          </button>
          <button type="button" style={btn} onClick={() => loadExample(exampleSoftwareRows())}>
            Software
          </button>
          <button type="button" style={btn} onClick={() => loadExample(exampleLinearRows())}>
            Lineal A→D
          </button>
          <button type="button" style={btn} onClick={() => loadExample(exampleParallelRows())}>
            Paralelo A→B,C→D
          </button>
        </div>
      </header>

      <ActivityTable rows={rows} onChange={setRows} />

      <div
        style={{
          marginTop: 12,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 12,
        }}
      >
        <button type="button" style={btnPrimary} onClick={applyTable}>
          ACTUALIZAR
        </button>
        {dirty ? (
          <span style={{ fontSize: 12, color: "#92400e", fontWeight: 500 }}>
            Hay cambios sin aplicar: el diagrama y los totales siguen la última actualización.
          </span>
        ) : (
          <span style={{ fontSize: 12, color: "#525252" }}>Tabla aplicada al CPM y al diagrama.</span>
        )}
      </div>

      <div style={{ marginTop: 20, padding: 12, background: "#fafafa", border: "1px solid #ddd" }}>
        <p style={{ margin: "0 0 8px", fontSize: 13 }}>
          <strong>Duración total del proyecto:</strong>{" "}
          {ok ? (
            <span style={{ fontFamily: "monospace" }}>{result.projectEnd.toFixed(1)} semanas</span>
          ) : (
            <span>—</span>
          )}
        </p>
        {result.errors.length > 0 && (
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: "#b91c1c" }}>
            {result.errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        )}
      </div>

      {ok && (
        <>
          <h2 style={{ fontSize: 15, margin: "22px 0 8px", fontWeight: 600 }}>
            {showClassicAoA ? "Diagrama AoA (eventos 1–8)" : "Diagrama AoN (SVG)"}
          </h2>
          {showClassicAoA ? <ClassicAoA8Diagram result={result} /> : <PertDiagram result={result} positions={positions} />}
          <ActivityQuadrants result={result} />
        </>
      )}
    </div>
  )
}

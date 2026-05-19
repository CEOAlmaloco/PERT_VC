import { useMemo, useState } from "react"
import type { CSSProperties } from "react"
import { ActivityQuadrants } from "../ActivityQuadrants"
import { ActivityTable } from "../ActivityTable"
import {
  computeCpmFromRows,
  exampleClassicAHRows,
  exampleGpy5101Rows,
  exampleLinearRows,
  exampleParallelRows,
  examplePizzaRows,
  exampleSoftwareRows,
  layoutPositions,
  matchesClassicAoA8Pattern,
  sigpiValleDelSolRows,
  type Row,
} from "../cpmEngine"
import { AoADiagram } from "../AoADiagram"
import { ClassicAoA8Diagram } from "../ClassicAoA8Diagram"
import { detectSigpiAoATopology } from "../sigpiAoA"
import { PertDiagram } from "../PertDiagram"
import { PertStatsPanel } from "../PertStatsPanel"
import { HelpButton, SectionHeadingWithHelp } from "./ContextHelp"
import { GanttChart } from "./GanttChart"
import { NormalDistributionTable } from "./NormalDistributionTable"
import { ganttFromCpmResult, projectWeekCount } from "./ganttFromCpm"
import { SIGPI_CRONOGRAMA_TEMPLATES, type SigpiPertTemplate } from "./sigpiPertTemplates"
import type { GanttTask } from "./types"

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
}

const btnEntregable: CSSProperties = {
  ...btn,
  borderColor: "#2563eb",
  color: "#1d4ed8",
  fontWeight: 600,
}

function cloneRows(r: Row[]): Row[] {
  return r.map((x) => ({ ...x }))
}

type Props = {
  ganttWeeks: number
  ganttTasks: GanttTask[]
  projectTitle: string
  ganttUnitLabel?: string
  initialRows: Row[]
  onPersist?: (patch: { pertRows: Row[]; ganttTasks?: GanttTask[]; ganttWeeks?: number }) => void
}

export function TabPertSection({
  ganttWeeks,
  ganttTasks,
  projectTitle,
  ganttUnitLabel,
  initialRows,
  onPersist,
}: Props) {
  const [rows, setRows] = useState<Row[]>(() => cloneRows(initialRows))
  const [committedRows, setCommittedRows] = useState<Row[]>(() => cloneRows(initialRows))
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>("e1")
  const [ganttPhase, setGanttPhase] = useState("Entregable 1 — Gestión")
  const [highlightZ, setHighlightZ] = useState<number | null>(null)

  const result = useMemo(() => computeCpmFromRows(committedRows), [committedRows])
  const positions = useMemo(() => {
    if (result.errors.length || result.activities.length === 0) {
      return { x: {}, y: {}, width: 400, height: 320 }
    }
    return layoutPositions(result)
  }, [result])

  const ok = result.errors.length === 0 && result.activities.length > 0
  const sigpiAoA = useMemo(() => (ok ? detectSigpiAoATopology(committedRows) : null), [ok, committedRows])
  const showClassicAoA = ok && !sigpiAoA && matchesClassicAoA8Pattern(committedRows)
  const showAoA = ok && (sigpiAoA != null || showClassicAoA)
  const dirty = useMemo(() => JSON.stringify(rows) !== JSON.stringify(committedRows), [rows, committedRows])

  const ganttDerived = useMemo(() => {
    if (!ok) return null
    return ganttFromCpmResult(result, committedRows, ganttPhase)
  }, [ok, result, committedRows, ganttPhase])

  const displayGanttTasks = ok ? (ganttDerived?.tasks ?? ganttTasks) : ganttTasks
  const displayGanttWeeks = ok ? projectWeekCount(result) : ganttWeeks

  const persist = (
    pertRows: Row[],
    patch?: { ganttTasks?: GanttTask[]; ganttWeeks?: number },
  ) => {
    onPersist?.({ pertRows: cloneRows(pertRows), ...patch })
  }

  const syncGanttFromCpm = (pertRows: Row[], phase: string) => {
    const r = computeCpmFromRows(pertRows)
    if (r.errors.length) return undefined
    const { tasks, totalWeeks } = ganttFromCpmResult(r, pertRows, phase)
    return { ganttTasks: tasks, ganttWeeks: totalWeeks }
  }

  const applyTable = () => {
    const next = cloneRows(rows)
    setCommittedRows(next)
    const g = syncGanttFromCpm(next, ganttPhase)
    persist(next, g)
  }

  const loadSigpiTemplate = (t: SigpiPertTemplate) => {
    const c = cloneRows(t.rows())
    setGanttPhase(t.ganttPhase)
    setRows(c)
    setCommittedRows(c)
    setActiveTemplateId(t.id)
    const g = syncGanttFromCpm(c, t.ganttPhase)
    persist(c, g)
  }

  const loadExample = (next: Row[]) => {
    const c = cloneRows(next)
    setGanttPhase("Ejemplo PERT")
    setRows(c)
    setCommittedRows(c)
    setActiveTemplateId(null)
    const g = syncGanttFromCpm(c, "Ejemplo PERT")
    persist(c, g)
  }

  return (
    <section>
      <div
        style={{
          marginBottom: 14,
          padding: "12px 14px",
          background: "#eff6ff",
          border: "1px solid #93c5fd",
          borderRadius: 8,
          fontSize: 12,
          lineHeight: 1.5,
        }}
      >
        <strong>AoA (círculos = eventos, flechas = actividades A, B, C…):</strong> un evento de inicio, actividades
        ficticias punteadas donde hay varias predecessoras. Códigos en letras; el EDT (1.1, 2.1…) va en el nombre.{" "}
        <HelpButton topicId="pert-entregables" />
      </div>

      <p
        style={{
          margin: "0 0 8px",
          fontSize: 12,
          color: "#64748b",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span>a, m, b → Te, σ² y red. Pulse ACTUALIZAR tras editar.</span>
        <HelpButton topicId="pert-overview" />
      </p>

      <div style={{ marginBottom: 6 }}>
        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>SIGPI — cronograma por entregable</div>
        {SIGPI_CRONOGRAMA_TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            title={t.description}
            style={
              activeTemplateId === t.id
                ? { ...btnPrimary, marginTop: 6 }
                : t.id === "e1" || t.id === "e2" || t.id === "e3" || t.id === "e4"
                  ? { ...btnEntregable, marginTop: 6 }
                  : { ...btn, marginTop: 6 }
            }
            onClick={() => loadSigpiTemplate(t)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 600, marginRight: 8 }}>Ejemplos curso:</span>
        <button type="button" style={btn} onClick={() => loadExample(sigpiValleDelSolRows())}>
          SIGPI fases (A1–B6)
        </button>
        <button type="button" style={btn} onClick={() => loadExample(exampleClassicAHRows())}>
          A–H
        </button>
        <button type="button" style={btn} onClick={() => loadExample(exampleGpy5101Rows())}>
          GPY5101
        </button>
        <button type="button" style={btn} onClick={() => loadExample(examplePizzaRows())}>
          Pizza
        </button>
        <button type="button" style={btn} onClick={() => loadExample(exampleSoftwareRows())}>
          Software
        </button>
        <button type="button" style={btn} onClick={() => loadExample(exampleLinearRows())}>
          Lineal
        </button>
        <button type="button" style={btn} onClick={() => loadExample(exampleParallelRows())}>
          Paralelo
        </button>
      </div>

      <ActivityTable rows={rows} onChange={setRows} />

      <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
        <button type="button" style={btnPrimary} onClick={applyTable}>
          ACTUALIZAR
        </button>
        {dirty ? (
          <span style={{ fontSize: 12, color: "#92400e" }}>Cambios sin aplicar al diagrama.</span>
        ) : (
          <span style={{ fontSize: 12, color: "#525252" }}>Red actualizada.</span>
        )}
      </div>

      <div style={{ marginTop: 16, padding: 12, background: "#fafafa", border: "1px solid #ddd" }}>
        <p style={{ margin: "0 0 8px", fontSize: 13 }}>
          <strong>μ (duración):</strong>{" "}
          {ok ? <span style={{ fontFamily: "monospace" }}>{result.projectEnd.toFixed(1)} sem</span> : "—"}
          {ok && result.criticalPath.length > 0 && (
            <>
              {" "}
              · Ruta crítica: <span style={{ fontFamily: "monospace" }}>{result.criticalPath.join(" → ")}</span>
            </>
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
          <PertStatsPanel result={result} onZComputed={setHighlightZ} />

          <SectionHeadingWithHelp
            topicId={showAoA ? "pert-aoa-8" : "pert-overview"}
            style={{ margin: "24px 0 8px" }}
          >
            {showAoA ? "Diagrama AoA (○ evento · → actividad · - - - ficticia)" : "Diagrama AoN"}
          </SectionHeadingWithHelp>
          {sigpiAoA ? (
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}>
                <HelpButton topicId="pert-aoa-8" variant="panel" label="Guía AoA" />
              </div>
              <AoADiagram result={result} topology={sigpiAoA} />
            </div>
          ) : showClassicAoA ? (
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}>
                <HelpButton topicId="pert-aoa-8" variant="panel" label="Guía AoA" />
              </div>
              <ClassicAoA8Diagram result={result} />
            </div>
          ) : (
            <PertDiagram result={result} positions={positions} />
          )}

          <ActivityQuadrants result={result} />

          <SectionHeadingWithHelp topicId="pert-gantt" style={{ margin: "28px 0 8px" }}>
            Cronograma (Gantt) — semanas según CPM (ES/EF)
          </SectionHeadingWithHelp>
          <GanttChart
            weeks={displayGanttWeeks}
            tasks={displayGanttTasks}
            title={projectTitle}
            unitLabel={ganttUnitLabel ?? "Semana"}
          />

          <SectionHeadingWithHelp topicId="pert-z-tabla" style={{ margin: "28px 0 8px" }}>
            Tabla de distribución normal
          </SectionHeadingWithHelp>
          <NormalDistributionTable highlightZ={highlightZ} />
        </>
      )}
    </section>
  )
}

import type { CSSProperties } from "react"
import {
  EVALUATION_CHECKLIST,
  PRE_PLANNING_STEPS,
  PROJECT_TRIANGLE,
  SDLC_12_STEPS,
  WBS_ARTIFACT_BLOCKS,
} from "./evaluationRoadmap"
import { card, colors, sectionLead, sectionTitle } from "./theme"
import type { ReportTabId } from "./types"

type Props = {
  onOpenTab: (tab: ReportTabId) => void
  onScrollToBlock?: (blockId: string) => void
}

const HIERARCHY = ["SISTEMA", "PROCESO", "SUBPROCESO", "ACTIVIDADES", "TAREAS", "PRODUCTOS"]

export function TabEvaluationRoadmap({ onOpenTab, onScrollToBlock }: Props) {
  return (
    <section>
      <h2 style={sectionTitle}>Ruta de evaluación del proyecto</h2>
      <p style={sectionLead}>
        Guía según tus apuntes Excalidraw: <strong>dónde colocar</strong> investigación, entrevistas, UML,
        prototipo, EDT, PERT y finanzas en esta plataforma. El informe SIGPI ya tiene 14 pasos; aquí se alinea con el
        flujo de 12 etapas y el triángulo tiempo–costo–alcance.
      </p>

      <HierarchyDiagram />

      <div style={{ ...card, marginBottom: 16 }}>
        <h3 style={h3}>Antes de planificar (investigación → propuesta)</h3>
        <p style={hint}>Coloque esto en el <strong>Documento central</strong> antes de EDT y PERT.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {PRE_PLANNING_STEPS.map((step, i) => (
            <div key={step.id} style={{ display: "flex", gap: 12, minHeight: 72 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 28 }}>
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: colors.navy,
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {i + 1}
                </div>
                {i < PRE_PLANNING_STEPS.length - 1 && (
                  <div style={{ width: 2, flex: 1, background: colors.border, margin: "4px 0" }} />
                )}
              </div>
              <div style={{ flex: 1, paddingBottom: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: colors.navy }}>{step.title}</div>
                <p style={{ margin: "4px 0 8px", fontSize: 12, lineHeight: 1.45 }}>{step.text}</p>
                <WhereLinks links={step.where} onOpenTab={onOpenTab} onScrollToBlock={onScrollToBlock} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <ProjectTriangleVisual onOpenTab={onOpenTab} />

      <div style={{ ...card, marginBottom: 16 }}>
        <h3 style={h3}>¿Dónde van UML, prototipo y entrevistas? (bloques EDT)</h3>
        <p style={hint}>
          No van en PERT ni en flujo de caja. Van en <strong>Análisis</strong> y <strong>Diseño</strong> del informe.
        </p>
        {WBS_ARTIFACT_BLOCKS.map((block) => (
          <div key={block.phase} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: colors.orange, marginBottom: 6 }}>{block.phase}</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <tbody>
                {block.items.map((item) => (
                  <tr key={item.name}>
                    <td style={tdLeft}>{item.name}</td>
                    <td style={tdRight}>{item.where}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <div style={{ ...card, marginBottom: 16, overflowX: "auto" }}>
        <h3 style={h3}>Flujo de gestión de proyectos — 12 pasos (SIGPI)</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, minWidth: 640 }}>
          <thead>
            <tr>
              <th style={th}>#</th>
              <th style={th}>Etapa</th>
              <th style={th}>SIGPI (ejemplo)</th>
              <th style={th}>Entregables</th>
              <th style={th}>Dónde en la plataforma</th>
            </tr>
          </thead>
          <tbody>
            {SDLC_12_STEPS.map((row) => (
              <tr key={row.n}>
                <td style={td}>{row.n}</td>
                <td style={{ ...td, fontWeight: 600 }}>{row.name}</td>
                <td style={td}>{row.sigpi}</td>
                <td style={td}>{row.deliverables.join(" · ")}</td>
                <td style={td}>
                  <WhereLinks links={row.where} onOpenTab={onOpenTab} onScrollToBlock={onScrollToBlock} compact />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ ...card, marginBottom: 16 }}>
        <h3 style={h3}>Checklist — ¿qué debe tener tu evaluación?</h3>
        <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
          {EVALUATION_CHECKLIST.map((c) => (
            <li key={c.item} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, fontSize: 12 }}>
              <span style={{ color: colors.muted }}>☐</span>
              <span style={{ flex: 1 }}>{c.item}</span>
              <TabChip tab={c.tab} onOpen={() => onOpenTab(c.tab)} />
            </li>
          ))}
        </ul>
      </div>

      <p style={{ fontSize: 11, color: colors.muted, marginTop: 8 }}>
        Más detalle teórico: pestañas <button type="button" style={linkBtn} onClick={() => onOpenTab("glosario")}>Glosario</button> y{" "}
        <button type="button" style={linkBtn} onClick={() => onOpenTab("glosario")}>Glosario e índice</button> (mapa del curso).
      </p>
    </section>
  )
}

function HierarchyDiagram() {
  return (
    <div style={{ ...card, marginBottom: 16, textAlign: "center", padding: "24px 16px" }}>
      <h3 style={{ ...h3, textAlign: "center" }}>Jerarquía del proyecto (de macro a micro)</h3>
      <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        {HIERARCHY.map((label, i) => {
          const w = 280 - i * 36
          return (
            <div
              key={label}
              style={{
                width: w,
                padding: "10px 16px",
                border: `2px solid ${colors.navy}`,
                borderRadius: 999,
                fontSize: 12 - i * 0.3,
                fontWeight: i === 0 ? 700 : 600,
                color: colors.navy,
                background: i < 2 ? colors.skyLight : colors.white,
              }}
            >
              {label}
            </div>
          )
        })}
      </div>
      <p style={{ ...hint, marginTop: 16, maxWidth: 520, margin: "16px auto 0" }}>
        La <strong>EDT</strong> descompone el SISTEMA en entregables; el <strong>PERT</strong> programa las ACTIVIDADES.
      </p>
    </div>
  )
}

function ProjectTriangleVisual({ onOpenTab }: { onOpenTab: (t: ReportTabId) => void }) {
  const { vertices, center, constraints } = PROJECT_TRIANGLE
  const cx = 200
  const cy = 130
  const r = 95

  const points = [
    { x: cx, y: cy - r, ...vertices[0]! },
    { x: cx - r * 0.87, y: cy + r * 0.5, ...vertices[1]! },
    { x: cx + r * 0.87, y: cy + r * 0.5, ...vertices[2]! },
  ]

  return (
    <div style={{ ...card, marginBottom: 16 }}>
      <h3 style={h3}>Triángulo del proyecto (+ restricciones)</h3>
      <p style={hint}>Si cambias tiempo, costo o alcance, afectas los otros. La calidad queda en el centro.</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start" }}>
        <svg viewBox="0 0 400 260" style={{ width: "100%", maxWidth: 400, height: "auto" }} role="img">
          <polygon
            points={points.map((p) => `${p.x},${p.y}`).join(" ")}
            fill={colors.skyLight}
            stroke={colors.navy}
            strokeWidth={2}
          />
          <text x={cx} y={cy + 6} textAnchor="middle" fontSize={13} fontWeight={700} fill={colors.navy}>
            {center}
          </text>
          {points.map((p) => (
            <g key={p.id}>
              <circle cx={p.x} cy={p.y} r={22} fill={colors.white} stroke={colors.navy} strokeWidth={2} />
              <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill={colors.navy}>
                {p.label}
              </text>
            </g>
          ))}
        </svg>
        <div style={{ flex: "1 1 200px", fontSize: 11 }}>
          <p style={{ margin: "0 0 8px", fontWeight: 600 }}>Clic → pestaña relacionada:</p>
          {vertices.map((v) => (
            <div key={v.id} style={{ marginBottom: 6 }}>
              <TabChip tab={v.tab} label={v.label} onOpen={() => onOpenTab(v.tab)} /> — {v.hint}
            </div>
          ))}
          <p style={{ margin: "16px 0 8px", fontWeight: 600, fontSize: 10, color: colors.muted }}>
            Diagrama extendido (6 factores):
          </p>
          {constraints.map((c) => (
            <div key={c.label} style={{ marginBottom: 4 }}>
              <TabChip tab={c.tab} label={c.label} onOpen={() => onOpenTab(c.tab)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function WhereLinks({
  links,
  onOpenTab,
  onScrollToBlock,
  compact,
}: {
  links: readonly { tab: ReportTabId; label: string; blockIds?: readonly string[]; note?: string }[]
  onOpenTab: (t: ReportTabId) => void
  onScrollToBlock?: (id: string) => void
  compact?: boolean
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
      {links.map((l) => (
        <span key={l.label} style={{ display: "inline-flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}>
          <TabChip tab={l.tab} label={l.label} onOpen={() => onOpenTab(l.tab)} />
          {l.blockIds?.map((bid) =>
            onScrollToBlock ? (
              <button key={bid} type="button" style={blockBtn} onClick={() => onScrollToBlock(bid)} title={bid}>
                §
              </button>
            ) : null,
          )}
          {l.note && <span style={{ fontSize: compact ? 10 : 11, color: colors.muted }}>({l.note})</span>}
        </span>
      ))}
    </div>
  )
}

function TabChip({ tab, label, onOpen }: { tab: ReportTabId; label?: string; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} style={chip}>
      {label ?? tab}
    </button>
  )
}

const h3: CSSProperties = { margin: "0 0 8px", fontSize: 14, fontWeight: 700, color: colors.navy }
const hint: CSSProperties = { margin: "0 0 12px", fontSize: 12, color: colors.muted, lineHeight: 1.45 }
const th: CSSProperties = {
  padding: "8px 10px",
  textAlign: "left",
  background: colors.surface,
  borderBottom: `2px solid ${colors.border}`,
  fontSize: 10,
  fontWeight: 700,
}
const td: CSSProperties = { padding: "8px 10px", borderBottom: `1px solid ${colors.border}`, verticalAlign: "top" }
const tdLeft: CSSProperties = { ...td, fontWeight: 600, width: "38%" }
const tdRight: CSSProperties = { ...td, color: colors.muted }
const chip: CSSProperties = {
  border: `1px solid ${colors.blue}`,
  background: colors.skyLight,
  color: colors.navy,
  padding: "3px 10px",
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 600,
  cursor: "pointer",
}
const blockBtn: CSSProperties = {
  border: `1px solid ${colors.border}`,
  background: colors.white,
  padding: "2px 6px",
  borderRadius: 4,
  fontSize: 10,
  cursor: "pointer",
  color: colors.muted,
}
const linkBtn: CSSProperties = {
  border: "none",
  background: "none",
  color: colors.blue,
  cursor: "pointer",
  textDecoration: "underline",
  fontSize: "inherit",
  padding: 0,
}

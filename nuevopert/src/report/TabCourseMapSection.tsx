import { useMemo, useState } from "react"
import type { CSSProperties } from "react"
import { EXCALIDRAW_INTRO, EXCALIDRAW_SECTIONS, type CourseMapSection } from "./excalidrawContent"
import { card, colors, sectionLead, sectionTitle } from "./theme"
import type { ReportTabId } from "./types"

const TAB_LABELS: Partial<Record<ReportTabId, string>> = {
  informe: "Documento",
  ruta: "Ruta evaluación",
  edt: "EDT",
  pert: "PERT / CPM",
  financiero: "Flujo de caja",
  matriz: "Matriz",
  glosario: "Glosario e índice",
}

type Props = {
  onOpenTab?: (tab: ReportTabId) => void
  /** Sin título duplicado cuando va dentro de TabReferenciaSection */
  embedded?: boolean
}

export function TabCourseMapSection({ onOpenTab, embedded }: Props) {
  const [openId, setOpenId] = useState<string>(EXCALIDRAW_SECTIONS[0]?.id ?? "")
  const [filter, setFilter] = useState("")

  const sections = useMemo(() => {
    const q = filter.trim().toLowerCase()
    if (!q) return EXCALIDRAW_SECTIONS
    return EXCALIDRAW_SECTIONS.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.bullets.some((b) => b.toLowerCase().includes(q)),
    )
  }, [filter])

  return (
    <section>
      {!embedded && (
        <>
          <h2 style={sectionTitle}>Mapa del curso (Excalidraw)</h2>
          <p style={sectionLead}>{EXCALIDRAW_INTRO}</p>
        </>
      )}
      {embedded && <p style={{ ...sectionLead, marginTop: 0 }}>{EXCALIDRAW_INTRO}</p>}

      <div style={{ ...card, marginBottom: 16 }}>
        <input
          type="search"
          placeholder="Buscar en apuntes (PERT, holgura, flujo de caja, licitación…)"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            border: `1px solid ${colors.border}`,
            borderRadius: 8,
            fontSize: 13,
          }}
        />
        <p style={{ margin: "10px 0 0", fontSize: 11, color: colors.muted }}>
          {sections.length} sección{sections.length === 1 ? "" : "es"} · Fuente: excalidraw.md
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {sections.map((sec) => (
          <SectionCard
            key={sec.id}
            section={sec}
            open={openId === sec.id}
            onToggle={() => setOpenId((id) => (id === sec.id ? "" : sec.id))}
            onOpenTab={onOpenTab}
          />
        ))}
        {sections.length === 0 && (
          <p style={{ color: colors.muted, fontSize: 13 }}>Sin resultados para «{filter}».</p>
        )}
      </div>
    </section>
  )
}

function SectionCard({
  section,
  open,
  onToggle,
  onOpenTab,
}: {
  section: CourseMapSection
  open: boolean
  onToggle: () => void
  onOpenTab?: (tab: ReportTabId) => void
}) {
  return (
    <article style={{ ...card, padding: 0, overflow: "hidden" }}>
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
          border: "none",
          background: open ? colors.skyLight : colors.white,
          padding: "14px 18px",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: colors.navy }}>{section.title}</div>
          {section.subtitle && (
            <div style={{ fontSize: 11, color: colors.muted, marginTop: 2 }}>{section.subtitle}</div>
          )}
        </div>
        <span style={{ fontSize: 18, color: colors.muted, lineHeight: 1 }}>{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div style={{ padding: "0 18px 16px", borderTop: `1px solid ${colors.border}` }}>
          <p style={{ fontSize: 13, lineHeight: 1.55, color: colors.text, margin: "12px 0" }}>{section.summary}</p>

          <ul style={{ margin: "0 0 12px", paddingLeft: 18, fontSize: 12, lineHeight: 1.5 }}>
            {section.bullets.map((b) => (
              <li key={b.slice(0, 40)} style={{ marginBottom: 6 }}>
                {b}
              </li>
            ))}
          </ul>

          {section.formulas && section.formulas.length > 0 && (
            <>
              <h4 style={h4}>Fórmulas</h4>
              <ul style={{ ...listMono }}>
                {section.formulas.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </>
          )}

          {section.examples && section.examples.length > 0 && (
            <>
              <h4 style={h4}>Ejemplos</h4>
              <ul style={list}>
                {section.examples.map((ex) => (
                  <li key={ex.slice(0, 40)}>{ex}</li>
                ))}
              </ul>
            </>
          )}

          {section.table && (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, marginBottom: 12 }}>
              <thead>
                <tr>
                  {section.table.cols.map((c) => (
                    <th key={c} style={th}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.table.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} style={td}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {section.relatedTab && onOpenTab && (
            <button
              type="button"
              onClick={() => onOpenTab(section.relatedTab!)}
              style={{
                border: `1px solid ${colors.blue}`,
                background: colors.skyLight,
                color: colors.navy,
                padding: "8px 14px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Ir a {TAB_LABELS[section.relatedTab] ?? section.relatedTab}
            </button>
          )}
        </div>
      )}
    </article>
  )
}

const h4: CSSProperties = { margin: "12px 0 6px", fontSize: 11, fontWeight: 700, color: colors.navy, textTransform: "uppercase" }
const list: CSSProperties = { margin: 0, paddingLeft: 18, fontSize: 12, lineHeight: 1.45 }
const listMono: CSSProperties = { ...list, fontFamily: "ui-monospace, monospace", color: colors.blue }
const th: CSSProperties = {
  padding: "6px 8px",
  borderBottom: `2px solid ${colors.border}`,
  textAlign: "left",
  background: colors.surface,
}
const td: CSSProperties = { padding: "6px 8px", borderBottom: `1px solid ${colors.border}` }

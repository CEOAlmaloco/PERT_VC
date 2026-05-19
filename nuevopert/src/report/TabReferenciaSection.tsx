import { useEffect } from "react"
import type { CSSProperties } from "react"
import { HelpGuideContent } from "./HelpGuide"
import { TabCourseMapSection } from "./TabCourseMapSection"
import { TabGlossarySection } from "./TabGlossarySection"
import { card, colors, sectionLead, sectionTitle } from "./theme"
import type { ReportTabId } from "./types"

export type ReferenciaView = "indice" | "mapa" | "glosario"

type Props = {
  view: ReferenciaView
  onViewChange: (view: ReferenciaView) => void
  onOpenTab?: (tab: ReportTabId) => void
}

const NAV: { id: ReferenciaView; label: string }[] = [
  { id: "indice", label: "Índice" },
  { id: "mapa", label: "Mapa del curso" },
  { id: "glosario", label: "Glosario y guía" },
]

export function TabReferenciaSection({ view, onViewChange, onOpenTab }: Props) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [view])

  return (
    <section>
      <h2 style={sectionTitle}>Referencia del curso</h2>
      <p style={sectionLead}>
        Índice único: apuntes visuales (Excalidraw), términos GPY1101 y guía de uso de la plataforma. El botón{" "}
        <strong>?</strong> en la barra superior abre directamente la guía.
      </p>

      <nav
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 20,
        }}
        aria-label="Secciones de referencia"
      >
        {NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onViewChange(item.id)}
            style={pill(view === item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {view === "indice" && <Indice onSelect={onViewChange} onOpenTab={onOpenTab} />}
      {view === "mapa" && <TabCourseMapSection onOpenTab={onOpenTab} embedded />}
      {view === "glosario" && (
        <>
          <HelpGuideContent compact />
          <div style={{ height: 24 }} aria-hidden />
          <TabGlossarySection onOpenTab={onOpenTab} onOpenMapa={() => onViewChange("mapa")} />
        </>
      )}
    </section>
  )
}

function Indice({
  onSelect,
  onOpenTab,
}: {
  onSelect: (v: ReferenciaView) => void
  onOpenTab?: (tab: ReportTabId) => void
}) {
  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <IndexCard
          title="Mapa del curso"
          subtitle="Apuntes Excalidraw · GPY1101"
          body="Jerarquía del proyecto, AOA/CPM, ciclo de vida, licitación, flujo de caja. Cada tema enlaza a EDT, PERT o Financiero cuando aplica."
          accent={colors.blue}
          onClick={() => onSelect("mapa")}
        />
        <IndexCard
          title="Glosario y guía"
          subtitle="Términos A–G + tutorial de la app"
          body="Definiciones didácticas (VAN, holgura, PERT…) y pasos para usar Documento, EDT, PERT, flujo de caja y matriz."
          accent={colors.orange}
          onClick={() => onSelect("glosario")}
        />
      </div>

      {onOpenTab && (
        <div style={{ ...card, background: colors.surface }}>
          <h3 style={{ margin: "0 0 10px", fontSize: 13, color: colors.navy }}>Herramientas del informe</h3>
          <p style={{ margin: "0 0 10px", fontSize: 12, color: colors.muted, lineHeight: 1.5 }}>
            Desde aquí puede saltar a las pestañas de trabajo sin volver al menú principal.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {(
              [
                ["informe", "Documento central"],
                ["ruta", "Ruta evaluación"],
                ["edt", "EDT"],
                ["pert", "PERT / CPM"],
                ["financiero", "Flujo de caja"],
                ["matriz", "Matriz decisión"],
              ] as const
            ).map(([id, label]) => (
              <button key={id} type="button" onClick={() => onOpenTab(id)} style={toolBtn}>
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

function IndexCard({
  title,
  subtitle,
  body,
  accent,
  onClick,
}: {
  title: string
  subtitle: string
  body: string
  accent: string
  onClick: () => void
}) {
  return (
    <button type="button" onClick={onClick} style={indexCardBtn}>
      <div style={{ fontSize: 10, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {subtitle}
      </div>
      <div style={{ fontSize: 17, fontWeight: 700, color: colors.navy, margin: "6px 0 8px" }}>{title}</div>
      <p style={{ margin: 0, fontSize: 12, lineHeight: 1.55, color: colors.text, textAlign: "left" }}>{body}</p>
      <span style={{ marginTop: 12, fontSize: 12, fontWeight: 600, color: accent }}>Abrir →</span>
    </button>
  )
}

function pill(active: boolean): CSSProperties {
  return {
    border: `1px solid ${active ? colors.orange : colors.border}`,
    background: active ? colors.orangeLight : colors.white,
    color: active ? colors.navy : colors.muted,
    padding: "8px 14px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: active ? 700 : 500,
    cursor: "pointer",
  }
}

const indexCardBtn: CSSProperties = {
  ...card,
  display: "block",
  width: "100%",
  textAlign: "left",
  cursor: "pointer",
  border: `2px solid ${colors.border}`,
}

const toolBtn: CSSProperties = {
  border: `1px solid ${colors.border}`,
  background: colors.white,
  padding: "6px 12px",
  borderRadius: 8,
  fontSize: 11,
  cursor: "pointer",
  color: colors.navy,
}

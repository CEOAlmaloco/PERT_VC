import { useEffect, type CSSProperties } from "react"
import type { DocumentBlock, ReportData } from "./types"
import { processStepLabel } from "./processSteps"
import { StatCards } from "./StatCards"
import { badge, card, colors } from "./theme"

type Props = {
  data: ReportData
  onBlockChange: (id: string, content: string) => void
  onMetaChange: (
    patch: Partial<
      Pick<
        ReportData,
        | "projectSubtitle"
        | "closingQuote"
        | "documentHeroOrg"
        | "documentHeroSystem"
        | "documentHeroBadge"
      >
    >,
  ) => void
  scrollToBlockId?: string | null
  onScrollToBlockDone?: () => void
}

const heroInput: CSSProperties = {
  width: "100%",
  border: "none",
  background: "transparent",
  color: "#fff",
  fontFamily: "inherit",
  textAlign: "center",
}

export function CentralDocument({
  data,
  onBlockChange,
  onMetaChange,
  scrollToBlockId,
  onScrollToBlockDone,
}: Props) {
  const blocks = data.documentBlocks
  let lastPart: DocumentBlock["part"] | undefined

  useEffect(() => {
    if (!scrollToBlockId) return
    const el = document.getElementById(scrollToBlockId)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
      onScrollToBlockDone?.()
    }
  }, [scrollToBlockId, onScrollToBlockDone])

  return (
    <article style={{ maxWidth: 920 }}>
      <section
        style={{
          background: `linear-gradient(160deg, ${colors.navy} 0%, ${colors.blue} 50%, #1d4ed8 100%)`,
          color: "#fff",
          borderRadius: 16,
          padding: "36px 28px 32px",
          marginBottom: 28,
          textAlign: "center",
          boxShadow: "0 12px 40px rgba(15, 39, 68, 0.25)",
        }}
      >
        <input
          value={data.documentHeroOrg}
          onChange={(e) => onMetaChange({ documentHeroOrg: e.target.value })}
          style={{
            ...heroInput,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            opacity: 0.95,
          }}
        />
        <input
          value={data.documentHeroSystem}
          onChange={(e) => onMetaChange({ documentHeroSystem: e.target.value })}
          style={{
            ...heroInput,
            fontSize: 22,
            fontWeight: 800,
            marginTop: 12,
            lineHeight: 1.25,
            letterSpacing: "-0.02em",
          }}
        />
        <p style={{ margin: "16px 0 8px", fontSize: 15, fontWeight: 700, opacity: 0.95 }}>
          DOCUMENTO CENTRAL INTEGRAL
        </p>
        <input
          value={data.documentHeroBadge}
          onChange={(e) => onMetaChange({ documentHeroBadge: e.target.value })}
          style={{
            ...heroInput,
            fontSize: 12,
            opacity: 0.88,
            marginTop: 4,
          }}
        />
        <p style={{ margin: "20px 0 0", fontSize: 11, opacity: 0.75 }}>
          {data.courseCode} · {data.team} · {data.documentDate}
        </p>
      </section>

      <p style={{ fontSize: 13, color: colors.muted, lineHeight: 1.55, marginBottom: 20 }}>
        Siga el informe en orden: cada bloque corresponde a una etapa del proceso de evaluación de un
        proyecto de software. Los títulos de etapa son fijos; el contenido es editable.
      </p>

      <StatCards stats={data.kpiStats} title="Indicadores de referencia (diagnóstico)" />

      <div style={{ marginTop: 32 }}>
        {blocks.map((block) => {
          const showPart = block.part && block.part !== lastPart
          if (block.part) lastPart = block.part
          const lines = block.content.split("\n").length
          const rows = Math.max(5, Math.min(22, lines + 2))

          return (
            <section key={block.id} id={block.id} style={{ marginBottom: 40, scrollMarginTop: 88 }}>
              {showPart && block.part && (
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: colors.white,
                    background: `linear-gradient(90deg, ${colors.navy}, ${colors.blue})`,
                    marginBottom: 20,
                    padding: "12px 18px",
                    borderRadius: 8,
                    boxShadow: "0 2px 8px rgba(15,39,68,0.15)",
                  }}
                >
                  {processStepLabel(block.part)}
                </div>
              )}

              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: colors.navy, flex: 1 }}>
                  {block.title}
                </h2>
                <span style={{ ...badge("#e2e8f0", colors.muted), fontSize: 9, flexShrink: 0 }}>título fijo</span>
              </div>

              <div
                style={{
                  ...card,
                  padding: "12px 16px",
                  marginBottom: 12,
                  background: "#f0f9ff",
                  borderColor: "#bae6fd",
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 700, color: colors.blue, marginBottom: 4 }}>
                  ¿Qué debe ir aquí? (guía — no editable)
                </div>
                <p style={{ margin: 0, fontSize: 12, color: colors.text, lineHeight: 1.55 }}>{block.hint}</p>
              </div>

              <label style={{ fontSize: 10, fontWeight: 600, color: colors.muted, display: "block", marginBottom: 6 }}>
                Contenido editable
              </label>
              <textarea
                value={block.content}
                onChange={(e) => onBlockChange(block.id, e.target.value)}
                rows={rows}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  fontSize: 14,
                  lineHeight: 1.6,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 10,
                  fontFamily: "inherit",
                  resize: "vertical",
                  minHeight: 110,
                  color: colors.text,
                }}
              />
            </section>
          )
        })}
      </div>

      <footer style={{ ...card, marginTop: 48, background: colors.surface }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: colors.muted }}>Cita de cierre</label>
        <textarea
          value={data.closingQuote}
          onChange={(e) => onMetaChange({ closingQuote: e.target.value })}
          rows={2}
          style={{
            width: "100%",
            marginTop: 8,
            border: `1px solid ${colors.border}`,
            borderRadius: 8,
            padding: 10,
            fontSize: 14,
            fontStyle: "italic",
            fontFamily: "inherit",
          }}
        />
      </footer>
    </article>
  )
}

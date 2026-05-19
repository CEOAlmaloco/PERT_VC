import { useCallback, useEffect, useState, type CSSProperties, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { getHelpTopic, type HelpBlock, type HelpTopic } from "./contextHelpData"
import { colors } from "./theme"

function renderBlock(block: HelpBlock, key: number) {
  switch (block.type) {
    case "simple":
      return (
        <div key={key} style={simpleBox}>
          <div style={simpleLabel}>En simple</div>
          {block.text}
        </div>
      )
    case "h3":
      return (
        <h4 key={key} style={h4}>
          {block.text}
        </h4>
      )
    case "p":
      return (
        <p key={key} style={p}>
          {block.text}
        </p>
      )
    case "ul":
      return (
        <ul key={key} style={list}>
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )
    case "ol":
      return (
        <ol key={key} style={list}>
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      )
    case "formula":
      return (
        <div key={key} style={formula}>
          {block.text}
        </div>
      )
    case "code":
      return (
        <pre key={key} style={code}>
          {block.text}
        </pre>
      )
    case "img":
      return (
        <figure key={key} style={{ margin: "12px 0" }}>
          <img
            src={block.src}
            alt={block.alt}
            style={{
              width: "100%",
              maxWidth: 520,
              borderRadius: 8,
              border: `1px solid ${colors.border}`,
              background: colors.surface,
            }}
            onError={(e) => {
              const t = e.currentTarget
              t.style.display = "none"
            }}
          />
          {block.caption && <figcaption style={caption}>{block.caption}</figcaption>}
        </figure>
      )
    case "callout":
      return (
        <div key={key} style={callout}>
          {block.text}
        </div>
      )
    default:
      return null
  }
}

export function HelpContent({ topic }: { topic: HelpTopic }) {
  return (
    <article>
      {topic.subtitle && <p style={{ ...p, fontStyle: "italic", marginTop: 0 }}>{topic.subtitle}</p>}
      {topic.blocks.map((b, i) => renderBlock(b, i))}
    </article>
  )
}

type ModalProps = {
  topic: HelpTopic
  onClose: () => void
}

export function HelpModal({ topic, onClose }: ModalProps) {
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
      style={overlay}
      onClick={onClose}
    >
      <div style={panel} onClick={(e) => e.stopPropagation()}>
        <header style={header}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 id="help-modal-title" style={title}>
              {topic.title}
            </h2>
            <p style={{ margin: 0, fontSize: 11, color: colors.muted }}>Ayuda contextual · GPY1101</p>
          </div>
          <button type="button" onClick={onClose} style={closeBtn} aria-label="Cerrar ayuda">
            ×
          </button>
        </header>
        <div style={body}>
          <HelpContent topic={topic} />
        </div>
      </div>
    </div>,
    document.body,
  )
}

type HelpButtonProps = {
  topicId: string
  /** compacto junto a etiquetas; panel = tarjeta para esquina de diagramas */
  variant?: "icon" | "panel"
  label?: string
}

export function HelpButton({ topicId, variant = "icon", label }: HelpButtonProps) {
  const [open, setOpen] = useState(false)
  const topic = getHelpTopic(topicId)
  const close = useCallback(() => setOpen(false), [])

  if (!topic) return null

  if (variant === "panel") {
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          style={panelTrigger}
          title={topic.title}
          aria-label={`Ayuda: ${topic.title}`}
        >
          <span style={{ fontSize: 16, fontWeight: 800, lineHeight: 1 }}>?</span>
          <span style={{ fontSize: 10, fontWeight: 600, marginTop: 2 }}>{label ?? "Guía"}</span>
        </button>
        {open && <HelpModal topic={topic} onClose={close} />}
      </>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={iconBtn}
        title={topic.title}
        aria-label={`Ayuda: ${topic.title}`}
      >
        ?
      </button>
      {open && <HelpModal topic={topic} onClose={close} />}
    </>
  )
}

/** Etiqueta + botón ? alineados */
export function LabelWithHelp({
  children,
  topicId,
  style,
}: {
  children: ReactNode
  topicId: string
  style?: CSSProperties
}) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, ...style }}>
      {children}
      <HelpButton topicId={topicId} />
    </span>
  )
}

/** Título de sección con ayuda */
export function SectionHeadingWithHelp({
  children,
  topicId,
  as = "h3",
  style,
}: {
  children: ReactNode
  topicId: string
  as?: "h2" | "h3"
  style?: CSSProperties
}) {
  const Tag = as
  return (
    <Tag
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        margin: "0 0 8px",
        fontSize: as === "h2" ? 18 : 15,
        fontWeight: 700,
        color: colors.navy,
        ...style,
      }}
    >
      <span style={{ flex: 1 }}>{children}</span>
      <HelpButton topicId={topicId} />
    </Tag>
  )
}

const overlay: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 10000,
  background: "rgba(15, 39, 68, 0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
}

const panel: CSSProperties = {
  background: colors.white,
  borderRadius: 12,
  maxWidth: 560,
  width: "100%",
  maxHeight: "min(88vh, 720px)",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
  border: `2px solid ${colors.navy}`,
}

const header: CSSProperties = {
  display: "flex",
  gap: 12,
  padding: "14px 18px",
  borderBottom: `1px solid ${colors.border}`,
  background: colors.skyLight,
}

const title: CSSProperties = { margin: 0, fontSize: 16, fontWeight: 700, color: colors.navy }

const closeBtn: CSSProperties = {
  border: "none",
  background: colors.white,
  width: 36,
  height: 36,
  borderRadius: 8,
  fontSize: 22,
  lineHeight: 1,
  cursor: "pointer",
  color: colors.muted,
  flexShrink: 0,
}

const body: CSSProperties = {
  padding: "16px 18px 20px",
  overflowY: "auto",
  fontSize: 13,
  lineHeight: 1.55,
  color: colors.text,
}

const h4: CSSProperties = { margin: "16px 0 6px", fontSize: 13, fontWeight: 700, color: colors.navy }
const p: CSSProperties = { margin: "0 0 10px" }
const list: CSSProperties = { margin: "0 0 10px", paddingLeft: 20 }
const formula: CSSProperties = {
  margin: "10px 0",
  padding: "10px 14px",
  background: colors.skyLight,
  borderRadius: 8,
  fontFamily: "ui-monospace, monospace",
  fontSize: 13,
  fontWeight: 600,
  color: colors.navy,
  border: `1px solid ${colors.border}`,
}
const code: CSSProperties = {
  margin: "8px 0 12px",
  padding: "10px 12px",
  background: "#f8fafc",
  borderRadius: 6,
  fontSize: 12,
  overflowX: "auto",
  border: `1px solid ${colors.border}`,
}
const caption: CSSProperties = { fontSize: 11, color: colors.muted, marginTop: 6, textAlign: "center" }
const callout: CSSProperties = {
  margin: "12px 0",
  padding: "10px 12px",
  background: colors.orangeLight,
  borderLeft: `4px solid ${colors.orange}`,
  borderRadius: "0 8px 8px 0",
  fontSize: 12,
}

const simpleBox: CSSProperties = {
  margin: "0 0 16px",
  padding: "14px 16px",
  background: "#ecfdf5",
  border: `2px solid #10b981`,
  borderRadius: 10,
  fontSize: 14,
  lineHeight: 1.55,
  color: "#064e3b",
  fontWeight: 500,
}

const simpleLabel: CSSProperties = {
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#047857",
  marginBottom: 8,
}

const iconBtn: CSSProperties = {
  width: 20,
  height: 20,
  minWidth: 20,
  padding: 0,
  borderRadius: "50%",
  border: `1.5px solid ${colors.blue}`,
  background: colors.skyLight,
  color: colors.navy,
  fontSize: 12,
  fontWeight: 800,
  lineHeight: 1,
  cursor: "pointer",
  flexShrink: 0,
}

const panelTrigger: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: 52,
  height: 52,
  padding: 4,
  borderRadius: 10,
  border: `2px solid ${colors.navy}`,
  background: colors.white,
  color: colors.navy,
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
}

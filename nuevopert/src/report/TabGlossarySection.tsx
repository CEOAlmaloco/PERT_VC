import { useMemo, useState } from "react"
import type { CSSProperties } from "react"
import {
  GLOSSARY_MAPA_6,
  GLOSSARY_SECTIONS,
  searchGlossary,
  type GlossaryEntry,
} from "./glossaryData"
import { card, colors, sectionLead, sectionTitle } from "./theme"
import type { ReportTabId } from "./types"

const entryCard: CSSProperties = {
  border: `1px solid ${colors.border}`,
  borderRadius: 10,
  padding: "14px 16px",
  marginBottom: 10,
  background: colors.white,
}

type Props = {
  initialSection?: string
  onOpenTab?: (tab: ReportTabId) => void
  onOpenMapa?: () => void
}

export function TabGlossarySection({ initialSection, onOpenTab, onOpenMapa }: Props) {
  const [query, setQuery] = useState("")
  const [section, setSection] = useState<string>(initialSection ?? "all")

  const filtered = useMemo(() => {
    let list = searchGlossary(query)
    if (section !== "all") list = list.filter((x) => x.sectionId === section)
    return list
  }, [query, section])

  return (
    <section>
      <h3 style={{ ...sectionTitle, fontSize: 16 }}>Glosario didáctico — Valle del Sol</h3>
      <p style={sectionLead}>
        GPY1101 · Cada término incluye definición, cómo recordarlo, ejemplo cotidiano, aplicación al caso SIGPI y por qué
        importa. Use el buscador o filtre por sección (A–G).
      </p>

      <div style={{ ...card, marginBottom: 16, background: colors.skyLight }}>
        <h3 style={{ margin: "0 0 8px", fontSize: 14, color: colors.navy }}>¿Cómo usar este glosario?</h3>
        <p style={{ margin: 0, fontSize: 12, lineHeight: 1.55, color: colors.text }}>
          Pensado para quien recién parte: no adivine siglas. Si se pierde, vuelva al mapa de las 6 preguntas del
          evaluador.
        </p>
        <pre
          style={{
            margin: "12px 0 0",
            fontSize: 11,
            lineHeight: 1.5,
            whiteSpace: "pre-wrap",
            fontFamily: "inherit",
            color: colors.navy,
          }}
        >
          {GLOSSARY_MAPA_6}
        </pre>
      </div>

      <div style={{ ...card, marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
        <input
          type="search"
          placeholder="Buscar término (VAN, depreciación, PERT…)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: "1 1 220px",
            padding: "10px 12px",
            border: `1px solid ${colors.border}`,
            borderRadius: 8,
            fontSize: 13,
          }}
        />
        <select
          value={section}
          onChange={(e) => setSection(e.target.value)}
          style={{
            padding: "10px 12px",
            border: `1px solid ${colors.border}`,
            borderRadius: 8,
            fontSize: 12,
            minWidth: 200,
          }}
        >
          <option value="all">Todas las secciones</option>
          {GLOSSARY_SECTIONS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.letter}. {s.title}
            </option>
          ))}
        </select>
        <span style={{ fontSize: 12, color: colors.muted }}>{filtered.length} términos</span>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: colors.navy, marginBottom: 8 }}>Índice de secciones</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {GLOSSARY_SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSection(s.id)}
              style={{
                border: `1px solid ${section === s.id ? colors.orange : colors.border}`,
                background: section === s.id ? colors.orangeLight : colors.white,
                padding: "6px 10px",
                borderRadius: 8,
                fontSize: 11,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <strong>{s.letter}.</strong> {s.title}
              <div style={{ fontSize: 10, color: colors.muted, marginTop: 2 }}>{s.question}</div>
            </button>
          ))}
        </div>
      </div>

      {onOpenTab && (
        <p style={{ fontSize: 12, color: colors.muted, marginBottom: 12 }}>
          Ir a herramientas:{" "}
          {(
            [
              ["financiero", "Flujo de caja"],
              ["pert", "PERT / CPM"],
              ["edt", "EDT"],
              ["matriz", "Matriz"],
              ["informe", "Documento"],
            ] as const
          ).map(([id, label], i) => (
            <span key={id}>
              {i > 0 && " · "}
              <button
                type="button"
                onClick={() => onOpenTab(id)}
                style={{
                  border: "none",
                  background: "none",
                  color: colors.blue,
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontSize: 12,
                }}
              >
                {label}
              </button>
            </span>
          ))}
          {onOpenMapa && (
            <>
              {" · "}
              <button
                type="button"
                onClick={onOpenMapa}
                style={{
                  border: "none",
                  background: "none",
                  color: colors.blue,
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontSize: 12,
                }}
              >
                Mapa del curso
              </button>
            </>
          )}
        </p>
      )}

      <div>
        {filtered.map((entry) => (
          <GlossaryEntryCard key={entry.id} entry={entry} />
        ))}
        {filtered.length === 0 && (
          <p style={{ color: colors.muted, fontSize: 13 }}>No hay términos con ese criterio.</p>
        )}
      </div>
    </section>
  )
}

function GlossaryEntryCard({ entry }: { entry: GlossaryEntry }) {
  const sec = GLOSSARY_SECTIONS.find((s) => s.id === entry.sectionId)
  return (
    <article style={entryCard}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
        <h4 style={{ margin: 0, fontSize: 15, color: colors.navy }}>{entry.term}</h4>
        {sec && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: colors.blue,
              background: colors.skyLight,
              padding: "2px 8px",
              borderRadius: 999,
            }}
          >
            {sec.letter}. {sec.title}
          </span>
        )}
      </div>
      <Field label="Definición" text={entry.definition} />
      {entry.formula && <Field label="Fórmula" text={entry.formula} mono />}
      {entry.mnemonic && <Field label="Cómo recordarlo" text={entry.mnemonic} />}
      {entry.example && <Field label="Ejemplo cotidiano" text={entry.example} />}
      {entry.caseValle && <Field label="En Valle del Sol" text={entry.caseValle} accent />}
      {entry.why && <Field label="Por qué importa" text={entry.why} />}
    </article>
  )
}

function Field({
  label,
  text,
  mono,
  accent,
}: {
  label: string
  text: string
  mono?: boolean
  accent?: boolean
}) {
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: colors.muted, textTransform: "uppercase" }}>
        {label}
      </div>
      <p
        style={{
          margin: "4px 0 0",
          fontSize: 12,
          lineHeight: 1.5,
          color: accent ? colors.navy : colors.text,
          fontFamily: mono ? "ui-monospace, monospace" : "inherit",
        }}
      >
        {text}
      </p>
    </div>
  )
}

import { useState } from "react"
import type { CSSProperties } from "react"
import { HelpButton } from "./ContextHelp"
import { GLOSSARY_TO_HELP } from "./contextHelpData"
import { entriesForSection, FINANCE_FORMULAS } from "./glossaryData"
import { card, colors } from "./theme"

type Props = {
  onOpenFullGlossary?: () => void
}

export function FinanceGlossaryPanel({ onOpenFullGlossary }: Props) {
  const [open, setOpen] = useState(true)
  const terms = entriesForSection("d")

  return (
    <div style={{ ...card, marginBottom: 16 }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          padding: 0,
          fontSize: 14,
          fontWeight: 700,
          color: colors.navy,
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          Glosario financiero y fórmulas (sección D)
          <HelpButton topicId="finance-overview" />
        </span>
        <span style={{ fontSize: 18, lineHeight: 1 }}>{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div style={{ marginTop: 14 }}>
          <p style={{ fontSize: 12, color: colors.muted, margin: "0 0 12px", lineHeight: 1.5 }}>
            Referencia rápida mientras editas el flujo de caja. Depreciación y amortización son GND: afectan el
            resultado pero se repiten en el ajuste de caja.
          </p>

          <h4 style={sub}>Fórmulas del proyecto</h4>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16, fontSize: 11 }}>
            <tbody>
              {FINANCE_FORMULAS.map((row) => (
                <tr key={row.label}>
                  <td style={cellLabel}>{row.label}</td>
                  <td style={cellFormula}>{row.formula}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4 style={sub}>Términos clave ({terms.length})</h4>
          <div style={{ maxHeight: 280, overflowY: "auto", paddingRight: 4 }}>
            {terms.map((t) => (
              <details key={t.id} style={detail}>
                <summary style={summary}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    {t.term}
                    {GLOSSARY_TO_HELP[t.id] ? <HelpButton topicId={GLOSSARY_TO_HELP[t.id]!} /> : null}
                  </span>
                </summary>
                <p style={{ margin: "6px 0 0", fontSize: 11, lineHeight: 1.45 }}>{t.definition}</p>
                {t.formula && (
                  <p style={{ margin: "4px 0 0", fontSize: 11, fontFamily: "ui-monospace, monospace", color: colors.blue }}>
                    {t.formula}
                  </p>
                )}
                {t.caseValle && (
                  <p style={{ margin: "4px 0 0", fontSize: 11, color: colors.navy }}>
                    <strong>Valle del Sol:</strong> {t.caseValle}
                  </p>
                )}
              </details>
            ))}
          </div>

          {onOpenFullGlossary && (
            <button
              type="button"
              onClick={onOpenFullGlossary}
              style={{
                marginTop: 12,
                border: `1px solid ${colors.blue}`,
                background: colors.skyLight,
                color: colors.navy,
                padding: "8px 14px",
                borderRadius: 8,
                fontSize: 12,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Abrir glosario completo (A–G)
            </button>
          )}
        </div>
      )}
    </div>
  )
}

const sub: CSSProperties = { margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: colors.navy }
const cellLabel: CSSProperties = {
  padding: "6px 8px",
  borderBottom: `1px solid ${colors.border}`,
  fontWeight: 600,
  width: "38%",
  verticalAlign: "top",
}
const cellFormula: CSSProperties = {
  padding: "6px 8px",
  borderBottom: `1px solid ${colors.border}`,
  fontFamily: "ui-monospace, monospace",
  color: colors.text,
}
const detail: CSSProperties = {
  borderBottom: `1px solid ${colors.border}`,
  padding: "8px 0",
}
const summary: CSSProperties = { cursor: "pointer", fontSize: 12, fontWeight: 600, color: colors.navy }

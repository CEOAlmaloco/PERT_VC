import type { SigpiModule } from "./types"
import { badge, card, colors } from "./theme"

type Props = { modules: SigpiModule[]; flowAsIs?: string; flowToBe?: string }

const CODE_COLOR: Record<string, string> = {
  C: "#ea580c",
  A: "#1e4d8c",
  B: "#059669",
}

export function ModuleCards({ modules, flowAsIs, flowToBe }: Props) {
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {modules.map((m) => (
          <article
            key={m.code}
            style={{
              ...card,
              borderTop: `5px solid ${CODE_COLOR[m.code] ?? colors.blue}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: CODE_COLOR[m.code] ?? colors.blue,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 16,
                }}
              >
                {m.code}
              </span>
              <div>
                <div style={badge(CODE_COLOR[m.code] ?? colors.blue)}>Módulo {m.code}</div>
                <h4 style={{ margin: "6px 0 0", fontSize: 14, color: colors.navy }}>{m.name}</h4>
              </div>
            </div>
            <p style={{ fontSize: 12, color: colors.muted, margin: "0 0 10px", lineHeight: 1.5 }}>{m.summary}</p>
            <div style={{ fontSize: 11, color: colors.text }}>
              <strong>Plazo ref.:</strong> {m.duration} · <strong>Complejidad:</strong> {m.complexity}
            </div>
          </article>
        ))}
      </div>

      {(flowAsIs || flowToBe) && (
        <div style={{ display: "grid", gap: 14, gridTemplateColumns: "1fr 1fr" }}>
          {flowAsIs && (
            <div style={{ ...card, background: "#fef2f2", borderColor: "#fecaca" }}>
              <h4 style={{ margin: "0 0 8px", fontSize: 13, color: colors.danger }}>AS-IS (hoy)</h4>
              <p style={{ margin: 0, fontSize: 12, lineHeight: 1.55, color: colors.text }}>{flowAsIs}</p>
            </div>
          )}
          {flowToBe && (
            <div style={{ ...card, background: "#ecfdf5", borderColor: "#a7f3d0" }}>
              <h4 style={{ margin: "0 0 8px", fontSize: 13, color: colors.success }}>TO-BE (SIGPI)</h4>
              <p style={{ margin: 0, fontSize: 12, lineHeight: 1.55, color: colors.text }}>{flowToBe}</p>
            </div>
          )}
        </div>
      )}

      <p style={{ marginTop: 16, fontSize: 12, color: colors.muted, fontStyle: "italic" }}>
        A, B y C son partes de un mismo sistema integrado — no tres compras distintas. Fase 1: C + A · Fase 2: B.
      </p>
    </div>
  )
}

import type { ReportData } from "./types"
import { StatCards } from "./StatCards"
import { badge, card, colors } from "./theme"

type Props = {
  data: ReportData
  onFichaChange: (index: number, value: string) => void
}

export function CoverPanel({ data, onFichaChange }: Props) {
  return (
    <div>
      <section
        style={{
          background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.blue} 55%, #2563eb 100%)`,
          color: "#fff",
          borderRadius: 16,
          padding: "32px 28px",
          marginBottom: 24,
          boxShadow: "0 8px 32px rgba(15, 39, 68, 0.2)",
        }}
      >
        <div style={badge("rgba(255,255,255,0.2)")}>{data.courseCode} · {data.courseName}</div>
        <h1 style={{ margin: "14px 0 8px", fontSize: 26, fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.03em" }}>
          {data.projectTitle}
        </h1>
        <p style={{ margin: "0 0 20px", fontSize: 15, opacity: 0.92, maxWidth: 640 }}>{data.projectSubtitle}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px", fontSize: 12, opacity: 0.9 }}>
          <span>{data.organization}</span>
          <span>·</span>
          <span>{data.documentDate}</span>
          <span>·</span>
          <span>{data.documentVersion}</span>
        </div>
      </section>

      <p
        style={{
          ...card,
          background: colors.orangeLight,
          borderColor: "#fed7aa",
          fontSize: 13,
          lineHeight: 1.55,
          color: colors.text,
          marginBottom: 24,
        }}
      >
        <strong style={{ color: colors.orange }}>Problema de fondo:</strong> el problema no es el incendio — es llegar
        tarde a la información del incendio. SIGPI centraliza reporte, mapa operativo y coordinación con trazabilidad
        legal.
      </p>

      <StatCards stats={data.kpiStats} title="Indicadores críticos del caso" />

      <div style={{ ...card, marginTop: 24 }}>
        <h3 style={{ margin: "0 0 14px", fontSize: 15, color: colors.navy }}>Ficha del informe</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <tbody>
            {data.ficha.map((row, i) => (
              <tr key={row.label}>
                <td
                  style={{
                    width: "32%",
                    padding: "10px 12px",
                    background: colors.surface,
                    borderBottom: `1px solid ${colors.border}`,
                    fontWeight: 600,
                    color: colors.navy,
                    verticalAlign: "top",
                  }}
                >
                  {row.label}
                </td>
                <td style={{ padding: "4px", borderBottom: `1px solid ${colors.border}` }}>
                  <input
                    value={row.value}
                    onChange={(e) => onFichaChange(i, e.target.value)}
                    style={{
                      width: "100%",
                      border: "none",
                      padding: "8px 10px",
                      fontSize: 13,
                      fontFamily: "inherit",
                      background: "transparent",
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 14,
          marginTop: 20,
        }}
      >
        <div style={card}>
          <div style={{ fontSize: 11, fontWeight: 700, color: colors.muted, textTransform: "uppercase" }}>Equipo</div>
          <p style={{ margin: "6px 0 0", fontSize: 13 }}>{data.team}</p>
        </div>
        <div style={card}>
          <div style={{ fontSize: 11, fontWeight: 700, color: colors.muted, textTransform: "uppercase" }}>Docente</div>
          <p style={{ margin: "6px 0 0", fontSize: 13 }}>{data.teacher}</p>
        </div>
        <div style={card}>
          <div style={{ fontSize: 11, fontWeight: 700, color: colors.muted, textTransform: "uppercase" }}>Rol</div>
          <p style={{ margin: "6px 0 0", fontSize: 12, lineHeight: 1.45 }}>{data.teamRole}</p>
        </div>
      </div>

      <p
        style={{
          marginTop: 20,
          padding: "12px 16px",
          fontSize: 11,
          color: colors.muted,
          borderLeft: `3px solid ${colors.amber}`,
          background: colors.surface,
        }}
      >
        {data.roleNote}
      </p>

      <blockquote
        style={{
          margin: "24px 0 0",
          padding: "16px 20px",
          borderLeft: `4px solid ${colors.orange}`,
          background: colors.surface,
          fontSize: 14,
          fontStyle: "italic",
          color: colors.navy,
        }}
      >
        “{data.closingQuote}”
      </blockquote>
    </div>
  )
}

import type { KpiStat } from "./types"
import { card, colors } from "./theme"

type Props = { stats: KpiStat[]; title?: string }

export function StatCards({ stats, title }: Props) {
  return (
    <div>
      {title && (
        <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: colors.navy }}>{title}</h3>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 14,
        }}
      >
        {stats.map((s) => (
          <article
            key={s.id}
            style={{
              ...card,
              padding: "16px 18px",
              borderTop: `4px solid ${s.accent ?? colors.orange}`,
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 800, color: colors.navy, lineHeight: 1.1 }}>{s.value}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: colors.text, marginTop: 6 }}>{s.label}</div>
            {s.impact && (
              <p style={{ fontSize: 11, color: colors.muted, margin: "8px 0 0", lineHeight: 1.4 }}>{s.impact}</p>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}

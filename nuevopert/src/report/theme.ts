import type { CSSProperties } from "react"

export const colors = {
  navy: "#0f2744",
  blue: "#1e4d8c",
  sky: "#3b82f6",
  skyLight: "#dbeafe",
  orange: "#ea580c",
  orangeLight: "#ffedd5",
  amber: "#f59e0b",
  ganttBar: "#eab308",
  ganttPhase: "#bfdbfe",
  surface: "#f8fafc",
  border: "#e2e8f0",
  text: "#0f172a",
  muted: "#64748b",
  white: "#ffffff",
  success: "#059669",
  danger: "#dc2626",
}

export const card: CSSProperties = {
  background: colors.white,
  border: `1px solid ${colors.border}`,
  borderRadius: 12,
  padding: "20px 24px",
  boxShadow: "0 1px 3px rgba(15, 39, 68, 0.06)",
}

export const sectionTitle: CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  margin: "0 0 8px",
  color: colors.navy,
  letterSpacing: "-0.02em",
}

export const sectionLead: CSSProperties = {
  fontSize: 13,
  color: colors.muted,
  margin: "0 0 20px",
  lineHeight: 1.5,
}

export const badge = (bg: string, fg = colors.white): CSSProperties => ({
  display: "inline-block",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  padding: "4px 10px",
  borderRadius: 999,
  background: bg,
  color: fg,
})

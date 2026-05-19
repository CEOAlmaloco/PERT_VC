import type { CSSProperties } from "react"
import type { FormField } from "./types"
import { colors } from "./theme"

type Props = {
  fields: FormField[]
  values: Record<string, string>
  onChange: (id: string, value: string) => void
}

export function TwoColumnForm({ fields, values, onChange }: Props) {
  return (
    <div
      style={{
        border: `1px solid ${colors.border}`,
        borderRadius: 12,
        overflow: "hidden",
        maxWidth: 920,
        boxShadow: "0 1px 3px rgba(15, 39, 68, 0.05)",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <tbody>
          {fields.map((f, i) => (
            <tr key={f.id}>
              <td style={{ ...labelCell, background: i % 2 === 0 ? colors.surface : "#f1f5f9" }}>{f.label}</td>
              <td style={valueCell}>
                {f.multiline ? (
                  <textarea
                    style={ta}
                    value={values[f.id] ?? ""}
                    placeholder={f.placeholder}
                    rows={3}
                    onChange={(e) => onChange(f.id, e.target.value)}
                  />
                ) : (
                  <input
                    style={inp}
                    value={values[f.id] ?? ""}
                    placeholder={f.placeholder}
                    onChange={(e) => onChange(f.id, e.target.value)}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const labelCell: CSSProperties = {
  width: "34%",
  padding: "12px 14px",
  borderBottom: `1px solid ${colors.border}`,
  fontWeight: 600,
  fontSize: 12,
  verticalAlign: "top",
  color: colors.navy,
}

const valueCell: CSSProperties = {
  padding: 0,
  borderBottom: `1px solid ${colors.border}`,
  verticalAlign: "top",
  background: "#fff",
}

const inp: CSSProperties = {
  width: "100%",
  border: "none",
  padding: "12px 14px",
  fontSize: 13,
  fontFamily: "inherit",
  background: "transparent",
  color: colors.text,
}

const ta: CSSProperties = {
  ...inp,
  resize: "vertical",
  minHeight: 80,
  lineHeight: 1.5,
}

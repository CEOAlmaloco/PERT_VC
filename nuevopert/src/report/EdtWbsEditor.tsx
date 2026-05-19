import type { EdtNode } from "./types"
import { colors } from "./theme"

const DARK = "#1e4d8c"
const LIGHT = "#e8f4fc"
const LIGHT_BORDER = "#93c5fd"

type Props = {
  root: EdtNode
  onChange: (root: EdtNode) => void
}

export function EdtWbsEditor({ root, onChange }: Props) {
  const entregas = root.children ?? []

  const setRootLabel = (label: string) => onChange({ ...root, label })
  const setEntrega = (idx: number, node: EdtNode) => {
    const children = [...entregas]
    children[idx] = node
    onChange({ ...root, children })
  }

  return (
    <div
      style={{
        overflowX: "auto",
        padding: "24px 16px 32px",
        background: "#fff",
        border: `1px solid ${colors.border}`,
        borderRadius: 12,
      }}
    >
      <p style={{ margin: "0 0 20px", fontSize: 12, color: colors.muted, textAlign: "center" }}>
        EDT — Producto resultado → entregables → paquetes / actividades (editable)
      </p>

      {/* Raíz */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <WbsBox dark value={root.label} onChange={setRootLabel} width={Math.min(480, root.label.length * 7 + 40)} />
        <ConnectorDown h={28} />
        <div style={{ width: "80%", maxWidth: 720, height: 2, background: "#334155" }} />
        <ConnectorDown h={20} />

        {/* Tres entregas */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          {entregas.map((ent, ei) => (
            <EntregaColumn
              key={ent.id}
              entrega={ent}
              onChange={(n) => setEntrega(ei, n)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function EntregaColumn({ entrega, onChange }: { entrega: EdtNode; onChange: (n: EdtNode) => void }) {
  const items = entrega.children ?? []

  const setEntregaLabel = (label: string) => onChange({ ...entrega, label })
  const setItem = (ii: number, label: string) => {
    const children = items.map((c, i) => (i === ii ? { ...c, label } : c))
    onChange({ ...entrega, children })
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 200 }}>
      <ConnectorDown h={12} />
      <WbsBox dark value={entrega.label} onChange={setEntregaLabel} width={Math.min(220, entrega.label.length * 6 + 36)} />
      <div style={{ display: "flex", marginTop: 8, alignSelf: "stretch" }}>
        <div
          style={{
            width: 2,
            background: "#334155",
            marginLeft: 20,
            minHeight: items.length * 48,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, paddingLeft: 4 }}>
          {items.map((item, ii) => (
            <div key={item.id} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: 24, height: 2, background: "#334155", flexShrink: 0 }} />
              <WbsBox light value={item.label} onChange={(v) => setItem(ii, v)} width={180} small />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function WbsBox({
  dark,
  light: lightProp,
  value,
  onChange,
  width,
  small,
}: {
  dark?: boolean
  light?: boolean
  value: string
  onChange: (v: string) => void
  width: number
  small?: boolean
}) {
  const isDark = dark ?? !lightProp
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width,
        padding: small ? "6px 10px" : "8px 12px",
        fontSize: small ? 11 : 12,
        fontWeight: 600,
        textAlign: "center",
        border: isDark ? `2px solid ${DARK}` : `1px solid ${LIGHT_BORDER}`,
        borderRadius: 4,
        background: isDark ? DARK : LIGHT,
        color: isDark ? "#fff" : DARK,
        fontFamily: "inherit",
      }}
    />
  )
}

function ConnectorDown({ h }: { h: number }) {
  return <div style={{ width: 2, height: h, background: "#334155" }} />
}

import type { EdtNode } from "./types"

const KIND_COLOR: Record<EdtNode["kind"], string> = {
  producto: "#1e40af",
  entregable: "#2563eb",
  paquete: "#f59e0b",
  actividad: "#dc2626",
}

const KIND_LABEL: Record<EdtNode["kind"], string> = {
  producto: "Producto resultado",
  entregable: "Entregable",
  paquete: "Paquete de trabajo",
  actividad: "Actividad",
}

type Props = {
  root: EdtNode
  onLabelChange?: (id: string, label: string) => void
}

export function EdtDiagram({ root, onLabelChange }: Props) {
  const w = 920
  const h = layoutTree(root, 40, 80).height + 60

  return (
    <div style={{ overflowX: "auto", border: "1px solid #ccc", background: "#fff", borderRadius: 4 }}>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", maxWidth: w, height: "auto", minHeight: 280 }}>
        <text x={16} y={22} fontSize={12} fill="#555" fontWeight={600}>
          EDT — Estructura de desglose del trabajo (GPY1101 · SIGPI)
        </text>
        <TreeNode node={root} depth={0} xCenter={w / 2} y={48} onLabelChange={onLabelChange} />
      </svg>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, padding: "8px 12px 12px", fontSize: 11, color: "#555" }}>
        {(Object.keys(KIND_LABEL) as EdtNode["kind"][]).map((k) => (
          <span key={k}>
            <span style={{ display: "inline-block", width: 10, height: 10, background: KIND_COLOR[k], marginRight: 4 }} />
            {KIND_LABEL[k]}
          </span>
        ))}
      </div>
    </div>
  )
}

function TreeNode({
  node,
  depth,
  xCenter,
  y,
  onLabelChange,
}: {
  node: EdtNode
  depth: number
  xCenter: number
  y: number
  onLabelChange?: (id: string, label: string) => void
}) {
  const boxW = Math.min(200, Math.max(120, node.label.length * 7 + 24))
  const boxH = 36
  const color = KIND_COLOR[node.kind]
  const children = node.children ?? []
  const childY = y + 72
  const spacing = 220
  const totalW = children.length * spacing
  const startX = xCenter - totalW / 2 + spacing / 2

  return (
    <g>
      <rect
        x={xCenter - boxW / 2}
        y={y}
        width={boxW}
        height={boxH}
        rx={4}
        fill={color}
        stroke="#111"
        strokeWidth={1.2}
      />
      <text
        x={xCenter}
        y={y + boxH / 2 + 4}
        textAnchor="middle"
        fontSize={11}
        fontWeight={600}
        fill="#fff"
      >
        {truncate(node.label, 28)}
      </text>
      {children.map((ch, i) => {
        const cx = startX + i * spacing
        return (
          <g key={ch.id}>
            <line x1={xCenter} y1={y + boxH} x2={cx} y2={childY} stroke="#64748b" strokeWidth={1.2} />
            <TreeNode node={ch} depth={depth + 1} xCenter={cx} y={childY} onLabelChange={onLabelChange} />
          </g>
        )
      })}
    </g>
  )
}

function truncate(s: string, n: number) {
  return s.length <= n ? s : `${s.slice(0, n - 1)}…`
}

function layoutTree(node: EdtNode, y: number, gap: number): { height: number } {
  const children = node.children ?? []
  if (children.length === 0) return { height: y + 40 }
  let maxH = 0
  for (const c of children) {
    const sub = layoutTree(c, y + gap, gap)
    maxH = Math.max(maxH, sub.height)
  }
  return { height: maxH }
}

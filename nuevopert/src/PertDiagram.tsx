import type { CpmResult, DepEdge } from "./cpmEngine"

type Props = {
  result: CpmResult
  positions: { x: Record<string, number>; y: Record<string, number>; width: number; height: number }
}

const R = 28
const CRIT_STROKE = "#b91c1c"
const NORM_STROKE = "#1a1a1a"
const CRIT_FILL = "#b91c1c"
const NORM_FILL = "#1a1a1a"

function arrowPath(
  a: { x: number; y: number },
  b: { x: number; y: number },
  r = R,
): string {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  const x1 = a.x + ux * r
  const y1 = a.y + uy * r
  const x2 = b.x - ux * r
  const y2 = b.y - uy * r
  return `M ${x1} ${y1} L ${x2} ${y2}`
}

function mid(a: { x: number; y: number }, b: { x: number; y: number }) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

/** Etiqueta de flecha desplazada ligeramente para no tapar la línea (estilo diagrama en limpio). */
function labelOffset(
  a: { x: number; y: number },
  b: { x: number; y: number },
  dist: number,
): { x: number; y: number } {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  const nx = -dy / len
  const ny = dx / len
  const m = mid(a, b)
  return { x: m.x + nx * dist, y: m.y + ny * dist - 8 }
}

function isCriticalLink(result: CpmResult, e: DepEdge): boolean {
  const s = result.slack[e.from] ?? 0
  const t = result.slack[e.to] ?? 0
  const tight = Math.abs(result.es[e.to] - result.ef[e.from]) < 1e-6
  return Math.abs(s) < 1e-6 && Math.abs(t) < 1e-6 && tight
}

export function PertDiagram({ result, positions }: Props) {
  const { x, y, width, height } = positions
  const pad = 28
  const w = Math.max(440, width + pad * 2)
  const h = Math.max(380, height + pad * 2)

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label="Diagrama de red de actividades (AoN)"
      style={{
        width: "100%",
        maxWidth: w,
        height: "auto",
        border: "1px solid #d4d4d4",
        background: "#fff",
        borderRadius: 4,
      }}
    >
      <defs>
        <marker id="arrow-pert-norm" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto">
          <path d="M0,0 L9,4.5 L0,9 Z" fill={NORM_FILL} />
        </marker>
        <marker id="arrow-pert-crit" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto">
          <path d="M0,0 L9,4.5 L0,9 Z" fill={CRIT_FILL} />
        </marker>
      </defs>

      <text x={pad} y={24} fontSize={12} fill="#525252" fontFamily="system-ui, Segoe UI, Roboto, sans-serif">
        AoN · precedencia según tabla · <tspan fill={CRIT_STROKE} fontWeight={600}>rojo</tspan> = camino crítico
      </text>

      {result.edges.map((e, idx) => {
        const xa = (x[e.from] ?? 0) + pad
        const ya = (y[e.from] ?? 0) + pad
        const xb = (x[e.to] ?? 0) + pad
        const yb = (y[e.to] ?? 0) + pad
        const crit = isCriticalLink(result, e)
        const stroke = crit ? CRIT_STROKE : NORM_STROKE
        const d = arrowPath({ x: xa, y: ya }, { x: xb, y: yb })
        const lp = labelOffset({ x: xa, y: ya }, { x: xb, y: yb }, 14)
        return (
          <g key={`${e.from}-${e.to}-${idx}`}>
            <path
              d={d}
              fill="none"
              stroke={stroke}
              strokeWidth={crit ? 2.25 : 1.35}
              strokeLinecap="round"
              markerEnd={crit ? "url(#arrow-pert-crit)" : "url(#arrow-pert-norm)"}
            />
            <text
              x={lp.x}
              y={lp.y}
              textAnchor="middle"
              fontSize={10}
              fill={crit ? "#991b1b" : "#404040"}
              fontFamily="system-ui, Segoe UI, Roboto, sans-serif"
            >
              {e.from}→{e.to}
            </text>
          </g>
        )
      })}

      {result.activities.map((a) => {
        const cx = (x[a.code] ?? 0) + pad
        const cy = (y[a.code] ?? 0) + pad
        const slack = result.slack[a.code] ?? 0
        const crit = Math.abs(slack) < 1e-6
        const es = result.es[a.code] ?? 0
        const ef = result.ef[a.code] ?? 0
        return (
          <g key={a.code}>
            <circle
              cx={cx}
              cy={cy}
              r={R}
              fill="#fff"
              stroke={crit ? CRIT_STROKE : NORM_STROKE}
              strokeWidth={crit ? 2.5 : 2}
            />
            <text
              x={cx}
              y={cy + 5}
              textAnchor="middle"
              fontSize={16}
              fontWeight={700}
              fill="#111"
              fontFamily="system-ui, Segoe UI, Roboto, sans-serif"
            >
              {a.code}
            </text>
            <text
              x={cx}
              y={cy + 48}
              textAnchor="middle"
              fontSize={9}
              fill="#525252"
              fontFamily="system-ui, Segoe UI, Roboto, sans-serif"
            >
              {a.duration} sem
            </text>
            <text
              x={cx}
              y={cy + 62}
              textAnchor="middle"
              fontSize={8.5}
              fill="#737373"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
            >
              ES:{es.toFixed(0)} EF:{ef.toFixed(0)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

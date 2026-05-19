import type { CpmResult } from "./cpmEngine"
import { formatSem } from "./formatSem"
import type { AoASegment, AoATopology } from "./sigpiAoA"
import { computeAoAEventTimes } from "./sigpiAoA"

type Props = {
  result: CpmResult
  topology: AoATopology
}

const EVT_R = 22
const CRIT = "#b91c1c"
const NORM = "#171717"
const DUMMY = "#64748b"

function edgePoint(
  from: { x: number; y: number },
  to: { x: number; y: number },
  which: "from" | "to",
  r: number,
): { x: number; y: number } {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  if (which === "from") return { x: from.x + ux * r, y: from.y + uy * r }
  return { x: to.x - ux * r, y: to.y - uy * r }
}

function mid(a: { x: number; y: number }, b: { x: number; y: number }) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

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
  return { x: m.x + nx * dist, y: m.y + ny * dist - 6 }
}

function isCritAct(result: CpmResult, code: string): boolean {
  return Math.abs(result.slack[code] ?? 1) < 1e-6
}

/** Diagrama AoA: círculos = eventos, flechas = actividades, ficticias punteadas. */
export function AoADiagram({ result, topology }: Props) {
  const pad = 36
  const segments = topology.segments
  const Te = computeAoAEventTimes(result, segments)
  const dur = Object.fromEntries(result.activities.map((a) => [a.code, a.duration]))
  const maxEv = topology.eventCount

  const pt = (n: number) => {
    const p = topology.eventPos[n] ?? { x: 80 + n * 100, y: 240 }
    return { x: p.x + pad, y: p.y + pad }
  }

  const xs = Object.values(topology.eventPos).map((p) => p.x)
  const ys = Object.values(topology.eventPos).map((p) => p.y)
  const w = Math.max(...xs, 900) + pad * 2 + 80
  const h = Math.max(...ys, 400) + pad * 2 + 80

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={topology.title}
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
        <marker id="aoa-norm" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto">
          <path d="M0,0 L9,4.5 L0,9 Z" fill={NORM} />
        </marker>
        <marker id="aoa-crit" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto">
          <path d="M0,0 L9,4.5 L0,9 Z" fill={CRIT} />
        </marker>
      </defs>

      <text x={pad} y={26} fontSize={12} fill="#404040" fontFamily="system-ui, Segoe UI, sans-serif">
        <tspan fontWeight={600}>{topology.title}</tspan>
        <tspan fill="#64748b"> · ○ = evento · → = actividad (A, B, C…) · - - - = ficticia (0 sem)</tspan>
      </text>

      {segments.filter((s): s is Extract<AoASegment, { kind: "dummy" }> => s.kind === "dummy").map((s, idx) => {
        const p1 = pt(s.from)
        const p2 = pt(s.to)
        const mx = (p1.x + p2.x) / 2
        const my = (p1.y + p2.y) / 2
        const bend = Math.abs(s.from - s.to) <= 1 ? 0 : s.from < s.to ? 56 : -56
        const cx = mx + (p1.y === p2.y ? 0 : bend)
        const cy = my + (p1.y === p2.y ? bend : 0)
        const d =
          bend === 0
            ? `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`
            : `M ${p1.x} ${p1.y} Q ${cx} ${cy} ${p2.x} ${p2.y}`
        const lp = { x: cx, y: cy - 14 }
        return (
          <g key={`dum-${s.from}-${s.to}-${idx}`}>
            <path
              d={d}
              fill="none"
              stroke={DUMMY}
              strokeWidth={1.6}
              strokeDasharray="7 5"
              strokeLinecap="round"
              markerEnd="url(#aoa-norm)"
            />
            <text
              x={lp.x}
              y={lp.y}
              textAnchor="middle"
              fontSize={9}
              fill={DUMMY}
              fontStyle="italic"
              fontFamily="system-ui, sans-serif"
            >
              ficticia
            </text>
          </g>
        )
      })}

      {segments
        .filter((s): s is Extract<AoASegment, { kind: "activity" }> => s.kind === "activity")
        .map((s, idx) => {
          const p1 = pt(s.from)
          const p2 = pt(s.to)
          const crit = isCritAct(result, s.code)
          const stroke = crit ? CRIT : NORM
          const a = edgePoint(p1, p2, "from", EVT_R)
          const b = edgePoint(p1, p2, "to", EVT_R)
          const d = `M ${a.x} ${a.y} L ${b.x} ${b.y}`
          const lp = labelOffset(p1, p2, 16)
          const wk = dur[s.code] ?? 0
          return (
            <g key={`act-${s.code}-${idx}`}>
              <path
                d={d}
                fill="none"
                stroke={stroke}
                strokeWidth={crit ? 2.35 : 1.45}
                strokeLinecap="round"
                markerEnd={crit ? "url(#aoa-crit)" : "url(#aoa-norm)"}
              />
              <text
                x={lp.x}
                y={lp.y}
                textAnchor="middle"
                fontSize={11}
                fontWeight={700}
                fill={crit ? "#991b1b" : "#262626"}
                fontFamily="system-ui, sans-serif"
              >
                {s.code} ({formatSem(wk)} sem)
              </text>
            </g>
          )
        })}

      {Array.from({ length: maxEv }, (_, i) => i + 1).map((n) => {
        const c = pt(n)
        const t = Te[n] ?? 0
        const isStart = n === 1
        const isEnd = n === maxEv
        return (
          <g key={`ev-${n}`}>
            <circle
              cx={c.x}
              cy={c.y}
              r={EVT_R}
              fill="#fff"
              stroke={isStart || isEnd ? "#0f766e" : "#262626"}
              strokeWidth={isStart || isEnd ? 2.4 : 2}
            />
            <text
              x={c.x}
              y={c.y + 5}
              textAnchor="middle"
              fontSize={14}
              fontWeight={700}
              fill="#111"
              fontFamily="system-ui, sans-serif"
            >
              {n}
            </text>
            <text
              x={c.x}
              y={c.y + EVT_R + 14}
              textAnchor="middle"
              fontSize={8.5}
              fill="#525252"
              fontFamily="ui-monospace, monospace"
            >
              {formatSem(t)} sem
            </text>
            {(isStart || isEnd) && (
              <text
                x={c.x}
                y={c.y - EVT_R - 6}
                textAnchor="middle"
                fontSize={8}
                fontWeight={600}
                fill="#0f766e"
                fontFamily="system-ui, sans-serif"
              >
                {isStart ? "INICIO" : "FIN"}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

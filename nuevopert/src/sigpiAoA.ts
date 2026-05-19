import { normalizeCode, type CpmResult, type Row } from "./cpmEngine"

export type AoASegment =
  | { kind: "activity"; from: number; to: number; code: string }
  | { kind: "dummy"; from: number; to: number }

export type AoATopology = {
  id: string
  title: string
  eventCount: number
  eventPos: Record<number, { x: number; y: number }>
  segments: AoASegment[]
  /** código actividad → procedencia esperada (vacío = inicio) */
  expectedPreds: Record<string, string>
}

/** Layout 8 eventos (paralelos + unión) — usado en E1, E2, E3 */
const POS_8_PARALLEL: Record<number, { x: number; y: number }> = {
  1: { x: 72, y: 240 },
  2: { x: 228, y: 120 },
  3: { x: 392, y: 240 },
  4: { x: 556, y: 72 },
  5: { x: 556, y: 240 },
  6: { x: 556, y: 408 },
  7: { x: 720, y: 240 },
  8: { x: 912, y: 240 },
}

/** Layout lineal 8 eventos — E4 */
const POS_8_LINE: Record<number, { x: number; y: number }> = {
  1: { x: 80, y: 240 },
  2: { x: 200, y: 240 },
  3: { x: 320, y: 240 },
  4: { x: 440, y: 240 },
  5: { x: 560, y: 240 },
  6: { x: 680, y: 240 },
  7: { x: 800, y: 240 },
  8: { x: 920, y: 240 },
}

const E1_SEGMENTS: AoASegment[] = [
  { kind: "activity", from: 1, to: 2, code: "A" },
  { kind: "activity", from: 2, to: 3, code: "B" },
  { kind: "activity", from: 3, to: 4, code: "C" },
  { kind: "activity", from: 2, to: 5, code: "D" },
  { kind: "dummy", from: 4, to: 6 },
  { kind: "dummy", from: 5, to: 6 },
  { kind: "activity", from: 6, to: 7, code: "E" },
  { kind: "activity", from: 7, to: 8, code: "F" },
]

const E2_SEGMENTS: AoASegment[] = [
  { kind: "activity", from: 1, to: 2, code: "A" },
  { kind: "activity", from: 2, to: 3, code: "B" },
  { kind: "activity", from: 3, to: 4, code: "C" },
  { kind: "activity", from: 3, to: 5, code: "D" },
  { kind: "activity", from: 3, to: 6, code: "E" },
  { kind: "dummy", from: 4, to: 7 },
  { kind: "dummy", from: 5, to: 7 },
  { kind: "dummy", from: 6, to: 7 },
  { kind: "activity", from: 7, to: 8, code: "F" },
]

const E3_SEGMENTS: AoASegment[] = [
  { kind: "activity", from: 1, to: 2, code: "A" },
  { kind: "activity", from: 2, to: 3, code: "B" },
  { kind: "activity", from: 3, to: 4, code: "C" },
  { kind: "activity", from: 2, to: 5, code: "D" },
  { kind: "activity", from: 2, to: 6, code: "E" },
  { kind: "dummy", from: 4, to: 7 },
  { kind: "dummy", from: 5, to: 7 },
  { kind: "dummy", from: 6, to: 7 },
  { kind: "activity", from: 7, to: 8, code: "F" },
]

const E4_SEGMENTS: AoASegment[] = [
  { kind: "activity", from: 1, to: 2, code: "A" },
  { kind: "activity", from: 2, to: 3, code: "B" },
  { kind: "activity", from: 3, to: 4, code: "C" },
  { kind: "activity", from: 4, to: 5, code: "D" },
  { kind: "activity", from: 5, to: 6, code: "E" },
  { kind: "activity", from: 6, to: 7, code: "F" },
]

const SUMMARY_SEGMENTS_OK: AoASegment[] = [
  { kind: "activity", from: 1, to: 2, code: "A" },
  { kind: "activity", from: 2, to: 3, code: "B" },
  { kind: "activity", from: 1, to: 4, code: "C" },
  { kind: "dummy", from: 3, to: 5 },
  { kind: "dummy", from: 4, to: 5 },
  { kind: "activity", from: 5, to: 6, code: "D" },
]

const POS_SUMMARY: Record<number, { x: number; y: number }> = {
  1: { x: 80, y: 240 },
  2: { x: 260, y: 240 },
  3: { x: 440, y: 120 },
  4: { x: 440, y: 360 },
  5: { x: 620, y: 240 },
  6: { x: 820, y: 240 },
}

export const SIGPI_AOA_TOPOLOGIES: AoATopology[] = [
  {
    id: "e1",
    title: "Entregable 1 — Gestión (AoA)",
    eventCount: 8,
    eventPos: POS_8_PARALLEL,
    segments: E1_SEGMENTS,
    expectedPreds: { A: "", B: "A", C: "B", D: "B", E: "C;D", F: "E" },
  },
  {
    id: "e2",
    title: "Entregable 2 — Módulo C (AoA)",
    eventCount: 8,
    eventPos: POS_8_PARALLEL,
    segments: E2_SEGMENTS,
    expectedPreds: { A: "", B: "A", C: "B", D: "B", E: "B", F: "C;D;E" },
  },
  {
    id: "e3",
    title: "Entregable 3 — Módulo A (AoA)",
    eventCount: 8,
    eventPos: POS_8_PARALLEL,
    segments: E3_SEGMENTS,
    expectedPreds: { A: "", B: "A", C: "B", D: "B", E: "A", F: "C;D;E" },
  },
  {
    id: "e4",
    title: "Entregable 4 — Módulo B (AoA)",
    eventCount: 8,
    eventPos: POS_8_LINE,
    segments: E4_SEGMENTS,
    expectedPreds: { A: "", B: "A", C: "B", D: "C", E: "D", F: "E" },
  },
  {
    id: "summary",
    title: "Resumen 4 entregables (AoA)",
    eventCount: 6,
    eventPos: POS_SUMMARY,
    segments: SUMMARY_SEGMENTS_OK,
    expectedPreds: { A: "", B: "A", C: "A", D: "B;C" },
  },
]

function predsKey(raw: string): string {
  if (!raw.trim() || raw.trim() === "-") return ""
  return raw
    .split(/[;,]/g)
    .map((x) => normalizeCode(x))
    .filter(Boolean)
    .sort()
    .join(";")
}

function rowPredsKey(r: Row): string {
  return predsKey(r.procedencia)
}

export function detectSigpiAoATopology(rows: Row[]): AoATopology | null {
  const withCode = rows.filter((r) => normalizeCode(r.actividad))
  if (withCode.length === 0) return null

  const byCode = new Map<string, Row>()
  for (const r of withCode) {
    const c = normalizeCode(r.actividad)
    byCode.set(c, r)
  }

  for (const topo of SIGPI_AOA_TOPOLOGIES) {
    const codes = Object.keys(topo.expectedPreds)
    if (codes.length !== byCode.size) continue
    let ok = true
    for (const code of codes) {
      const r = byCode.get(normalizeCode(code))
      if (!r) {
        ok = false
        break
      }
      const exp = predsKey(topo.expectedPreds[code] ?? "")
      if (rowPredsKey(r) !== exp) {
        ok = false
        break
      }
    }
    if (ok) return topo
  }
  return null
}

export function computeAoAEventTimes(result: CpmResult, segments: AoASegment[]): Record<number, number> {
  const dur = Object.fromEntries(result.activities.map((a) => [a.code, a.duration]))
  const maxEv = Math.max(...segments.flatMap((s) => [s.from, s.to]), 1)
  const Te: Record<number, number> = {}
  for (let i = 1; i <= maxEv; i++) Te[i] = i === 1 ? 0 : -1e18

  for (let it = 0; it < 50; it++) {
    let changed = false
    for (const s of segments) {
      const w = s.kind === "dummy" ? 0 : dur[s.code] ?? 0
      const next = Te[s.from]! + w
      if (next > Te[s.to]! + 1e-9) {
        Te[s.to] = next
        changed = true
      }
    }
    if (!changed) break
  }

  for (let i = 1; i <= maxEv; i++) {
    if (!Number.isFinite(Te[i]) || Te[i]! < -1e10) Te[i] = 0
  }
  return Te
}

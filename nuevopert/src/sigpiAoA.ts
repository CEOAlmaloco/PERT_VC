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

const POS_LINE_5: Record<number, { x: number; y: number }> = {
  1: { x: 80, y: 240 },
  2: { x: 230, y: 240 },
  3: { x: 380, y: 240 },
  4: { x: 530, y: 240 },
  5: { x: 680, y: 240 },
}

const POS_E11: Record<number, { x: number; y: number }> = {
  1: { x: 72, y: 240 },
  2: { x: 240, y: 240 },
  3: { x: 420, y: 120 },
  4: { x: 420, y: 360 },
  5: { x: 600, y: 240 },
  6: { x: 780, y: 240 },
}

const POS_E22: Record<number, { x: number; y: number }> = {
  1: { x: 72, y: 240 },
  2: { x: 240, y: 240 },
  3: { x: 420, y: 120 },
  4: { x: 420, y: 360 },
  5: { x: 600, y: 240 },
  6: { x: 780, y: 240 },
  7: { x: 960, y: 240 },
}

const POS_E23: Record<number, { x: number; y: number }> = {
  1: { x: 72, y: 240 },
  2: { x: 240, y: 240 },
  3: { x: 420, y: 240 },
  4: { x: 600, y: 96 },
  5: { x: 600, y: 240 },
  6: { x: 600, y: 384 },
  7: { x: 800, y: 240 },
}

const POS_E32: Record<number, { x: number; y: number }> = {
  1: { x: 72, y: 240 },
  2: { x: 240, y: 240 },
  3: { x: 420, y: 96 },
  4: { x: 420, y: 240 },
  5: { x: 420, y: 384 },
  6: { x: 620, y: 240 },
  7: { x: 800, y: 240 },
}

const POS_E33: Record<number, { x: number; y: number }> = {
  1: { x: 72, y: 240 },
  2: { x: 240, y: 240 },
  3: { x: 420, y: 120 },
  4: { x: 620, y: 120 },
  5: { x: 420, y: 360 },
  6: { x: 800, y: 240 },
}

const POS_E42: Record<number, { x: number; y: number }> = {
  1: { x: 72, y: 240 },
  2: { x: 240, y: 120 },
  3: { x: 240, y: 360 },
  4: { x: 460, y: 120 },
  5: { x: 640, y: 240 },
  6: { x: 820, y: 240 },
}

function linearSegments(): AoASegment[] {
  return [
    { kind: "activity", from: 1, to: 2, code: "A" },
    { kind: "activity", from: 2, to: 3, code: "B" },
    { kind: "activity", from: 3, to: 4, code: "C" },
    { kind: "activity", from: 4, to: 5, code: "D" },
  ]
}

function rowTemplateId(rows: Row[]): string {
  const first = rows.find((r) => normalizeCode(r.actividad))
  if (!first) return ""
  const match = first.id.match(/^(.*)-[^-]+$/)
  return match?.[1] ?? ""
}

function linearTopology(id: string, title: string): AoATopology {
  return {
    id,
    title,
    eventCount: 5,
    eventPos: POS_LINE_5,
    segments: linearSegments(),
    expectedPreds: { A: "", B: "A", C: "B", D: "C" },
  }
}

export const SIGPI_AOA_TOPOLOGIES: AoATopology[] = [
  {
    id: "e1.1",
    title: "Entregable 1.1 — Planificación (AoA)",
    eventCount: 6,
    eventPos: POS_E11,
    segments: [
      { kind: "activity", from: 1, to: 2, code: "A" },
      { kind: "activity", from: 2, to: 3, code: "B" },
      { kind: "activity", from: 2, to: 4, code: "C" },
      { kind: "dummy", from: 3, to: 5 },
      { kind: "dummy", from: 4, to: 5 },
      { kind: "activity", from: 5, to: 6, code: "D" },
    ],
    expectedPreds: { A: "", B: "A", C: "A", D: "B;C" },
  },
  linearTopology("e1.2", "Entregable 1.2 — Gestión de riesgos (AoA)"),
  linearTopology("e1.3", "Entregable 1.3 — Cierre (AoA)"),
  linearTopology("e2.1", "Entregable 2.1 — Diseño y prototipo (AoA)"),
  {
    id: "e2.2",
    title: "Entregable 2.2 — Aplicación ciudadana (AoA)",
    eventCount: 7,
    eventPos: POS_E22,
    segments: [
      { kind: "activity", from: 1, to: 2, code: "A" },
      { kind: "activity", from: 2, to: 3, code: "B" },
      { kind: "activity", from: 2, to: 4, code: "C" },
      { kind: "dummy", from: 3, to: 5 },
      { kind: "dummy", from: 4, to: 5 },
      { kind: "activity", from: 5, to: 6, code: "D" },
      { kind: "activity", from: 6, to: 7, code: "E" },
    ],
    expectedPreds: { A: "", B: "A", C: "A", D: "B;C", E: "D" },
  },
  {
    id: "e2.3",
    title: "Entregable 2.3 — Backend y alertas (AoA)",
    eventCount: 7,
    eventPos: POS_E23,
    segments: [
      { kind: "activity", from: 1, to: 2, code: "A" },
      { kind: "activity", from: 2, to: 3, code: "B" },
      { kind: "activity", from: 3, to: 4, code: "C" },
      { kind: "activity", from: 3, to: 5, code: "D" },
      { kind: "activity", from: 3, to: 6, code: "E" },
      { kind: "dummy", from: 4, to: 7 },
      { kind: "dummy", from: 5, to: 7 },
      { kind: "dummy", from: 6, to: 7 },
    ],
    expectedPreds: { A: "", B: "A", C: "B", D: "B", E: "B" },
  },
  linearTopology("e2.4", "Entregable 2.4 — Pruebas y despliegue (AoA)"),
  linearTopology("e3.1", "Entregable 3.1 — Diseño y prototipo (AoA)"),
  {
    id: "e3.2",
    title: "Entregable 3.2 — Visor GIS y dashboard (AoA)",
    eventCount: 7,
    eventPos: POS_E32,
    segments: [
      { kind: "activity", from: 1, to: 2, code: "A" },
      { kind: "activity", from: 2, to: 3, code: "B" },
      { kind: "activity", from: 2, to: 4, code: "C" },
      { kind: "activity", from: 2, to: 5, code: "D" },
      { kind: "dummy", from: 3, to: 6 },
      { kind: "dummy", from: 4, to: 6 },
      { kind: "dummy", from: 5, to: 6 },
      { kind: "activity", from: 6, to: 7, code: "E" },
    ],
    expectedPreds: { A: "", B: "A", C: "A", D: "A", E: "B;C;D" },
  },
  {
    id: "e3.3",
    title: "Entregable 3.3 — App brigadas (AoA)",
    eventCount: 6,
    eventPos: POS_E33,
    segments: [
      { kind: "activity", from: 1, to: 2, code: "A" },
      { kind: "activity", from: 2, to: 3, code: "B" },
      { kind: "activity", from: 2, to: 5, code: "D" },
      { kind: "activity", from: 3, to: 4, code: "C" },
      { kind: "dummy", from: 4, to: 6 },
      { kind: "dummy", from: 5, to: 6 },
    ],
    expectedPreds: { A: "", B: "A", C: "B", D: "A" },
  },
  linearTopology("e3.4", "Entregable 3.4 — Pruebas y despliegue (AoA)"),
  linearTopology("e4.1", "Entregable 4.1 — Diseño y modelo de datos (AoA)"),
  {
    id: "e4.2",
    title: "Entregable 4.2 — Hub e integraciones (AoA)",
    eventCount: 6,
    eventPos: POS_E42,
    segments: [
      { kind: "activity", from: 1, to: 2, code: "A" },
      { kind: "activity", from: 1, to: 3, code: "B" },
      { kind: "activity", from: 2, to: 4, code: "C" },
      { kind: "dummy", from: 3, to: 5 },
      { kind: "dummy", from: 4, to: 5 },
      { kind: "activity", from: 5, to: 6, code: "D" },
    ],
    expectedPreds: { A: "", B: "", C: "A", D: "B;C" },
  },
  linearTopology("e4.3", "Entregable 4.3 — Pruebas y despliegue (AoA)"),
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

  const templateId = rowTemplateId(rows)

  for (const topo of SIGPI_AOA_TOPOLOGIES) {
    if (templateId && topo.id !== templateId) continue
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

import type { CpmResult } from "./cpmEngine"

/** Posiciones de eventos 1…8 (diagrama AoA de referencia). */
export const AO_A8_EVENT_POS: Record<number, { x: number; y: number }> = {
  1: { x: 72, y: 240 },
  2: { x: 228, y: 108 },
  3: { x: 228, y: 372 },
  4: { x: 392, y: 240 },
  5: { x: 556, y: 96 },
  6: { x: 556, y: 384 },
  7: { x: 720, y: 240 },
  8: { x: 912, y: 240 },
}

export type AoA8Segment =
  | { kind: "activity"; from: number; to: number; code: string }
  | { kind: "dummy"; from: number; to: number }

/** Topología fija: A,B desde 1; ficticia 2→3; C…; ficticia 6→5; F,G→7; H→8. */
export const AO_A8_SEGMENTS: AoA8Segment[] = [
  { kind: "activity", from: 1, to: 2, code: "A" },
  { kind: "activity", from: 1, to: 3, code: "B" },
  { kind: "dummy", from: 2, to: 3 },
  { kind: "activity", from: 3, to: 4, code: "C" },
  { kind: "activity", from: 4, to: 5, code: "D" },
  { kind: "activity", from: 4, to: 6, code: "E" },
  { kind: "dummy", from: 6, to: 5 },
  { kind: "activity", from: 5, to: 7, code: "F" },
  { kind: "activity", from: 6, to: 7, code: "G" },
  { kind: "activity", from: 7, to: 8, code: "H" },
]

/** Tiempos tempranos de evento (máximo de predecesores) sobre la red AoA fija. */
export function computeAoA8EventTimes(result: CpmResult): Record<number, number> {
  const dur = Object.fromEntries(result.activities.map((a) => [a.code, a.duration]))
  const Te: Record<number, number> = {}
  for (let i = 1; i <= 8; i++) Te[i] = i === 1 ? 0 : -1e18

  for (let it = 0; it < 40; it++) {
    let changed = false
    for (const s of AO_A8_SEGMENTS) {
      const w = s.kind === "dummy" ? 0 : dur[s.code] ?? 0
      const next = Te[s.from]! + w
      if (next > Te[s.to]! + 1e-9) {
        Te[s.to] = next
        changed = true
      }
    }
    if (!changed) break
  }

  for (let i = 1; i <= 8; i++) {
    if (!Number.isFinite(Te[i]) || Te[i]! < -1e10) Te[i] = 0
  }
  return Te
}

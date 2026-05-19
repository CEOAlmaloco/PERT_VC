import { computeCpmFromRows, normalizeCode, type CpmResult, type Row } from "../cpmEngine"
import type { GanttTask } from "./types"

/**
 * Semana w (1, 2, 3…) = intervalo [w−1, w) en la escala del CPM.
 * La actividad [ES, EF] ocupa cada semana que se solapa con ese intervalo.
 */
export function weekSpanFromEsEf(es: number, ef: number, totalWeeks: number): { startWeek: number; endWeek: number } {
  let startWeek = 0
  let endWeek = 0
  for (let w = 1; w <= totalWeeks; w++) {
    const weekStart = w - 1
    const weekEnd = w
    if (ef > weekStart + 1e-9 && es < weekEnd - 1e-9) {
      if (startWeek === 0) startWeek = w
      endWeek = w
    }
  }
  if (startWeek === 0) startWeek = Math.max(1, Math.floor(es) + 1)
  if (endWeek === 0) endWeek = Math.max(startWeek, Math.ceil(ef - 1e-9))
  return { startWeek, endWeek }
}

export function projectWeekCount(result: CpmResult): number {
  return Math.max(1, Math.ceil(result.projectEnd - 1e-9))
}

/** Gantt alineado al CPM: columnas = semanas, barras según ES/EF. */
export function ganttFromCpmResult(
  result: CpmResult,
  rows: Row[],
  phase: string,
): { tasks: GanttTask[]; totalWeeks: number } {
  if (result.errors.length || result.activities.length === 0) {
    return { tasks: [], totalWeeks: 1 }
  }

  const totalWeeks = projectWeekCount(result)
  const rowByCode = new Map<string, Row>()
  for (const r of rows) {
    const c = normalizeCode(r.actividad)
    if (c) rowByCode.set(c, r)
  }

  const tasks: GanttTask[] = []
  for (const code of result.order) {
    const r = rowByCode.get(code)
    if (!r) continue
    const es = result.es[code]
    const ef = result.ef[code]
    if (!Number.isFinite(es) || !Number.isFinite(ef)) continue

    const { startWeek, endWeek } = weekSpanFromEsEf(es, ef, totalWeeks)
    const name = r.nombre?.trim() || result.activities.find((a) => a.code === code)?.name || ""

    tasks.push({
      id: `g-${r.id}`,
      phase,
      activity: `${code} — ${name} (sem ${startWeek}–${endWeek} · ES ${es.toFixed(1)} / EF ${ef.toFixed(1)})`,
      startWeek,
      endWeek,
    })
  }

  return { tasks, totalWeeks }
}

export function ganttForRows(rows: Row[], phase: string): { tasks: GanttTask[]; totalWeeks: number } {
  return ganttFromCpmResult(computeCpmFromRows(rows), rows, phase)
}

import { sigpiEntregablesRows, type Row } from "../cpmEngine"
import { ganttForRows } from "./ganttFromCpm"
import type { GanttTask } from "./types"

type SubDef = {
  letter: string
  edt: string
  nombre: string
  pred: string
  weeks: number
}

function sub(id: string, letter: string, nombre: string, procedencia: string, probableWeeks: number): Row {
  const m = probableWeeks
  const a = Math.max(1, Math.floor(m * 0.75))
  const b = Math.max(a + 1, Math.ceil(m * 1.35))
  return {
    id,
    actividad: letter,
    nombre,
    procedencia,
    optimista: String(a),
    probable: String(m),
    pesimista: String(b),
  }
}

function rowsFromDefs(idPrefix: string, defs: SubDef[]): Row[] {
  return defs.map((d, i) =>
    sub(`${idPrefix}-${i}`, d.letter, `(${d.edt}) ${d.nombre}`, d.pred, d.weeks),
  )
}

/** Entregable 1 — Gestión (A–F ↔ 1.1–1.6) */
export function sigpiEntregable1Rows(): Row[] {
  return rowsFromDefs("e1", [
    { letter: "A", edt: "1.1", nombre: "Inicio y planificación", pred: "", weeks: 2 },
    { letter: "B", edt: "1.2", nombre: "Gestión contractual y legal", pred: "A", weeks: 3 },
    { letter: "C", edt: "1.3", nombre: "Gestión de calidad", pred: "B", weeks: 2 },
    { letter: "D", edt: "1.4", nombre: "Gestión de riesgos", pred: "B", weeks: 2 },
    { letter: "E", edt: "1.5", nombre: "Comunicaciones", pred: "C;D", weeks: 1 },
    { letter: "F", edt: "1.6", nombre: "Capacitación y cambio", pred: "E", weeks: 2 },
  ])
}

/** Entregable 2 — Módulo C (A–F ↔ 2.1–2.6) */
export function sigpiEntregable2Rows(): Row[] {
  return rowsFromDefs("e2", [
    { letter: "A", edt: "2.1", nombre: "Análisis y diseño C", pred: "", weeks: 3 },
    { letter: "B", edt: "2.3", nombre: "Backend reportes", pred: "A", weeks: 5 },
    { letter: "C", edt: "2.4", nombre: "Motor de alertas", pred: "B", weeks: 4 },
    { letter: "D", edt: "2.2", nombre: "PWA / App ciudadana", pred: "B", weeks: 6 },
    { letter: "E", edt: "2.5", nombre: "Panel moderación", pred: "B", weeks: 4 },
    { letter: "F", edt: "2.6", nombre: "Testing y despliegue C", pred: "C;D;E", weeks: 3 },
  ])
}

/** Entregable 3 — Módulo A (A–F ↔ 3.1–3.6) */
export function sigpiEntregable3Rows(): Row[] {
  return rowsFromDefs("e3", [
    { letter: "A", edt: "3.1", nombre: "Análisis y diseño A", pred: "", weeks: 3 },
    { letter: "B", edt: "3.2", nombre: "Visor GIS y mapa", pred: "A", weeks: 7 },
    { letter: "C", edt: "3.4", nombre: "App brigadas móvil", pred: "B", weeks: 4 },
    { letter: "D", edt: "3.3", nombre: "Dashboard operativo", pred: "B", weeks: 5 },
    { letter: "E", edt: "3.5", nombre: "Infra sala crisis", pred: "A", weeks: 3 },
    { letter: "F", edt: "3.6", nombre: "Testing y despliegue A", pred: "C;D;E", weeks: 3 },
  ])
}

/** Entregable 4 — Módulo B (A–F ↔ 4.1–4.6) */
export function sigpiEntregable4Rows(): Row[] {
  return rowsFromDefs("e4", [
    { letter: "A", edt: "4.1", nombre: "Análisis y diseño B", pred: "", weeks: 3 },
    { letter: "B", edt: "4.2", nombre: "Hub datos e histórico", pred: "A", weeks: 8 },
    { letter: "C", edt: "4.3", nombre: "API integración", pred: "B", weeks: 5 },
    { letter: "D", edt: "4.4", nombre: "Analítica y reportes", pred: "C", weeks: 4 },
    { letter: "E", edt: "4.5", nombre: "Seguridad y cumplimiento", pred: "D", weeks: 3 },
    { letter: "F", edt: "4.6", nombre: "Testing y despliegue B", pred: "E", weeks: 3 },
  ])
}

const FULL_DEFS: SubDef[] = [
  { letter: "A", edt: "1.1", nombre: "Inicio y planificación", pred: "", weeks: 2 },
  { letter: "B", edt: "1.2", nombre: "Gestión contractual y legal", pred: "A", weeks: 3 },
  { letter: "C", edt: "1.3", nombre: "Gestión de calidad", pred: "B", weeks: 2 },
  { letter: "D", edt: "1.4", nombre: "Gestión de riesgos", pred: "B", weeks: 2 },
  { letter: "E", edt: "1.5", nombre: "Comunicaciones", pred: "C;D", weeks: 1 },
  { letter: "F", edt: "1.6", nombre: "Capacitación y cambio", pred: "E", weeks: 2 },
  { letter: "G", edt: "2.1", nombre: "Análisis y diseño C", pred: "F", weeks: 3 },
  { letter: "H", edt: "2.3", nombre: "Backend reportes", pred: "G", weeks: 5 },
  { letter: "I", edt: "2.4", nombre: "Motor de alertas", pred: "H", weeks: 4 },
  { letter: "J", edt: "2.2", nombre: "PWA / App ciudadana", pred: "H", weeks: 6 },
  { letter: "K", edt: "2.5", nombre: "Panel moderación", pred: "H", weeks: 4 },
  { letter: "L", edt: "2.6", nombre: "Testing y despliegue C", pred: "I;J;K", weeks: 3 },
  { letter: "M", edt: "3.1", nombre: "Análisis y diseño A", pred: "F", weeks: 3 },
  { letter: "N", edt: "3.2", nombre: "Visor GIS y mapa", pred: "M", weeks: 7 },
  { letter: "O", edt: "3.4", nombre: "App brigadas móvil", pred: "N", weeks: 4 },
  { letter: "P", edt: "3.3", nombre: "Dashboard operativo", pred: "N", weeks: 5 },
  { letter: "Q", edt: "3.5", nombre: "Infra sala crisis", pred: "M", weeks: 3 },
  { letter: "R", edt: "3.6", nombre: "Testing y despliegue A", pred: "O;P;Q", weeks: 3 },
  { letter: "S", edt: "4.1", nombre: "Análisis y diseño B", pred: "L;R", weeks: 3 },
  { letter: "T", edt: "4.2", nombre: "Hub datos e histórico", pred: "S", weeks: 8 },
  { letter: "U", edt: "4.3", nombre: "API integración", pred: "T", weeks: 5 },
  { letter: "V", edt: "4.4", nombre: "Analítica y reportes", pred: "U", weeks: 4 },
  { letter: "W", edt: "4.5", nombre: "Seguridad y cumplimiento", pred: "V", weeks: 3 },
  { letter: "X", edt: "4.6", nombre: "Testing y despliegue B", pred: "W", weeks: 3 },
]

/** Proyecto completo (A–X) — tabla con letras; diagrama AoN */
export function sigpiProyectoCompletoRows(): Row[] {
  return rowsFromDefs("full", FULL_DEFS)
}

export type SigpiPertTemplate = {
  id: string
  label: string
  description: string
  ganttPhase: string
  rows: () => Row[]
  gantt: () => GanttTask[]
  ganttWeeks: () => number
}

function tpl(
  id: string,
  label: string,
  description: string,
  ganttPhase: string,
  rows: () => Row[],
): SigpiPertTemplate {
  return {
    id,
    label,
    description,
    ganttPhase,
    rows,
    gantt: () => ganttForRows(rows(), ganttPhase).tasks,
    ganttWeeks: () => ganttForRows(rows(), ganttPhase).totalWeeks,
  }
}

export const SIGPI_CRONOGRAMA_TEMPLATES: SigpiPertTemplate[] = [
  tpl("summary", "Resumen A–D", "4 entregables (A–D) con ficticias en AoA", "SIGPI — 4 entregables", sigpiEntregablesRows),
  tpl("e1", "E1 Gestión", "Actividades A–F (EDT 1.1–1.6) · AoA con ficticias", "Entregable 1 — Gestión", sigpiEntregable1Rows),
  tpl("e2", "E2 Módulo C", "Actividades A–F (EDT 2.1–2.6) · AoA con ficticias", "Entregable 2 — Módulo C", sigpiEntregable2Rows),
  tpl("e3", "E3 Módulo A", "Actividades A–F (EDT 3.1–3.6) · AoA con ficticias", "Entregable 3 — Módulo A", sigpiEntregable3Rows),
  tpl("e4", "E4 Módulo B", "Actividades A–F (EDT 4.1–4.6) · AoA lineal", "Entregable 4 — Módulo B", sigpiEntregable4Rows),
  tpl("full", "SIGPI completo", "A–X enlazado (diagrama AoN)", "SIGPI — Proyecto", sigpiProyectoCompletoRows),
]

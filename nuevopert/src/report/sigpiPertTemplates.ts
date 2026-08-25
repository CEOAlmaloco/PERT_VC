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

/** Entregable 1 — Gestión Scrum y constitución (A–F ↔ 1.1–1.6) */
export function sigpiEntregable1Rows(): Row[] {
  return rowsFromDefs("e1", [
    { letter: "A", edt: "1.1", nombre: "Acta de constitución y kickoff", pred: "", weeks: 2 },
    { letter: "B", edt: "1.2", nombre: "Product Backlog y DoD", pred: "A", weeks: 2 },
    { letter: "C", edt: "1.3", nombre: "Gestión de calidad / DoD", pred: "B", weeks: 2 },
    { letter: "D", edt: "1.4", nombre: "Gestión de riesgos del piloto", pred: "B", weeks: 2 },
    { letter: "E", edt: "1.5", nombre: "Comunicaciones con DOM/TI", pred: "C;D", weeks: 1 },
    { letter: "F", edt: "1.6", nombre: "Capacitaciones iniciales", pred: "E", weeks: 2 },
  ])
}

/** Entregable 2 — Software core Registro + Captura (A–F ↔ 2.1–2.6) */
export function sigpiEntregable2Rows(): Row[] {
  return rowsFromDefs("e2", [
    { letter: "A", edt: "2.1", nombre: "Análisis y diseño funcional", pred: "", weeks: 3 },
    { letter: "B", edt: "2.2", nombre: "Módulo registro de infraestructura", pred: "A", weeks: 5 },
    { letter: "C", edt: "2.3", nombre: "Backend captura de mediciones", pred: "B", weeks: 5 },
    { letter: "D", edt: "2.4", nombre: "Integración inspecciones visuales", pred: "B", weeks: 4 },
    { letter: "E", edt: "2.5", nombre: "Seguridad y roles de usuario", pred: "B", weeks: 3 },
    { letter: "F", edt: "2.6", nombre: "Testing y release Foundation", pred: "C;D;E", weeks: 3 },
  ])
}

/** Entregable 3 — Alertas, panel y mantenimiento (A–F ↔ 3.1–3.6) */
export function sigpiEntregable3Rows(): Row[] {
  return rowsFromDefs("e3", [
    { letter: "A", edt: "3.1", nombre: "Diseño de umbrales y reglas", pred: "", weeks: 3 },
    { letter: "B", edt: "3.2", nombre: "Motor de reglas de alerta", pred: "A", weeks: 5 },
    { letter: "C", edt: "3.3", nombre: "Panel de monitoreo", pred: "B", weeks: 5 },
    { letter: "D", edt: "3.4", nombre: "Planificación de mantenimiento", pred: "B", weeks: 5 },
    { letter: "E", edt: "3.5", nombre: "Notificaciones y responsables", pred: "A", weeks: 3 },
    { letter: "F", edt: "3.6", nombre: "Testing y release Alertas/Panel", pred: "C;D;E", weeks: 3 },
  ])
}

/** Entregable 4 — Hardware, marcha blanca y cierre (A–F ↔ 4.1–4.6) */
export function sigpiEntregable4Rows(): Row[] {
  return rowsFromDefs("e4", [
    { letter: "A", edt: "4.1", nombre: "Adquisición e instalación de sensores", pred: "", weeks: 4 },
    { letter: "B", edt: "4.2", nombre: "Integración hardware–software", pred: "A", weeks: 5 },
    { letter: "C", edt: "4.3", nombre: "Pruebas en terreno (2 puentes)", pred: "B", weeks: 4 },
    { letter: "D", edt: "4.4", nombre: "Marcha blanca y capacitación", pred: "C", weeks: 4 },
    { letter: "E", edt: "4.5", nombre: "Ajustes de umbrales", pred: "D", weeks: 3 },
    { letter: "F", edt: "4.6", nombre: "Traspaso operacional y cierre", pred: "E", weeks: 3 },
  ])
}

const FULL_DEFS: SubDef[] = [
  { letter: "A", edt: "1.1", nombre: "Acta de constitución y kickoff", pred: "", weeks: 2 },
  { letter: "B", edt: "1.2", nombre: "Product Backlog y DoD", pred: "A", weeks: 2 },
  { letter: "C", edt: "1.3", nombre: "Gestión de calidad / DoD", pred: "B", weeks: 2 },
  { letter: "D", edt: "1.4", nombre: "Gestión de riesgos del piloto", pred: "B", weeks: 2 },
  { letter: "E", edt: "1.5", nombre: "Comunicaciones con DOM/TI", pred: "C;D", weeks: 1 },
  { letter: "F", edt: "1.6", nombre: "Capacitaciones iniciales", pred: "E", weeks: 2 },
  { letter: "G", edt: "2.1", nombre: "Análisis y diseño funcional", pred: "F", weeks: 3 },
  { letter: "H", edt: "2.2", nombre: "Módulo registro de infraestructura", pred: "G", weeks: 5 },
  { letter: "I", edt: "2.3", nombre: "Backend captura de mediciones", pred: "H", weeks: 5 },
  { letter: "J", edt: "2.4", nombre: "Integración inspecciones visuales", pred: "H", weeks: 4 },
  { letter: "K", edt: "2.5", nombre: "Seguridad y roles de usuario", pred: "H", weeks: 3 },
  { letter: "L", edt: "2.6", nombre: "Testing y release Foundation", pred: "I;J;K", weeks: 3 },
  { letter: "M", edt: "3.1", nombre: "Diseño de umbrales y reglas", pred: "L", weeks: 3 },
  { letter: "N", edt: "3.2", nombre: "Motor de reglas de alerta", pred: "M", weeks: 5 },
  { letter: "O", edt: "3.3", nombre: "Panel de monitoreo", pred: "N", weeks: 5 },
  { letter: "P", edt: "3.4", nombre: "Planificación de mantenimiento", pred: "N", weeks: 5 },
  { letter: "Q", edt: "3.5", nombre: "Notificaciones y responsables", pred: "M", weeks: 3 },
  { letter: "R", edt: "3.6", nombre: "Testing y release Alertas/Panel", pred: "O;P;Q", weeks: 3 },
  { letter: "S", edt: "4.1", nombre: "Adquisición e instalación de sensores", pred: "R", weeks: 4 },
  { letter: "T", edt: "4.2", nombre: "Integración hardware–software", pred: "S", weeks: 5 },
  { letter: "U", edt: "4.3", nombre: "Pruebas en terreno (2 puentes)", pred: "T", weeks: 4 },
  { letter: "V", edt: "4.4", nombre: "Marcha blanca y capacitación", pred: "U", weeks: 4 },
  { letter: "W", edt: "4.5", nombre: "Ajustes de umbrales", pred: "V", weeks: 3 },
  { letter: "X", edt: "4.6", nombre: "Traspaso operacional y cierre", pred: "W", weeks: 3 },
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
  tpl(
    "summary",
    "Resumen A–D",
    "4 entregables del piloto de puentes (A–D) con ficticias en AoA",
    "Puentes Biobío — 4 entregables",
    sigpiEntregablesRows,
  ),
  tpl("e1", "E1 Gestión Scrum", "Actividades A–F (EDT 1.1–1.6) · AoA con ficticias", "Entregable 1 — Gestión", sigpiEntregable1Rows),
  tpl("e2", "E2 Software core", "Actividades A–F (EDT 2.1–2.6) · Registro + Captura", "Entregable 2 — Software core", sigpiEntregable2Rows),
  tpl("e3", "E3 Alertas/Panel", "Actividades A–F (EDT 3.1–3.6) · Alertas + Panel + Mantenimiento", "Entregable 3 — Alertas/Panel", sigpiEntregable3Rows),
  tpl("e4", "E4 Hardware/Cierre", "Actividades A–F (EDT 4.1–4.6) · Sensores + marcha blanca", "Entregable 4 — Hardware/Cierre", sigpiEntregable4Rows),
  tpl("full", "Proyecto completo", "A–X enlazado (diagrama AoN) · piloto 12 meses", "Puentes Biobío — Proyecto", sigpiProyectoCompletoRows),
]

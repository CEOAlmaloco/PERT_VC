import type { FinanceInputs } from "../finance/cashFlow"

export type { FinanceInputs }
export type FormField = { id: string; label: string; placeholder?: string; multiline?: boolean }

export type EdtNode = {
  id: string
  label: string
  kind: "producto" | "entregable" | "paquete" | "actividad"
  children?: EdtNode[]
}

/** Fila PERT (re-export conceptual; datos en cpmEngine.Row) */
export type PertRow = {
  id: string
  actividad: string
  nombre: string
  procedencia: string
  optimista: string
  probable: string
  pesimista: string
  duracion?: string
}

export type GanttTask = {
  id: string
  phase: string
  activity: string
  startWeek: number
  endWeek: number
}

export type DecisionAlt = { id: string; name: string; description: string }

export type DecisionCriterion = {
  id: string
  name: string
  weight: number
  scores: Record<string, number>
}

export type KpiStat = {
  id: string
  value: string
  label: string
  impact?: string
  accent?: string
}

export type SigpiModule = {
  code: "A" | "B" | "C"
  name: string
  summary: string
  duration: string
  complexity: string
}

export type FichaRow = { label: string; value: string }

/** Bloque del documento central: título y guía fijos; contenido editable */
export type DocumentBlock = {
  id: string
  title: string
  hint: string
  content: string
  /** Fase del proceso de evaluación (no EV1/EV2) */
  part?:
    | "identificacion"
    | "contexto"
    | "diagnostico"
    | "requisitos"
    | "solucion"
    | "edt"
    | "cronograma"
    | "arquitectura"
    | "factibilidad"
    | "alternativas"
    | "financiera"
    | "especificacion"
    | "ejecucion"
    | "conclusiones"
}

export type ReportData = {
  projectTitle: string
  projectSubtitle: string
  courseCode: string
  courseName: string
  team: string
  teacher: string
  organization: string
  documentDate: string
  documentVersion: string
  teamRole: string
  roleNote: string
  closingQuote: string
  documentHeroOrg: string
  documentHeroSystem: string
  documentHeroBadge: string
  documentBlocks: DocumentBlock[]
  ficha: FichaRow[]
  kpiStats: KpiStat[]
  sigpiModules: SigpiModule[]
  flowAsIs: string
  flowToBe: string
  proposito: Record<string, string>
  contexto: Record<string, string>
  caso: Record<string, string>
  factibilidad: Record<string, string>
  edtRoot: EdtNode
  ganttWeeks: number
  ganttUnitLabel: string
  ganttTasks: GanttTask[]
  decisionTitle: string
  decisionProject: string
  decisionAlts: DecisionAlt[]
  decisionCriteria: DecisionCriterion[]
  decisionReading: string
  decisionRecommendation: string
  decisionInterpretation: string
  finance: FinanceInputs
  /** Red PERT/CPM editable (SIGPI A1–B6) */
  pertRows: PertRow[]
}

export type ReportTabId =
  | "informe"
  | "ruta"
  | "edt"
  | "pert"
  | "financiero"
  | "matriz"
  | "glosario"

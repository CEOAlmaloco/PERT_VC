import type { DocumentBlock } from "./types"

export type ProcessPhase = NonNullable<DocumentBlock["part"]>

/** Pasos del proceso de evaluación de un proyecto de software (orden del informe) */
export const EVALUATION_PROCESS: { id: ProcessPhase; step: number; label: string }[] = [
  { id: "identificacion", step: 1, label: "Identificación del proyecto y marco del estudio" },
  { id: "contexto", step: 2, label: "Contexto del cliente y del entorno" },
  { id: "diagnostico", step: 3, label: "Diagnóstico: problema, evidencias e indicadores" },
  { id: "requisitos", step: 4, label: "Requisitos de negocio y alcance" },
  { id: "solucion", step: 5, label: "Definición de la solución propuesta" },
  { id: "edt", step: 6, label: "Desglose del trabajo (EDT / WBS)" },
  { id: "cronograma", step: 7, label: "Programación, estimación de tiempos (CPM / PERT)" },
  { id: "arquitectura", step: 8, label: "Arquitectura, infraestructura y seguridad" },
  { id: "factibilidad", step: 9, label: "Análisis de factibilidad" },
  { id: "alternativas", step: 10, label: "Alternativas de implantación y decisión" },
  { id: "financiera", step: 11, label: "Evaluación financiera del proyecto" },
  { id: "especificacion", step: 12, label: "Especificación del sistema (UML)" },
  { id: "ejecucion", step: 13, label: "Modelo de ejecución e implementación" },
  { id: "conclusiones", step: 14, label: "Conclusiones, plan de acción y cierre" },
]

const STEP_BY_ID = new Map(EVALUATION_PROCESS.map((s) => [s.id, s]))

export function processStepLabel(part: ProcessPhase): string {
  const s = STEP_BY_ID.get(part)
  return s ? `Paso ${s.step} — ${s.label}` : part
}

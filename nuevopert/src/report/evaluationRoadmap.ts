import type { ReportTabId } from "./types"

export type RoadmapLink = {
  tab: ReportTabId
  label: string
  blockIds?: string[]
  note?: string
}

export type SdlcStep = {
  n: number
  name: string
  sigpi: string
  deliverables: string[]
  where: RoadmapLink[]
}

/** Flujo vertical: antes de CPM/PERT */
export const PRE_PLANNING_STEPS = [
  {
    id: "investigacion",
    title: "Investigación",
    text: "Entender el problema: mantenimiento reactivo e información dispersa.",
    where: [{ tab: "informe", label: "Documento", blockIds: ["s1-problema", "s1-ficha-organizacion"] }],
  },
  {
    id: "entrevistas",
    title: "Aclaraciones cliente",
    text: "Presupuesto $50–100M, plazo ≤1 año, proyecto público-social, supuesto digitalización.",
    where: [{ tab: "informe", label: "Documento", blockIds: ["meta-correccion-rol", "s1-5w1h"] }],
  },
  {
    id: "analisis",
    title: "Análisis",
    text: "Transformar el caso en alcance, exclusiones y módulos obligatorios.",
    where: [{ tab: "informe", label: "Documento", blockIds: ["s1-solucion", "s1-funcionalidades", "s1-exclusiones"] }],
  },
  {
    id: "requisitos",
    title: "Requisitos",
    text: "Cinco funcionalidades obligatorias + restricciones de alcance/plazo/costo.",
    where: [{ tab: "informe", label: "Documento", blockIds: ["s1-funcionalidades", "s1-exclusiones"] }],
  },
  {
    id: "propuesta",
    title: "Propuesta",
    text: "Piloto Scrum + sensores básicos + reglas de alerta (sin predictivo avanzado).",
    where: [
      { tab: "informe", label: "Documento", blockIds: ["s1-solucion", "s3-decision"] },
      { tab: "matriz", label: "Matriz decisión", note: "Alternativas de implantación" },
    ],
  },
] as const

/** 12 pasos ciclo de vida — adaptados al Caso 6 */
export const SDLC_12_STEPS: SdlcStep[] = [
  {
    n: 1,
    name: "Idea",
    sigpi: "Monitoreo de puentes municipales — Biobío (Caso 6)",
    deliverables: ["Acta de constitución", "Alcance preliminar"],
    where: [{ tab: "informe", label: "Documento", blockIds: ["meta-ficha", "s1-solucion"] }],
  },
  {
    n: 2,
    name: "Alcance",
    sigpi: "2 puentes · 3 mediciones · 5 módulos · sin predictivo avanzado",
    deliverables: ["Lista de funciones", "Exclusiones"],
    where: [{ tab: "informe", label: "Documento", blockIds: ["s1-funcionalidades", "s1-exclusiones"] }],
  },
  {
    n: 3,
    name: "Requisitos",
    sigpi: "Registro, captura, alertas, panel, planificación de mantenimiento",
    deliverables: ["Backlog priorizado", "Criterios de aceptación"],
    where: [{ tab: "informe", label: "Documento", blockIds: ["s1-funcionalidades", "meta-correccion-rol"] }],
  },
  {
    n: 4,
    name: "Diseño",
    sigpi: "Modelo de datos de puentes/sensores, umbrales, roles DOM/inspectores",
    deliverables: ["Diseño funcional", "Arquitectura básica"],
    where: [{ tab: "informe", label: "Documento", blockIds: ["s2-edt"] }],
  },
  {
    n: 5,
    name: "Prototipo",
    sigpi: "Mockups de panel, captura e inspecciones visuales",
    deliverables: ["Wireframes", "Flujo AS-IS / TO-BE"],
    where: [{ tab: "informe", label: "Documento", blockIds: ["s1-problema", "s1-solucion"] }],
  },
  {
    n: 6,
    name: "EDT / WBS",
    sigpi: "4 paquetes: Gestión Scrum, Software core, Alertas/Panel, Hardware/Cierre",
    deliverables: ["EDT jerárquica", "Diccionario EDT"],
    where: [
      { tab: "edt", label: "EDT visual", note: "Editar árbol WBS" },
      { tab: "informe", label: "Documento", blockIds: ["s2-edt", "s1-5w1h"] },
    ],
  },
  {
    n: 7,
    name: "CPM / PERT",
    sigpi: "Red por entregable E1–E4 + proyecto completo A–X (≤12 meses)",
    deliverables: ["Tabla a–m–b", "Diagrama AoA", "Gantt"],
    where: [
      { tab: "pert", label: "PERT / CPM", note: "Tabla, AoA, Gantt" },
      { tab: "informe", label: "Documento", blockIds: ["s2-hitos"] },
    ],
  },
  {
    n: 8,
    name: "Desarrollo",
    sigpi: "Sprints Scrum: Registro → Captura → Alertas → Panel → Mantenimiento",
    deliverables: ["Incrementos", "DoD por sprint"],
    where: [{ tab: "informe", label: "Documento", blockIds: ["meta-correccion-rol", "s2-edt"] }],
  },
  {
    n: 9,
    name: "Testing",
    sigpi: "UAT DOM/TI, pruebas de alertas, integración sensores",
    deliverables: ["Plan de pruebas", "Acta UAT"],
    where: [{ tab: "informe", label: "Documento", blockIds: ["s3-criterios-exito", "s2-riesgos"] }],
  },
  {
    n: 10,
    name: "Deploy",
    sigpi: "Sensores en 2 puentes + release en ambiente municipal",
    deliverables: ["Runbook", "Capacitación"],
    where: [{ tab: "informe", label: "Documento", blockIds: ["s2-hitos"] }],
  },
  {
    n: 11,
    name: "Operación",
    sigpi: "Marcha blanca: DOM/inspectores operan panel y tareas",
    deliverables: ["Manual operativo", "Ajuste de umbrales"],
    where: [{ tab: "informe", label: "Documento", blockIds: ["s3-criterios-exito"] }],
  },
  {
    n: 12,
    name: "Cierre",
    sigpi: "Traspaso operacional; escalamiento futuro a más puentes",
    deliverables: ["Acta de cierre", "Lecciones aprendidas"],
    where: [{ tab: "informe", label: "Documento", blockIds: ["s3-criterios-exito", "s3-decision"] }],
  },
]

export const WBS_ARTIFACT_BLOCKS = [
  {
    phase: "Análisis",
    items: [
      { name: "Problemáticas del caso", where: "Documento → s1-problema" },
      { name: "Funcionalidades obligatorias", where: "Documento → s1-funcionalidades" },
      { name: "Exclusiones / fuera de alcance", where: "Documento → s1-exclusiones" },
    ],
  },
  {
    phase: "Diseño",
    items: [
      { name: "EDT 4 paquetes", where: "Documento → s2-edt + pestaña EDT" },
      { name: "Roles Scrum", where: "Documento → meta-correccion-rol" },
      { name: "Hitos / releases", where: "Documento → s2-hitos" },
    ],
  },
  {
    phase: "Desarrollo",
    items: [
      { name: "Software core + alertas/panel", where: "PERT E2–E3 + EDT paquetes 2–3" },
    ],
  },
  {
    phase: "Testing · Deploy · Cierre",
    items: [
      { name: "Hardware, marcha blanca y traspaso", where: "PERT E4 + s3-criterios-exito" },
    ],
  },
]

export const PROJECT_TRIANGLE = {
  vertices: [
    { id: "tiempo", label: "Tiempo", tab: "pert" as ReportTabId, hint: "CPM/PERT, Gantt, hitos ≤12 meses" },
    { id: "costo", label: "Costo", tab: "financiero" as ReportTabId, hint: "Techo $100M CLP" },
    { id: "alcance", label: "Alcance", tab: "edt" as ReportTabId, hint: "2 puentes · 3 mediciones · 5 módulos" },
  ],
  center: "Calidad / trazabilidad",
  constraints: [
    { label: "Presupuesto / costo", tab: "financiero" as ReportTabId },
    { label: "Tiempo / programación", tab: "pert" as ReportTabId },
    { label: "Alcance", tab: "edt" as ReportTabId },
    { label: "Recursos Scrum", tab: "informe" as ReportTabId },
    { label: "Riesgo", tab: "informe" as ReportTabId },
    { label: "Calidad", tab: "informe" as ReportTabId },
  ],
}

export const EVALUATION_CHECKLIST = [
  { item: "Problema y necesidad documentados", tab: "informe" as ReportTabId },
  { item: "Alcance, exclusiones y módulos obligatorios", tab: "informe" as ReportTabId },
  { item: "Roles Scrum definidos", tab: "informe" as ReportTabId },
  { item: "EDT / WBS visual", tab: "edt" as ReportTabId },
  { item: "CPM / PERT + Gantt", tab: "pert" as ReportTabId },
  { item: "Matriz de alternativas", tab: "matriz" as ReportTabId },
  { item: "Flujo de caja (techo $100M)", tab: "financiero" as ReportTabId },
  { item: "Riesgos y criterios de éxito", tab: "informe" as ReportTabId },
]

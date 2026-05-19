import type { ReportTabId } from "./types"

export type RoadmapLink = {
  tab: ReportTabId
  label: string
  /** Bloques del documento central (ids en documentBlocks.ts) */
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

/** Flujo vertical: antes de CPM/PERT (Excalidraw) */
export const PRE_PLANNING_STEPS = [
  {
    id: "investigacion",
    title: "Investigación",
    text: "Antes de planificar: debes entender el problema.",
    where: [{ tab: "informe", label: "Documento", blockIds: ["s1-problematica-resumen", "ec-proceso-problema", "s1-indicadores"] }],
  },
  {
    id: "entrevistas",
    title: "Entrevistas",
    text: "Cliente, usuarios, stakeholders → necesidades, problemas, objetivos.",
    where: [
      { tab: "informe", label: "Documento", blockIds: ["s1-investigacion-entrevistas", "ec-proceso-necesidad", "s2-requisitos-rn"], note: "Bloque dedicado entrevistas" },
    ],
  },
  {
    id: "analisis",
    title: "Análisis",
    text: "Transformar información en requerimientos, procesos y funcionalidades.",
    where: [{ tab: "informe", label: "Documento", blockIds: ["s2-requisitos-rn", "s2-flujo-asistobe", "ec-proceso-solucion"] }],
  },
  {
    id: "requisitos",
    title: "Requisitos",
    text: "Funcionales (qué hace) y no funcionales (cómo debe comportarse).",
    where: [{ tab: "informe", label: "Documento", blockIds: ["s2-requisitos-rn", "ec-proceso-necesidad"], note: "Paso 4 del informe" }],
  },
  {
    id: "propuesta",
    title: "Propuesta",
    text: "Qué se construirá: tecnologías, arquitectura, planificación.",
    where: [
      { tab: "informe", label: "Documento", blockIds: ["ec-proceso-solucion", "ec-proceso-como", "ec-proceso-infraestructura", "s2-solucion-sigpi"] },
      { tab: "matriz", label: "Matriz decisión", note: "Alternativas de implantación" },
    ],
  },
] as const

/** 12 pasos ciclo de vida (Excalidraw — Flujo gestión de proyectos) */
export const SDLC_12_STEPS: SdlcStep[] = [
  {
    n: 1,
    name: "Idea",
    sigpi: "SIGPI — gestión integrada de incendios forestales",
    deliverables: ["Acta de origen", "Alcance preliminar"],
    where: [{ tab: "informe", label: "Documento", blockIds: ["meta-ficha", "s2-solucion-sigpi"] }],
  },
  {
    n: 2,
    name: "Alcance",
    sigpi: "Módulos C + A (Fase 1), B (Fase 2); RN01–RN07",
    deliverables: ["Lista de funciones", "Exclusiones"],
    where: [{ tab: "informe", label: "Documento", blockIds: ["s2-modulos", "s2-requisitos-rn"] }],
  },
  {
    n: 3,
    name: "Requisitos",
    sigpi: "Funcionales y no funcionales; criterios de aceptación",
    deliverables: ["RN01–RN07", "Matriz trazabilidad"],
    where: [{ tab: "informe", label: "Documento", blockIds: ["s2-requisitos-rn", "ec-proceso-necesidad"] }],
  },
  {
    n: 4,
    name: "UML 4+1 / Diseño",
    sigpi: "Vistas lógica, desarrollo, proceso, física, escenarios",
    deliverables: ["Diagramas UML", "Arquitectura por capas", "API REST"],
    where: [
      { tab: "informe", label: "Documento", blockIds: ["s9-uml-galeria", "s9-casos-uso", "s5-arq-vs-infra"], note: "Galería UML + arquitectura" },
      { tab: "glosario", label: "Glosario e índice", note: "Mapa del curso — ingeniería vs gestión" },
    ],
  },
  {
    n: 5,
    name: "Prototipo",
    sigpi: "Mockups PWA ciudadana, tablero PMU, flujos de alerta",
    deliverables: ["Wireframes", "Mockup navegable", "Flujo AS-IS / TO-BE"],
    where: [
      { tab: "informe", label: "Documento", blockIds: ["s2-prototipo-ui", "s2-flujo-asistobe", "ec-proceso-solucion"], note: "Bloque prototipo con capturas" },
    ],
  },
  {
    n: 6,
    name: "EDT / WBS",
    sigpi: "4 paquetes: Gestión, C, A, B (máx. 6 niveles)",
    deliverables: ["EDT jerárquica", "Diccionario EDT"],
    where: [
      { tab: "edt", label: "EDT visual", note: "Editar árbol WBS" },
      {
        tab: "informe",
        label: "Documento",
        blockIds: [
          "s3-edt-concepto",
          "s3-edt-desglose",
          "s3-edt-paquete-1",
          "s3-edt-paquete-2",
          "s3-edt-paquete-3",
          "s3-edt-paquete-4",
          "s3-edt-diccionario",
        ],
      },
      {
        tab: "informe",
        label: "Documento",
        blockIds: [
          "ev3-5w1h",
          "ev3-secuencia",
          "s4-cpm-concepto",
          "ev3-redes",
          "s4-red-cpm",
          "ev3-probabilidad",
          "ev3-outsourcing",
          "ev3-recursos-parte2",
        ],
      },
    ],
  },
  {
    n: 7,
    name: "CPM / PERT",
    sigpi: "Red A–H, ruta crítica, Gantt 18 meses",
    deliverables: ["Tabla a–m–b", "Diagrama AoA", "Cronograma"],
    where: [
      { tab: "pert", label: "PERT / CPM", note: "Tabla, AoA, Gantt, tabla Z" },
      { tab: "informe", label: "Documento", blockIds: ["s4-cpm-concepto", "s4-red-cpm", "s4-pert-tabla"] },
    ],
  },
  {
    n: 8,
    name: "Desarrollo",
    sigpi: "React, Node, PostGIS, cloud — por módulo",
    deliverables: ["Código", "Repos", "CI/CD"],
    where: [{ tab: "informe", label: "Documento", blockIds: ["s10-outsourcing", "ec-proceso-infraestructura"], note: "Paso 13 ejecución" }],
  },
  {
    n: 9,
    name: "Testing",
    sigpi: "UAT Dir. Riesgos, pruebas brigadas, carga",
    deliverables: ["Plan de pruebas", "Acta UAT"],
    where: [{ tab: "informe", label: "Documento", blockIds: ["s6-fact-tecnica"], note: "Criterios de aceptación por hito" }],
  },
  {
    n: 10,
    name: "Deploy",
    sigpi: "Piloto pre-verano, producción Fase 1",
    deliverables: ["Runbook", "Capacitación"],
    where: [{ tab: "informe", label: "Documento", blockIds: ["s4-red-cpm", "s4-pert-tabla"] }],
  },
  {
    n: 11,
    name: "Operación",
    sigpi: "Gestión de Riesgos + TI municipal operan SIGPI",
    deliverables: ["Manual operativo", "SLA"],
    where: [{ tab: "informe", label: "Documento", blockIds: ["s1-rol-equipo"] }],
  },
  {
    n: 12,
    name: "Mantenimiento",
    sigpi: "Soporte, mejoras, Fase 2 (módulo B)",
    deliverables: ["Backlog", "Contrato mantención"],
    where: [{ tab: "informe", label: "Documento", blockIds: ["s12-plan-accion"] }],
  },
]

/** Bloques EDT tipo Excalidraw (dónde van UML, prototipo, entrevistas) */
export const WBS_ARTIFACT_BLOCKS = [
  {
    phase: "Análisis",
    items: [
      { name: "Entrevistas / levantamiento", where: "Documento → s1-investigacion-entrevistas" },
      { name: "Requisitos funcionales y no funcionales", where: "Documento → s2-requisitos-rn" },
      { name: "BPMN / procesos AS-IS", where: "Documento → s2-bpmn-proceso y s2-flujo-asistobe" },
    ],
  },
  {
    phase: "Diseño",
    items: [
      { name: "UML (casos de uso, componentes, despliegue)", where: "Documento → s9-uml-galeria + s9-casos-uso, actividad, componentes" },
      { name: "Arquitectura e infraestructura", where: "Documento → s5-arq-vs-infra, s5-infra-modulos, ec-proceso-infraestructura" },
      { name: "Prototipo (wireframes / mockups)", where: "Documento → s2-prototipo-ui (pegar capturas Markdown)" },
    ],
  },
  {
    phase: "Desarrollo",
    items: [
      { name: "Frontend / Backend / BD", where: "EDT paquetes 2–4 + informe ejecución" },
    ],
  },
  {
    phase: "Testing · Deploy",
    items: [
      { name: "Pruebas y despliegue", where: "PERT (hitos) + documento factibilidad / cronograma" },
    ],
  },
]

export const PROJECT_TRIANGLE = {
  vertices: [
    { id: "tiempo", label: "Tiempo", tab: "pert" as ReportTabId, hint: "CPM/PERT, Gantt, hitos" },
    { id: "costo", label: "Costo", tab: "financiero" as ReportTabId, hint: "Flujo de caja, CAPEX/OPEX" },
    { id: "alcance", label: "Alcance", tab: "edt" as ReportTabId, hint: "EDT, requisitos, módulos" },
  ],
  center: "Calidad",
  constraints: [
    { label: "Presupuesto / costo", tab: "financiero" as ReportTabId },
    { label: "Tiempo / programación", tab: "pert" as ReportTabId },
    { label: "Alcance", tab: "edt" as ReportTabId },
    { label: "Recursos", tab: "informe" as ReportTabId },
    { label: "Riesgo", tab: "informe" as ReportTabId },
    { label: "Calidad", tab: "informe" as ReportTabId },
  ],
}

export const EVALUATION_CHECKLIST = [
  { item: "Problema y necesidad documentados", tab: "informe" as ReportTabId },
  { item: "Entrevistas / hallazgos de levantamiento", tab: "informe" as ReportTabId },
  { item: "Requisitos RN y alcance", tab: "informe" as ReportTabId },
  { item: "UML y arquitectura (4+1)", tab: "informe" as ReportTabId },
  { item: "Prototipo o flujos TO-BE descritos", tab: "informe" as ReportTabId },
  { item: "EDT / WBS visual", tab: "edt" as ReportTabId },
  { item: "CPM / PERT + Gantt", tab: "pert" as ReportTabId },
  { item: "Matriz de alternativas", tab: "matriz" as ReportTabId },
  { item: "Flujo de caja y VAN/TIR", tab: "financiero" as ReportTabId },
  { item: "EV3 (recursos, costos, 5W1H) en documento", tab: "informe" as ReportTabId },
  { item: "Factibilidad y conclusiones", tab: "informe" as ReportTabId },
]

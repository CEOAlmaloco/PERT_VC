import type { Row } from "../cpmEngine"
import { ganttForRows } from "./ganttFromCpm"
import type { GanttTask } from "./types"

type EstimateBand = {
  optimista: number
  probable: number
  pesimista: number
}

type ActivityKind =
  | "management"
  | "analysis"
  | "frontend"
  | "backend"
  | "integration"
  | "testing"
  | "deployment"
  | "gis"
  | "security"
  | "training"

const ESTIMATES: Record<ActivityKind, EstimateBand> = {
  management: { optimista: 1, probable: 2, pesimista: 3 },
  analysis: { optimista: 1, probable: 2, pesimista: 4 },
  frontend: { optimista: 3, probable: 5, pesimista: 9 },
  backend: { optimista: 2, probable: 4, pesimista: 7 },
  integration: { optimista: 2, probable: 3, pesimista: 6 },
  testing: { optimista: 1, probable: 2, pesimista: 4 },
  deployment: { optimista: 1, probable: 2, pesimista: 3 },
  gis: { optimista: 3, probable: 6, pesimista: 10 },
  security: { optimista: 2, probable: 3, pesimista: 5 },
  training: { optimista: 1, probable: 2, pesimista: 4 },
}

type ActivitySpec = {
  letter: string
  name: string
  pred: string
  kind: ActivityKind
}

function makeRow(id: string, letter: string, name: string, procedencia: string, kind: ActivityKind): Row {
  const band = ESTIMATES[kind]
  return {
    id,
    actividad: letter,
    nombre: name,
    procedencia,
    optimista: String(band.optimista),
    probable: String(band.probable),
    pesimista: String(band.pesimista),
  }
}

function rowsFromSpecs(templateId: string, deliverableCode: string, specs: ActivitySpec[]): Row[] {
  return specs.map((spec) =>
    makeRow(`${templateId}-${spec.letter}`, spec.letter, `(${deliverableCode}) ${spec.name}`, spec.pred, spec.kind),
  )
}

export function sigpiEntregable11Rows(): Row[] {
  return rowsFromSpecs("e1.1", "1.1", [
    { letter: "A", name: "Redactar acta de constitución del proyecto", pred: "", kind: "management" },
    { letter: "B", name: "Elaborar plan de proyecto y cronograma base", pred: "A", kind: "management" },
    { letter: "C", name: "Formalizar contrato con la Municipalidad Valle del Sol", pred: "A", kind: "management" },
    { letter: "D", name: "Realizar kick-off con equipo y municipalidad", pred: "B;C", kind: "management" },
  ])
}

export function sigpiEntregable12Rows(): Row[] {
  return rowsFromSpecs("e1.2", "1.2", [
    { letter: "A", name: "Identificar y clasificar riesgos del proyecto", pred: "", kind: "management" },
    { letter: "B", name: "Elaborar registro de riesgos con probabilidad e impacto", pred: "A", kind: "management" },
    { letter: "C", name: "Definir plan de mitigación por riesgo", pred: "B", kind: "management" },
    { letter: "D", name: "Ejecutar seguimiento periódico de riesgos", pred: "C", kind: "management" },
  ])
}

export function sigpiEntregable13Rows(): Row[] {
  return rowsFromSpecs("e1.3", "1.3", [
    {
      letter: "A",
      name: "Desarrollar materiales de capacitación para brigadas y ciudadanía",
      pred: "",
      kind: "training",
    },
    { letter: "B", name: "Ejecutar talleres de capacitación con usuarios finales", pred: "A", kind: "training" },
    { letter: "C", name: "Evaluar nivel de adopción del sistema", pred: "B", kind: "testing" },
    { letter: "D", name: "Preparar y entregar informe de cierre del proyecto", pred: "C", kind: "management" },
  ])
}

export function sigpiEntregable21Rows(): Row[] {
  return rowsFromSpecs("e2.1", "2.1", [
    { letter: "A", name: "Levantar requerimientos funcionales con la municipalidad", pred: "", kind: "analysis" },
    { letter: "B", name: "Elaborar wireframes de la aplicación ciudadana", pred: "A", kind: "analysis" },
    { letter: "C", name: "Desarrollar prototipo navegable", pred: "B", kind: "frontend" },
    { letter: "D", name: "Validar prototipo con vecinos y analistas de riesgos municipales", pred: "C", kind: "testing" },
  ])
}

export function sigpiEntregable22Rows(): Row[] {
  return rowsFromSpecs("e2.2", "2.2", [
    { letter: "A", name: "Desarrollar estructura base de la PWA offline-first", pred: "", kind: "frontend" },
    { letter: "B", name: "Integrar módulo de geolocalización automática", pred: "A", kind: "frontend" },
    { letter: "C", name: "Integrar módulo de cámara para adjuntar evidencia fotográfica", pred: "A", kind: "frontend" },
    { letter: "D", name: "Implementar lógica de sincronización offline/online", pred: "B;C", kind: "integration" },
    { letter: "E", name: "Testear aplicación en dispositivos Android e iOS en zonas rurales", pred: "D", kind: "testing" },
  ])
}

export function sigpiEntregable23Rows(): Row[] {
  return rowsFromSpecs("e2.3", "2.3", [
    { letter: "A", name: "Desarrollar API REST de recepción de reportes ciudadanos", pred: "", kind: "backend" },
    { letter: "B", name: "Implementar validación de datos y cola asíncrona", pred: "A", kind: "backend" },
    { letter: "C", name: "Integrar servicio de SMS masivos vía Twilio", pred: "B", kind: "integration" },
    { letter: "D", name: "Configurar push notifications con Firebase FCM", pred: "B", kind: "integration" },
    { letter: "E", name: "Desarrollar panel de moderación para funcionarios municipales", pred: "B", kind: "frontend" },
  ])
}

export function sigpiEntregable24Rows(): Row[] {
  return rowsFromSpecs("e2.4", "2.4", [
    { letter: "A", name: "Ejecutar pruebas funcionales de todos los flujos del módulo C", pred: "", kind: "testing" },
    { letter: "B", name: "Realizar UAT con vecinos representativos y moderadores municipales", pred: "A", kind: "testing" },
    { letter: "C", name: "Corregir observaciones del UAT", pred: "B", kind: "testing" },
    { letter: "D", name: "Desplegar módulo C en infraestructura cloud", pred: "C", kind: "deployment" },
  ])
}

export function sigpiEntregable31Rows(): Row[] {
  return rowsFromSpecs("e3.1", "3.1", [
    { letter: "A", name: "Levantar requerimientos GIS con brigadas y Directora de Riesgos", pred: "", kind: "analysis" },
    { letter: "B", name: "Mapear flujos operativos de emergencia actuales y futuros", pred: "A", kind: "analysis" },
    { letter: "C", name: "Diseñar interfaz del dashboard operativo y app de brigadas", pred: "B", kind: "analysis" },
    { letter: "D", name: "Validar diseño con analistas de riesgos y brigadas municipales", pred: "C", kind: "testing" },
  ])
}

export function sigpiEntregable32Rows(): Row[] {
  return rowsFromSpecs("e3.2", "3.2", [
    { letter: "A", name: "Implementar mapa interactivo base con PostGIS y Leaflet", pred: "", kind: "gis" },
    { letter: "B", name: "Integrar capa de focos activos en tiempo real desde módulo C", pred: "A", kind: "integration" },
    { letter: "C", name: "Integrar ubicación GPS en tiempo real de brigadas en el mapa", pred: "A", kind: "gis" },
    { letter: "D", name: "Configurar rutas de evacuación y zonas de riesgo en el mapa", pred: "A", kind: "gis" },
    { letter: "E", name: "Desarrollar dashboard operativo con KPIs e indicadores de emergencia", pred: "B;C;D", kind: "frontend" },
  ])
}

export function sigpiEntregable33Rows(): Row[] {
  return rowsFromSpecs("e3.3", "3.3", [
    { letter: "A", name: "Desarrollar app móvil offline para brigadas en terreno", pred: "", kind: "frontend" },
    { letter: "B", name: "Implementar sincronización GPS y estado de brigada con el mapa", pred: "A", kind: "integration" },
    { letter: "C", name: "Testear conectividad y funcionamiento offline en zonas sin señal", pred: "B", kind: "testing" },
    { letter: "D", name: "Instalar y configurar sala de crisis con pantallas, UPS y red local", pred: "A", kind: "deployment" },
  ])
}

export function sigpiEntregable34Rows(): Row[] {
  return rowsFromSpecs("e3.4", "3.4", [
    { letter: "A", name: "Ejecutar pruebas de carga y failover del módulo A", pred: "", kind: "testing" },
    { letter: "B", name: "Realizar UAT con brigadas municipales y analistas de riesgos", pred: "A", kind: "testing" },
    { letter: "C", name: "Corregir observaciones del UAT", pred: "B", kind: "testing" },
    { letter: "D", name: "Desplegar módulo A en producción y verificar disponibilidad mayor o igual a 99.5%", pred: "C", kind: "deployment" },
  ])
}

export function sigpiEntregable41Rows(): Row[] {
  return rowsFromSpecs("e4.1", "4.1", [
    { letter: "A", name: "Modelar base de datos relacional con extensión PostGIS", pred: "", kind: "analysis" },
    { letter: "B", name: "Diseñar separación entre BD transaccional, BD geoespacial y BD analítica", pred: "A", kind: "analysis" },
    { letter: "C", name: "Diseñar arquitectura de APIs de integración externa", pred: "B", kind: "analysis" },
    { letter: "D", name: "Mapear requerimientos técnicos de integración con CONAF, Bomberos y SENAPRED", pred: "C", kind: "analysis" },
  ])
}

export function sigpiEntregable42Rows(): Row[] {
  return rowsFromSpecs("e4.2", "4.2", [
    { letter: "A", name: "Implementar base de datos histórica y ETL de migración de datos existentes", pred: "", kind: "backend" },
    { letter: "B", name: "Desarrollar endpoints de integración para CONAF, Bomberos y SENAPRED", pred: "", kind: "backend" },
    { letter: "C", name: "Implementar analítica con mapas de calor, análisis histórico y reportes gerenciales", pred: "A", kind: "backend" },
    { letter: "D", name: "Aplicar seguridad OAuth, cifrado, logs de auditoría y cumplimiento EIPD", pred: "B;C", kind: "security" },
  ])
}

export function sigpiEntregable43Rows(): Row[] {
  return rowsFromSpecs("e4.3", "4.3", [
    { letter: "A", name: "Ejecutar pruebas de integración con organismos externos", pred: "", kind: "testing" },
    { letter: "B", name: "Ejecutar pruebas de penetración y seguridad", pred: "A", kind: "security" },
    { letter: "C", name: "Corregir observaciones de seguridad e integración", pred: "B", kind: "testing" },
    { letter: "D", name: "Desplegar módulo B en producción y verificar disponibilidad mayor o igual a 99.9%", pred: "C", kind: "deployment" },
  ])
}

export function sigpiEntregable1Rows(): Row[] {
  return sigpiEntregable11Rows()
}

export function sigpiEntregable2Rows(): Row[] {
  return sigpiEntregable21Rows()
}

export function sigpiEntregable3Rows(): Row[] {
  return sigpiEntregable31Rows()
}

export function sigpiEntregable4Rows(): Row[] {
  return sigpiEntregable41Rows()
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
  tpl("e1.1", "E1.1 Planificación", "4 actividades con B y C en paralelo y dummy de convergencia", "Entregable 1.1 — Planificación", sigpiEntregable11Rows),
  tpl("e1.2", "E1.2 Gestión de riesgos", "Cadena lineal A→B→C→D", "Entregable 1.2 — Gestión de riesgos", sigpiEntregable12Rows),
  tpl("e1.3", "E1.3 Cierre", "Cadena lineal A→B→C→D", "Entregable 1.3 — Cierre", sigpiEntregable13Rows),
  tpl("e2.1", "E2.1 Diseño y prototipo", "Cadena lineal A→B→C→D", "Entregable 2.1 — Diseño y prototipo", sigpiEntregable21Rows),
  tpl("e2.2", "E2.2 Aplicación ciudadana", "B y C salen en paralelo desde A y convergen en D", "Entregable 2.2 — Aplicación ciudadana", sigpiEntregable22Rows),
  tpl("e2.3", "E2.3 Backend y alertas", "A→B y luego C/D/E en paralelo con dummy al FIN", "Entregable 2.3 — Backend y alertas", sigpiEntregable23Rows),
  tpl("e2.4", "E2.4 Pruebas y despliegue", "Cadena lineal A→B→C→D", "Entregable 2.4 — Pruebas y despliegue", sigpiEntregable24Rows),
  tpl("e3.1", "E3.1 Diseño y prototipo", "Cadena lineal A→B→C→D", "Entregable 3.1 — Diseño y prototipo", sigpiEntregable31Rows),
  tpl("e3.2", "E3.2 Visor GIS y dashboard", "B, C y D salen en paralelo desde A y convergen en E", "Entregable 3.2 — Visor GIS y dashboard", sigpiEntregable32Rows),
  tpl("e3.3", "E3.3 App brigadas", "A→B, D en paralelo desde A y dummies al FIN", "Entregable 3.3 — App brigadas", sigpiEntregable33Rows),
  tpl("e3.4", "E3.4 Pruebas y despliegue", "Cadena lineal A→B→C→D", "Entregable 3.4 — Pruebas y despliegue", sigpiEntregable34Rows),
  tpl("e4.1", "E4.1 Diseño y modelo de datos", "Cadena lineal A→B→C→D", "Entregable 4.1 — Diseño y modelo de datos", sigpiEntregable41Rows),
  tpl("e4.2", "E4.2 Hub e integraciones", "A y B paralelas desde inicio; C depende de A; D converge desde B y C", "Entregable 4.2 — Hub e integraciones", sigpiEntregable42Rows),
  tpl("e4.3", "E4.3 Pruebas y despliegue", "Cadena lineal A→B→C→D", "Entregable 4.3 — Pruebas y despliegue", sigpiEntregable43Rows),
]

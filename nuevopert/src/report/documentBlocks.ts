import type { DocumentBlock } from "./types"
import type { ProcessPhase } from "./processSteps"

type Part = ProcessPhase

function b(
  id: string,
  title: string,
  hint: string,
  content: string,
  part: Part,
): DocumentBlock {
  return { id, title, hint, content, part }
}

/** Documento central — Caso 6 Monitoreo de puentes Biobío (Scrum) */
export function defaultDocumentBlocks(): DocumentBlock[] {
  return [
    b(
      "meta-ficha",
      "Portada — Caso 6 Monitoreo de infraestructura crítica",
      "Municipalidad Biobío · Puentes · GPY1102 · Scrum",
      `Proyecto: Sistema de Monitoreo y Gestión de Mantenimiento de Puentes Municipales
Organización: Municipalidad — Región del Biobío
Asignatura: GPY1102 Gestión de Proyectos de Software
Docente: Gabriela Soledad Ruiz Acevedo
Metodología: Ágil — Scrum
Roles: Product Owner · Scrum Master · Development Team
Presupuesto: $50.000.000 – $100.000.000 CLP
Plazo: ≤ 12 meses
Tipo: Proyecto público-social (piloto)`,
      "identificacion",
    ),
    b(
      "meta-correccion-rol",
      "Rol del equipo (Scrum)",
      "Tres roles del equipo de trabajo.",
      `Product Owner: Ariel Nicolás Exequiel Molina Milanca — prioriza Product Backlog, valida entregas y representa valor municipal.
Scrum Master: Christian Leonardo Jesús Mesa Gaete — facilita ceremonias, elimina impedimentos y cuida el proceso.
Development Team / Gerente de Proyecto: Alex Ignacio Ampuero Ahumada — diseña, desarrolla, prueba e integra; representa al equipo ante el cliente.

Somos un proyecto público-social. No es un SaaS comercial predictivo: es un piloto acotado a 2 puentes y 3 mediciones.`,
      "identificacion",
    ),
    b(
      "s1-ficha-organizacion",
      "Ficha de la organización cliente",
      "Municipalidad Biobío — Obras / infraestructura vial",
      `Nombre: Municipalidad de la Región del Biobío
Área: Obras municipales / infraestructura vial (DOM) + TI
Territorio: Puentes de conectividad local en la Región del Biobío
Misión del piloto: mejorar priorización del mantenimiento y trazabilidad del estado estructural
Modelo de financiamiento: presupuesto municipal, fondos regionales y posibles convenios`,
      "contexto",
    ),
    b(
      "s1-problema",
      "Problemáticas a abordar",
      "Tres problemas del caso",
      `1) Información histórica incompleta: antecedentes de inspecciones y reparaciones dispersos.
2) Mantenimiento reactivo: se prioriza después de identificar daños visibles.
3) Baja trazabilidad: no hay sistema integrado de alertas, inspecciones, responsables y acciones.`,
      "contexto",
    ),
    b(
      "s1-solucion",
      "Solución propuesta",
      "Alcance del piloto",
      `Desarrollar un sistema de monitoreo y gestión del mantenimiento para DOS puentes municipales, con:
• Sensores básicos (vibración e inclinación)
• Inspecciones digitales (condición visual)
• Reglas de alerta predefinidas (SIN algoritmos predictivos avanzados)
• Panel de monitoreo y planificación de mantenimiento`,
      "contexto",
    ),
    b(
      "s1-funcionalidades",
      "Funcionalidades obligatorias",
      "Cinco módulos del caso",
      `1. Registro de infraestructura — fichas, componentes, sensores, inspecciones, criticidad
2. Captura de mediciones — sensores + inspecciones visuales
3. Reglas de alerta — avisos al superar umbrales
4. Panel de monitoreo — estado, alertas activas, tareas pendientes
5. Planificación de mantenimiento — programación, asignación y seguimiento`,
      "requisitos",
    ),
    b(
      "s1-exclusiones",
      "Fuera de alcance",
      "Exclusiones explícitas",
      `• Algoritmos predictivos avanzados
• Más de 2 puentes o variables distintas a vibración / inclinación / visual
• Rediseño estructural u obras civiles de refuerzo
• Sistemas de control de tráfico o peajes`,
      "requisitos",
    ),
    b(
      "s1-5w1h",
      "Marco 5W + 1H",
      "Resumen ejecutivo del proyecto",
      `QUÉ: sistema piloto de monitoreo y gestión de mantenimiento de puentes
QUIÉN: municipalidad (cliente), DOM/TI/inspectores (usuarios), comunidad (beneficiario)
CUÁNDO: ≤ 12 meses, sprints de 2 semanas
DÓNDE: 2 puentes Biobío + plataforma digital
POR QUÉ: pasar de mantenimiento reactivo a preventivo/trazable
CÓMO: Scrum (PO, SM, Dev) + sensores básicos + reglas de alerta
CUÁNTO: $50M–$100M CLP (techo $100M)`,
      "identificacion",
    ),
    b(
      "s2-edt",
      "EDT — cuatro paquetes de trabajo",
      "Ver también pestaña EDT",
      `1. Gestión Scrum y constitución
2. Software core (Registro + Captura)
3. Alertas, panel y mantenimiento
4. Hardware en terreno, marcha blanca y cierre

Cada paquete se descompone en actividades 1.x–4.x usadas en PERT/CPM y Gantt.`,
      "edt",
    ),
    b(
      "s2-hitos",
      "Hitos principales (releases)",
      "Control gerencial del piloto",
      `H1 Mes 1 — Constitución y Kickoff Scrum
H2 Mes 3 — Release Foundation (Registro + Captura)
H3 Mes 6 — Release Alertas y Panel
H4 Mes 9 — Hardware en terreno + mantenimiento
H5 Mes 11 — Marcha blanca y capacitación
H6 Mes 12 — Cierre y traspaso operacional`,
      "cronograma",
    ),
    b(
      "s2-riesgos",
      "Riesgos iniciales de alto nivel",
      "Del Acta de Constitución",
      `• Vandalismo o robo de sensores
• Retrasos de permisos/acceso a puentes
• Umbrales mal calibrados (falsas alertas)
• Sobre-costo de hardware/conectividad
• Baja adopción de inspectores
• Integración sensor–software inestable`,
      "factibilidad",
    ),
    b(
      "s3-presupuesto",
      "Presupuesto referencial (techo $100M)",
      "Distribución orientativa",
      `Hardware sensores / instalación / conectividad …… ~35%
Desarrollo de software (equipo Scrum) …………… ~40%
Infraestructura cloud/hosting y seguridad ……… ~8%
Capacitación, marcha blanca y soporte …………… ~7%
Gestión, QA y contingencia (~10%) ……………… ~10%
TOTAL TECHO ………………………………………… $100.000.000 CLP`,
      "financiera",
    ),
    b(
      "s3-criterios-exito",
      "Criterios de éxito / cierre",
      "Aceptación municipal",
      `• 5 módulos obligatorios operativos en 2 puentes
• Sensores + inspecciones alimentan el sistema
• Alertas con responsable asignado
• Evidencia de marcha blanca y capacitación
• Firma de aceptación DOM/TI
• Presupuesto ≤ $100M y plazo ≤ 12 meses`,
      "conclusiones",
    ),
    b(
      "s3-decision",
      "Recomendación de alternativa",
      "Matriz de decisión",
      `Se recomienda Alternativa 2: equipo Scrum dedicado + proveedores de hardware,
dentro del techo presupuestario, sin contratar un SaaS predictivo completo (fuera de alcance).`,
      "alternativas",
    ),
  ]
}

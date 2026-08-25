import { sigpiEntregable1Rows, SIGPI_CRONOGRAMA_TEMPLATES } from "./sigpiPertTemplates"
import { defaultDocumentBlocks } from "./documentBlocks"
import { defaultFinanceInputs } from "./financeDefaults"
import type { FormField, ReportData, ReportTabId } from "./types"

export const TAB_LABELS: { id: ReportTabId; label: string }[] = [
  { id: "informe", label: "Documento central" },
  { id: "ruta", label: "Ruta evaluación" },
  { id: "edt", label: "EDT" },
  { id: "pert", label: "PERT / CPM" },
  { id: "financiero", label: "Flujo de caja" },
  { id: "matriz", label: "Matriz decisión" },
  { id: "glosario", label: "Glosario e índice" },
]

export const propositoFields: FormField[] = [
  { id: "que", label: "¿Qué? (producto / sistema)", multiline: true },
  { id: "quien", label: "¿Quién? (cliente / usuarios)", multiline: true },
  { id: "cuando", label: "¿Cuándo? (fases / hitos)", multiline: true },
  { id: "donde", label: "¿Dónde? (territorio / despliegue)", multiline: true },
  { id: "porque", label: "¿Por qué? (problema de fondo)", multiline: true },
  { id: "como", label: "¿Cómo? (estrategia de implantación)", multiline: true },
]

export const contextoFields: FormField[] = [
  { id: "antecedentes", label: "Antecedentes del caso", multiline: true },
  { id: "situacion", label: "Situación actual (AS-IS)", multiline: true },
  { id: "restricciones", label: "Restricciones de alcance, plazo y presupuesto", multiline: true },
  { id: "supuestos", label: "Supuestos del proyecto", multiline: true },
  { id: "stakeholders", label: "Actores e interesados", multiline: true },
  { id: "requisitos", label: "Funcionalidades obligatorias (caso)", multiline: true },
]

export const casoFields: FormField[] = [
  { id: "nombre", label: "Nombre del proyecto" },
  { id: "organismo", label: "Organización / municipalidad" },
  { id: "industria", label: "Industria / área" },
  { id: "tamano", label: "Escala del piloto" },
  { id: "ubicacion", label: "Ubicación y territorio" },
  { id: "mision", label: "Misión", multiline: true },
  { id: "vision", label: "Visión", multiline: true },
  { id: "valores", label: "Valores", multiline: true },
  { id: "problema", label: "Problemáticas a abordar", multiline: true },
  { id: "alcance", label: "Alcance y exclusiones", multiline: true },
  { id: "entregables", label: "Módulos / funcionalidades", multiline: true },
  { id: "indicadores", label: "Indicadores de éxito", multiline: true },
  { id: "entrevistas", label: "Aclaraciones del cliente (profe)", multiline: true },
  { id: "consideraciones", label: "Consideraciones Scrum / roles", multiline: true },
]

export const factibilidadFields: FormField[] = [
  { id: "tecnica", label: "Factibilidad técnica — conclusión", multiline: true },
  { id: "organizacional", label: "Factibilidad organizacional — conclusión", multiline: true },
  { id: "legal", label: "Factibilidad legal / marco público", multiline: true },
  { id: "fortalezas", label: "Fortalezas del proyecto", multiline: true },
  { id: "debilidades", label: "Debilidades y riesgos", multiline: true },
  { id: "foda", label: "Síntesis FODA", multiline: true },
  { id: "kpis", label: "KPIs mínimos de éxito", multiline: true },
]

export function defaultReportData(): ReportData {
  return {
    documentBlocks: defaultDocumentBlocks(),
    documentHeroOrg: "MUNICIPALIDAD — REGIÓN DEL BIOBÍO",
    documentHeroSystem:
      "Sistema de Monitoreo y Gestión de Mantenimiento de Puentes Municipales",
    documentHeroBadge: "CASO 6 — Acta · EDT · PERT · Scrum",
    projectTitle: "Monitoreo de infraestructura crítica — Puentes Biobío",
    projectSubtitle: "Caso 6 · GPY1102 · Gestión de Proyectos de Software · Enfoque Ágil Scrum",
    courseCode: "GPY1102",
    courseName: "Gestión de Proyectos de Software",
    team: "Ariel Molina (PO) · Christian Mesa (SM) · Alex Ampuero (Dev / GP)",
    teacher: "Gabriela Soledad Ruiz Acevedo",
    organization: "Municipalidad de la Región del Biobío",
    documentDate: "24 de agosto de 2026",
    documentVersion: "Acta v2.0 · Plan preliminar",
    teamRole: "Equipo de proyecto público-social ejecutando bajo marco Scrum (piloto municipal)",
    roleNote:
      "Somos un proyecto público-social. Roles Scrum: Product Owner = Ariel Nicolás Exequiel Molina Milanca; Scrum Master = Christian Leonardo Jesús Mesa Gaete; Development Team / Gerente de Proyecto = Alex Ignacio Ampuero Ahumada. El cliente es la municipalidad (representada académicamente por la docente).",
    closingQuote:
      "No se trata solo de sensores: se trata de pasar de un mantenimiento reactivo a uno preventivo y trazable — y que los inspectores realmente lo usen.",
    ficha: [
      { label: "Asignatura", value: "GPY1102 – Gestión de Proyectos de Software" },
      {
        label: "Equipo",
        value:
          "PO: Ariel Molina · SM: Christian Mesa · Dev/GP: Alex Ampuero",
      },
      { label: "Docente", value: "Gabriela Soledad Ruiz Acevedo" },
      { label: "Organización", value: "Municipalidad — Región del Biobío" },
      {
        label: "Proyecto",
        value: "Sistema de Monitoreo y Gestión de Mantenimiento de Puentes (Caso 6)",
      },
      { label: "Versión", value: "Acta v2.0 — Agosto 2026" },
      { label: "Metodología", value: "Ágil — Scrum (sprints de 2 semanas)" },
      { label: "Presupuesto", value: "$50.000.000 – $100.000.000 CLP (techo $100M)" },
      { label: "Plazo", value: "≤ 12 meses" },
      { label: "Patrocinador principal", value: "Alcalde / Alcaldía (GORE = cofinanciador)" },
    ],
    kpiStats: [
      {
        id: "k1",
        value: "2",
        label: "Puentes en el piloto",
        impact: "Alcance acotado para controlar complejidad del MVP.",
        accent: "#1e4d8c",
      },
      {
        id: "k2",
        value: "3",
        label: "Tipos de medición",
        impact: "Vibración, inclinación y condición visual por inspectores.",
        accent: "#0d9488",
      },
      {
        id: "k3",
        value: "5",
        label: "Módulos obligatorios",
        impact: "Registro, captura, alertas, panel y planificación de mantenimiento.",
        accent: "#ea580c",
      },
      {
        id: "k4",
        value: "≤12 m",
        label: "Plazo máximo",
        impact: "Constitución → marcha blanca → traspaso operacional.",
        accent: "#dc2626",
      },
      {
        id: "k5",
        value: "$100M",
        label: "Techo presupuestario CLP",
        impact: "Rango autorizado $50M–$100M; control de desviación < 5%.",
        accent: "#059669",
      },
      {
        id: "k6",
        value: "0",
        label: "Algoritmos predictivos avanzados",
        impact: "Fuera de alcance: solo reglas de alerta predefinidas.",
        accent: "#64748b",
      },
    ],
    sigpiModules: [
      {
        code: "R",
        name: "Registro de infraestructura",
        summary:
          "Ficha digital de puentes, componentes, sensores, inspecciones y niveles de criticidad.",
        duration: "Meses 1–3",
        complexity: "Media",
      },
      {
        code: "C",
        name: "Captura de mediciones",
        summary:
          "Registro de datos de sensores (vibración/inclinación) y resultados de inspecciones visuales.",
        duration: "Meses 2–5",
        complexity: "Media",
      },
      {
        code: "A",
        name: "Reglas de alerta",
        summary:
          "Avisos automáticos cuando una medición o condición supera umbrales establecidos.",
        duration: "Meses 4–6",
        complexity: "Media–alta",
      },
      {
        code: "P",
        name: "Panel de monitoreo",
        summary: "Visualización del estado de puentes, alertas activas y tareas pendientes.",
        duration: "Meses 5–7",
        complexity: "Media",
      },
      {
        code: "M",
        name: "Planificación de mantenimiento",
        summary:
          "Programación, asignación y seguimiento de inspecciones y acciones preventivas.",
        duration: "Meses 6–9",
        complexity: "Media",
      },
    ],
    flowAsIs:
      "Inspecciones programadas → planillas / reportes de contratistas → información dispersa → priorización reactiva tras daño visible → baja trazabilidad de alertas y responsables.",
    flowToBe:
      "Sensores + inspección digital → captura en sistema → reglas de alerta → panel de monitoreo → planificación de mantenimiento con responsable y estado → histórico trazable.",
    proposito: {
      que: "Sistema piloto de monitoreo y gestión del mantenimiento para dos puentes municipales (software + sensores básicos + inspecciones digitales + reglas de alerta).",
      quien: "Cliente: Municipalidad Región del Biobío. Usuarios: DOM, TI municipal, inspectores, contratistas. Beneficiario: comunidad (seguridad vial).",
      cuando: "≤ 12 meses: Kickoff Scrum → Foundation (registro/captura) → Alertas/Panel → Hardware en terreno → Marcha blanca → Cierre.",
      donde: "Dos puentes municipales de la Región del Biobío + plataforma digital municipal.",
      porque:
        "Información histórica incompleta, mantenimiento reactivo y nula trazabilidad integrada de alertas, inspecciones y acciones.",
      como: "Marco Ágil Scrum (PO, SM, Dev), entregas por sprints de 2 semanas, MVP sin algoritmos predictivos avanzados.",
    },
    contexto: {
      antecedentes:
        "La municipalidad administra varios puentes relevantes para la conectividad local. Hoy el control se hace con inspecciones programadas, planillas y reportes de contratistas.",
      situacion:
        "Existen cuatro puentes identificados, pero no hay monitoreo continuo. El piloto se limita a dos puentes y tres mediciones: vibración, inclinación y condición visual.",
      restricciones:
        "Presupuesto $50M–$100M CLP · plazo ≤ 1 año · sin algoritmos predictivos avanzados · solo 2 puentes y 3 variables.",
      supuestos:
        "Todo está digitalizado salvo indicación contraria · acceso físico a los 2 puentes · umbrales técnicos definidos con apoyo DOM/ingeniería · financiamiento municipal/regional disponible.",
      stakeholders:
        "Alcaldía/DOM (patrocinador), GORE (cofinanciador), TI municipal, inspectores/contratistas, universidades/empresas de ingeniería (convenios), comunidad.",
      requisitos:
        "1) Registro de infraestructura · 2) Captura de mediciones · 3) Reglas de alerta · 4) Panel de monitoreo · 5) Planificación de mantenimiento.",
    },
    caso: {
      nombre: "Sistema de Monitoreo y Gestión de Mantenimiento de Puentes Municipales",
      organismo: "Municipalidad de la Región del Biobío",
      industria: "Administración pública local / Obras municipales e infraestructura vial",
      tamano: "Piloto: 2 puentes · 3 mediciones · 5 módulos de software",
      ubicacion: "Región del Biobío, Chile — puentes de conectividad local",
      mision:
        "Mejorar la priorización del mantenimiento y disponer de información histórica confiable sobre el estado de las estructuras.",
      vision:
        "Municipalidad con capacidad preventiva de monitoreo estructural básico, trazable y escalable a más puentes tras validar el piloto.",
      valores: "Seguridad vial, transparencia del gasto público, trazabilidad, prevención y trabajo colaborativo (Scrum).",
      problema:
        "1) Información histórica incompleta/dispersa · 2) Mantenimiento reactivo (intervención tras daño visible) · 3) Baja trazabilidad de alertas, inspecciones, responsables y acciones.",
      alcance:
        "Incluye: 2 puentes, vibración, inclinación, inspección visual, reglas de alerta, panel y planificación. Excluye: predictivo avanzado, más de 2 puentes, obras civiles de refuerzo.",
      entregables:
        "Registro · Captura · Alertas · Panel · Planificación de mantenimiento · Integración sensores · Capacitación/marcha blanca · Acta de cierre.",
      indicadores:
        "Aceptación DOM/TI en 2 puentes · cierre ≤12 meses · desviación presupuesto <5% · ≥95% alertas válidas en marcha blanca · 100% alertas/inspecciones con responsable y estado.",
      entrevistas:
        "Aclaraciones cliente (docente): presupuesto mínimo $50M / máximo $100M · tiempo 1 año o menos · proyecto público-social · supuesto de digitalización si no se indica lo contrario.",
      consideraciones:
        "Roles Scrum: PO = Ariel Molina; SM = Christian Mesa; Dev/GP = Alex Ampuero. GORE es cofinanciador, no patrocinador principal. Objetivo de Calidad incluye adopción real por inspectores (no solo entrega técnica).",
    },
    factibilidad: {
      tecnica:
        "Viable como MVT/piloto: sensores básicos + software de gestión + umbrales fijos. La complejidad se controla limitando puentes/variables y evitando IA predictiva.",
      organizacional:
        "Favorable si DOM/TI patrocinan el cambio de planillas a sistema. Riesgo de adopción de inspectores: mitigar con UX simple, capacitación y acompañamiento del PO.",
      legal:
        "Proyecto público-social con fondos municipales/regionales. Debe respetar contratación pública aplicable, protección de datos operativos y trazabilidad de decisiones de mantenimiento.",
      fortalezas:
        "Problema claro y cuantificable · alcance acotado · valor social (seguridad vial) · metodología Scrum con roles definidos · presupuesto y plazo explícitos.",
      debilidades:
        "Riesgo de vandalismo/robo de sensores · calibración de umbrales · dependencia de acceso a terreno · equipo académico reducido.",
      foda:
        "F: alcance MVP claro. O: escalar a más puentes tras piloto; convenios universidad/ingeniería. D: hardware en vía pública. A: retrasos de permisos y sobrecosto de conectividad.",
      kpis:
        "2 puentes operativos · 5 módulos en producción · marcha blanca con uso real de inspectores · presupuesto ≤$100M · plazo ≤12 meses · desviación <5% · ≥95% alertas válidas.",
    },
    edtRoot: {
      id: "root",
      label: "Monitoreo de puentes municipales — Biobío (Caso 6)",
      kind: "producto",
      children: [
        {
          id: "p1",
          label: "Paquete 1 — Gestión Scrum y constitución",
          kind: "entregable",
          children: [
            { id: "p1-1", label: "1.1 Acta de constitución y kickoff", kind: "paquete" },
            { id: "p1-2", label: "1.2 Product Backlog y Definition of Done", kind: "paquete" },
            { id: "p1-3", label: "1.3 Gestión de calidad / DoD", kind: "paquete" },
            { id: "p1-4", label: "1.4 Gestión de riesgos del piloto", kind: "paquete" },
            { id: "p1-5", label: "1.5 Comunicaciones con DOM/TI", kind: "paquete" },
            { id: "p1-6", label: "1.6 Capacitaciones iniciales", kind: "actividad" },
          ],
        },
        {
          id: "p2",
          label: "Paquete 2 — Software core (Registro + Captura)",
          kind: "entregable",
          children: [
            { id: "p2-1", label: "2.1 Análisis y diseño funcional", kind: "paquete" },
            { id: "p2-2", label: "2.2 Módulo registro de infraestructura", kind: "paquete" },
            { id: "p2-3", label: "2.3 Backend captura de mediciones", kind: "paquete" },
            { id: "p2-4", label: "2.4 Integración inspecciones visuales", kind: "paquete" },
            { id: "p2-5", label: "2.5 Seguridad y roles de usuario", kind: "paquete" },
            { id: "p2-6", label: "2.6 Testing y release Foundation", kind: "actividad" },
          ],
        },
        {
          id: "p3",
          label: "Paquete 3 — Alertas, panel y mantenimiento",
          kind: "entregable",
          children: [
            { id: "p3-1", label: "3.1 Diseño de umbrales y reglas", kind: "paquete" },
            { id: "p3-2", label: "3.2 Motor de reglas de alerta", kind: "paquete" },
            { id: "p3-3", label: "3.3 Panel de monitoreo", kind: "paquete" },
            { id: "p3-4", label: "3.4 Planificación de mantenimiento", kind: "paquete" },
            { id: "p3-5", label: "3.5 Notificaciones y responsables", kind: "paquete" },
            { id: "p3-6", label: "3.6 Testing y release Alertas/Panel", kind: "actividad" },
          ],
        },
        {
          id: "p4",
          label: "Paquete 4 — Hardware, marcha blanca y cierre",
          kind: "entregable",
          children: [
            { id: "p4-1", label: "4.1 Adquisición e instalación de sensores", kind: "paquete" },
            { id: "p4-2", label: "4.2 Integración hardware–software", kind: "paquete" },
            { id: "p4-3", label: "4.3 Pruebas en terreno (2 puentes)", kind: "paquete" },
            { id: "p4-4", label: "4.4 Marcha blanca y capacitación", kind: "paquete" },
            { id: "p4-5", label: "4.5 Ajustes de umbrales", kind: "paquete" },
            { id: "p4-6", label: "4.6 Traspaso operacional y cierre", kind: "actividad" },
          ],
        },
      ],
    },
    ganttWeeks: SIGPI_CRONOGRAMA_TEMPLATES.find((t) => t.id === "e1")!.ganttWeeks(),
    ganttUnitLabel: "Semana",
    ganttTasks: SIGPI_CRONOGRAMA_TEMPLATES.find((t) => t.id === "e1")!.gantt(),
    decisionTitle: "Caso 6 — Monitoreo de infraestructura crítica (Biobío)",
    decisionProject:
      "Sistema de monitoreo y gestión de mantenimiento de 2 puentes municipales (vibración, inclinación, inspección visual)",
    decisionAlts: [
      {
        id: "alt1",
        name: "Alt.1",
        description: "Desarrollo interno municipal + compra de sensores",
      },
      {
        id: "alt2",
        name: "Alt.2",
        description: "Equipo Scrum dedicado (piloto) con proveedores de hardware",
      },
      {
        id: "alt3",
        name: "Alt.3",
        description: "SaaS llave en mano de monitoreo estructural completo",
      },
    ],
    decisionCriteria: [
      { id: "c1", name: "Ajuste al alcance MVP (2 puentes / 3 variables)", weight: 25, scores: { alt1: 3, alt2: 5, alt3: 4 } },
      { id: "c2", name: "Costo total dentro de $50–100M", weight: 25, scores: { alt1: 4, alt2: 5, alt3: 2 } },
      { id: "c3", name: "Plazo ≤ 12 meses", weight: 20, scores: { alt1: 2, alt2: 5, alt3: 4 } },
      { id: "c4", name: "Trazabilidad y adopción DOM/inspectores", weight: 15, scores: { alt1: 3, alt2: 5, alt3: 4 } },
      { id: "c5", name: "Riesgo técnico / dependencia externa", weight: 15, scores: { alt1: 3, alt2: 4, alt3: 2 } },
    ],
    decisionReading:
      "La mejor evaluada es la Alternativa 2 (equipo Scrum dedicado + hardware), por equilibrar costo, plazo y control del MVP público-social.",
    decisionRecommendation:
      "Alternativa 2 — Ejecutar el piloto con equipo Scrum (PO, SM, Dev), adquiriendo sensores básicos e integrándolos al software propio del caso, sin contratar un SaaS predictivo completo.",
    decisionInterpretation:
      "Alt.2 maximiza control del alcance y del presupuesto municipal. Alt.3 suele exceder el techo o incluir capacidades fuera de alcance (predictivo). Alt.1 atrasa por capacidad TI interna limitada.",
    finance: defaultFinanceInputs(),
    pertRows: sigpiEntregable1Rows(),
  }
}

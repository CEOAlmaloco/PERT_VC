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
  { id: "antecedentes", label: "Antecedentes y crisis 2023", multiline: true },
  { id: "situacion", label: "Situación actual (AS-IS)", multiline: true },
  { id: "restricciones", label: "Restricciones técnicas y territoriales", multiline: true },
  { id: "supuestos", label: "Supuestos del proyecto", multiline: true },
  { id: "stakeholders", label: "Actores e interesados", multiline: true },
  { id: "requisitos", label: "Requisitos de negocio (RN01–RN07)", multiline: true },
]

export const casoFields: FormField[] = [
  { id: "nombre", label: "Nombre del proyecto" },
  { id: "organismo", label: "Organización / municipalidad" },
  { id: "industria", label: "Industria / área" },
  { id: "tamano", label: "Tamaño (~funcionarios)" },
  { id: "ubicacion", label: "Ubicación y territorio" },
  { id: "mision", label: "Misión", multiline: true },
  { id: "vision", label: "Visión", multiline: true },
  { id: "valores", label: "Valores", multiline: true },
  { id: "problema", label: "Problemática (6 problemas detectados)", multiline: true },
  { id: "alcance", label: "Alcance y prioridades", multiline: true },
  { id: "entregables", label: "Módulos A, B y C", multiline: true },
  { id: "indicadores", label: "Indicadores críticos y KPIs", multiline: true },
  { id: "entrevistas", label: "Hallazgos de levantamiento", multiline: true },
  { id: "consideraciones", label: "Consideraciones para stakeholders", multiline: true },
]

export const factibilidadFields: FormField[] = [
  { id: "tecnica", label: "Factibilidad técnica — conclusión", multiline: true },
  { id: "organizacional", label: "Factibilidad organizacional — conclusión", multiline: true },
  { id: "legal", label: "Factibilidad legal — marco y garantías", multiline: true },
  { id: "fortalezas", label: "Fortalezas del proyecto SIGPI", multiline: true },
  { id: "debilidades", label: "Debilidades y riesgos", multiline: true },
  { id: "foda", label: "Síntesis FODA (mercado)", multiline: true },
  { id: "kpis", label: "KPIs mínimos de éxito (Fase 1 / 2)", multiline: true },
]

export function defaultReportData(): ReportData {
  return {
    documentBlocks: defaultDocumentBlocks(),
    documentHeroOrg: "MUNICIPALIDAD VALLE DEL SOL",
    documentHeroSystem: "Sistema Integrado de Gestión y Prevención de Incendios Forestales — SIGPI",
    documentHeroBadge: "EVALUACIÓN 3 — Estudio Técnico",
    projectTitle: "SIGPI — Estudio Técnico EV3",
    projectSubtitle: "Municipalidad Valle del Sol · GPY1101 · Mayo 2026",
    courseCode: "GPY1101",
    courseName: "Evaluación de Proyectos de Software",
    team: "Gabriel Aguila · Alex Ampuero · Christian Mesa",
    teacher: "Gabriela Soledad Ruiz Acevedo",
    organization: "Municipalidad Valle del Sol — Región San Jorge",
    documentDate: "28 de Abril de 2026",
    documentVersion: "EV3 — Mayo 2026",
    teamRole: "Empresa licitante respondiendo a bases de la Municipalidad (ChileCompra / Ley 19.886)",
    roleNote:
      "Somos una empresa privada que responde a una licitación pública. No generamos la licitación; respondemos según bases publicadas en Mercado Público.",
    closingQuote:
      "La tecnología sola no apaga incendios. Pero bien gestionada, nos permite llegar antes.",
    ficha: [
      { label: "Asignatura", value: "GPY1101 – Evaluación de Proyectos de Software" },
      { label: "Equipo", value: "Gabriel Aguila · Alex Ampuero · Christian Mesa" },
      { label: "Docente", value: "Gabriela Soledad Ruiz Acevedo" },
      { label: "Organización", value: "Municipalidad Valle del Sol – Región San Jorge" },
      { label: "Proyecto", value: "SIGPI (Sistema Integrado de Gestión y Prevención de Incendios)" },
      { label: "Versión", value: "EV3 — Mayo 2026" },
      { label: "Rol del equipo", value: "Empresa licitante respondiendo a bases municipales" },
    ],
    kpiStats: [
      {
        id: "k1",
        value: "~35 min",
        label: "Tiempo inicio incendio → reporte verificado",
        impact: "La superficie afectada crece exponencialmente con cada minuto de retraso.",
        accent: "#ea580c",
      },
      {
        id: "k2",
        value: "65%",
        label: "Vecinos desorientados al reportar",
        impact: "No saben cómo ni a quién reportar un foco temprano.",
        accent: "#dc2626",
      },
      {
        id: "k3",
        value: "73%",
        label: "Alertas percibidas como tardías",
        impact: "Confianza ciudadana deteriorada en sectores rurales.",
        accent: "#f59e0b",
      },
      {
        id: "k4",
        value: "81%",
        label: "Funcionarios con información incompleta",
        impact: "Toma de decisiones comprometida durante la crisis.",
        accent: "#1e4d8c",
      },
      {
        id: "k5",
        value: "22%",
        label: "Reportes tempranos de vecinos",
        impact: "El 78% se detecta cuando el fuego ya es visible.",
        accent: "#64748b",
      },
      {
        id: "k6",
        value: "≤40%",
        label: "Reducción superficie con 15 min de anticipación",
        impact: "Estimación de expertos en incendios forestales.",
        accent: "#059669",
      },
    ],
    sigpiModules: [
      {
        code: "C",
        name: "Valle Alerta Ciudadana",
        summary:
          "Canal oficial multicanal de reporte con geolocalización, evidencias y tolerancia offline para zonas con señal intermitente.",
        duration: "2–4 meses",
        complexity: "Baja–media",
      },
      {
        code: "A",
        name: "Valle Situación",
        summary:
          "Tablero y mapa operativo communal PMU-ready: focos, brigadas, rutas de evacuación y estado de emergencia en tiempo real.",
        duration: "4–6 meses",
        complexity: "Media",
      },
      {
        code: "B",
        name: "Valle Nexo",
        summary:
          "Hub de datos central, histórico analítico y API para interoperar con CONAF, Bomberos y SENAPRED bajo convenio.",
        duration: "6–9 meses",
        complexity: "Alta",
      },
    ],
    flowAsIs:
      "Ciudadano → llamada / WhatsApp / redes sociales → municipio (informal) → ¿bomberos? → sin mapa, sin trazabilidad ni georreferencia.",
    flowToBe:
      "Ciudadano/Brigada → Módulo C → validación Gestión de Riesgos → Tablero Módulo A → derivación Bomberos/CONAF → PMU → cierre e histórico Módulo B.",
    proposito: {
      que: "SIGPI: plataforma modular que centraliza reporte ciudadano, monitoreo GIS, alertas y datos históricos para gestión de incendios forestales.",
      quien: "Cliente: Municipalidad Valle del Sol. Usuarios: vecinos, brigadas, operadores de riesgos, patrullaje, TI municipal, Bomberos, CONAF, SENAPRED.",
      cuando: "Fase 1 (C+A) antes del próximo verano crítico; Fase 2 (B) cuando la base operativa esté validada (~18 meses referenciales).",
      donde: "Comuna Valle del Sol, Región San Jorge — territorio rural-forestal con interfaz forestal-urbana y conectividad heterogénea.",
      porque:
        "El problema no es el incendio: es llegar tarde a la información. Hoy el flujo es informal, fragmentado y sin trazabilidad.",
      como: "Alternativa 2 recomendada: proveedor especializado SaaS/llave en mano con contrato único, hitos y despliegue por fases (Fase 1 = C+A, Fase 2 = B).",
    },
    contexto: {
      antecedentes:
        "Temporada 2023: múltiples focos simultáneos en la región. Valle del Sol enfrentó tres incendios relevantes; uno afectó zonas habitadas. El alcalde y el concejo impulsaron modernización tecnológica.",
      situacion:
        "Reportes por teléfono, WhatsApp y radio. Sin canal único, sin mapa operativo, sin trazabilidad. Información dispersa en papel, Excel y reportes de bomberos.",
      restricciones:
        "Conectividad rural irregular (offline-first obligatorio); TI municipal acotado sin GIS; picos de cientos de reportes/min en emergencia; datos sensibles (geolocalización, Ley 19.628).",
      supuestos:
        "Apoyo de alta dirección (Alcalde Rivas, Directora Cisternas, Director Castillo); licitación vía ChileCompra; proveedor con experiencia B2G y SLA para sistema crítico.",
      stakeholders:
        "Alta dirección municipal, Gestión de Riesgos, TI, brigadas, vecinos, patrullaje, Bomberos, CONAF, SENAPRED, Carabineros, Contraloría/CORESAM.",
      requisitos:
        "RN01 Reducir tiempo detección (crítica) · RN02 Coordinación interinstitucional · RN03 Participación ciudadana · RN04 Monitoreo GIS · RN05 Alertas automáticas · RN06 Centralización trazable · RN07 Histórico analítico.",
    },
    caso: {
      nombre: "SIGPI — Sistema Integrado de Gestión y Prevención de Incendios Forestales",
      organismo: "Municipalidad Valle del Sol",
      industria: "Administración pública local / Subdirección de Gestión de Emergencias y Prevención de Desastres",
      tamano: "~180 funcionarios",
      ubicacion:
        "Oficinas en puntos rurales de la comuna, Región San Jorge, sur de Chile. Territorio con plantaciones de pino y eucalipto e interfaz forestal-urbana en crecimiento.",
      mision:
        "Ser referente en Chile en tecnología y participación ciudadana para la prevención y control de incendios forestales.",
      vision:
        "Municipalidad referente en Chile en tecnología y participación ciudadana para la prevención y control de incendios forestales.",
      valores: "Compromiso con la comunidad, responsabilidad ambiental, transparencia e innovación en la gestión pública.",
      problema:
        "1) Detección tardía · 2) Dificultad para reportar focos · 3) Mala coordinación de alertas · 4) Falta de información geográfica en tiempo real · 5) Limitada participación preventiva · 6) Fragmentación de la información.",
      alcance:
        "Prioridad 1: sistema integrado de gestión · Prioridad 2: reporte ciudadano · Prioridad 3: dashboards en tiempo real · Prioridad 4: alertas automatizadas · Prioridad 5: base histórica.",
      entregables:
        "Módulo C (Valle Alerta Ciudadana) · Módulo A (Valle Situación — tablero GIS) · Módulo B (Valle Nexo — hub y API). Entrega por fases, no como tres compras aisladas.",
      indicadores:
        "Tiempo inicio→reporte: 35 min (meta F1 <20 min, F2 <10 min) · Reportes canal oficial: 22% (meta F1 ≥50%, F2 ≥75%) · Georreferenciados ~10% (meta ≥80%/95%) · Disponibilidad emergencia ≥99.5%/99.9%.",
      entrevistas:
        "Alcalde Rivas: respuesta temprana y protección rural · Directora Cisternas: falta de herramientas limita coordinación · Director Castillo: oportunidad digital · Brigadas: dificultad para ubicar focos en terreno.",
      consideraciones:
        "Alcalde: valor antes del próximo verano · Gestión de Riesgos: mapa operativo centralizado · TI: proveedor reduce carga técnica · Ciudadanía: canal oficial simple · Organismos externos: APIs en Fase 2.",
    },
    factibilidad: {
      tecnica:
        "Viable técnicamente, condicionado a arquitectura en fases, nube con autoescalado, diseño offline-first, Security by Design y proveedor con experiencia GIS/alertas. TI municipal no absorbe desarrollo crítico.",
      organizacional:
        "Condiciones favorables (apoyo directivo, necesidad urgente) vs obstáculos (cultura WhatsApp, rotación política, OPEX, brecha digital rural). La barrera real es la adopción sostenida, no solo instalar software.",
      legal:
        "Ley 19.886 (licitación) · 19.628 (datos personales/EIPD) · 20.285 (transparencia) · 21.364 (SINAPRED) · 19.799 (documentos electrónicos). Cumplimiento por matriz legal, contrato y auditoría — no por buena voluntad.",
      fortalezas:
        "Problema cuantificado · diseño modular · alineación normativa · apoyo político · replicabilidad en ~120–150 municipios en riesgo forestal.",
      debilidades:
        "TI interno insuficiente · conectividad heterogénea · resistencia cultural · dependencia de acuerdos CONAF/Bomberos · sin línea base de adopción previa.",
      foda:
        "Fortalezas: indicadores claros, respaldo político, modularidad. Oportunidades: Ley 21.364, fondos FNDR/SENAPRED, brecha de oferta en municipios rurales. Amenazas: ciclos políticos, presupuesto, competencia ESRI.",
      kpis:
        "Fase 1: tiempo <20 min, ≥50% reportes oficiales, ≥80% georreferenciados, ≥99.5% disponibilidad. Fase 2: <10 min, ≥75%, ≥95%, ≥99.9%, alertas <5 min en ≥99%.",
    },
    edtRoot: {
      id: "root",
      label: "SIGPI — Sistema Integrado de Gestión y Prevención de Incendios",
      kind: "producto",
      children: [
        {
          id: "p1",
          label: "Paquete 1 — Gestión del Proyecto",
          kind: "entregable",
          children: [
            { id: "p1-1", label: "1.1 Planificación (A-D)", kind: "paquete" },
            { id: "p1-2", label: "1.2 Gestión de riesgos (A-D)", kind: "paquete" },
            { id: "p1-3", label: "1.3 Cierre (A-D)", kind: "paquete" },
          ],
        },
        {
          id: "p2",
          label: "Paquete 2 — Módulo C: Valle Alerta Ciudadana",
          kind: "entregable",
          children: [
            { id: "p2-1", label: "2.1 Diseño y prototipo (A-D)", kind: "paquete" },
            { id: "p2-2", label: "2.2 Aplicación ciudadana (A-E)", kind: "paquete" },
            { id: "p2-3", label: "2.3 Backend y alertas (A-E)", kind: "paquete" },
            { id: "p2-4", label: "2.4 Pruebas y despliegue (A-D)", kind: "paquete" },
          ],
        },
        {
          id: "p3",
          label: "Paquete 3 — Módulo A: Valle Situación",
          kind: "entregable",
          children: [
            { id: "p3-1", label: "3.1 Diseño y prototipo (A-D)", kind: "paquete" },
            { id: "p3-2", label: "3.2 Visor GIS y dashboard (A-E)", kind: "paquete" },
            { id: "p3-3", label: "3.3 App brigadas (A-D)", kind: "paquete" },
            { id: "p3-4", label: "3.4 Pruebas y despliegue (A-D)", kind: "paquete" },
          ],
        },
        {
          id: "p4",
          label: "Paquete 4 — Módulo B: Valle Nexo",
          kind: "entregable",
          children: [
            { id: "p4-1", label: "4.1 Diseño y modelo de datos (A-D)", kind: "paquete" },
            { id: "p4-2", label: "4.2 Hub e integraciones (A-D)", kind: "paquete" },
            { id: "p4-3", label: "4.3 Pruebas y despliegue (A-D)", kind: "paquete" },
          ],
        },
      ],
    },
    ganttWeeks: SIGPI_CRONOGRAMA_TEMPLATES.find((t) => t.id === "e1.1")!.ganttWeeks(),
    ganttUnitLabel: "Semana",
    ganttTasks: SIGPI_CRONOGRAMA_TEMPLATES.find((t) => t.id === "e1.1")!.gantt(),
    decisionTitle: "Caso Municipalidad Valle del Sol",
    decisionProject:
      "SIGPI — Sistema integrado de gestión y prevención de incendios forestales (reporte, monitoreo y coordinación)",
    decisionAlts: [
      { id: "alt1", name: "Alt.1", description: "Implementación gradual por fases (piloto → escala)" },
      { id: "alt2", name: "Alt.2", description: "Proveedor externo / SaaS / llave en mano" },
      { id: "alt3", name: "Alt.3", description: "Desarrollo interno + consultoría puntual" },
    ],
    decisionCriteria: [
      { id: "c1", name: "Calidad técnica de la solución", weight: 20, scores: { alt1: 4, alt2: 5, alt3: 3 } },
      { id: "c2", name: "Costo total (CAPEX+OPEX)", weight: 30, scores: { alt1: 3, alt2: 4, alt3: 2 } },
      { id: "c3", name: "Valor entregado al cliente", weight: 15, scores: { alt1: 3, alt2: 3, alt3: 2 } },
      { id: "c4", name: "Facilidad de mantenimiento", weight: 10, scores: { alt1: 3, alt2: 4, alt3: 4 } },
      { id: "c5", name: "Facilidad de instalación", weight: 25, scores: { alt1: 4, alt2: 2, alt3: 3 } },
    ],
    decisionReading:
      "La mejor evaluada es la Alternativa 2 (355 pts), seguida de cerca por la Alternativa 1 (345 pts). La Alternativa 3 queda descartada (265 pts).",
    decisionRecommendation:
      "Alternativa 2 — Proveedor especializado (SaaS/llave en mano), implementada por fases en un único contrato: Fase 1 = Módulos C + A (valor antes del verano); Fase 2 = Módulo B (interoperabilidad e histórico).",
    decisionInterpretation:
      "Alt.2 lidera por equilibrio calidad–riesgo bajo los pesos del equipo. Alt.1 es atractiva por bajo riesgo político pero cede en calidad técnica e instalación. Alt.3 es inviable para un sistema crítico de emergencias: alto riesgo técnico y costo total mayor.",
    finance: defaultFinanceInputs(),
    pertRows: sigpiEntregable1Rows(),
  }
}
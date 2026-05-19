import type { ReportTabId } from "./types"

export type CourseMapSection = {
  id: string
  title: string
  subtitle?: string
  summary: string
  bullets: string[]
  examples?: string[]
  formulas?: string[]
  table?: { cols: string[]; rows: string[][] }
  relatedTab?: ReportTabId
}

/** Contenido didáctico extraído de excalidraw.md (apuntes visuales GPY1101) */
export const EXCALIDRAW_SECTIONS: CourseMapSection[] = [
  {
    id: "proyecto-def",
    title: "¿Qué es un proyecto?",
    summary:
      "Esfuerzo temporal y único con inicio y fin, recursos limitados y objetivo claro. No es operación continua.",
    bullets: [
      "Tiene fecha de partida y de término.",
      "Produce un producto, servicio o resultado específico.",
      "En Valle del Sol: implementar SIGPI es proyecto; operarlo después es gestión continua.",
    ],
    relatedTab: "informe",
  },
  {
    id: "jerarquia",
    title: "Jerarquía: Sistema → Proceso → … → Producto",
    subtitle: "Descomposición macro a micro (ejemplo Netflix / SIGPI)",
    summary: "Del proyecto completo hasta el entregable concreto.",
    bullets: [
      "SISTEMA — el proyecto completo (ej. plataforma Netflix / SIGPI).",
      "PROCESO / SUBPROCESO — grandes áreas funcionales (autenticación, streaming, pagos).",
      "ACTIVIDADES — cosas que se hacen (validar usuario, crear tabla SQL).",
      "TAREAS — trabajo técnico específico (programar middleware, crear endpoint).",
      "PRODUCTOS — resultado generado (API funcionando, JWT, pantalla login).",
    ],
    examples: [
      "Netflix: Login → Validar usuario → Crear tabla SQL → JWT generado.",
      "SIGPI: Valle Alerta → PWA offline → Backend reportes → Panel moderación.",
    ],
    relatedTab: "edt",
  },
  {
    id: "dependencias",
    title: "Tipos de dependencias",
    summary: "No todas las dependencias son iguales; definen qué puede hacerse en paralelo.",
    bullets: [
      "OBLIGATORIAS — no puedes saltarlas (ej. no testear sin programar antes).",
      "DISCRECIONALES — decisión del equipo (frontend y backend en paralelo).",
      "EXTERNAS — dependen de terceros (esperar proveedor AWS).",
      "INTERNAS — del proyecto (frontend depende de API).",
      "MACRO → MICRO — del proyecto general a tareas pequeñas (endpoint login, tabla usuarios, docker compose).",
    ],
    examples: ["IN HOUSE: nuestro equipo desarrolla frontend.", "OUTSOURCING: empresa externa hace testing."],
    relatedTab: "pert",
  },
  {
    id: "cpm-preguntas",
    title: "¿Qué responde el diagrama CPM/PERT?",
    summary: "Ocho preguntas clave antes de armar la red.",
    bullets: [
      "¿Cuál es el tiempo mínimo del proyecto?",
      "¿Qué tareas no pueden retrasarse?",
      "¿Cuáles tienen margen (holgura)?",
      "¿Cuál es el cuello de botella?",
      "Un producto suele tener al menos 7 entregables principales (nivel 1 EDT).",
    ],
    relatedTab: "pert",
  },
  {
    id: "aoa-elementos",
    title: "Diagrama AOA (Activity on Arrow) — elementos",
    summary: "Lectura del diagrama tipo flecha entre eventos (círculos).",
    bullets: [
      "CÍRCULOS (1, 2, 3…) — hitos / eventos; NO son tareas, son estados del proyecto.",
      "FLECHAS — son las ACTIVIDADES; consumen tiempo y conectan eventos.",
      "LÍNEAS PUNTEADAS — actividades ficticias (dummy); no consumen tiempo; mantienen lógica.",
      "CUADROS INFERIORES — ES, EF, LS, LF (corazón del CPM).",
      "NÚMERO ARRIBA DEL CUADRO — holgura (slack).",
    ],
    formulas: [
      "EF = ES + Duración",
      "Holgura = LS − ES",
      "Si una actividad crítica se atrasa → TODO el proyecto se atrasa.",
    ],
    examples: ["Actividad A: ES=0, EF=6, LS=2, LF=8 → holgura 2 semanas.", "Ruta ejemplo: 8+12+6+15+8 = 49 semanas."],
    relatedTab: "pert",
  },
  {
    id: "forward-backward",
    title: "Forward pass y Backward pass",
    summary: "Cálculo de tiempos tempranos y tardíos en la red.",
    bullets: [
      "FORWARD PASS — calcula ES y EF (avance hacia adelante).",
      "BACKWARD PASS — calcula LS y LF (regreso desde el fin).",
      "ES = Early Start (inicio más temprano).",
      "EF = Early Finish (fin más temprano).",
      "LS / LF = límites tardíos sin romper la fecha final.",
    ],
    relatedTab: "pert",
  },
  {
    id: "sdlc-flujo",
    title: "Flujo de gestión de proyectos (ciclo de vida)",
    subtitle: "12 etapas — ejemplo plataforma streaming / SIGPI",
    summary: "Secuencia desde la idea hasta mantención.",
    bullets: [
      "1 IDEA — crear plataforma (Netflix / SIGPI incendios).",
      "2 ALCANCE — qué entra y qué no.",
      "3 REQUISITOS — funcionales y no funcionales.",
      "4 UML 4+1 / DISEÑO — lógico vs físico.",
      "5 PROTOTIPO — mockup navegable.",
      "6 EDT / WBS — máximo 6 niveles; dividir trabajo.",
      "7 CPM / PERT — tiempos exactos o probabilísticos (a, m, b).",
      "8 DESARROLLO — programar.",
      "9 TESTING — probar.",
      "10 DEPLOY — subir a producción.",
      "11 OPERACIÓN — sistema en uso.",
      "12 MANTENCIÓN — bugs, mejoras, nuevas funciones.",
    ],
    relatedTab: "informe",
  },
  {
    id: "ingenieria-vs-gestion",
    title: "Gestión de proyectos vs Ingeniería de software",
    summary: "Antes de planificar debes entender el problema.",
    bullets: [
      "INVESTIGACIÓN — entrevistas a cliente, usuarios, stakeholders.",
      "Descubrir: necesidades, problemas, objetivos.",
      "ANÁLISIS → requisitos, procesos, funcionalidades.",
      "PROPUESTA — tecnologías, arquitectura, planificación.",
      "Luego: actividades, procedencia, duración, recursos, costos → red CPM/PERT.",
    ],
    relatedTab: "informe",
  },
  {
    id: "cpm-vs-pert",
    title: "CPM vs PERT",
    table: {
      cols: ["", "CPM", "PERT"],
      rows: [
        ["Tiempo", "Fijo / exacto", "Probabilístico (a, m, b)"],
        ["Uso", "Tareas conocidas", "Incertidumbre"],
        ["Fórmula", "Duración única", "Te = (a + 4m + b) / 6"],
      ],
    },
    summary: "CPM = preciso; PERT = estimado con incertidumbre.",
    bullets: ["¿Cuánto tardará? ¿Qué depende de qué? ¿Cuál es la ruta crítica?"],
    relatedTab: "pert",
  },
  {
    id: "control-optim",
    title: "Control y optimización del proyecto",
    summary: "Después del cronograma: riesgos, contingencia y trade-offs.",
    bullets: [
      "TRIÁNGULO: tiempo — costo — alcance (si cambias uno, afectas los otros).",
      "Más tiempo puede reducir costo; menos tiempo suele aumentar costo (crashing).",
      "Plan de contingencia — IF proveedor no llega → servidor alternativo.",
      "Agilizar — más devs, paralelizar, outsourcing, reducir alcance.",
      "Proveedor falla = dependencia externa / riesgo → el cronograma cambia.",
    ],
    table: {
      cols: ["Tema", "Área"],
      rows: [
        ["Ruta crítica", "CPM"],
        ["Duración probabilística", "PERT"],
        ["Proveedor falla", "Riesgos"],
        ["IF/ELSE", "Contingencia"],
        ["Agilizar", "Optimización / crashing"],
      ],
    },
    relatedTab: "pert",
  },
  {
    id: "plata-pipeline",
    title: "La plata — pipeline económico",
    subtitle: "De ingresos a flujo de caja",
    summary: "Estado de resultados ≠ flujo de caja. La depreciación no sale del bolsillo.",
    bullets: [
      "1 INGRESOS = Precio × Cantidad (estudio de mercado).",
      "2 COSTOS FIJOS — sueldos, arriendo (no cambian mucho).",
      "3 COSTOS VARIABLES — AWS, ancho de banda (cambian con uso).",
      "4 UTILIDAD BRUTA = Ingresos − Costos.",
      "5 IMPUESTOS — IVA, impuesto empresa (~27%).",
      "6 UTILIDAD LÍQUIDA = Utilidad bruta − Impuestos.",
      "7 INVERSIÓN INICIAL + capital de trabajo.",
      "8 ACTIVOS FIJOS — se DEPRECIAN (tangibles).",
      "9 INTANGIBLES — se AMORTIZAN (licencias, capacitación).",
      "10 FLUJO DE CAJA — dinero REAL que entra y sale.",
    ],
    formulas: [
      "Ingresos = Precio × Cantidad",
      "Utilidad bruta = Ingresos − Costos",
      "Utilidad líquida = Utilidad bruta − Impuestos",
      "Depreciación anual = (Valor inicial − Valor residual) / Vida útil",
    ],
    examples: [
      "Netflix: suscripción $10 × 1000 usuarios = $10.000; costos $6.000 → utilidad bruta $4.000.",
      "FC: entradas (ventas cobradas, préstamos) − salidas (sueldos, AWS, impuestos).",
      "Empresa rentable en papel pero sin liquidez si cobra a 60 días y paga a 30.",
    ],
    relatedTab: "financiero",
  },
  {
    id: "fc-vs-resultado",
    title: "Flujo de caja vs utilidad",
    summary: "GND (depreciación/amortización) ajusta la diferencia.",
    bullets: [
      "Estado de resultados: incluye depreciación y amortización (GND).",
      "Flujo de caja: NO incluye GND como egreso real; se repone en ajuste.",
      "Flujo positivo = liquidez; flujo negativo = necesitas financiamiento aunque haya utilidad.",
      "Capital de trabajo = operar mientras aún no ingresa suficiente dinero.",
    ],
    relatedTab: "financiero",
  },
  {
    id: "licitacion",
    title: "Empresa que responde una licitación",
    summary: "Rol del proveedor en compras públicas (Ley 19.886).",
    bullets: [
      "El cliente NO eres tú: una organización (municipalidad) publica la necesidad.",
      "Tu equipo RESPONDE a bases en Mercado Público — no redacta la licitación.",
      "Ejemplos de solución pedida: sistema de pagos, portal web, RPA, API, ERP, SaaS.",
      "En Valle del Sol: municipalidad licita SIGPI → proveedor adjudicado implementa por hitos.",
      "Recepción conforme = acta que autoriza pago final.",
    ],
    relatedTab: "informe",
  },
  {
    id: "sigpi-aplicacion",
    title: "Aplicación al caso SIGPI (Valle del Sol)",
    summary: "Cómo encajan los conceptos del diagrama en nuestro proyecto.",
    bullets: [
      "EDT: Gestión, Módulo C (Valle Alerta), Módulo A (Valle Situación), Módulo B (Valle Nexo).",
      "PERT Fase 1: A→B→D→E ≈ 11,67 semanas; holgura en actividades no críticas.",
      "CAPEX Fase 1 ≈ USD 67k–104k; OPEX cloud + SMS.",
      "Municipalidad paga por hitos → proveedor necesita capital de trabajo.",
      "Evaluar: VAN/TIR sobre flujo de caja del contrato + beneficios sociales.",
    ],
    relatedTab: "financiero",
  },
]

export const EXCALIDRAW_INTRO = `Mapa didáctico extraído de tus apuntes Excalidraw (615 textos). Organizado por temas y enlazado a las herramientas de esta plataforma: Documento, EDT, PERT/CPM y Flujo de caja.`

import type { ReportTabId } from "./types"

export type GlossarySectionMeta = {
  id: string
  letter: string
  title: string
  question: string
}

export type GlossaryEntry = {
  id: string
  term: string
  sectionId: string
  definition: string
  mnemonic?: string
  example?: string
  caseValle?: string
  why?: string
  formula?: string
  /** Pestañas donde aplica el concepto */
  tabs?: ReportTabId[]
}

export const GLOSSARY_SECTIONS: GlossarySectionMeta[] = [
  { id: "a", letter: "A", title: "Lo básico: qué es un proyecto", question: "¿Qué es un proyecto y para quién?" },
  { id: "b", letter: "B", title: "Cómo se ordena el trabajo", question: "¿Cómo se planifica?" },
  { id: "c", letter: "C", title: "Estudio técnico", question: "¿Se puede construir?" },
  { id: "d", letter: "D", title: "Las palabras de la plata", question: "¿Hay plata? ¿de dónde sale?" },
  { id: "e", letter: "E", title: "Compras públicas", question: "¿Cómo se contrata con el Estado?" },
  { id: "f", letter: "F", title: "Cálculos Valle del Sol", question: "¿Cuánto cuesta el caso real?" },
  { id: "g", letter: "G", title: "Conexión GPY1101", question: "¿Para qué sirve en el ramo?" },
]

export const GLOSSARY_MAPA_6 = `Mapa mental — 6 preguntas del evaluador:
1. ¿QUÉ ES? → ¿Es un proyecto? ¿quién lo necesita?
2. ¿CÓMO LO ORDENO? → EDT, PERT/CPM, hitos
3. ¿SE PUEDE HACER? → Factibilidad técnica
4. ¿HAY PLATA? → Costos, inversión, flujo de caja
5. ¿ES LEGAL? → Licitación (Ley 19.886)
6. ¿VALE LA PENA? → VAN, TIR, PRI`

export const FINANCE_FORMULAS = [
  { label: "Ingresos", formula: "Ingresos = Precio × Cantidad (PVU × Q)" },
  { label: "Costo variable total", formula: "CVT = CVU × Q" },
  { label: "Margen de contribución", formula: "Ingresos − CVT" },
  { label: "Depreciación lineal", formula: "Dep = (VC − VR) / n" },
  { label: "BAI / Beneficio ADI", formula: "Ingresos − Costos − Intereses (antes de impuesto)" },
  { label: "Impuestos", formula: "Impuesto = Utilidad × tasa (ej. 27%)" },
  { label: "Flujo de caja", formula: "FC = UAI + ajuste GND + inversiones + préstamo/amort." },
  { label: "Cuota préstamo (francés)", formula: "C = P·[r(1+r)^n] / [(1+r)^n − 1]" },
  { label: "VAN", formula: "Σ FCₜ / (1+TD)ᵗ" },
  { label: "TIR", formula: "Tasa donde VAN = 0" },
]

function e(
  id: string,
  term: string,
  sectionId: string,
  definition: string,
  extra: Partial<GlossaryEntry> = {},
): GlossaryEntry {
  return { id, term, sectionId, definition, ...extra }
}

export const GLOSSARY_ENTRIES: GlossaryEntry[] = [
  e("a-proyecto", "Proyecto", "a", "Esfuerzo temporal y único con inicio y fin, recursos limitados y objetivo claro.", {
    mnemonic: "Tiene fecha de partida y de término; no es para siempre.",
    example: "Construir tu casa es proyecto; vivir en ella es operación.",
    caseValle: "Crear SIGPI es proyecto; operarlo después es gestión continua municipal.",
    why: "La asignatura evalúa proyectos, no operaciones.",
    tabs: ["informe"],
  }),
  e("a-triple", "Triple restricción", "a", "Alcance, calidad, tiempo, presupuesto y riesgos — si mueves una, las otras se mueven.", {
    caseValle: "Alcance C+A Fase 1; tiempo 6–9 meses; CAPEX ≈ USD 55–85k.",
    tabs: ["informe", "pert"],
  }),
  e("a-stakeholder", "Stakeholder", "a", "Persona u organización afectada por el proyecto.", {
    caseValle: "Alcalde, Dir. Riesgos, TI, brigadas, Bomberos, CONAF, SENAPRED, ciudadanía.",
    tabs: ["informe"],
  }),
  e("b-edt", "EDT / WBS", "b", "Descomposición jerárquica en entregables (máx. 6 niveles en clase).", {
    mnemonic: "Tronco = proyecto; ramas = entregables; hojas = tareas.",
    caseValle: "7 entregables nivel 1: Gestión, Análisis, C, A, B, Infra, Cierre.",
    tabs: ["informe", "edt"],
  }),
  e("b-cpm", "CPM", "b", "Ruta crítica con duración determinista (un solo tiempo por actividad).", {
    tabs: ["pert"],
  }),
  e("b-pert", "PERT", "b", "Estimación con optimista (a), probable (m) y pesimista (b).", {
    formula: "Te = (a + 4m + b) / 6",
    caseValle: "Útil en Fase 1 por incertidumbre en integraciones.",
    tabs: ["pert"],
  }),
  e("b-ruta-critica", "Ruta crítica", "b", "Cadena más larga; si se atrasa una actividad crítica, se atrasa todo.", {
    caseValle: "Ejemplo Fase 1: A → B → D → E.",
    tabs: ["pert"],
  }),
  e("b-holgura", "Holgura (slack)", "b", "Tiempo que una actividad no crítica puede atrasarse sin afectar el fin del proyecto.", {
    tabs: ["pert"],
  }),
  e("c-arquitectura", "Arquitectura", "c", "Diseño estructural: componentes, capas y cómo interactúan.", {
    caseValle: "Módulos C, A, B con API REST, ClaveÚnica, capas presentación–aplicación–datos.",
    tabs: ["informe"],
  }),
  e("c-infra", "Infraestructura", "c", "Base técnica: servidores, red, SO, cloud — lo que hace funcionar la arquitectura.", {
    caseValle: "Nube SaaS, 4G/5G + offline rural, tablets brigadas.",
    tabs: ["informe"],
  }),

  e("d-ingreso", "Ingresos / Beneficios por venta", "d", "Dinero que entra; Ingreso = precio × cantidad.", {
    formula: "Ingresos = PVU × Q",
    example: "Servicio $3.000.000 × 60 = $180.000.000",
    caseValle: "Para el municipio: transferencias por hitos al proveedor.",
    why: "Ingreso ≠ utilidad (aún no se restan costos).",
    tabs: ["financiero"],
  }),
  e("d-costo-var", "Costos variables (CVT)", "d", "Gastos que cambian con el volumen (hosting, SMS, APIs).", {
    formula: "CVT = CVU × Q",
    caseValle: "SMS por alerta según cantidad de incidentes.",
    tabs: ["financiero"],
  }),
  e("d-costo-fijo", "Costos fijos (CFT)", "d", "Gastos que existen aunque no haya ventas (sueldos, arriendo, licencias).", {
    caseValle: "Cloud + soporte USD 2.500–4.000/mes.",
    tabs: ["financiero"],
  }),
  e("d-inversion", "Inversión inicial", "d", "Desembolso para que el proyecto exista: activos, capital de trabajo, intangibles.", {
    caseValle: "CAPEX Fase 1 ≈ USD 55–85k + capital de trabajo.",
    tabs: ["financiero"],
  }),
  e("d-kt", "Capital de trabajo (KT)", "d", "Plata para operar antes de que entren los ingresos.", {
    caseValle: "Proveedor necesita KT porque el municipio paga por hitos cada 3–4 meses.",
    tabs: ["financiero"],
  }),
  e("d-deprec", "Depreciación", "d", "Reparto del costo de activos tangibles en su vida útil (GND — no es egreso de caja).", {
    formula: "Dep = (VC − VR) / n",
    example: "Tablet USD 600, 3 años → USD 200/año",
    caseValle: "8 tablets USD 5.000, vida 3 años.",
    tabs: ["financiero"],
  }),
  e("d-amort-int", "Amortización (intangibles)", "d", "Reparto de licencias, capacitación, software en el tiempo.", {
    tabs: ["financiero"],
  }),
  e("d-gnd", "GND (Gastos no desembolsables)", "d", "Depreciación y amortización contable — no salen del bolsillo en el período.", {
    why: "En FC se restan en resultado y se repiten (+) en ajuste de caja.",
    tabs: ["financiero"],
  }),
  e("d-interes", "Interés", "d", "Costo del dinero prestado.", {
    formula: "Interés = Saldo × tasa",
    tabs: ["financiero"],
  }),
  e("d-cuota", "Cuota de crédito", "d", "Pago periódico = interés + amortización de capital.", {
    why: "En FC sale la cuota completa; en resultado solo el interés es gasto.",
    tabs: ["financiero"],
  }),
  e("d-prestamo", "Préstamo / tabla amortización", "d", "Financiamiento con cuotas; tabla muestra cuota, interés, capital y saldo.", {
    tabs: ["financiero"],
  }),
  e("d-bai", "BAI / Beneficio ADI", "d", "Ganancia antes de impuestos.", {
    formula: "BAI = Ingresos + Costos + GND + Intereses",
    tabs: ["financiero"],
  }),
  e("d-impuesto", "Impuestos", "d", "Tributo sobre utilidades (ej. 27% Primera Categoría en Chile).", {
    formula: "Impuesto = BAI × tasa (si BAI > 0)",
    tabs: ["financiero"],
  }),
  e("d-uai", "UAI / Utilidad después de impuestos", "d", "Ganancia líquida del período.", {
    tabs: ["financiero"],
  }),
  e("d-fc", "Flujo de caja (FC)", "d", "Dinero real que entra y sale de la cuenta.", {
    formula: "FC = UAI + ajuste GND + inversiones + mov. deuda",
    mnemonic: "Resultado dice si soy rentable; FC dice si tengo plata a fin de mes.",
    tabs: ["financiero"],
  }),
  e("d-fca", "Flujo de caja acumulado (FCA)", "d", "Suma acumulada de FC — muestra recuperación de inversión.", {
    tabs: ["financiero"],
  }),
  e("d-td", "Tasa de descuento (TD)", "d", "Tasa para traer flujos futuros al presente.", {
    example: "TD = 16% en plantillas del curso.",
    tabs: ["financiero"],
  }),
  e("d-van", "VAN (Valor actual neto)", "d", "Suma de flujos descontados menos inversión inicial.", {
    formula: "VAN > 0 → aceptar; VAN < 0 → rechazar",
    tabs: ["financiero"],
  }),
  e("d-tir", "TIR", "d", "Tasa que hace VAN = 0. Si TIR > tasa exigida → conviene.", {
    tabs: ["financiero"],
  }),
  e("d-pri", "PRI", "d", "Tiempo en recuperar la inversión inicial.", {
    tabs: ["financiero"],
  }),
  e("d-pvu", "PVU (precio venta unitario)", "d", "Precio por unidad o servicio.", {
    tabs: ["financiero"],
  }),
  e("d-cvu", "CVU (costo variable unitario)", "d", "Costo variable por unidad.", {
    tabs: ["financiero"],
  }),

  e("e-licitacion", "Licitación pública", "e", "Compra estatal vía Mercado Público (Ley 19.886).", {
    caseValle: "Municipalidad publica → proveedores responden → adjudicación.",
    tabs: ["informe"],
  }),
  e("e-bases", "Bases de licitación", "e", "Reglamento: qué se pide, plazos, criterios, garantías.", {
    tabs: ["informe"],
  }),
  e("e-saas", "SaaS", "e", "Software como servicio en la nube (suscripción).", {
    caseValle: "Alternativa 2 del caso.",
    tabs: ["informe", "matriz"],
  }),

  e("f-capex", "CAPEX Fase 1 (C + A)", "f", "Inversión de desarrollo e implementación inicial.", {
    caseValle: "USD 67.000 – 104.000 (análisis, C, A, capacitación, tablets).",
    tabs: ["financiero", "informe"],
  }),
  e("f-opex", "OPEX", "f", "Costos operativos recurrentes.", {
    caseValle: "Cloud USD 2.500–4.000/mes + SMS variable.",
    tabs: ["financiero"],
  }),
  e("f-kpi-tiempo", "KPI — tiempo de reporte", "f", "Minutos entre inicio incendio y reporte verificado.", {
    caseValle: "Línea base 35 min → meta ≤ 20 min.",
    tabs: ["informe", "pert"],
  }),

  e("g-ra2-il24", "RA2 — IL2.4 (factibilidad económica)", "g", "Evalúa VAN, TIR, PRI, flujo de caja y punto de equilibrio.", {
    tabs: ["financiero", "informe"],
  }),
]

export function entriesForTab(tab: ReportTabId): GlossaryEntry[] {
  return GLOSSARY_ENTRIES.filter((x) => x.tabs?.includes(tab))
}

export function entriesForSection(sectionId: string): GlossaryEntry[] {
  return GLOSSARY_ENTRIES.filter((x) => x.sectionId === sectionId)
}

export function searchGlossary(query: string): GlossaryEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return GLOSSARY_ENTRIES
  return GLOSSARY_ENTRIES.filter(
    (x) =>
      x.term.toLowerCase().includes(q) ||
      x.definition.toLowerCase().includes(q) ||
      x.caseValle?.toLowerCase().includes(q) ||
      x.formula?.toLowerCase().includes(q),
  )
}

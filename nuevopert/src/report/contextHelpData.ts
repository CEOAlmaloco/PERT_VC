/** Contenido tipo README para botones de ayuda contextual (?) */

export type HelpBlock =
  | { type: "simple"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "formula"; text: string }
  | { type: "code"; text: string }
  | { type: "img"; src: string; alt: string; caption?: string }
  | { type: "callout"; text: string }

export type HelpTopic = {
  id: string
  title: string
  subtitle?: string
  glossaryId?: string
  blocks: HelpBlock[]
}

type HelpCfg = {
  subtitle?: string
  glossaryId?: string
  /** Una o dos frases, lenguaje cotidiano */
  simple: string
  /** Lista «de qué depende» */
  dependsOn?: string[]
  /** Cómo se calcula / lógica técnica */
  howCalc?: string[]
  formulas?: string[]
  steps?: string[]
  sigpi?: string
  img?: { src: string; alt: string; caption?: string }
  extra?: HelpBlock[]
}

function help(id: string, title: string, cfg: HelpCfg): HelpTopic {
  const blocks: HelpBlock[] = [{ type: "simple", text: cfg.simple }]

  if (cfg.dependsOn?.length) {
    blocks.push({ type: "h3", text: "De qué depende" })
    blocks.push({ type: "ul", items: cfg.dependsOn })
  }
  if (cfg.howCalc?.length) {
    blocks.push({ type: "h3", text: "Cómo se calcula (técnico)" })
    blocks.push({ type: "ul", items: cfg.howCalc })
  }
  for (const f of cfg.formulas ?? []) {
    blocks.push({ type: "formula", text: f })
  }
  if (cfg.steps?.length) {
    blocks.push({ type: "h3", text: "Pasos en esta plataforma" })
    blocks.push({ type: "ol", items: cfg.steps })
  }
  if (cfg.sigpi) {
    blocks.push({ type: "callout", text: `Valle del Sol / SIGPI: ${cfg.sigpi}` })
  }
  if (cfg.img) {
    blocks.push({ type: "img", src: cfg.img.src, alt: cfg.img.alt, caption: cfg.img.caption })
  }
  if (cfg.extra?.length) blocks.push(...cfg.extra)

  return {
    id,
    title,
    subtitle: cfg.subtitle,
    glossaryId: cfg.glossaryId,
    blocks,
  }
}

export const HELP_TOPICS: Record<string, HelpTopic> = {
  // ─── PERT / CPM ───────────────────────────────────────────────
  "pert-overview": help("pert-overview", "PERT y CPM — visión general", {
    glossaryId: "b-pert",
    simple:
      "PERT adivina cuánto puede tardar cada tarea (optimista, normal, pesimista). CPM ordena las tareas en una red y dice cuál es la ruta más larga: si se atrasa esa, se atrasa todo el proyecto.",
    dependsOn: [
      "Lista de actividades y quién va después de quién (procedencia).",
      "Tres tiempos por actividad: a, m, b (en semanas).",
      "Que pulse ACTUALIZAR para que la red use los Te calculados.",
    ],
    howCalc: [
      "Por actividad: Te = (a + 4m + b) / 6 y σ² = ((b − a) / 6)².",
      "CPM: forward/backward pass → ES, EF, LS, LF, holgura.",
      "μ del proyecto = tiempo del último evento; σ del proyecto suele sumar varianza de la ruta crítica.",
    ],
    steps: [
      "Complete la tabla (actividad, procedencia, a, m, b).",
      "Pulse ACTUALIZAR.",
      "Revise diagrama, ruta crítica y Gantt.",
      "Si piden probabilidad, use el panel Z y la tabla normal.",
    ],
    sigpi: "Caso Valle del Sol: botón «SIGPI Valle del Sol» (A1–A15 + B1–B6). AoA 1–8 solo con red A–H del curso.",
    img: { src: "/help/pert-tabla.svg", alt: "Tabla PERT", caption: "Columnas a, m, b → Te automático" },
  }),

  "pert-entregables": help("pert-entregables", "Cronograma por entregable (E1–E4)", {
    glossaryId: "b-edt",
    simple:
      "Elija E1, E2, E3 o E4: verá el PERT de ese entregable con cada subpaquete (1.1, 2.1, 3.1…). Es un cronograma por entregable. «SIGPI completo» une los cuatro; «Resumen E1–E4» muestra solo una fila por paquete.",
    dependsOn: [
      "EDT con 4 paquetes / entregables definidos.",
      "Tiempos a, m, b por entregable (suma orientativa de sus subpaquetes).",
      "E2 y E3 en paralelo tras E1; E4 cuando terminan C y A.",
    ],
    howCalc: [
      "E1 sin predecesora; E2 y E3 dependen de E1; E4 depende de E2 y E3.",
      "Te por entregable = (a + 4m + b) / 6.",
      "Duración proyecto = camino más largo hasta E4.",
    ],
    steps: [
      "Pulse E1 Gestión, E2 Módulo C, E3 Módulo A o E4 Módulo B.",
      "Revise la tabla (códigos 1.1, 2.1…) y el Gantt del entregable.",
      "Opcional: SIGPI completo para el proyecto entero; Resumen E1–E4 para vista corta.",
    ],
    sigpi:
      "E1≈Paquete 1 · E2≈2.1–2.6 · E3≈3.1–3.6 · E4≈4.1–4.6. Use «SIGPI detallado» solo si el informe pide red ampliada.",
  }),

  "pert-edt-sigpi": help("pert-edt-sigpi", "EDT → PERT (Valle del Sol)", {
    glossaryId: "b-edt",
    simple:
      "La EDT es el «árbol» de entregables (Gestión, módulo C, módulo A, módulo B). El PERT toma cada paquete de trabajo y lo convierte en actividades con duración (a, m, b) y reglas «esto va después de aquello».",
    dependsOn: [
      "EDT descompuesta en paquetes de trabajo (pestaña EDT / bloque s3).",
      "Orden lógico: licitación → análisis → diseño → desarrollo → integración → UAT → despliegue.",
      "Estimaciones a, m, b por actividad (equipo, riesgos, dependencias externas).",
    ],
    howCalc: [
      "Cada ítem EDT relevante → una fila PERT (A1…A15 Fase 1, B1…B6 Fase 2).",
      "Procedencia refleja dependencias técnicas (ej. diseño antes de backend; A4 exige A2 y A3).",
      "CPM sobre Te calcula ruta crítica y duración μ del proyecto.",
    ],
    steps: [
      "Revise la EDT (4 paquetes SIGPI).",
      "En pestaña PERT/CPM cargue «SIGPI Valle del Sol» o use los datos guardados.",
      "Ajuste a, m, b si su equipo estima distinto; pulse ACTUALIZAR.",
      "Compare μ y ruta crítica con el informe (Fase 1 ≈ 37–39 sem en ruta A1…A15).",
    ],
    sigpi:
      "Mapeo EDT→PERT: 1.1 Licitación→A1; 2.x módulo C→A2,A4,A5,A6,A7; 3.x módulo A→A3,A9,A11; integración/UAT→A12–A15; 4.x Valle Nexo→B1–B6 tras A15.",
    img: { src: "/help/pert-tabla.svg", alt: "EDT a PERT", caption: "Paquetes EDT → actividades con precedencias" },
  }),

  "pert-formula-te": help("pert-formula-te", "Tiempos a, m, b y Te", {
    glossaryId: "b-pert",
    simple:
      "a = si todo sale bien, m = lo más probable, b = si hay problemas. La app calcula Te (tiempo esperado) y lo usa en la red.",
    dependsOn: [
      "Su estimación por actividad (entrevistas, experiencia, histórico).",
      "Unidades consistentes (aquí: semanas).",
      "Que b ≥ m ≥ a (si no, revise — el pesimista no puede ser menor que el optimista).",
    ],
    howCalc: [
      "Te = (a + 4·m + b) / 6 — el «m» pesa más porque es el escenario más creíble.",
      "Varianza σ² = ((b − a) / 6)² — mide incertidumbre de esa actividad.",
    ],
    formulas: ["Te = (a + 4·m + b) / 6", "σ² = ((b − a) / 6)²"],
    steps: ["Escriba a, m, b en la tabla.", "Pulse ACTUALIZAR.", "Lea Te y σ² en las columnas."],
    sigpi: "Ej.: «Backend reportes» m=5 sem, a=3, b=8 → Te ≈ 5,17 sem.",
  }),

  "pert-procedencia": help("pert-procedencia", "Procedencia (predecesores)", {
    simple: "Dice qué tareas deben terminar antes de empezar otra. Sin eso la red no sabe el orden.",
    dependsOn: [
      "El orden lógico real del proyecto (diseño antes de programar, etc.).",
      "Si dos tareas pueden ir en paralelo (mismo predecesor).",
      "Que no cree ciclos (A espera B y B espera A).",
    ],
    howCalc: [
      "Vacío o «-» = actividad de inicio.",
      "«A» = una predecesora; «A;B» o «A,B» = ambas deben terminar antes.",
      "El motor CPM construye la red y detecta errores si falta enlace o hay ciclo.",
    ],
    sigpi: "Ej.: Frontend depende de Backend y BD → procedencia «B;C».",
  }),

  "pert-aoa-8": help("pert-aoa-8", "Diagrama AoA (flecha = actividad)", {
    glossaryId: "b-cpm",
    subtitle: "Eventos 1–8 · material GPY1101",
    simple:
      "Los círculos son momentos del proyecto (hitos). Las flechas son trabajos con duración. Lo rojo es lo que no puede atrasarse.",
    dependsOn: [
      "Tabla PERT con Te y procedencias correctas.",
      "Patrón de red tipo A–H (curso) para ver este dibujo fijo.",
      "Actividades ficticias (punteadas) solo para mantener la lógica entre eventos.",
    ],
    howCalc: [
      "Sobre cada flecha: duración Te de la actividad (A, B, C…).",
      "En cada círculo: tiempo acumulado del evento (early time).",
      "Ruta crítica = cadena más larga; holgura 0 en esas actividades.",
    ],
    steps: [
      "Cargue ejemplo A–H o su red compatible.",
      "ACTUALIZAR.",
      "Compare rojo (crítico) con la lista «Ruta crítica» del panel.",
      "Pulse ? Guía AoA en la esquina para este texto.",
    ],
    sigpi: "Su informe puede usar AoN si la red no es A–H; el contenido SIGPI es el mismo, cambia solo el dibujo.",
    img: { src: "/help/aoa-diagrama.svg", alt: "AoA", caption: "Círculo = evento · Flecha = actividad" },
  }),

  "pert-ruta-critica": help("pert-ruta-critica", "Ruta crítica", {
    glossaryId: "b-ruta-critica",
    simple: "Es la cadena de tareas más larga. Si una de ellas se atrasa un día, el proyecto entero se atrasa un día.",
    dependsOn: [
      "Todas las duraciones Te de las actividades.",
      "Las dependencias (quién va después de quién).",
      "Que no haya errores en la red.",
    ],
    howCalc: [
      "CPM marca actividades con holgura total = 0.",
      "La secuencia de esas actividades de inicio a fin es la ruta crítica.",
      "Duración del proyecto μ = suma (o camino) de esa ruta.",
    ],
    sigpi: "Fase 1 ejemplo informe: A1→A2→A4→…→A15 ≈ 37 semanas.",
  }),

  "pert-holgura": help("pert-holgura", "Holgura", {
    glossaryId: "b-holgura",
    simple: "Es el «colchón» de una tarea que NO es crítica. Puede atrasarse ese tiempo sin retrasar el fin del proyecto.",
    dependsOn: ["Diferencia entre inicio más tarde y más temprano de la actividad."],
    howCalc: ["Holgura total HT = LS − ES = LF − EF.", "HT = 0 → actividad crítica."],
    formulas: ["HT = LS − ES"],
  }),

  "pert-z-tabla": help("pert-z-tabla", "Probabilidad (Z y tabla normal)", {
    simple:
      "Pregunta: «¿qué chance hay de terminar en X semanas?». Se compara X con la duración esperada μ y la dispersión σ.",
    dependsOn: [
      "μ y σ del proyecto (panel de estadísticas, tras ACTUALIZAR).",
      "El plazo X que usted quiere evaluar.",
      "Tabla de distribución normal del curso.",
    ],
    howCalc: [
      "Z = (X − μ) / σ.",
      "Con Z busca en la tabla el valor P(Z ≤ z) = probabilidad de terminar en X o antes.",
      "Si σ ≈ 0, no aplica (proyecto casi sin incertidumbre).",
    ],
    formulas: ["Z = (X − μ) / σ"],
    steps: ["Escriba x en el panel PERT.", "Lea Z y probabilidad.", "Cruce con la tabla de abajo."],
    img: { src: "/help/pert-z.svg", alt: "Z", caption: "X = meta · μ = esperado · σ = dispersión" },
  }),

  "pert-gantt": help("pert-gantt", "Carta Gantt", {
    simple: "Calendario visual: qué fase va en qué mes. Es para mostrar al cliente, no se recalcula solo desde PERT.",
    dependsOn: [
      "Fases acordadas (licitación, C+A, B).",
      "Hitos del contrato (UAT, verano, cierre).",
    ],
    sigpi: "Fase 0 licitación · Fase 1 C+A · Fase 2 B — coherente con Gantt del informe.",
  }),

  // ─── FINANZAS ─────────────────────────────────────────────────
  "finance-overview": help("finance-overview", "Flujo de caja — visión general", {
    glossaryId: "d-fc",
    simple:
      "Aquí se ve si el proyecto deja plata en el bolsillo, no solo si «ganó» en papel. Ingresos del contrato menos costos, impuestos, inversiones y préstamos.",
    dependsOn: [
      "Ingresos por período (pagos del municipio).",
      "Costos variables y fijos.",
      "Inversión período 0 y depreciación/amortización.",
      "Tasa de impuesto y, si aplica, préstamo.",
    ],
    howCalc: [
      "Resultado: BAI → impuesto → UAI.",
      "Caja: UAI + ajuste GND + movimientos de inversión y deuda.",
      "VAN y TIR se calculan desde la fila «Flujo de caja».",
    ],
    steps: [
      "Elija plantilla SIGPI o cargue la suya.",
      "Complete ingresos y costos base.",
      "Revise estado de flujos (editable).",
      "Mire VAN, TIR y FCA al final.",
    ],
    sigpi: "Usted es el proveedor licitante: ingresos = lo que paga Valle del Sol por hitos, no suscripciones ciudadanas.",
    img: { src: "/help/finanzas-flujo.svg", alt: "Flujo", caption: "Utilidad ≠ dinero en caja" },
  }),

  "finance-ingresos": help("finance-ingresos", "Ingresos", {
    glossaryId: "d-ingreso",
    simple:
      "Es el dinero que ENTRA a su empresa por el contrato SIGPI. Cada vez que la municipalidad paga un hito, eso es un ingreso en ese período.",
    dependsOn: [
      "Contrato y calendario de pagos (no cuándo usted factura internamente, sino cuándo cobra).",
      "Fases: Fase 1 (módulos C+A) y Fase 2 (módulo B).",
      "Adjudicación, avances, UAT, despliegue — cada uno puede ser un hito.",
      "Moneda (USD en informe vs CLP en plantilla — use un criterio solo).",
    ],
    howCalc: [
      "Ingresos del período t = suma de pagos recibidos en t.",
      "Modelo académico: Ingresos = precio × cantidad (aquí «cantidad» = hitos o % de avance).",
      "En la app: fila «Ingresos» o parámetro «revenues» por período (valores positivos).",
    ],
    formulas: ["Ingresos = Σ pagos del período", "Ej. académico: Ingresos = PVU × Q"],
    sigpi:
      "Contrato referencia ~USD 115k total (USD 65k Fase 1 C+A + USD 50k Fase 2 B). Reparta por períodos según bases: ej. 40k al medio del año 1, resto al cierre.",
  }),

  "finance-costo-variable": help("finance-costo-variable", "Costos variables", {
    glossaryId: "d-costo-var",
    simple:
      "Gastos que SUBEN cuando el sistema se usa más: más alertas, más SMS, más tráfico en el mapa. Si no hay emergencias, gastan menos.",
    dependsOn: [
      "Cantidad de uso (Q): reportes, SMS, GB en mapa, almacenamiento de fotos.",
      "Precio unitario de cada servicio (CVU): costo por SMS, por GB, etc.",
      "Temporada (verano = más incidentes en Valle del Sol).",
    ],
    howCalc: [
      "CVT = CVU × Q (costo variable total).",
      "En la app: fila «Costos variables» por período (valores negativos).",
      "Estime Q conservador en año pico y otro en año normal si tiene varios períodos.",
    ],
    formulas: ["CVT = CVU × Q"],
    sigpi: "Ej.: cloud variable, Twilio/SMS por alerta, ancho de banda GIS en emergencia. Informe ~USD 28k/año variables.",
    img: { src: "/help/finanzas-costos.svg", alt: "Variables", caption: "Suben con el uso" },
  }),

  "finance-costo-fijo": help("finance-costo-fijo", "Costos fijos", {
    glossaryId: "d-costo-fijo",
    simple:
      "Gastos que paga IGUAL aunque no haya alertas: sueldos del equipo, arriendo, licencias base, cloud mínimo. El proyecto «encendido» cuesta esto.",
    dependsOn: [
      "Tamaño del equipo (PM, dev, QA, GIS) y meses de contrato.",
      "Arriendo, herramientas, seguros, contador.",
      "Licencias y cloud con tarifa mínima mensual.",
      "NO incluye compra grande de equipos (eso va en inversión P0).",
    ],
    howCalc: [
      "Liste cada gasto fijo mensual → multiplique por meses del período → sume.",
      "CFT período = Σ gastos fijos del período.",
      "En la app: «Costos fijos» negativos por columna P1, P2…",
    ],
    formulas: ["CFT = Σ (gastos fijos del período)"],
    sigpi: "Informe ~USD 62k fijos (equipo 12 meses) + OPEX base cloud. Salarios meses 1–3 antes del primer cobro → relacionado con capital de trabajo.",
    img: { src: "/help/finanzas-costos.svg", alt: "Fijos", caption: "Casi no cambian con # de alertas" },
  }),

  "finance-depreciacion": help("finance-depreciacion", "Depreciación y amortización", {
    glossaryId: "d-deprec",
    simple:
      "Repartir el costo de compras grandes en varios años «en el papel». No es que pague otra vez cada mes: es contabilidad. Las licencias y capacitaciones se amortizan; PCs y tablets se deprecian.",
    dependsOn: [
      "Valor de compra (VC) de equipos, muebles e intangibles.",
      "Vida útil en años (cuánto durará útil).",
      "Valor residual (cuánto vale al final, a veces 0).",
      "Número de períodos del flujo.",
    ],
    howCalc: [
      "Depreciación lineal = (VC − VR) / vida útil → reparte en cada período.",
      "Amortización intangible = costo / vida (sin residual usualmente).",
      "GND: baja el BAI pero en flujo de caja se suma de vuelta (ajuste GND).",
    ],
    formulas: [
      "Dep anual = (VC − VR) / n",
      "Amort intangible = costo / n",
    ],
    sigpi: "Tablets brigadas, TVs sala crisis, PCs moderación ~USD 4.045/año depreciación. Software/capacitación ~USD 9k/año amortización.",
  }),

  "finance-kt": help("finance-kt", "Capital de trabajo (P0)", {
    glossaryId: "d-kt",
    simple:
      "Plata de su bolsillo (o crédito) para pagar sueldos y proveedores MIENTRAS el municipio aún no paga el hito. Sin esto, puede quebrar aunque el proyecto sea rentable.",
    dependsOn: [
      "Desfase entre cuándo usted paga (mes 1–3) y cuándo cobra (hitos M6, M12…).",
      "Salarios, cloud inicial, licencias, garantía de licitación.",
      "Política de pagos del contrato público.",
    ],
    howCalc: [
      "KT inicial ≈ costos de operar en el «valle» antes del primer ingreso fuerte.",
      "En la app: «Capital de trabajo P0» negativo en período 0.",
      "No es costo fijo repetido cada año: es desembolso inicial de caja.",
    ],
    sigpi: "Informe ~USD 22,3k: salarios 3 meses + cloud + licencias + garantía 2% licitación.",
  }),

  "finance-equipos-p0": help("finance-equipos-p0", "Inversión equipos y muebles (P0)", {
    simple:
      "Compras del inicio: servidores, tablets para brigadas, muebles de oficina. Salen de caja una vez al principio.",
    dependsOn: [
      "CAPEX del proyecto (hardware, infra física).",
      "Qué compra el proveedor vs qué pone la municipalidad.",
      "Vida útil para la depreciación posterior.",
    ],
    howCalc: [
      "Período 0: «Inversión equipos» + «Inversión muebles» (negativos).",
      "Parámetros VC y vida alimentan filas GND en años siguientes.",
    ],
    sigpi: "Tablets x12, equipo sala crisis, PCs — alineado con bloque depreciación del informe.",
  }),

  "finance-impuesto": help("finance-impuesto", "Impuesto (27 %)", {
    glossaryId: "d-impuesto",
    simple: "Si hubo ganancia antes de impuesto (BAI positivo), el Estado lleva un % (en Chile Primera Categoría suele usarse 27 % en el curso).",
    dependsOn: [
      "BAI del período (ingresos + costos + GND + intereses).",
      "Tasa configurada (campo «Impuesto % sobre BAI»).",
      "Solo se aplica si BAI > 0 en ese período.",
    ],
    howCalc: ["Impuesto = − tasa × BAI (si BAI > 0).", "UAI = BAI + impuesto (impuesto es negativo)."],
    formulas: ["Impuesto = BAI × 27% (si BAI > 0)"],
    sigpi: "Sobre utilidad del proveedor del contrato SIGPI, no sobre el presupuesto municipal total.",
  }),

  "finance-prestamo": help("finance-prestamo", "Préstamo", {
    glossaryId: "d-prestamo",
    simple:
      "Plata prestada para arrancar el proyecto. Entra al inicio; después paga cuotas. La cuota baja la caja; solo el interés baja la «ganancia» contable.",
    dependsOn: [
      "Monto, tasa por período y plazo (Excel 2.4.3).",
      "Si activó «Incluir préstamo» y plantilla con préstamo.",
    ],
    howCalc: [
      "Cuota sistema francés: C = P × [r(1+r)^n] / [(1+r)^n − 1].",
      "Flujo: entrada del principal en P0; salidas por cuota.",
      "Resultado: solo interés como gasto; amortización de capital no es gasto contable.",
    ],
    formulas: ["C = P × [r(1+r)^n] / [(1+r)^n − 1]"],
    steps: ["Active checkbox préstamo.", "Complete monto y tasa.", "Revise tabla amortización y filas de deuda."],
  }),

  "finance-flujo-caja": help("finance-flujo-caja", "Flujo de caja (FC) y acumulado (FCA)", {
    glossaryId: "d-fc",
    simple:
      "Es el dinero real que entra y sale de la cuenta cada período. Puede ganar en papel y aun así quedarse sin plata si el municipio paga tarde.",
    dependsOn: [
      "UAI de cada período.",
      "Ajuste GND (devuelve depreciación/amortización a caja).",
      "Inversiones P0 y movimientos de préstamo.",
    ],
    howCalc: [
      "FCₜ = UAI + ajuste GND + inversiones + principal préstamo (según diseño 2.5.4).",
      "FCA = suma acumulada de FC — muestra cuándo recupera la inversión.",
    ],
    formulas: ["FC = UAI + ajuste GND + inversiones + deuda"],
    sigpi: "Informe: utilidad ~USD 18k pero meses M1–M5 negativos en caja hasta hito M6 (+40k). Por eso el KT.",
    img: { src: "/help/finanzas-flujo.svg", alt: "FC", caption: "Caja ≠ utilidad" },
  }),

  "finance-van-tir": help("finance-van-tir", "VAN y TIR", {
    glossaryId: "d-van",
    simple:
      "VAN: si pongo todos los flujos en «plata de hoy», ¿gano o pierdo? TIR: qué rentabilidad implicita tiene el proyecto. Si VAN > 0 o TIR alta, conviene (según regla del curso).",
    dependsOn: [
      "Toda la fila «Flujo de caja» por período.",
      "Tasa de descuento TD (la da el profesor o usted la justifica).",
    ],
    howCalc: [
      "VAN = Σ FCₜ / (1 + TD)^t.",
      "TIR = tasa donde VAN = 0 (cálculo numérico en la app).",
      "Compare TIR con TD o con tasa mínima exigida.",
    ],
    formulas: ["VAN = Σ [ FCₜ / (1 + TD)^t ]", "TIR: VAN(TIR) = 0"],
    sigpi: "Evalúa si le conviene como empresa postular y ejecutar SIGPI, no si el municipio «gana».",
  }),

  "finance-td": help("finance-td", "Tasa de descuento (TD)", {
    glossaryId: "d-td",
    simple:
      "Es «qué tan caro es el dinero en el tiempo». Flujos futuros valen menos hoy. A mayor TD, más exigente es el proyecto para dar VAN positivo.",
    dependsOn: [
      "Costo de oportunidad (qué ganaría en otro lado con la misma plata).",
      "Riesgo del proyecto (público, tecnológico).",
      "Lo que indique el enunciado (16 % es común en plantillas del ramo).",
    ],
    howCalc: ["Se ingresa como % anual en parámetros.", "Se usa en VAN período por período."],
    sigpi: "Documente: «TD 16% según material 2.5.4» o cite tasa bancaria + prima de riesgo.",
  }),

  "finance-recalcular": help("finance-recalcular", "Recalcular y sincronizar", {
    simple:
      "«Sincronizar» = al cambiar ingresos/costos/activos, la tabla se regenera sola. «Recalcular» = botón para forzar todo desde cero y borrar ediciones manuales en rubros.",
    dependsOn: [
      "Parámetros de arriba (ingresos, costos, equipos, impuesto, préstamo).",
      "Checkbox «Sincronizar rubros».",
    ],
    howCalc: [
      "Motor interno: BAI → impuesto → UAI → GND → FC → FCA.",
      "VAN/TIR leen la fila FC resultante (aunque edite celdas a mano).",
    ],
    steps: [
      "Edite parámetros o tabla.",
      "Si desincronizó, pulse Recalcular.",
      "Revise VAN al final.",
    ],
  }),

  "finance-bai-uai": help("finance-bai-uai", "BAI y utilidad después de impuesto", {
    glossaryId: "d-bai",
    simple:
      "BAI = ganancia antes de impuesto. UAI = lo que «queda» después del 27 %. Es resultado en papel, no necesariamente lo que hay en el banco.",
    dependsOn: ["Ingresos, costos variables, costos fijos, GND, intereses del préstamo."],
    howCalc: [
      "BAI = ingresos + costos var + costos fijos + GND equipos + GND muebles + GND intangibles + intereses.",
      "Impuesto solo si BAI > 0.",
      "UAI = BAI + impuesto.",
    ],
    formulas: ["BAI = Ingresos + Costos + GND + Intereses", "UAI = BAI − Impuesto"],
  }),

  "finance-gnd": help("finance-gnd", "GND (gasto no desembolsable)", {
    glossaryId: "d-gnd",
    simple:
      "Depreciación y amortización: bajan la ganancia contable pero NO son un cheque que sale ese mes. Por eso en flujo de caja se «corrigen».",
    dependsOn: ["Depreciación de equipos/muebles.", "Amortización de intangibles.", "Vida útil y valor de compra."],
    howCalc: [
      "En resultado: GND negativo (gasto).",
      "En FC: ajuste GND positivo (misma magnitud, signo opuesto al efecto en caja).",
    ],
    sigpi: "Tablets y licencias SIGPI generan GND cada año aunque ya los pagó en P0 o en compra inicial.",
  }),

  "finance-fca": help("finance-fca", "Flujo de caja acumulado (FCA)", {
    glossaryId: "d-fca",
    simple: "Suma ir sumando el flujo de cada período. Si pasa de negativo a positivo, ahí recuperó la inversión (punto de equilibrio en caja).",
    dependsOn: ["Todos los FC período a período."],
    howCalc: ["FCAₜ = FCAₜ₋₁ + FCₜ.", "KPI «FCA final» = último valor de la fila acumulada."],
    sigpi: "Informe: negativo hasta hito M6, luego sube con pagos municipales.",
  }),
}

export function getHelpTopic(id: string): HelpTopic | undefined {
  return HELP_TOPICS[id]
}

/** Mapeo id glosario → tema de ayuda contextual */
export const GLOSSARY_TO_HELP: Partial<Record<string, string>> = {
  "a-proyecto": "finance-overview",
  "a-triple": "finance-overview",
  "b-edt": "pert-entregables",
  "b-pert": "pert-formula-te",
  "b-cpm": "pert-aoa-8",
  "b-ruta-critica": "pert-ruta-critica",
  "b-holgura": "pert-holgura",
  "d-ingreso": "finance-ingresos",
  "d-costo-var": "finance-costo-variable",
  "d-costo-fijo": "finance-costo-fijo",
  "d-inversion": "finance-equipos-p0",
  "d-kt": "finance-kt",
  "d-deprec": "finance-depreciacion",
  "d-amort-int": "finance-depreciacion",
  "d-gnd": "finance-gnd",
  "d-interes": "finance-prestamo",
  "d-cuota": "finance-prestamo",
  "d-prestamo": "finance-prestamo",
  "d-bai": "finance-bai-uai",
  "d-impuesto": "finance-impuesto",
  "d-uai": "finance-bai-uai",
  "d-fc": "finance-flujo-caja",
  "d-fca": "finance-fca",
  "d-td": "finance-td",
  "d-van": "finance-van-tir",
  "d-tir": "finance-van-tir",
  "d-pri": "finance-van-tir",
  "d-pvu": "finance-ingresos",
  "d-cvu": "finance-costo-variable",
}

/** Fila editable tipo Excel */
export type Row = {
  id: string
  /** Código único de la actividad (clave), ej. A, REQ1 */
  actividad: string
  /** Nombre legible (valor), ej. Comprar ingredientes */
  nombre: string
  /** Códigos separados por ; o , — deben existir en otra fila */
  procedencia: string
  /** Tiempo optimista (a) — semanas */
  optimista: string
  /** Tiempo probable (m) — semanas */
  probable: string
  /** Tiempo pesimista (b) — semanas */
  pesimista: string
  /** @deprecated Solo compatibilidad; si a,m,b vacíos se usa como Te */
  duracion?: string
}

export type ActivityDef = {
  code: string
  name: string
  /** Te = (a+4m+b)/6 — duración usada en CPM */
  duration: number
  optimista: number
  probable: number
  pesimista: number
  te: number
  variance: number
  preds: string[]
}

/** Arista FS: predecesor terminó → sucesor puede empezar */
export type DepEdge = { from: string; to: string }

export type CpmResult = {
  activities: ActivityDef[]
  order: string[]
  edges: DepEdge[]
  es: Record<string, number>
  ef: Record<string, number>
  ls: Record<string, number>
  lf: Record<string, number>
  slack: Record<string, number>
  variance: Record<string, number>
  /** μ — duración del proyecto (CPM sobre Te) */
  projectEnd: number
  /** Suma de σ² solo en ruta crítica */
  projectVariance: number
  projectStdDev: number
  criticalPath: string[]
  errors: string[]
}

/** Te = (a + 4m + b) / 6 */
export function pertTe(a: number, m: number, b: number): number {
  return (a + 4 * m + b) / 6
}

/** σ² = ((b − a) / 6)² */
export function pertVariance(a: number, b: number): number {
  const s = (b - a) / 6
  return s * s
}

/** Vista previa por fila (tabla antes de ACTUALIZAR) */
export function previewPertFromRow(r: Row): { te: number; variance: number } | null {
  const a = parseDurationWeeks(r.optimista)
  const m = parseDurationWeeks(r.probable)
  const b = parseDurationWeeks(r.pesimista)
  if (Number.isFinite(a) && Number.isFinite(m) && Number.isFinite(b)) {
    if (a < 0 || m < 0 || b < 0) return null
    return { te: pertTe(a, m, b), variance: pertVariance(a, b) }
  }
  const d = parseDurationWeeks(r.duracion ?? "")
  if (Number.isFinite(d) && d >= 0) return { te: d, variance: 0 }
  return null
}

/** Φ(z) — probabilidad acumulada normal estándar */
export function normalCdf(z: number): number {
  if (!Number.isFinite(z)) return 0
  const t = 1 / (1 + 0.2316419 * Math.abs(z))
  const d = 0.3989423 * Math.exp((-z * z) / 2)
  const p =
    d *
    t *
    (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
  return z >= 0 ? 1 - p : p
}

/** Z = (x − μ) / σ ; probabilidad de terminar en o antes de x */
export function pertProbability(x: number, mu: number, sigma: number): { z: number; probability: number } | null {
  if (!Number.isFinite(x) || !Number.isFinite(mu) || !Number.isFinite(sigma) || sigma <= 1e-9) return null
  const z = (x - mu) / sigma
  return { z, probability: normalCdf(z) }
}

export function parseDurationWeeks(raw: string): number {
  const m = raw.match(/-?\d+(\.\d+)?/)
  if (!m) return NaN
  return Number(m[0])
}

/** Normaliza código: sin espacios, mayúsculas; conserva . para códigos EDT (ej. 2.1, 3.2) */
export function normalizeCode(s: string): string {
  return s.trim().toUpperCase().replace(/\s+/g, "")
}

/** Códigos PERT válidos: A, REQ1, 2.1, E1, etc. */
export function isValidActivityCode(normalized: string): boolean {
  return /^[A-Z0-9][A-Z0-9._-]*$/.test(normalized)
}

export function parsePredecessors(raw: string, known: Set<string>): { preds: string[]; unknown: string[] } {
  if (!raw.trim() || raw.trim() === "-") return { preds: [], unknown: [] }
  const parts = raw.split(/[;,]/g).map((x) => normalizeCode(x)).filter(Boolean)
  const unknown: string[] = []
  const preds: string[] = []
  for (const p of parts) {
    if (!known.has(p)) unknown.push(p)
    else preds.push(p)
  }
  return { preds, unknown }
}

/** Construye actividades y aristas desde filas; no calcula CPM */
export function buildActivitiesFromRows(rows: Row[]): {
  acts: ActivityDef[]
  errors: string[]
} {
  const errors: string[] = []
  const codes: string[] = []
  const seen = new Set<string>()

  for (const r of rows) {
    const c = normalizeCode(r.actividad)
    if (!c) continue
    if (!isValidActivityCode(c)) {
      errors.push(`Código inválido «${c}»: use letras, números, punto (2.1) o _ sin espacios.`)
      continue
    }
    if (seen.has(c)) {
      errors.push(`Código duplicado: ${c}`)
      continue
    }
    seen.add(c)
    codes.push(c)
  }

  if (codes.length === 0) errors.push("Añade al menos una actividad con código.")
  if (errors.length) return { acts: [], errors }

  const known = new Set(codes)
  const acts: ActivityDef[] = []

  for (const c of codes) {
    const r = rows.find((row) => normalizeCode(row.actividad) === c)
    if (!r) continue

    let a = parseDurationWeeks(r.optimista)
    let m = parseDurationWeeks(r.probable)
    let b = parseDurationWeeks(r.pesimista)
    const hasTriple = Number.isFinite(a) && Number.isFinite(m) && Number.isFinite(b)

    if (!hasTriple) {
      const legacy = parseDurationWeeks(r.duracion ?? "")
      if (Number.isFinite(legacy) && legacy >= 0) {
        a = legacy
        m = legacy
        b = legacy
      } else {
        return {
          acts: [],
          errors: [`En «${c}» indique T. optimista, probable y pesimista (o Te legacy en duración).`],
        }
      }
    }

    if (a < 0 || m < 0 || b < 0) {
      return { acts: [], errors: [`Tiempos negativos en «${c}».`] }
    }
    if (a > b) {
      return { acts: [], errors: [`En «${c}»: optimista (a) no puede ser mayor que pesimista (b).`] }
    }

    const te = pertTe(a, m, b)
    const variance = pertVariance(a, b)

    const { preds, unknown } = parsePredecessors(r.procedencia, known)
    if (unknown.length) {
      const err = unknown.map((u) => `En «${c}», procedencia desconocida: «${u}».`)
      return { acts: [], errors: err }
    }
    acts.push({
      code: c,
      name: r.nombre.trim(),
      duration: te,
      optimista: a,
      probable: m,
      pesimista: b,
      te,
      variance,
      preds,
    })
  }

  if (errors.length) return { acts: [], errors }
  if (acts.length !== codes.length) {
    return { acts: [], errors: ["Faltan datos en alguna actividad."] }
  }

  return { acts, errors: [] }
}

function topologicalOrder(codes: string[], edges: DepEdge[]): string[] | null {
  const adj = new Map<string, string[]>()
  const indeg = new Map<string, number>()
  for (const c of codes) {
    adj.set(c, [])
    indeg.set(c, 0)
  }
  for (const e of edges) {
    adj.get(e.from)!.push(e.to)
    indeg.set(e.to, (indeg.get(e.to) ?? 0) + 1)
  }
  const q = codes.filter((c) => (indeg.get(c) ?? 0) === 0)
  const out: string[] = []
  while (q.length) {
    const u = q.shift()!
    out.push(u)
    for (const v of adj.get(u) ?? []) {
      const n = (indeg.get(v) ?? 0) - 1
      indeg.set(v, n)
      if (n === 0) q.push(v)
    }
  }
  if (out.length !== codes.length) return null
  return out
}

/** CPM AoN (FS, lag 0). */
export function computeCpmFromRows(rows: Row[]): CpmResult {
  const empty = (): CpmResult => ({
    activities: [],
    order: [],
    edges: [],
    es: {},
    ef: {},
    ls: {},
    lf: {},
    slack: {},
    variance: {},
    projectEnd: 0,
    projectVariance: 0,
    projectStdDev: 0,
    criticalPath: [],
    errors: [],
  })

  const { acts, errors: buildErr } = buildActivitiesFromRows(rows)
  if (buildErr.length) return { ...empty(), errors: buildErr }

  const codes = acts.map((a) => a.code)
  const codeSet = new Set(codes)
  const dur = Object.fromEntries(acts.map((a) => [a.code, a.duration]))
  const edges: DepEdge[] = []
  for (const a of acts) {
    for (const p of a.preds) {
      if (codeSet.has(p) && p !== a.code) edges.push({ from: p, to: a.code })
    }
  }

  const order = topologicalOrder(codes, edges)
  if (!order) {
    return {
      ...empty(),
      errors: ["Hay un ciclo en las dependencias (no se puede ordenar la red)."],
    }
  }

  const predsOf = new Map<string, string[]>()
  const succsOf = new Map<string, string[]>()
  for (const c of codes) {
    predsOf.set(c, [])
    succsOf.set(c, [])
  }
  for (const e of edges) {
    predsOf.get(e.to)!.push(e.from)
    succsOf.get(e.from)!.push(e.to)
  }

  const es: Record<string, number> = {}
  const ef: Record<string, number> = {}
  for (const c of codes) {
    es[c] = 0
    ef[c] = 0
  }

  for (const c of order) {
    let s = 0
    for (const p of predsOf.get(c) ?? []) s = Math.max(s, ef[p])
    es[c] = s
    ef[c] = s + dur[c]
  }

  let projectEnd = 0
  for (const c of codes) projectEnd = Math.max(projectEnd, ef[c])

  const lf: Record<string, number> = {}
  const ls: Record<string, number> = {}
  for (const c of codes) lf[c] = projectEnd

  for (let i = order.length - 1; i >= 0; i--) {
    const c = order[i]!
    let late = projectEnd
    for (const s of succsOf.get(c) ?? []) {
      late = Math.min(late, ls[s])
    }
    lf[c] = late
    ls[c] = late - dur[c]
  }

  const slack: Record<string, number> = {}
  const variance: Record<string, number> = {}
  for (const c of codes) {
    slack[c] = ls[c] - es[c]
    variance[c] = acts.find((x) => x.code === c)?.variance ?? 0
  }

  const criticalPath = codes.filter((c) => Math.abs(slack[c]) < 1e-6)
  let projectVariance = 0
  for (const c of criticalPath) projectVariance += variance[c] ?? 0
  const projectStdDev = Math.sqrt(Math.max(0, projectVariance))

  return {
    activities: acts,
    order,
    edges,
    es,
    ef,
    ls,
    lf,
    slack,
    variance,
    projectEnd,
    projectVariance,
    projectStdDev,
    criticalPath,
    errors: [],
  }
}

/** Capas lógicas (solo referencia / pruebas); el SVG usa `layoutPositions` con tiempos CPM. */
export function computeLayers(acts: ActivityDef[]): Map<string, number> {
  const layer = new Map<string, number>()
  const predsOf = new Map<string, string[]>()
  for (const a of acts) predsOf.set(a.code, [...a.preds])
  const codes = acts.map((a) => a.code)

  let changed = true
  while (changed) {
    changed = false
    for (const c of codes) {
      const ps = predsOf.get(c) ?? []
      const lv = ps.length === 0 ? 0 : Math.max(...ps.map((p) => layer.get(p) ?? -1)) + 1
      if ((layer.get(c) ?? -1) !== lv) {
        layer.set(c, lv)
        changed = true
      }
    }
  }
  return layer
}

const LAYOUT_NODE_R = 28

/**
 * Layout tipo **diagrama en limpio** (imagen blanca AoN): columnas por **capa lógica**
 * (misma precedencia que la tabla: nivel = 1 + max nivel de predecesores), con la fila de cada
 * capa ordenada por la **media vertical de los predecesores** y reparto simétrico en Y — paralelos
 * y convergencias como A+B→C, C→D+E, etc.
 */
export function layoutPositions(result: CpmResult): {
  x: Record<string, number>
  y: Record<string, number>
  width: number
  height: number
} {
  const acts = result.activities
  const codes = acts.map((a) => a.code)
  if (codes.length === 0) {
    return { x: {}, y: {}, width: 400, height: 320 }
  }

  const layer = computeLayers(acts)
  const maxL = Math.max(...codes.map((c) => layer.get(c) ?? 0))

  const preds = new Map<string, string[]>()
  for (const c of codes) preds.set(c, [])
  for (const e of result.edges) preds.get(e.to)!.push(e.from)

  const marginL = 56
  const marginR = 100
  const marginTop = 46
  const marginB = 132
  const colW = 200
  const rowH = 100
  const anchorY = 260

  const x: Record<string, number> = {}
  for (const c of codes) {
    x[c] = marginL + (layer.get(c) ?? 0) * colW
  }

  const byLayer = new Map<number, string[]>()
  for (const c of codes) {
    const L = layer.get(c) ?? 0
    if (!byLayer.has(L)) byLayer.set(L, [])
    byLayer.get(L)!.push(c)
  }

  const y: Record<string, number> = {}

  for (let L = 0; L <= maxL; L++) {
    const row = [...(byLayer.get(L) ?? [])]
    const bary: Record<string, number> = {}
    for (const c of row) {
      const ps = preds.get(c) ?? []
      if (ps.length === 0) {
        bary[c] = anchorY
      } else {
        bary[c] = ps.reduce((s, p) => s + (y[p] ?? anchorY), 0) / ps.length
      }
    }
    row.sort((a, b) => bary[a] - bary[b] || a.localeCompare(b))
    const n = row.length
    const mean = n ? row.reduce((s, c) => s + bary[c], 0) / n : anchorY
    row.forEach((c, i) => {
      y[c] = mean + (i - (n - 1) / 2) * rowH
    })
  }

  let minY = Infinity
  for (const c of codes) {
    minY = Math.min(minY, y[c]!)
  }
  if (!Number.isFinite(minY)) minY = marginTop

  const yShift = marginTop + LAYOUT_NODE_R - minY
  for (const c of codes) {
    y[c] = y[c]! + yShift
  }

  let maxY2 = -Infinity
  for (const c of codes) {
    maxY2 = Math.max(maxY2, y[c]!)
  }

  const width = Math.max(480, marginL + (maxL + 1) * colW + marginR)
  const height = Math.max(360, maxY2 + marginB + LAYOUT_NODE_R)

  return { x, y, width, height }
}

/** Proyecto clásico 8 actividades A–H con la misma lógica que el diagrama AoA (eventos 1–8). */
export function matchesClassicAoA8Pattern(rows: Row[]): boolean {
  const withCode = rows.filter((r) => normalizeCode(r.actividad))
  if (withCode.length !== 8) return false
  const by = new Map<string, string>()
  for (const r of withCode) {
    const c = normalizeCode(r.actividad)
    if (!/^[A-H]$/.test(c)) return false
    if (by.has(c)) return false
    const p = r.procedencia.trim()
    const key =
      !p || p === "-"
        ? ""
        : p
            .split(/[;,]/g)
            .map((x) => normalizeCode(x))
            .filter(Boolean)
            .sort()
            .join(",")
    by.set(c, key)
  }
  const exp: Record<string, string> = {
    A: "",
    B: "",
    C: "A,B",
    D: "C",
    E: "C",
    F: "D,E",
    G: "E",
    H: "F,G",
  }
  for (const k of Object.keys(exp)) {
    if (by.get(k) !== exp[k]) return false
  }
  return true
}

function pertRow(
  id: string,
  actividad: string,
  nombre: string,
  procedencia: string,
  optimista: number,
  probable: number,
  pesimista: number,
): Row {
  return {
    id,
    actividad,
    nombre,
    procedencia,
    optimista: String(optimista),
    probable: String(probable),
    pesimista: String(pesimista),
  }
}

/**
 * PERT por entregable EDT (Paquetes 1–4) — formato pedido en evaluación GPY1101:
 * un bloque de cronograma por cada entregable principal.
 */
export function sigpiEntregablesRows(): Row[] {
  return [
    pertRow("ent-a", "A", "Entregable 1 — Gestión y administración", "-", 6, 10, 14),
    pertRow("ent-b", "B", "Entregable 2 — Módulo C (Valle Alerta Ciudadana)", "A", 18, 24, 32),
    pertRow("ent-c", "C", "Entregable 3 — Módulo A (Valle Situación)", "A", 17, 23, 31),
    pertRow("ent-d", "D", "Entregable 4 — Módulo B (Valle Nexo)", "B;C", 19, 26, 34),
  ]
}

/** Red PERT detallada (subpaquetes / fases) — opcional */
export function sigpiValleDelSolRows(): Row[] {
  return [
    // —— Fase 0 / 1: licitación y módulos C + A ——
    pertRow("sigpi-a1", "A1", "Licitación y contrato", "-", 6, 8, 14),
    pertRow("sigpi-a2", "A2", "Análisis requisitos módulo C", "A1", 2, 3, 5),
    pertRow("sigpi-a3", "A3", "Análisis requisitos módulo A", "A1", 2, 3, 5),
    pertRow("sigpi-a8", "A8", "Infraestructura cloud inicial", "A1", 2, 3, 5),
    pertRow("sigpi-a4", "A4", "Diseño UX/UI C+A", "A2;A3", 3, 4, 6),
    pertRow("sigpi-a5", "A5", "Backend API reportes", "A4", 4, 5, 9),
    pertRow("sigpi-a6", "A6", "PWA ciudadana (módulo C)", "A4;A5", 4, 6, 9),
    pertRow("sigpi-a7", "A7", "Motor alertas SMS", "A5", 3, 4, 6),
    pertRow("sigpi-a9", "A9", "Visor GIS (módulo A)", "A3;A4", 5, 7, 12),
    pertRow("sigpi-a11", "A11", "App brigadas móvil", "A9", 3, 4, 6),
    pertRow("sigpi-a10", "A10", "Dashboard operativo PMU", "A7;A9", 4, 5, 7),
    pertRow("sigpi-a12", "A12", "Integración C↔A", "A6;A10;A11", 2, 3, 5),
    pertRow("sigpi-a13", "A13", "UAT Fase 1", "A12", 2, 3, 5),
    pertRow("sigpi-a14", "A14", "Despliegue piloto pre-verano", "A13", 1, 2, 4),
    pertRow("sigpi-a15", "A15", "Evaluación piloto Fase 1", "A14", 1, 2, 4),
    // —— Fase 2: módulo B (Valle Nexo) ——
    pertRow("sigpi-b1", "B1", "Análisis y diseño módulo B", "A15", 2, 3, 5),
    pertRow("sigpi-b2", "B2", "Hub datos e histórico", "B1", 6, 8, 11),
    pertRow("sigpi-b3", "B3", "API integración externa", "B2", 4, 5, 8),
    pertRow("sigpi-b4", "B4", "Analítica y reportes", "B3", 3, 4, 6),
    pertRow("sigpi-b5", "B5", "Testing y seguridad B", "B4", 2, 3, 5),
    pertRow("sigpi-b6", "B6", "Despliegue Fase 2 / cierre", "B5", 2, 3, 5),
  ]
}

/** Ejemplo didáctico A–H (curso); no es el caso SIGPI */
export function exampleClassicAHRows(): Row[] {
  return [
    pertRow("1", "A", "Obra / ingeniería", "-", 4, 6, 9),
    pertRow("2", "B", "Compras largo plazo", "-", 6, 8, 11),
    pertRow("3", "C", "Integración", "A;B", 9, 12, 16),
    pertRow("4", "D", "Montaje línea 1", "C", 3, 4, 6),
    pertRow("5", "E", "Montaje línea 2", "C", 4, 6, 9),
    pertRow("6", "F", "Pruebas conjuntas", "D;E", 12, 15, 19),
    pertRow("7", "G", "Puesta en marcha", "E", 9, 12, 16),
    pertRow("8", "H", "Recepción cliente", "F;G", 6, 8, 11),
  ]
}

/** Por defecto: 4 entregables EDT (cronograma por entregable) */
export function defaultRows(): Row[] {
  return sigpiEntregablesRows()
}

/** Ejemplo curso GPY5101 (A–F, ruta crítica B–D–E–F, μ≈38) */
export function exampleGpy5101Rows(): Row[] {
  return [
    pertRow("g1", "A", "Actividad A", "-", 2, 6, 10),
    pertRow("g2", "B", "Actividad B", "-", 5, 9, 13),
    pertRow("g3", "C", "Actividad C", "A;B", 3, 8, 13),
    pertRow("g4", "D", "Actividad D", "A;B", 1, 7, 13),
    pertRow("g5", "E", "Actividad E", "D", 8, 10, 12),
    pertRow("g6", "F", "Actividad F", "C;E", 9, 12, 15),
  ]
}

export function examplePizzaRows(): Row[] {
  return [
    pertRow("p1", "A", "Comprar ingredientes", "-", 1, 1, 2),
    pertRow("p2", "B", "Preparar masa", "A", 1, 2, 3),
    pertRow("p3", "C", "Preparar salsa", "A", 1, 1, 2),
    pertRow("p4", "D", "Hornear pizza", "B;C", 2, 3, 4),
    pertRow("p5", "E", "Entregar", "D", 1, 1, 2),
  ]
}

export function exampleSoftwareRows(): Row[] {
  return [
    pertRow("s1", "A", "Requisitos", "-", 4, 5, 7),
    pertRow("s2", "B", "Diseño UI", "A", 3, 4, 6),
    pertRow("s3", "C", "Base de datos", "A", 2, 3, 5),
    pertRow("s4", "D", "Backend", "C", 5, 6, 8),
    pertRow("s5", "E", "Frontend", "B;D", 6, 8, 11),
    pertRow("s6", "F", "Testing", "E", 3, 4, 6),
    pertRow("s7", "G", "Deploy", "F", 1, 2, 4),
  ]
}

export function exampleLinearRows(): Row[] {
  return [
    pertRow("l1", "A", "Paso A", "-", 1, 2, 3),
    pertRow("l2", "B", "Paso B", "A", 2, 3, 5),
    pertRow("l3", "C", "Paso C", "B", 3, 4, 6),
    pertRow("l4", "D", "Paso D", "C", 1, 1, 2),
  ]
}

export function exampleParallelRows(): Row[] {
  return [
    pertRow("pa1", "A", "Inicio", "-", 1, 2, 3),
    pertRow("pa2", "B", "Rama B", "A", 2, 3, 5),
    pertRow("pa3", "C", "Rama C", "A", 1, 2, 4),
    pertRow("pa4", "D", "Unión", "B;C", 1, 1, 2),
  ]
}

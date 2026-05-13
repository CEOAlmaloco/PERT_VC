/** Fila editable tipo Excel */
export type Row = {
  id: string
  /** Código único de la actividad (clave), ej. A, REQ1 */
  actividad: string
  /** Nombre legible (valor), ej. Comprar ingredientes */
  nombre: string
  /** Códigos separados por ; o , — deben existir en otra fila */
  procedencia: string
  /** Texto con número de semanas, ej. "6" o "6 sem" */
  duracion: string
}

export type ActivityDef = {
  code: string
  name: string
  duration: number
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
  projectEnd: number
  errors: string[]
}

export function parseDurationWeeks(raw: string): number {
  const m = raw.match(/-?\d+(\.\d+)?/)
  if (!m) return NaN
  return Number(m[0])
}

/** Normaliza código: sin espacios, mayúsculas para comparar */
export function normalizeCode(s: string): string {
  return s.trim().toUpperCase().replace(/\s+/g, "")
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
    if (!/^[A-Z0-9_]+$/.test(c)) {
      errors.push(`Código inválido «${c}»: use letras, números o _ sin espacios.`)
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
    const d = parseDurationWeeks(r.duracion)
    if (!Number.isFinite(d) || d < 0) {
      return { acts: [], errors: [`Duración inválida (semanas) en «${c}».`] }
    }
    const { preds, unknown } = parsePredecessors(r.procedencia, known)
    if (unknown.length) {
      const err = unknown.map((u) => `En «${c}», procedencia desconocida: «${u}».`)
      return { acts: [], errors: err }
    }
    acts.push({
      code: c,
      name: r.nombre.trim(),
      duration: d,
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
    projectEnd: 0,
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
  for (const c of codes) slack[c] = ls[c] - es[c]

  return {
    activities: acts,
    order,
    edges,
    es,
    ef,
    ls,
    lf,
    slack,
    projectEnd,
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

export function defaultRows(): Row[] {
  return [
    { id: "1", actividad: "A", nombre: "Obra / ingeniería", procedencia: "-", duracion: "6" },
    { id: "2", actividad: "B", nombre: "Compras largo plazo", procedencia: "-", duracion: "8" },
    { id: "3", actividad: "C", nombre: "Integración", procedencia: "A;B", duracion: "12" },
    { id: "4", actividad: "D", nombre: "Montaje línea 1", procedencia: "C", duracion: "4" },
    { id: "5", actividad: "E", nombre: "Montaje línea 2", procedencia: "C", duracion: "6" },
    { id: "6", actividad: "F", nombre: "Pruebas conjuntas", procedencia: "D;E", duracion: "15" },
    { id: "7", actividad: "G", nombre: "Puesta en marcha", procedencia: "E", duracion: "12" },
    { id: "8", actividad: "H", nombre: "Recepción cliente", procedencia: "F;G", duracion: "8" },
  ]
}

export function examplePizzaRows(): Row[] {
  return [
    { id: "p1", actividad: "A", nombre: "Comprar ingredientes", procedencia: "-", duracion: "1" },
    { id: "p2", actividad: "B", nombre: "Preparar masa", procedencia: "A", duracion: "2" },
    { id: "p3", actividad: "C", nombre: "Preparar salsa", procedencia: "A", duracion: "1" },
    { id: "p4", actividad: "D", nombre: "Hornear pizza", procedencia: "B;C", duracion: "3" },
    { id: "p5", actividad: "E", nombre: "Entregar", procedencia: "D", duracion: "1" },
  ]
}

export function exampleSoftwareRows(): Row[] {
  return [
    { id: "s1", actividad: "A", nombre: "Requisitos", procedencia: "-", duracion: "5" },
    { id: "s2", actividad: "B", nombre: "Diseño UI", procedencia: "A", duracion: "4" },
    { id: "s3", actividad: "C", nombre: "Base de datos", procedencia: "A", duracion: "3" },
    { id: "s4", actividad: "D", nombre: "Backend", procedencia: "C", duracion: "6" },
    { id: "s5", actividad: "E", nombre: "Frontend", procedencia: "B;D", duracion: "8" },
    { id: "s6", actividad: "F", nombre: "Testing", procedencia: "E", duracion: "4" },
    { id: "s7", actividad: "G", nombre: "Deploy", procedencia: "F", duracion: "2" },
  ]
}

export function exampleLinearRows(): Row[] {
  return [
    { id: "l1", actividad: "A", nombre: "Paso A", procedencia: "-", duracion: "2" },
    { id: "l2", actividad: "B", nombre: "Paso B", procedencia: "A", duracion: "3" },
    { id: "l3", actividad: "C", nombre: "Paso C", procedencia: "B", duracion: "4" },
    { id: "l4", actividad: "D", nombre: "Paso D", procedencia: "C", duracion: "1" },
  ]
}

export function exampleParallelRows(): Row[] {
  return [
    { id: "pa1", actividad: "A", nombre: "Inicio", procedencia: "-", duracion: "2" },
    { id: "pa2", actividad: "B", nombre: "Rama B", procedencia: "A", duracion: "3" },
    { id: "pa3", actividad: "C", nombre: "Rama C", procedencia: "A", duracion: "2" },
    { id: "pa4", actividad: "D", nombre: "Unión", procedencia: "B;C", duracion: "1" },
  ]
}

import type { Activity, ComputedActivity, DependencyLink, ScheduleIssue, ScheduleResult } from '@/types/project'

function durationOf(a: Activity): number {
  if (a.status === 'dummy') return 0
  return Math.max(0, a.duration)
}

/** Orden topológico; vacío si hay ciclo */
export function topologicalSort(
  activityIds: string[],
  edges: DependencyLink[],
): { order: string[]; cycle: string[] | null } {
  const ids = new Set(activityIds)
  const indeg = new Map<string, number>()
  for (const id of activityIds) indeg.set(id, 0)
  const adj = new Map<string, string[]>()
  for (const id of activityIds) adj.set(id, [])
  for (const e of edges) {
    if (!ids.has(e.source) || !ids.has(e.target)) continue
    indeg.set(e.target, (indeg.get(e.target) ?? 0) + 1)
    adj.get(e.source)!.push(e.target)
  }
  const q: string[] = []
  for (const id of activityIds) {
    if ((indeg.get(id) ?? 0) === 0) q.push(id)
  }
  const order: string[] = []
  while (q.length) {
    const u = q.shift()!
    order.push(u)
    for (const v of adj.get(u) ?? []) {
      const next = (indeg.get(v) ?? 0) - 1
      indeg.set(v, next)
      if (next === 0) q.push(v)
    }
  }
  if (order.length !== activityIds.length) {
    const cycle = recoverCycle(activityIds, edges)
    return { order: [], cycle }
  }
  return { order, cycle: null }
}

function recoverCycle(activityIds: string[], edges: DependencyLink[]): string[] {
  const ids = new Set(activityIds)
  const adj = new Map<string, string[]>()
  for (const id of activityIds) adj.set(id, [])
  for (const e of edges) {
    if (ids.has(e.source) && ids.has(e.target)) adj.get(e.source)!.push(e.target)
  }
  const state = new Map<string, 0 | 1 | 2>()
  for (const id of activityIds) state.set(id, 0)
  const stack: string[] = []
  let found: string[] | null = null
  const dfs = (u: string) => {
    if (found) return
    state.set(u, 1)
    stack.push(u)
    for (const v of adj.get(u) ?? []) {
      if (state.get(v) === 0) dfs(v)
      else if (state.get(v) === 1) {
        const idx = stack.indexOf(v)
        found = idx >= 0 ? stack.slice(idx).concat(v) : [v]
      }
      if (found) return
    }
    stack.pop()
    state.set(u, 2)
  }
  for (const id of activityIds) {
    if (state.get(id) === 0) dfs(id)
    if (found) break
  }
  return found ?? ['?']
}

function forwardBound(
  type: DependencyLink['type'],
  lag: number,
  ES_p: number,
  EF_p: number,
  durS: number,
): number {
  switch (type) {
    case 'FS':
      return EF_p + lag
    case 'SS':
      return ES_p + lag
    case 'FF':
      return EF_p + lag - durS
    case 'SF':
      return ES_p + lag - durS
    default:
      return EF_p + lag
  }
}

function backwardCandidate(
  type: DependencyLink['type'],
  lag: number,
  LF_s: number,
  durS: number,
  durP: number,
): number {
  switch (type) {
    case 'FS':
      return LF_s - durS - lag
    case 'SS':
      return LF_s - durS - lag + durP
    case 'FF':
      return LF_s - durS + durP - lag
    case 'SF':
      return LF_s + durP - lag
    default:
      return LF_s - durS - lag
  }
}

export function computeCPM(
  activities: Record<string, Activity>,
  edges: DependencyLink[],
): ScheduleResult {
  const ids = Object.keys(activities)
  const issues: ScheduleIssue[] = []
  const byId: Record<string, ComputedActivity> = {}

  for (const id of ids) {
    const a = activities[id]
    if (a.duration < 0 || !Number.isFinite(a.duration)) {
      issues.push({ kind: 'invalid_duration', activityId: id })
    }
  }

  const { order, cycle } = topologicalSort(ids, edges)
  if (cycle) {
    issues.push({ kind: 'cycle', chain: cycle })
    for (const id of ids) {
      byId[id] = { id, ES: 0, EF: 0, LS: 0, LF: 0, slack: 0, critical: false }
    }
    return {
      byId,
      projectDuration: 0,
      criticalPathEdges: [],
      criticalPathNodes: [],
      topologicalOrder: [],
      issues,
    }
  }

  const ES: Record<string, number> = {}
  const EF: Record<string, number> = {}
  for (const id of ids) {
    ES[id] = 0
    EF[id] = 0
  }

  const predsOf = new Map<string, DependencyLink[]>()
  const succsOf = new Map<string, DependencyLink[]>()
  for (const id of ids) {
    predsOf.set(id, [])
    succsOf.set(id, [])
  }
  for (const e of edges) {
    if (!activities[e.source] || !activities[e.target]) continue
    predsOf.get(e.target)!.push(e)
    succsOf.get(e.source)!.push(e)
  }

  for (const id of order) {
    const a = activities[id]
    const d = durationOf(a)
    let es = 0
    for (const e of predsOf.get(id) ?? []) {
      const p = activities[e.source]
      if (!p) continue
      const b = forwardBound(e.type, e.lag, ES[e.source], EF[e.source], d)
      es = Math.max(es, b)
    }
    ES[id] = es
    EF[id] = es + d
  }

  let projectDuration = 0
  for (const id of ids) projectDuration = Math.max(projectDuration, EF[id])

  const LF: Record<string, number> = {}
  const LS: Record<string, number> = {}
  for (const id of ids) LF[id] = projectDuration

  for (let i = order.length - 1; i >= 0; i--) {
    const id = order[i]!
    const a = activities[id]
    const d = durationOf(a)
    let lf = projectDuration
    for (const e of succsOf.get(id) ?? []) {
      const s = activities[e.target]
      if (!s) continue
      const dS = durationOf(s)
      const cand = backwardCandidate(e.type, e.lag, LF[e.target], dS, d)
      lf = Math.min(lf, cand)
    }
    LF[id] = lf
    LS[id] = lf - d
  }

  const slack: Record<string, number> = {}
  for (const id of ids) {
    slack[id] = LS[id] - ES[id]
  }

  for (const id of ids) {
    const cr = Math.abs(slack[id]) < 1e-9
    byId[id] = {
      id,
      ES: ES[id],
      EF: EF[id],
      LS: LS[id],
      LF: LF[id],
      slack: slack[id],
      critical: cr,
    }
  }

  const criticalPathEdges = edges
    .filter((e) => byId[e.source]?.critical && byId[e.target]?.critical)
    .map((e) => e.id)

  const criticalPathNodes = ids.filter((id) => byId[id]?.critical)

  const reachable = new Set<string>()
  const roots = ids.filter((id) => (predsOf.get(id) ?? []).length === 0)
  const stack = [...roots]
  while (stack.length) {
    const u = stack.pop()!
    if (reachable.has(u)) continue
    reachable.add(u)
    for (const e of succsOf.get(u) ?? []) stack.push(e.target)
  }
  const disconnected = ids.filter((id) => !reachable.has(id))
  if (reachable.size && disconnected.length) {
    issues.push({ kind: 'disconnected', activityIds: disconnected })
  }

  return {
    byId,
    projectDuration,
    criticalPathEdges,
    criticalPathNodes,
    topologicalOrder: order,
    issues,
  }
}

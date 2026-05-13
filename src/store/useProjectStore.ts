import { computeCPM } from '@/engine/cpm'
import { layoutDagLR } from '@/engine/dagreLayout'
import type { Activity, DependencyLink, DependencyType, ScheduleResult } from '@/types/project'
import type { Edge, Node } from '@xyflow/react'
import { create } from 'zustand'

const uid = () => crypto.randomUUID().slice(0, 8)

const seedActivities: Record<string, Activity> = {
  a1: {
    id: 'a1',
    code: 'A-100',
    name: 'Ingeniería de sistema',
    duration: 3,
    status: 'done',
    resourceUnits: 4,
    baselineDuration: 4,
  },
  a2: {
    id: 'a2',
    code: 'A-110',
    name: 'Adquisición L/T',
    duration: 6,
    status: 'active',
    resourceUnits: 6,
    baselineDuration: 6,
  },
  a3: {
    id: 'a3',
    code: 'A-120',
    name: 'Cimentación / obra gris',
    duration: 8,
    status: 'idle',
    resourceUnits: 10,
    baselineDuration: 7,
  },
  a4: {
    id: 'a4',
    code: 'M-010',
    name: 'Hito instalaciones',
    duration: 0,
    status: 'dummy',
    resourceUnits: 0,
  },
  a5: {
    id: 'a5',
    code: 'A-200',
    name: 'Montaje estructural',
    duration: 5,
    status: 'idle',
    resourceUnits: 8,
  },
  a6: {
    id: 'a6',
    code: 'A-210',
    name: 'Comisionado FAT/SAT',
    duration: 4,
    status: 'idle',
    resourceUnits: 5,
  },
  a7: {
    id: 'a7',
    code: 'A-220',
    name: 'Puesta en servicio',
    duration: 2,
    status: 'idle',
    resourceUnits: 3,
  },
}

const seedLinks: DependencyLink[] = [
  { id: 'e1', source: 'a1', target: 'a2', type: 'FS', lag: 0 },
  { id: 'e2', source: 'a1', target: 'a3', type: 'FS', lag: 0 },
  { id: 'e3', source: 'a2', target: 'a4', type: 'FS', lag: 0 },
  { id: 'e4', source: 'a3', target: 'a4', type: 'FS', lag: 0 },
  { id: 'e5', source: 'a4', target: 'a5', type: 'FS', lag: 1 },
  { id: 'e6', source: 'a5', target: 'a6', type: 'FS', lag: 0 },
  { id: 'e7', source: 'a6', target: 'a7', type: 'FS', lag: 0 },
]

export type ViewMode = 'logical' | 'physical' | 'gantt' | 'analytics'

export type ProjectState = {
  projectName: string
  activities: Record<string, Activity>
  links: DependencyLink[]
  positions: Record<string, { x: number; y: number }>
  schedule: ScheduleResult
  viewMode: ViewMode
  leftCollapsed: boolean
  rightCollapsed: boolean
  bottomCollapsed: boolean
  autosaveAt: number
  selectedActivityId: string | null
  inspectActivityId: string | null
  resourceCap: number
  recalc: () => void
  setProjectName: (n: string) => void
  setViewMode: (m: ViewMode) => void
  toggleLeft: () => void
  toggleRight: () => void
  toggleBottom: () => void
  addActivity: (partial?: Partial<Pick<Activity, 'name' | 'code' | 'duration'>>) => string
  updateActivity: (id: string, patch: Partial<Activity>) => void
  removeActivity: (id: string) => void
  addLink: (link: { source: string; target: string; type: DependencyType; lag: number; id?: string }) => boolean
  updateLink: (id: string, patch: Partial<Pick<DependencyLink, 'type' | 'lag'>>) => void
  removeLink: (id: string) => void
  setPositionsFromNodes: (nodes: Node[]) => void
  autoLayout: () => void
  setSelected: (id: string | null) => void
  setInspect: (id: string | null) => void
  setResourceCap: (n: number) => void
  touchAutosave: () => void
}

function buildFlowNodes(
  activities: Record<string, Activity>,
  schedule: ScheduleResult,
  positions: Record<string, { x: number; y: number }>,
): Node[] {
  return Object.values(activities).map((a) => ({
    id: a.id,
    type: 'activity',
    position: positions[a.id] ?? { x: 0, y: 0 },
    data: {
      activity: a,
      computed: schedule.byId[a.id],
    },
  }))
}

function buildFlowEdges(
  activities: Record<string, Activity>,
  links: DependencyLink[],
  schedule: ScheduleResult,
): Edge[] {
  return links
    .filter((l) => Boolean(activities[l.source]) && Boolean(activities[l.target]))
    .map((l) => ({
    id: l.id,
    source: l.source,
    target: l.target,
    type: 'dataflow',
    data: {
      depType: l.type,
      lag: l.lag,
      criticalPath: schedule.criticalPathEdges.includes(l.id),
    },
    style: schedule.criticalPathEdges.includes(l.id)
      ? { stroke: '#ef4444', strokeWidth: 2.4 }
      : { stroke: 'rgba(34,211,238,0.35)', strokeWidth: 1.25 },
    animated: false,
  }))
}

/** Quita enlaces cuyo origen/destino ya no existe (evita que React Flow reviente con aristas huérfanas). */
function sanitizeLinks(activities: Record<string, Activity>, links: DependencyLink[]): DependencyLink[] {
  return links.filter((l) => Boolean(activities[l.source]) && Boolean(activities[l.target]))
}

export const useProjectStore = create<ProjectState>((set, get) => {
  const recalc = () => {
    set((s) => {
      const cleaned = sanitizeLinks(s.activities, s.links)
      const schedule = computeCPM(s.activities, cleaned)
      return {
        ...(cleaned.length !== s.links.length ? { links: cleaned } : {}),
        schedule,
        autosaveAt: Date.now(),
      }
    })
  }

  return {
    projectName: 'Línea de ensamble — Fase 2',
    activities: seedActivities,
    links: seedLinks,
    positions: {},
    schedule: computeCPM(seedActivities, seedLinks),
    viewMode: 'logical',
    leftCollapsed: false,
    rightCollapsed: false,
    bottomCollapsed: false,
    autosaveAt: Date.now(),
    selectedActivityId: null,
    inspectActivityId: null,
    resourceCap: 18,
    recalc,
    setProjectName: (projectName) => set({ projectName }),
    setViewMode: (viewMode) => set({ viewMode }),
    toggleLeft: () => set((s) => ({ leftCollapsed: !s.leftCollapsed })),
    toggleRight: () => set((s) => ({ rightCollapsed: !s.rightCollapsed })),
    toggleBottom: () => set((s) => ({ bottomCollapsed: !s.bottomCollapsed })),
    addActivity: (partial) => {
      const id = uid()
      const code = partial?.code ?? `T-${id.toUpperCase()}`
      const act: Activity = {
        id,
        code,
        name: partial?.name ?? 'Nueva actividad',
        duration: partial?.duration ?? 1,
        status: 'idle',
        resourceUnits: 2,
      }
      set((s) => ({
        activities: { ...s.activities, [id]: act },
      }))
      recalc()
      return id
    },
    updateActivity: (id, patch) => {
      set((s) => {
        const cur = s.activities[id]
        if (!cur) return s
        return { activities: { ...s.activities, [id]: { ...cur, ...patch } } }
      })
      recalc()
    },
    removeActivity: (id) => {
      set((s) => {
        const activities = { ...s.activities }
        delete activities[id]
        const positions = { ...s.positions }
        delete positions[id]
        return {
          activities,
          links: s.links.filter((l) => l.source !== id && l.target !== id),
          positions,
          selectedActivityId: s.selectedActivityId === id ? null : s.selectedActivityId,
        }
      })
      recalc()
    },
    addLink: (link) => {
      const id = link.id ?? uid()
      const { activities, links } = get()
      if (!activities[link.source] || !activities[link.target]) return false
      if (link.source === link.target) return false
      const base = sanitizeLinks(activities, links)
      if (base.some((l) => l.source === link.source && l.target === link.target)) return false
      const next: DependencyLink = {
        id,
        source: link.source,
        target: link.target,
        type: link.type,
        lag: link.lag,
      }
      const trial = computeCPM(activities, [...base, next])
      if (trial.topologicalOrder.length === 0) return false
      set({ links: [...base, next] })
      recalc()
      return true
    },
    updateLink: (id, patch) => {
      set((s) => ({
        links: s.links.map((l) => (l.id === id ? { ...l, ...patch } : l)),
      }))
      recalc()
    },
    removeLink: (id) => {
      set((s) => ({ links: s.links.filter((l) => l.id !== id) }))
      recalc()
    },
    setPositionsFromNodes: (nodes) => {
      const positions: Record<string, { x: number; y: number }> = { ...get().positions }
      for (const n of nodes) {
        positions[n.id] = n.position
      }
      set({ positions })
    },
    autoLayout: () => {
      const { activities, links, schedule, positions } = get()
      const nodes = buildFlowNodes(activities, schedule, positions).map((n) => ({
        ...n,
        width: 232,
        height: 132,
      }))
      const edges = buildFlowEdges(activities, links, schedule)
      try {
        const laid = layoutDagLR(nodes, edges)
        const nextPos: Record<string, { x: number; y: number }> = {}
        for (const n of laid) nextPos[n.id] = n.position
        set({ positions: nextPos, autosaveAt: Date.now() })
      } catch {
        /* dagre puede fallar con estado intermedio o ciclos residuales */
      }
    },
    setSelected: (selectedActivityId) => set({ selectedActivityId }),
    setInspect: (inspectActivityId) => set({ inspectActivityId }),
    setResourceCap: (resourceCap) => set({ resourceCap }),
    touchAutosave: () => set({ autosaveAt: Date.now() }),
  }
})

export function selectFlowNodes(
  state: Pick<ProjectState, 'activities' | 'schedule' | 'positions'>,
): Node[] {
  return buildFlowNodes(state.activities, state.schedule, state.positions)
}

export function selectFlowEdges(state: Pick<ProjectState, 'activities' | 'links' | 'schedule'>): Edge[] {
  return buildFlowEdges(state.activities, state.links, state.schedule)
}

export const depTypeLabels: Record<DependencyType, string> = {
  FS: 'Fin → Inicio',
  SS: 'Inicio → Inicio',
  FF: 'Fin → Fin',
  SF: 'Inicio → Fin',
}

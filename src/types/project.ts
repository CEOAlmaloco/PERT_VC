export type ActivityStatus = 'idle' | 'active' | 'done' | 'dummy'

export type DependencyType = 'FS' | 'SS' | 'FF' | 'SF'

export type Activity = {
  id: string
  code: string
  name: string
  duration: number
  status: ActivityStatus
  /** Recursos asignados (unidades abstractas) */
  resourceUnits: number
  baselineDuration?: number
}

export type DependencyLink = {
  id: string
  source: string
  target: string
  type: DependencyType
  /** Lag positivo, lead como valor negativo */
  lag: number
}

export type ComputedActivity = {
  id: string
  ES: number
  EF: number
  LS: number
  LF: number
  slack: number
  critical: boolean
}

export type ScheduleIssue =
  | { kind: 'cycle'; chain: string[] }
  | { kind: 'invalid_duration'; activityId: string }
  | { kind: 'disconnected'; activityIds: string[] }
  | { kind: 'impossible_constraint'; message: string; edgeId: string }

export type ScheduleResult = {
  byId: Record<string, ComputedActivity>
  projectDuration: number
  criticalPathEdges: string[]
  criticalPathNodes: string[]
  topologicalOrder: string[]
  issues: ScheduleIssue[]
}

export type ViewMode = 'logical' | 'physical' | 'gantt' | 'analytics'

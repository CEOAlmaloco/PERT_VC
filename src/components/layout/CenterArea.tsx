import { cn } from '@/lib/utils'
import { FlowCanvas } from '@/components/canvas/FlowCanvas'
import { useProjectStore } from '@/store/useProjectStore'

export function CenterArea() {
  const viewMode = useProjectStore((s) => s.viewMode)

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden border-x border-zinc-800/40 bg-[#050505]">
      <div className={cn('engineering-grid screen-noise absolute inset-0 opacity-90')} />
      <div className="relative z-[1] h-full min-h-[420px]">
        {viewMode === 'gantt' ? (
          <GanttCenter />
        ) : viewMode === 'analytics' ? (
          <AnalyticsCenter />
        ) : (
          <FlowCanvas />
        )}
      </div>
    </div>
  )
}

function GanttCenter() {
  const activities = useProjectStore((s) => s.activities)
  const schedule = useProjectStore((s) => s.schedule)
  const projectDuration = schedule.projectDuration || 1
  const list = Object.values(activities).sort((a, b) => a.code.localeCompare(b.code))

  return (
    <div className="flex h-full flex-col gap-3 p-4 text-xs text-zinc-300">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Gantt sintético</span>
        <span className="font-mono text-[10px] text-cyan-500/80">Duración proyecto: {projectDuration.toFixed(0)}d</span>
      </div>
      <div className="min-h-0 flex-1 space-y-2 overflow-auto pr-1">
        {list.map((a) => {
          const c = schedule.byId[a.id]
          const w = projectDuration > 0 ? ((c?.EF ?? 0) - (c?.ES ?? 0)) / projectDuration : 0
          const x = projectDuration > 0 ? (c?.ES ?? 0) / projectDuration : 0
          const slackW = projectDuration > 0 ? (c?.slack ?? 0) / projectDuration : 0
          const crit = c?.critical
          return (
            <div
              key={a.id}
              className="grid grid-cols-[140px_1fr] items-center gap-3 rounded-sm border border-zinc-800/60 bg-zinc-950/40 px-2 py-1.5"
            >
              <div className="min-w-0">
                <div className="truncate font-mono text-[10px] text-cyan-200/80">{a.code}</div>
                <div className="truncate text-[11px] text-zinc-400">{a.name}</div>
              </div>
              <div className="relative h-7 rounded-sm bg-zinc-900/80 ring-1 ring-inset ring-zinc-800/80">
                <div
                  className="absolute top-1 bottom-1 rounded-[2px] bg-amber-500/15 ring-1 ring-amber-500/20"
                  style={{ left: `${x * 100}%`, width: `${Math.max(0.04, slackW) * 100}%` }}
                />
                <div
                  className={cn(
                    'absolute top-1 bottom-1 rounded-[2px] ring-1',
                    crit ? 'bg-red-500/35 ring-red-400/50' : 'bg-cyan-500/25 ring-cyan-400/35',
                  )}
                  style={{ left: `${x * 100}%`, width: `${Math.max(2, w * 100)}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AnalyticsCenter() {
  const schedule = useProjectStore((s) => s.schedule)
  const activities = useProjectStore((s) => s.activities)
  const n = Object.keys(activities).length
  const crit = schedule.criticalPathNodes.length
  const floats = Object.values(schedule.byId).filter((c) => c.slack > 0.0001)

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500">Tablero analítico</div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric label="Actividades" value={String(n)} />
        <Metric label="Críticas" value={String(crit)} accent="text-red-300" />
        <Metric label="Con holgura" value={String(floats.length)} accent="text-amber-200" />
      </div>
      <p className="max-w-xl text-[11px] leading-relaxed text-zinc-500">
        Métricas en tiempo real desde el motor CPM. El panel derecho muestra gráficos compactos; esta vista amplía el
        contexto operativo para revisiones de auditoría o junta de planificación.
      </p>
    </div>
  )
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-md border border-zinc-800/80 bg-zinc-950/50 p-3">
      <div className="text-[9px] font-semibold uppercase tracking-wider text-zinc-500">{label}</div>
      <div className={cn('mt-1 font-mono text-2xl tabular-nums text-zinc-100', accent)}>{value}</div>
    </div>
  )
}

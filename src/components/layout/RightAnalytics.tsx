import { Badge } from '@/components/ui/badge'
import { ScrollBox } from '@/components/ui/scroll-box'
import { cn } from '@/lib/utils'
import { useProjectStore } from '@/store/useProjectStore'
import type { Activity } from '@/types/project'
import { AlertTriangle, Cpu, Gauge, GitBranch, Timer, type LucideIcon } from 'lucide-react'
import { useMemo } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

export function RightAnalytics() {
  const rightCollapsed = useProjectStore((s) => s.rightCollapsed)
  const toggleRight = useProjectStore((s) => s.toggleRight)
  const schedule = useProjectStore((s) => s.schedule)
  const activities = useProjectStore((s) => s.activities)
  const resourceCap = useProjectStore((s) => s.resourceCap)

  const slackStats = useMemo(() => {
    const vals = Object.values(schedule.byId)
    const maxSlack = Math.max(0, ...vals.map((v) => v.slack))
    const avg = vals.length ? vals.reduce((s, v) => s + v.slack, 0) / vals.length : 0
    return { maxSlack, avg }
  }, [schedule.byId])

  const resourceLoad = useMemo(() => {
    const used = Object.values(activities).reduce((s, a) => s + a.resourceUnits, 0)
    return Math.min(100, Math.round((used / Math.max(1, resourceCap)) * 100))
  }, [activities, resourceCap])

  const pieData = useMemo(() => {
    const crit = schedule.criticalPathNodes.length
    const tot = Object.keys(activities).length || 1
    const other = Math.max(0, tot - crit)
    return [
      { name: 'Crítico', value: crit, fill: '#ef4444' },
      { name: 'Holgura', value: other, fill: '#27272a' },
    ]
  }, [activities, schedule.criticalPathNodes.length])

  const bottlenecks = useMemo(() => {
    return Object.values(activities)
      .map((a) => ({
        id: a.id,
        code: a.code,
        slack: schedule.byId[a.id]?.slack ?? 0,
        r: a.resourceUnits,
      }))
      .sort((x, y) => y.r - x.r)
      .slice(0, 4)
  }, [activities, schedule.byId])

  if (rightCollapsed) {
    return (
      <button
        type="button"
        onClick={toggleRight}
        className="flex w-10 shrink-0 items-center justify-center border-l border-zinc-800/80 bg-zinc-950/40 text-[10px] uppercase tracking-widest text-zinc-500 hover:bg-zinc-900/60"
      >
        MET
      </button>
    )
  }

  return (
    <aside className="flex w-[360px] shrink-0 flex-col border-l border-zinc-800/80 bg-zinc-950/45 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-zinc-800/80 px-3 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Analítica en vivo</span>
        <button type="button" onClick={toggleRight} className="text-xs text-zinc-500 hover:text-zinc-300">
          ▸
        </button>
      </div>

      <ScrollBox className="min-h-0 flex-1">
        <div className="space-y-5 p-3">
          {schedule.issues.length > 0 && (
            <div className="space-y-2 rounded-md border border-amber-500/30 bg-amber-500/5 p-2.5">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-amber-200">
                <AlertTriangle className="h-3.5 w-3.5" />
                Alertas de red
              </div>
              {schedule.issues.map((iss, i) => (
                <p key={i} className="text-[10px] leading-relaxed text-amber-100/80">
                  {iss.kind === 'cycle' && `Ciclo detectado: ${iss.chain.join(' → ')}`}
                  {iss.kind === 'disconnected' && `Subconjunto sin raíz: ${iss.activityIds.join(', ')}`}
                  {iss.kind === 'invalid_duration' && `Duración inválida en ${iss.activityId}`}
                  {iss.kind === 'impossible_constraint' && iss.message}
                </p>
              ))}
            </div>
          )}

          <section className="rounded-md border border-zinc-800/80 bg-[#080809]/80 p-3">
            <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              <Timer className="h-3.5 w-3.5" />
              Duración total
            </div>
            <div className="font-mono text-3xl tabular-nums text-cyan-100/90">{schedule.projectDuration.toFixed(0)}</div>
            <div className="mt-1 text-[10px] uppercase tracking-widest text-zinc-600">días · CPM forward</div>
          </section>

          <section className="grid grid-cols-2 gap-2">
            <MiniStat icon={GitBranch} label="Camino crítico" value={String(schedule.criticalPathNodes.length)} accent="text-red-300" />
            <MiniStat icon={Gauge} label="Holgura máx" value={slackStats.maxSlack.toFixed(0)} accent="text-amber-200" />
          </section>

          <section className="rounded-md border border-zinc-800/80 bg-[#080809]/80 p-2">
            <div className="mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5" />
                Carga vs capacidad
              </span>
              <span className="font-mono text-cyan-300/90">{resourceLoad}%</span>
            </div>
            <Radial resourceLoad={resourceLoad} />
          </section>

          <section className="rounded-md border border-zinc-800/80 bg-[#080809]/80 p-2">
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Mix crítico / no crítico</div>
            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" innerRadius={44} outerRadius={58} paddingAngle={2} stroke="none" />
                  <Tooltip contentStyle={{ background: '#0a0a0b', border: '1px solid #27272a', fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="space-y-2">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Cuellos (recurso)</div>
            <div className="space-y-1.5">
              {bottlenecks.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between rounded-sm border border-zinc-800/60 bg-zinc-950/50 px-2 py-1.5 font-mono text-[10px]"
                >
                  <span className="text-cyan-200/80">{b.code}</span>
                  <span className="text-zinc-500">{b.r} u</span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Slack medio</div>
            <div className="font-mono text-lg text-zinc-200">{slackStats.avg.toFixed(2)} d</div>
          </section>

          <section className="rounded-md border border-zinc-800/60 bg-zinc-950/30 p-2">
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Progreso global (ponderado)</div>
            <ProgressPct activities={activities} />
          </section>
        </div>
      </ScrollBox>
    </aside>
  )
}

function MiniStat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: LucideIcon
  label: string
  value: string
  accent?: string
}) {
  return (
    <div className="rounded-md border border-zinc-800/70 bg-zinc-950/40 p-2">
      <div className="mb-1 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-500">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className={cn('font-mono text-xl tabular-nums text-zinc-100', accent)}>{value}</div>
    </div>
  )
}

function Radial({ resourceLoad }: { resourceLoad: number }) {
  return (
    <div className="h-32 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={[{ v: 100 - resourceLoad }, { v: resourceLoad }]}
            dataKey="v"
            startAngle={90}
            endAngle={-270}
            innerRadius={40}
            outerRadius={52}
            stroke="none"
            cornerRadius={4}
          >
            <Cell fill="#18181b" />
            <Cell fill="rgba(34,211,238,0.45)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

function ProgressPct({ activities }: { activities: Record<string, Activity> }) {
  const list = Object.values(activities)
  if (!list.length) return <Badge>0%</Badge>
  const w = list.reduce((s, a) => s + a.duration, 0) || 1
  const doneW = list.filter((a) => a.status === 'done').reduce((s, a) => s + a.duration, 0)
  const pct = Math.round((doneW / w) * 100)
  return (
    <div className="space-y-1">
      <div className="h-1.5 overflow-hidden rounded-full bg-zinc-900">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-600/80 to-cyan-500/70"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between font-mono text-[10px] text-zinc-500">
        <span>Completado ponderado</span>
        <span className="text-emerald-300/90">{pct}%</span>
      </div>
    </div>
  )
}

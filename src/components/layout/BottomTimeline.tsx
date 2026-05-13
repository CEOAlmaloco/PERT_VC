import { cn } from '@/lib/utils'
import { useProjectStore } from '@/store/useProjectStore'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, Table2 } from 'lucide-react'
import { useMemo } from 'react'
import type { Activity, DependencyLink } from '@/types/project'

export function BottomTimeline() {
  const bottomCollapsed = useProjectStore((s) => s.bottomCollapsed)
  const toggleBottom = useProjectStore((s) => s.toggleBottom)
  const activities = useProjectStore((s) => s.activities)
  const schedule = useProjectStore((s) => s.schedule)
  const links = useProjectStore((s) => s.links)
  const projectDuration = schedule.projectDuration || 1

  const rows = useMemo(
    () => Object.values(activities).sort((a, b) => a.code.localeCompare(b.code)),
    [activities],
  )

  return (
    <div className="flex shrink-0 flex-col border-t border-zinc-800/80 bg-zinc-950/55 backdrop-blur-md">
      <button
        type="button"
        onClick={toggleBottom}
        className="flex h-9 items-center justify-between px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500 hover:bg-zinc-900/40"
      >
        <span className="flex items-center gap-2">
          <Table2 className="h-3.5 w-3.5" />
          Tabla / Gantt / matriz de dependencias
        </span>
        <ChevronUp className={cn('h-4 w-4 transition-transform', bottomCollapsed && 'rotate-180')} />
      </button>

      <AnimatePresence initial={false}>
        {!bottomCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-zinc-800/60"
          >
            <div className="max-h-[280px] overflow-auto">
              <table className="w-full min-w-[720px] border-collapse text-left text-[11px]">
                <thead className="sticky top-0 z-[1] bg-zinc-950/95 backdrop-blur-sm">
                  <tr className="border-b border-zinc-800/80 text-[9px] font-semibold uppercase tracking-wider text-zinc-500">
                    <th className="whitespace-nowrap px-2 py-2">Código</th>
                    <th className="min-w-[160px] px-2 py-2">Actividad</th>
                    <th className="px-2 py-2">Dur.</th>
                    <th className="px-2 py-2">ES</th>
                    <th className="px-2 py-2">EF</th>
                    <th className="px-2 py-2">LS</th>
                    <th className="px-2 py-2">LF</th>
                    <th className="px-2 py-2">Float</th>
                    <th className="min-w-[220px] px-2 py-2">Gantt</th>
                    <th className="min-w-[200px] px-2 py-2">Pred.</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((a) => {
                    const c = schedule.byId[a.id]
                    const preds = links.filter((l) => l.target === a.id)
                    const left = projectDuration > 0 && c ? (c.ES / projectDuration) * 100 : 0
                    const width = projectDuration > 0 && c ? ((c.EF - c.ES) / projectDuration) * 100 : 0
                    const slackW = projectDuration > 0 && c ? (c.slack / projectDuration) * 100 : 0
                    return (
                      <tr key={a.id} className="border-b border-zinc-900/80 hover:bg-zinc-900/30">
                        <td className="whitespace-nowrap px-2 py-1.5 font-mono text-cyan-200/90">{a.code}</td>
                        <td className="px-2 py-1.5 text-zinc-300">{a.name}</td>
                        <td className="px-2 py-1.5 font-mono text-zinc-400">{a.duration}</td>
                        <td className="px-2 py-1.5 font-mono text-zinc-400">{c?.ES.toFixed(0)}</td>
                        <td className="px-2 py-1.5 font-mono text-zinc-400">{c?.EF.toFixed(0)}</td>
                        <td className="px-2 py-1.5 font-mono text-zinc-400">{c?.LS.toFixed(0)}</td>
                        <td className="px-2 py-1.5 font-mono text-zinc-400">{c?.LF.toFixed(0)}</td>
                        <td
                          className={cn(
                            'px-2 py-1.5 font-mono',
                            c?.critical ? 'text-red-300' : 'text-amber-200/90',
                          )}
                        >
                          {c?.slack.toFixed(1)}
                        </td>
                        <td className="px-2 py-1.5">
                          <div className="relative h-5 overflow-hidden rounded-sm bg-zinc-900 ring-1 ring-inset ring-zinc-800/80">
                            <div
                              className="absolute inset-y-0 rounded-[1px] bg-amber-500/10"
                              style={{ left: `${left}%`, width: `${Math.max(0, slackW)}%` }}
                            />
                            <div
                              className={cn(
                                'absolute inset-y-0 rounded-[1px]',
                                c?.critical ? 'bg-red-500/40' : 'bg-cyan-500/30',
                              )}
                              style={{ left: `${left}%`, width: `${Math.max(2, width)}%` }}
                            />
                          </div>
                        </td>
                        <td className="px-2 py-1.5 font-mono text-[10px] text-zinc-500">
                          {preds.map((p) => `${activities[p.source]?.code}:${p.type}`).join(' · ') || '—'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex items-center gap-2 border-t border-zinc-800/60 px-3 py-2 text-[10px] text-zinc-600">
              <span className="font-mono uppercase tracking-widest">Matriz FS</span>
              <MatrixPreview activities={rows} links={links} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MatrixPreview({ activities, links }: { activities: Activity[]; links: DependencyLink[] }) {
  const head = activities.slice(0, 6)
  const set = new Set(head.map((a) => a.id))
  return (
    <div className="flex flex-wrap gap-1">
      {head.map((row) => (
        <div key={row.id} className="flex gap-0.5">
          {head.map((col) => {
            const hit = links.find((l) => l.source === col.id && l.target === row.id)
            const active = hit && set.has(row.id) && set.has(col.id)
            return (
              <div
                key={col.id + row.id}
                title={hit ? `${hit.type} lag ${hit.lag}` : ''}
                className={cn(
                  'h-4 w-4 rounded-[2px] border border-zinc-800/80',
                  active ? 'bg-cyan-500/35' : 'bg-zinc-950/80',
                )}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

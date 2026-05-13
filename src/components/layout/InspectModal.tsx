import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useProjectStore } from '@/store/useProjectStore'
import * as Dialog from '@radix-ui/react-dialog'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

export function InspectModal() {
  const inspectActivityId = useProjectStore((s) => s.inspectActivityId)
  const setInspect = useProjectStore((s) => s.setInspect)
  const activity = useProjectStore((s) => (inspectActivityId ? s.activities[inspectActivityId] : null))
  const computed = useProjectStore((s) => (inspectActivityId ? s.schedule.byId[inspectActivityId] : null))
  const updateActivity = useProjectStore((s) => s.updateActivity)

  const open = Boolean(inspectActivityId && activity)

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && setInspect(null)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[101] w-[min(92vw,440px)] -translate-x-1/2 -translate-y-1/2 rounded-md border border-zinc-800/90 bg-zinc-950/95 p-4 shadow-2xl outline-none">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <Dialog.Title className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Diagnóstico de actividad
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-xs text-zinc-500">
                Metadatos PERT/CPM y holgura en tiempo real.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
          </div>

          {activity && computed && (
            <motion.div key={activity.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <label className="space-y-1">
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-500">Código</span>
                  <Input
                    value={activity.code}
                    onChange={(e) => updateActivity(activity.id, { code: e.target.value })}
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-500">Duración (d)</span>
                  <Input
                    value={String(activity.duration)}
                    onChange={(e) => {
                      const n = Number(e.target.value)
                      if (Number.isFinite(n) && n >= 0) updateActivity(activity.id, { duration: n })
                    }}
                  />
                </label>
              </div>
              <label className="space-y-1">
                <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-500">Nombre</span>
                <Input value={activity.name} onChange={(e) => updateActivity(activity.id, { name: e.target.value })} />
              </label>
              <div className="grid grid-cols-4 gap-2 rounded-md border border-zinc-800/80 bg-[#080809] p-2 font-mono text-[11px]">
                <Cell k="ES" v={computed.ES} />
                <Cell k="EF" v={computed.EF} />
                <Cell k="LS" v={computed.LS} />
                <Cell k="LF" v={computed.LF} />
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-500">Slack</span>
                <span className={computed.critical ? 'font-mono text-red-300' : 'font-mono text-amber-200'}>
                  {computed.slack.toFixed(2)} d
                </span>
              </div>
              {activity.baselineDuration != null && (
                <div className="text-[10px] text-zinc-500">
                  Línea base: <span className="font-mono text-zinc-300">{activity.baselineDuration}d</span> · var.{' '}
                  <span className="font-mono text-cyan-300/90">{(activity.duration - activity.baselineDuration).toFixed(1)}d</span>
                </div>
              )}
            </motion.div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function Cell({ k, v }: { k: string; v: number }) {
  return (
    <div>
      <div className="text-[9px] uppercase text-zinc-600">{k}</div>
      <div className="tabular-nums text-cyan-100/90">{v.toFixed(0)}</div>
    </div>
  )
}

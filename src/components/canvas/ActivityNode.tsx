import { cn } from '@/lib/utils'
import type { Activity, ComputedActivity } from '@/types/project'
import { Handle, type NodeProps, Position } from '@xyflow/react'
import { AlertTriangle, CheckCircle2, Circle } from 'lucide-react'
import { memo } from 'react'

export type ActivityNodeData = {
  activity: Activity
  computed: ComputedActivity
}

function fmt(n: number) {
  return Number.isFinite(n) ? n.toFixed(0) : '—'
}

export const ActivityNode = memo(function ActivityNode(props: NodeProps) {
  const { activity: a, computed: c } = props.data as ActivityNodeData
  const { selected } = props
  const critical = c?.critical
  const done = a.status === 'done'
  const dummy = a.status === 'dummy' || a.duration === 0

  const borderGlow = critical
    ? 'shadow-[0_0_22px_rgba(239,68,68,0.35)] border-red-500/70'
    : done
      ? 'shadow-[0_0_16px_rgba(34,197,94,0.18)] border-emerald-500/45'
      : 'shadow-[0_0_14px_rgba(34,211,238,0.12)] border-cyan-500/35'

  return (
    <div
      className={cn(
        'relative w-[232px] select-none rounded-md border bg-gradient-to-b from-zinc-950/95 to-[#080809]',
        borderGlow,
        selected && 'ring-1 ring-cyan-400/60',
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !border !border-cyan-500/50 !bg-zinc-950"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !border !border-cyan-500/50 !bg-zinc-950"
      />

      <div className="flex items-stretch border-b border-zinc-800/80">
        <div className="flex flex-1 flex-col gap-0.5 border-r border-zinc-800/80 px-2 py-1.5">
          <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-zinc-500">ES</span>
          <span className="font-mono text-xs tabular-nums text-cyan-100/90">{fmt(c?.ES ?? 0)}</span>
        </div>
        <div className="flex flex-1 flex-col gap-0.5 px-2 py-1.5 text-right">
          <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-zinc-500">EF</span>
          <span className="font-mono text-xs tabular-nums text-cyan-100/90">{fmt(c?.EF ?? 0)}</span>
        </div>
      </div>

      <div className="space-y-1 px-2.5 py-2">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-300/90">{a.code}</span>
          <div className="flex items-center gap-1">
            {dummy && <BadgeMini label="Hito" />}
            {critical && (
              <span className="flex items-center gap-0.5 rounded-sm border border-red-500/40 bg-red-500/10 px-1 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-red-200">
                <AlertTriangle className="h-2.5 w-2.5" />
                CP
              </span>
            )}
            {done && !critical && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
            {!done && !critical && !dummy && <Circle className="h-3 w-3 text-zinc-600" />}
          </div>
        </div>
        <div className="line-clamp-2 text-[11px] font-medium leading-snug text-zinc-100">{a.name}</div>
        <div className="flex items-center justify-between border-t border-dashed border-zinc-800/80 pt-1.5 font-mono text-[10px] text-zinc-400">
          <span>
            Duración: <span className="text-zinc-100">{dummy ? '0' : a.duration}d</span>
          </span>
          <span className={cn(critical ? 'text-red-300' : (c?.slack ?? 0) > 0 ? 'text-amber-200/90' : 'text-zinc-500')}>
            Float {fmt(c?.slack ?? 0)}
          </span>
        </div>
      </div>

      <div className="flex items-stretch border-t border-zinc-800/80">
        <div className="flex flex-1 flex-col gap-0.5 border-r border-zinc-800/80 px-2 py-1.5">
          <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-zinc-500">LS</span>
          <span className="font-mono text-xs tabular-nums text-zinc-300">{fmt(c?.LS ?? 0)}</span>
        </div>
        <div className="flex flex-1 flex-col gap-0.5 px-2 py-1.5 text-right">
          <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-zinc-500">LF</span>
          <span className="font-mono text-xs tabular-nums text-zinc-300">{fmt(c?.LF ?? 0)}</span>
        </div>
      </div>
    </div>
  )
})

function BadgeMini({ label }: { label: string }) {
  return (
    <span className="rounded-sm border border-zinc-600/80 bg-zinc-900/80 px-1 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-zinc-400">
      {label}
    </span>
  )
}

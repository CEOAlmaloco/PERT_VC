import { Button } from '@/components/ui/button'
import { useProjectStore } from '@/store/useProjectStore'
import { motion } from 'framer-motion'
import { Activity, Download, Save, ZoomIn } from 'lucide-react'

const modes = [
  { id: 'logical' as const, label: 'Lógica' },
  { id: 'physical' as const, label: 'Física' },
  { id: 'gantt' as const, label: 'Gantt' },
  { id: 'analytics' as const, label: 'Analítica' },
]

export function HeaderBar() {
  const projectName = useProjectStore((s) => s.projectName)
  const setProjectName = useProjectStore((s) => s.setProjectName)
  const autosaveAt = useProjectStore((s) => s.autosaveAt)
  const viewMode = useProjectStore((s) => s.viewMode)
  const setViewMode = useProjectStore((s) => s.setViewMode)
  const autoLayout = useProjectStore((s) => s.autoLayout)

  const saved = new Date(autosaveAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-14 shrink-0 items-center gap-4 border-b border-zinc-800/80 bg-zinc-950/55 px-4 backdrop-blur-md"
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-cyan-500/35 bg-cyan-500/10">
            <Activity className="h-4 w-4 text-cyan-300" />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-zinc-500">PERT / CPM</span>
            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="min-w-0 max-w-[min(40vw,320px)] truncate border-none bg-transparent p-0 text-sm font-medium tracking-tight text-zinc-100 outline-none focus:ring-0"
            />
          </div>
        </div>
        <div className="hidden items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500 xl:flex">
          <Save className="h-3 w-3 shrink-0 text-emerald-400/80" />
          <span>Autosave {saved}</span>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-center gap-1">
        {modes.map((m) => (
          <Button
            key={m.id}
            type="button"
            variant={viewMode === m.id ? 'accent' : 'ghost'}
            size="sm"
            className="rounded-sm px-2.5 sm:px-3"
            onClick={() => setViewMode(m.id)}
          >
            {m.label}
          </Button>
        ))}
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
        <Button type="button" variant="default" size="sm" className="gap-1.5" onClick={() => autoLayout()}>
          <ZoomIn className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Auto-layout</span>
        </Button>
        <Button type="button" variant="ghost" size="icon" title="Exportar" className="hidden sm:inline-flex">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </motion.header>
  )
}

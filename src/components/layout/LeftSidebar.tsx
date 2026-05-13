import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollBox } from '@/components/ui/scroll-box'
import { cn } from '@/lib/utils'
import { depTypeLabels, useProjectStore } from '@/store/useProjectStore'
import type { Activity, ComputedActivity, DependencyType } from '@/types/project'
import * as Select from '@radix-ui/react-select'
import * as Slider from '@radix-ui/react-slider'
import { ChevronDown, Filter, GripVertical, Link2, Plus, Search, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'

const depTypes: DependencyType[] = ['FS', 'SS', 'FF', 'SF']

export function LeftSidebar() {
  const leftCollapsed = useProjectStore((s) => s.leftCollapsed)
  const toggleLeft = useProjectStore((s) => s.toggleLeft)
  const activities = useProjectStore((s) => s.activities)
  const links = useProjectStore((s) => s.links)
  const addActivity = useProjectStore((s) => s.addActivity)
  const updateActivity = useProjectStore((s) => s.updateActivity)
  const removeActivity = useProjectStore((s) => s.removeActivity)
  const removeLink = useProjectStore((s) => s.removeLink)
  const selectedActivityId = useProjectStore((s) => s.selectedActivityId)
  const schedule = useProjectStore((s) => s.schedule)
  const resourceCap = useProjectStore((s) => s.resourceCap)
  const setResourceCap = useProjectStore((s) => s.setResourceCap)

  const [q, setQ] = useState('')
  const [form, setForm] = useState({ code: '', name: '', duration: '2' })
  const [pred, setPred] = useState('')
  const [depType, setDepType] = useState<DependencyType>('FS')
  const [lag, setLag] = useState('0')

  const filtered = useMemo(() => {
    const v = q.trim().toLowerCase()
    return Object.values(activities).filter(
      (a) => !v || a.name.toLowerCase().includes(v) || a.code.toLowerCase().includes(v),
    )
  }, [activities, q])

  const selected = selectedActivityId ? activities[selectedActivityId] : null
  const incoming = links.filter((l) => l.target === selectedActivityId)

  if (leftCollapsed) {
    return (
      <button
        type="button"
        onClick={toggleLeft}
        className="flex w-10 shrink-0 items-center justify-center border-r border-zinc-800/80 bg-zinc-950/40 text-[10px] uppercase tracking-widest text-zinc-500 hover:bg-zinc-900/60"
      >
        EXP
      </button>
    )
  }

  return (
    <aside className="flex w-[320px] shrink-0 flex-col border-r border-zinc-800/80 bg-zinc-950/50 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-zinc-800/80 px-3 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Explorador</span>
        <Button type="button" variant="ghost" size="sm" onClick={toggleLeft}>
          ◂
        </Button>
      </div>

      <ScrollBox className="min-h-0 flex-1">
        <div className="space-y-5 p-3">
          <section className="space-y-2">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Buscar</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Código o nombre…" className="pl-8" />
            </div>
          </section>

          <section className="space-y-2 rounded-md border border-zinc-800/70 bg-[#080809]/80 p-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Nueva actividad</span>
              <Link2 className="h-3.5 w-3.5 text-zinc-600" />
            </div>
            <div className="grid gap-2">
              <Input placeholder="Código" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} />
              <Input placeholder="Nombre" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              <Input
                placeholder="Duración (d)"
                value={form.duration}
                onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
              />
              <Button
                type="button"
                variant="accent"
                size="sm"
                className="w-full gap-1"
                onClick={() => {
                  const d = Number(form.duration)
                  const id = addActivity({
                    code: form.code || undefined,
                    name: form.name || undefined,
                    duration: Number.isFinite(d) ? d : 1,
                  })
                  setForm({ code: '', name: '', duration: '2' })
                  void id
                }}
              >
                <Plus className="h-3.5 w-3.5" />
                Crear
              </Button>
            </div>
          </section>

          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Dependencias</span>
              <Filter className="h-3.5 w-3.5 text-zinc-600" />
            </div>
            {!selected ? (
              <p className="text-[11px] leading-relaxed text-zinc-600">Seleccione un nodo en el lienzo para editar predecesores.</p>
            ) : (
              <div className="space-y-2 rounded-md border border-zinc-800/70 bg-[#080809]/80 p-2.5">
                <div className="text-[11px] text-zinc-300">
                  <span className="font-mono text-cyan-200/90">{selected.code}</span> — {selected.name}
                </div>
                <div className="flex flex-wrap gap-1">
                  {incoming.map((l) => (
                    <Badge key={l.id} className="gap-1 border-cyan-900/40 bg-cyan-950/40 text-[8px] text-cyan-100/90">
                      {activities[l.source]?.code ?? l.source} · {l.type} · lag {l.lag}
                      <button
                        type="button"
                        className="ml-1 text-zinc-500 hover:text-red-300"
                        onClick={() => removeLink(l.id)}
                        aria-label="Quitar dependencia"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                  {incoming.length === 0 && <span className="text-[10px] text-zinc-600">Sin predecesores</span>}
                </div>
                <div className="grid gap-2">
                  <Select.Root value={pred} onValueChange={setPred}>
                    <Select.Trigger className="flex h-8 w-full items-center justify-between rounded-sm border border-zinc-800 bg-[#0a0a0b] px-2 text-left text-[11px] text-zinc-200 focus:outline-none focus:ring-1 focus:ring-cyan-500/40">
                      <Select.Value placeholder="Predecesor" />
                      <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="z-50 overflow-hidden rounded-sm border border-zinc-800 bg-zinc-950 shadow-xl">
                        <Select.Viewport className="p-1">
                          {Object.values(activities)
                            .filter((a) => a.id !== selected.id)
                            .map((a) => (
                              <Select.Item
                                key={a.id}
                                value={a.id}
                                className="cursor-pointer rounded-sm px-2 py-1.5 text-[11px] text-zinc-200 outline-none data-[highlighted]:bg-zinc-800/80"
                              >
                                <span className="font-mono text-cyan-200/80">{a.code}</span> {a.name}
                              </Select.Item>
                            ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                  <div className="grid grid-cols-2 gap-2">
                    <Select.Root value={depType} onValueChange={(v) => setDepType(v as DependencyType)}>
                      <Select.Trigger className="flex h-8 w-full items-center justify-between rounded-sm border border-zinc-800 bg-[#0a0a0b] px-2 text-left text-[10px] text-zinc-200 focus:outline-none focus:ring-1 focus:ring-cyan-500/40">
                        <Select.Value />
                        <ChevronDown className="h-3 w-3 text-zinc-500" />
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content className="z-50 overflow-hidden rounded-sm border border-zinc-800 bg-zinc-950 shadow-xl">
                          <Select.Viewport className="p-1">
                            {depTypes.map((t) => (
                              <Select.Item
                                key={t}
                                value={t}
                                className="cursor-pointer rounded-sm px-2 py-1.5 text-[10px] outline-none data-[highlighted]:bg-zinc-800/80"
                              >
                                {t} — {depTypeLabels[t]}
                              </Select.Item>
                            ))}
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                    <Input value={lag} onChange={(e) => setLag(e.target.value)} placeholder="Lag" />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="default"
                    className="w-full"
                    onClick={() => {
                      if (!pred) return
                      const ok = useProjectStore.getState().addLink({
                        source: pred,
                        target: selected.id,
                        type: depType,
                        lag: Number(lag) || 0,
                      })
                      if (ok) setPred('')
                    }}
                  >
                    Enlazar
                  </Button>
                </div>
              </div>
            )}
          </section>

          <section className="space-y-2 rounded-md border border-zinc-800/70 bg-[#080809]/80 p-2.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Recursos / restricción</span>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                <span>Cap diaria</span>
                <span className="text-cyan-300/90">{resourceCap} u</span>
              </div>
              <Slider.Root
                className="relative flex h-5 w-full touch-none select-none items-center"
                value={[resourceCap]}
                max={40}
                min={4}
                step={1}
                onValueChange={(v) => setResourceCap(v[0] ?? 18)}
              >
                <Slider.Track className="relative h-1.5 grow rounded-full bg-zinc-800">
                  <Slider.Range className="absolute h-full rounded-full bg-cyan-500/40" />
                </Slider.Track>
                <Slider.Thumb className="block h-3.5 w-3.5 rounded-sm border border-cyan-400/50 bg-zinc-950 shadow focus:outline-none" />
              </Slider.Root>
            </div>
            <p className="text-[10px] leading-relaxed text-zinc-600">
              Indicador de carga frente a capacidad; el motor CPM sigue siendo tiempo lógico (DAG). Extensible a
              nivelación de recursos.
            </p>
          </section>

          <section className="space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Actividades</span>
            <div className="space-y-1.5">
              {filtered.map((a) => (
                <ActivityRow
                  key={a.id}
                  activity={a}
                  computed={schedule.byId[a.id]}
                  selected={a.id === selectedActivityId}
                  onSelect={() => useProjectStore.getState().setSelected(a.id)}
                  onDuration={(d) => updateActivity(a.id, { duration: d })}
                  onRemove={() => removeActivity(a.id)}
                />
              ))}
            </div>
          </section>
        </div>
      </ScrollBox>
    </aside>
  )
}

function ActivityRow({
  activity: a,
  computed: c,
  selected,
  onSelect,
  onDuration,
  onRemove,
}: {
  activity: Activity
  computed: ComputedActivity | undefined
  selected: boolean
  onSelect: () => void
  onDuration: (n: number) => void
  onRemove: () => void
}) {
  const [dur, setDur] = useState(String(a.duration))
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex w-full items-start gap-2 rounded-md border px-2 py-2 text-left transition-colors',
        selected ? 'border-cyan-500/45 bg-cyan-500/5' : 'border-zinc-800/70 bg-zinc-950/40 hover:border-zinc-700/80',
      )}
    >
      <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-zinc-600" />
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-cyan-200/90">{a.code}</span>
          {c?.critical && (
            <span className="rounded-sm border border-red-500/40 bg-red-500/10 px-1 py-px text-[8px] font-bold uppercase text-red-200">
              CP
            </span>
          )}
          {a.status === 'done' && <Badge className="border-emerald-900/40 text-[8px] text-emerald-200/90">OK</Badge>}
        </div>
        <div className="truncate text-[11px] text-zinc-300">{a.name}</div>
        <div className="flex items-center gap-2">
          <Input
            className="h-7 max-w-[72px] text-[11px]"
            value={dur}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              setDur(e.target.value)
              const n = Number(e.target.value)
              if (Number.isFinite(n) && n >= 0) onDuration(n)
            }}
          />
          <span className="font-mono text-[10px] text-zinc-500">d</span>
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0 text-zinc-600 hover:text-red-300"
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </button>
  )
}

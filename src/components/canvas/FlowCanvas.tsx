import { ActivityNode } from '@/components/canvas/ActivityNode'
import { DataFlowEdge } from '@/components/canvas/DataFlowEdge'
import type { DependencyLink } from '@/types/project'
import {
  selectFlowEdges,
  selectFlowNodes,
  useProjectStore,
} from '@/store/useProjectStore'
import {
  Background,
  BackgroundVariant,
  Controls,
  type Connection,
  type Edge,
  MarkerType,
  type Node,
  type NodeTypes,
  MiniMap,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesInitialized,
  useNodesState,
  useReactFlow,
} from '@xyflow/react'
import { useCallback, useEffect, useMemo, useRef } from 'react'

const nodeTypes = { activity: ActivityNode } as unknown as NodeTypes
const edgeTypes = { dataflow: DataFlowEdge }

function structureSignature(activities: Record<string, unknown>, links: DependencyLink[]) {
  const ids = Object.keys(activities).sort().join('|')
  const es = links
    .map((l) => `${l.id}:${l.source}->${l.target}`)
    .sort()
    .join('|')
  return `${ids}__${es}`
}

function InnerCanvas() {
  const activities = useProjectStore((s) => s.activities)
  const links = useProjectStore((s) => s.links)
  const schedule = useProjectStore((s) => s.schedule)
  const positions = useProjectStore((s) => s.positions)
  const addLink = useProjectStore((s) => s.addLink)
  const removeLink = useProjectStore((s) => s.removeLink)
  const removeActivity = useProjectStore((s) => s.removeActivity)
  const setPositionsFromNodes = useProjectStore((s) => s.setPositionsFromNodes)
  const setSelected = useProjectStore((s) => s.setSelected)
  const setInspect = useProjectStore((s) => s.setInspect)

  const scaffoldEdges = useMemo(
    () =>
      selectFlowEdges({
        activities,
        links,
        schedule,
      }),
    [activities, links, schedule],
  )

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  const structSig = useMemo(() => structureSignature(activities, links), [activities, links])
  const posKey = useMemo(() => JSON.stringify(positions), [positions])
  const prevFitSig = useRef<string | null>(null)

  useEffect(() => {
    setEdges(scaffoldEdges)
  }, [scaffoldEdges, setEdges])

  /** Estructura del grafo o posiciones en store: si hay posición persistida en Zustand, gana sobre el estado interno de RF (evita quedar todos en 0,0 tras autoLayout). */
  useEffect(() => {
    const { activities: act, schedule: sch, positions: pos } = useProjectStore.getState()
    setNodes((prev) => {
      const prevMap = new Map(prev.map((n) => [n.id, n]))
      const scaffold = selectFlowNodes({ activities: act, schedule: sch, positions: pos })
      return scaffold.map((n) => {
        if (Object.prototype.hasOwnProperty.call(pos, n.id)) {
          const p = pos[n.id]!
          return { ...n, position: { x: p.x, y: p.y } }
        }
        const prevN = prevMap.get(n.id)
        return { ...n, position: prevN?.position ?? n.position }
      })
    })
  }, [structSig, posKey, setNodes])

  /** Datos CPM en nodos sin tocar posiciones (sin bucle de layout) */
  useEffect(() => {
    setNodes((prev) =>
      prev.map((n) => {
        const act = activities[n.id]
        const comp = schedule.byId[n.id]
        if (!act || !comp) return n
        return { ...n, data: { activity: act, computed: comp } }
      }),
    )
  }, [schedule, activities, setNodes])

  const { fitView } = useReactFlow()
  const nodesInitialized = useNodesInitialized()

  useEffect(() => {
    if (!nodesInitialized || nodes.length === 0) return
    const fitKey = `${structSig}|${nodes.length}`
    if (prevFitSig.current === fitKey) return
    prevFitSig.current = fitKey
    let cancelled = false
    const t = requestAnimationFrame(() => {
      if (cancelled) return
      try {
        fitView({ padding: 0.2, duration: 200 })
      } catch {
        /* Estado intermedio nodos/aristas o viewport inválido */
      }
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(t)
    }
  }, [nodesInitialized, structSig, fitView, nodes.length])

  const onConnect = useCallback(
    (c: Connection) => {
      if (!c.source || !c.target) return
      addLink({ source: c.source, target: c.target, type: 'FS', lag: 0 })
    },
    [addLink],
  )

  const onNodeDragStop = useCallback(
    (_: unknown, __: unknown, ns: Node[]) => {
      setPositionsFromNodes(ns)
    },
    [setPositionsFromNodes],
  )

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      for (const n of deleted) removeActivity(n.id)
    },
    [removeActivity],
  )

  const onEdgesDelete = useCallback(
    (deleted: Edge[]) => {
      for (const e of deleted) removeLink(e.id)
    },
    [removeLink],
  )

  const onNodeClick = useCallback(
    (_: unknown, n: Node) => {
      setSelected(n.id)
    },
    [setSelected],
  )

  const onPaneClick = useCallback(() => {
    setSelected(null)
  }, [setSelected])

  const onNodeDoubleClick = useCallback(
    (_: unknown, n: Node) => {
      setInspect(n.id)
    },
    [setInspect],
  )

  return (
    <div className="relative h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        panOnScroll
        panOnDrag
        selectionOnDrag={false}
        deleteKeyCode={['Backspace', 'Delete']}
        minZoom={0.15}
        maxZoom={1.8}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{
          type: 'dataflow',
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#22d3ee',
            width: 18,
            height: 18,
          },
        }}
        className="!bg-transparent"
      >
        <Background id="grid" gap={24} size={1.2} color="rgba(148,163,184,0.08)" variant={BackgroundVariant.Dots} />
        <MiniMap
          className="!rounded-md !border !border-zinc-800/80 !bg-zinc-950/90"
          maskColor="rgba(5,5,5,0.72)"
          nodeStrokeWidth={2}
          nodeColor={(n) => {
            const d = n.data as { computed?: { critical?: boolean }; activity?: { status?: string } }
            if (d?.computed?.critical) return '#ef4444'
            if (d?.activity?.status === 'done') return '#22c55e'
            return '#27272a'
          }}
        />
        <Controls
          className="!overflow-hidden !rounded-md !border !border-zinc-800/80 !bg-zinc-950/90 !shadow-xl"
          showInteractive={false}
        />
        <Panel position="top-center" className="pointer-events-none m-0 p-0">
          <TimelineRuler projectEnd={schedule.projectDuration} />
        </Panel>
        <Panel position="bottom-left" className="m-3 flex flex-col gap-1 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
          <span>Capa: red lógica</span>
          <span className="text-cyan-500/70">XYZ · unidad: días</span>
        </Panel>
      </ReactFlow>
      <div className="pointer-events-none absolute inset-0 screen-noise" />
    </div>
  )
}

function TimelineRuler({ projectEnd }: { projectEnd: number }) {
  const ticks = useMemo(() => {
    const n = Math.max(6, Math.ceil(projectEnd) + 2)
    return Array.from({ length: n + 1 }, (_, i) => i)
  }, [projectEnd])
  return (
    <div className="pointer-events-auto flex w-[min(92vw,1120px)] items-end border-b border-zinc-800/80 bg-zinc-950/40 px-2 pb-1 backdrop-blur-[2px]">
      <div className="flex flex-1 justify-between gap-px">
        {ticks.map((t) => (
          <div key={t} className="flex flex-col items-center gap-0.5 text-[9px] font-mono text-zinc-500">
            <span className="h-2 w-px bg-zinc-600" />
            <span>{t}d</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function FlowCanvas() {
  return (
    <ReactFlowProvider>
      <InnerCanvas />
    </ReactFlowProvider>
  )
}

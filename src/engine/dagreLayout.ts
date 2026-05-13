import dagre from '@dagrejs/dagre'
import type { Edge, Node } from '@xyflow/react'

export function layoutDagLR(
  nodes: Node[],
  edges: Edge[],
  options?: { ranksep?: number; nodesep?: number },
): Node[] {
  const g = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))
  const ranksep = options?.ranksep ?? 96
  const nodesep = options?.nodesep ?? 56

  g.setGraph({
    rankdir: 'LR',
    ranksep,
    nodesep,
    marginx: 48,
    marginy: 48,
  })

  for (const node of nodes) {
    const w = (node.measured?.width ?? node.width ?? 220) as number
    const h = (node.measured?.height ?? node.height ?? 120) as number
    g.setNode(node.id, { width: w, height: h })
  }

  for (const e of edges) {
    g.setEdge(e.source, e.target)
  }

  dagre.layout(g)

  return nodes.map((node) => {
    const pos = g.node(node.id)
    if (!pos) return node
    const w = (node.measured?.width ?? node.width ?? 220) as number
    const h = (node.measured?.height ?? node.height ?? 120) as number
    return {
      ...node,
      position: {
        x: pos.x - w / 2,
        y: pos.y - h / 2,
      },
    }
  })
}

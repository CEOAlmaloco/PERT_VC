import { BaseEdge, type EdgeProps, getSmoothStepPath } from '@xyflow/react'

type Data = {
  depType?: string
  lag?: number
  criticalPath?: boolean
}

export function DataFlowEdge(props: EdgeProps) {
  const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd, style } = props
  const data = props.data as Data | undefined
  const critical = Boolean(data?.criticalPath)
  const [path] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const stroke = critical ? 'rgba(239,68,68,0.95)' : 'rgba(34,211,238,0.55)'
  const glow = critical ? 'rgba(239,68,68,0.45)' : 'rgba(34,211,238,0.25)'

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        style={{
          ...style,
          stroke: glow,
          strokeWidth: critical ? 6 : 4,
          filter: critical ? 'blur(4px)' : 'blur(3px)',
          opacity: 0.55,
        }}
        markerEnd={markerEnd}
      />
      <BaseEdge
        id={`${id}-core`}
        path={path}
        style={{
          stroke,
          strokeWidth: critical ? 2.4 : 1.35,
          strokeDasharray: critical ? '10 6' : '6 10',
        }}
        markerEnd={markerEnd}
      />
    </>
  )
}

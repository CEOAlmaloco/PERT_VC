import { BottomTimeline } from '@/components/layout/BottomTimeline'
import { CenterArea } from '@/components/layout/CenterArea'
import { HeaderBar } from '@/components/layout/HeaderBar'
import { InspectModal } from '@/components/layout/InspectModal'
import { LeftSidebar } from '@/components/layout/LeftSidebar'
import { RightAnalytics } from '@/components/layout/RightAnalytics'
import { useProjectStore } from '@/store/useProjectStore'
import { useEffect } from 'react'

export function AppShell() {
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const { positions, autoLayout } = useProjectStore.getState()
      if (Object.keys(positions).length === 0) autoLayout()
    })
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'l' || e.key === 'L') useProjectStore.getState().autoLayout()
      if (e.key === 'f' || e.key === 'F') {
        /* fitView handled inside RF; user can use controls */
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#050505] text-zinc-200">
      <HeaderBar />
      <div className="flex min-h-0 flex-1">
        <LeftSidebar />
        <CenterArea />
        <RightAnalytics />
      </div>
      <BottomTimeline />
      <InspectModal />
    </div>
  )
}

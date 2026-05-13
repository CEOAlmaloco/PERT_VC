import { cn } from '@/lib/utils'
import * as ScrollArea from '@radix-ui/react-scroll-area'

type Props = {
  className?: string
  children: React.ReactNode
}

export function ScrollBox({ className, children }: Props) {
  return (
    <ScrollArea.Root className={cn('relative overflow-hidden', className)}>
      <ScrollArea.Viewport className="h-full w-full rounded-[inherit]">{children}</ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        className="flex touch-none select-none bg-zinc-900/50 p-0.5 transition-colors hover:bg-zinc-800/80 data-[orientation=vertical]:w-1.5"
        orientation="vertical"
      >
        <ScrollArea.Thumb className="relative flex-1 rounded-full bg-zinc-600/80" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  )
}

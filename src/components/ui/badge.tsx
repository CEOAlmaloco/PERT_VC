import { cn } from '@/lib/utils'

export function Badge({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm border border-zinc-700/80 bg-zinc-900/60 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-400',
        className,
      )}
    >
      {children}
    </span>
  )
}

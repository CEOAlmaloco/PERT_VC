import { cn } from '@/lib/utils'
import type { InputHTMLAttributes } from 'react'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-8 w-full rounded-sm border border-zinc-800 bg-[#0a0a0b] px-2.5 text-xs text-zinc-100 placeholder:text-zinc-600',
        'font-mono tracking-tight shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]',
        'focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30',
        className,
      )}
      {...props}
    />
  )
}

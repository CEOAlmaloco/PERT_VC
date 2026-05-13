import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'

const variants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm border text-xs font-medium tracking-wide uppercase transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/70 disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      variant: {
        default:
          'border-zinc-700/80 bg-zinc-900/80 text-zinc-100 hover:border-cyan-500/40 hover:bg-zinc-800/90',
        ghost: 'border-transparent bg-transparent text-zinc-300 hover:bg-zinc-800/60',
        accent:
          'border-cyan-500/40 bg-cyan-500/10 text-cyan-100 hover:bg-cyan-500/15',
        danger:
          'border-red-500/35 bg-red-500/10 text-red-100 hover:bg-red-500/15',
      },
      size: {
        default: 'h-8 px-3',
        sm: 'h-7 px-2 text-[10px]',
        icon: 'h-8 w-8 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof variants> & {
    asChild?: boolean
  }

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(variants({ variant, size }), className)} {...props} />
}

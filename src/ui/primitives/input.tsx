import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/core/lib/utils'

const inputVariants = cva(
  'h-12 w-full min-w-0 rounded-lg border px-3 py-2 text-body-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-70 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20',
  {
    variants: {
      surface: {
        light: 'border-border bg-background text-foreground disabled:bg-surface-muted',
        dark: 'border-surface-dark-faint bg-surface-dark text-surface-dark-foreground placeholder:text-surface-dark-faint disabled:bg-surface-dark',
      },
    },
    defaultVariants: {
      surface: 'light',
    },
  },
)

function Input({
  className,
  surface = 'light',
  type,
  ...props
}: React.ComponentProps<'input'> & VariantProps<typeof inputVariants>) {
  return (
    <input
      className={cn(inputVariants({ surface, className }))}
      data-slot="input"
      data-surface={surface}
      type={type}
      {...props}
    />
  )
}

export { Input, inputVariants }

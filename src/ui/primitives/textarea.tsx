import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/core/lib/utils'

const textareaVariants = cva(
  'field-sizing-content min-h-28 w-full rounded-lg border px-3 py-3 text-body-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-70 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20',
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

function Textarea({
  className,
  surface = 'light',
  ...props
}: React.ComponentProps<'textarea'> & VariantProps<typeof textareaVariants>) {
  return (
    <textarea
      className={cn(textareaVariants({ surface, className }))}
      data-slot="textarea"
      data-surface={surface}
      {...props}
    />
  )
}

export { Textarea, textareaVariants }

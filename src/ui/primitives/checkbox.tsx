'use client'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { cva, type VariantProps } from 'class-variance-authority'
import { CheckIcon } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/core/lib/utils'

const checkboxVariants = cva(
  'peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-70 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
  {
    variants: {
      surface: {
        light: 'border-border bg-background',
        dark: 'border-surface-dark-faint bg-surface-dark text-surface-dark-foreground',
      },
    },
    defaultVariants: {
      surface: 'light',
    },
  },
)

function Checkbox({
  className,
  surface = 'light',
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & VariantProps<typeof checkboxVariants>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(checkboxVariants({ surface, className }))}
      data-slot="checkbox"
      data-surface={surface}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
        data-slot="checkbox-indicator"
      >
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox, checkboxVariants }

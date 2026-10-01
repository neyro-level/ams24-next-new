'use client'

import * as LabelPrimitive from '@radix-ui/react-label'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/core/lib/utils'

const labelVariants = cva(
  'text-body-sm leading-normal font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {
      surface: {
        light: 'text-muted-foreground',
        dark: 'text-surface-dark-muted',
      },
    },
    defaultVariants: {
      surface: 'light',
    },
  },
)

function Label({
  className,
  surface = 'light',
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>) {
  return (
    <LabelPrimitive.Root
      className={cn(labelVariants({ surface, className }))}
      data-slot="label"
      data-surface={surface}
      {...props}
    />
  )
}

export { Label, labelVariants }

import type { ComponentProps } from 'react'

import { cn } from '@/core/lib/utils'

type SectionProps = ComponentProps<'section'> & {
  spacing?: 'sm' | 'md' | 'lg' | 'hero'
}

const spacingClass = {
  sm: 'py-section-sm',
  md: 'py-section-md',
  lg: 'py-section-lg',
  hero: 'py-section-hero',
} satisfies Record<NonNullable<SectionProps['spacing']>, string>

export function Section({ className, spacing = 'md', ...props }: SectionProps) {
  return <section className={cn(spacingClass[spacing], className)} {...props} />
}

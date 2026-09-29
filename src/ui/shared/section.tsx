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

type SectionHeaderProps = ComponentProps<'div'> & {
  eyebrow?: string
  title: string
  lead?: string
}

export function SectionHeader({ className, eyebrow, title, lead, ...props }: SectionHeaderProps) {
  return (
    <div className={cn('max-w-3xl', className)} {...props}>
      {eyebrow ? <p className="mb-4 text-label font-bold uppercase text-primary">{eyebrow}</p> : null}
      <h2 className="font-display text-h2 font-extrabold text-foreground">{title}</h2>
      {lead ? <p className="mt-5 text-body-lg text-muted-foreground">{lead}</p> : null}
    </div>
  )
}

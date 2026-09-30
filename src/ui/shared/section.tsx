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
  level?: 1 | 2 | 3 | 4 | 5 | 6
  visualRole?: 'h1' | 'h2' | 'h3'
  tone?: 'light' | 'dark'
}

const titleClass = {
  h1: 'font-display text-h1 font-extrabold text-foreground',
  h2: 'font-display text-h2 font-extrabold text-foreground',
  h3: 'font-display text-h3 font-bold text-foreground',
} satisfies Record<NonNullable<SectionHeaderProps['visualRole']>, string>

export function SectionHeader({
  className,
  eyebrow,
  title,
  lead,
  level = 2,
  visualRole = 'h2',
  tone = 'light',
  ...props
}: SectionHeaderProps) {
  const Heading = `h${level}` as const
  const isDark = tone === 'dark'
  const eyebrowClass = `mb-4 text-label font-bold uppercase ${isDark ? 'text-surface-dark-faint' : 'text-primary'}`
  const headingClass = `${titleClass[visualRole]}${isDark ? ' text-surface-dark-foreground' : ''}`
  const leadClass = `mt-5 text-body-lg ${isDark ? 'text-surface-dark-muted' : 'text-muted-foreground'}`

  return (
    <div className={cn('max-w-3xl', className)} {...props}>
      {eyebrow ? <p className={eyebrowClass}>{eyebrow}</p> : null}
      <Heading className={headingClass}>{title}</Heading>
      {lead ? <p className={leadClass}>{lead}</p> : null}
    </div>
  )
}

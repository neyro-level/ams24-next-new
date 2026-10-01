import type { ComponentProps } from 'react'

import { cn } from '@/core/lib/utils'

type SectionHeaderProps = ComponentProps<'div'> & {
  eyebrow?: string
  title: string
  lead?: string
  level?: 1 | 2 | 3 | 4 | 5 | 6
  visualRole?: 'h1' | 'h2' | 'h3'
  tone?: 'light' | 'dark'
}

const titleClass = {
  h1: 'font-display text-h1 font-extrabold',
  h2: 'font-display text-h2 font-extrabold',
  h3: 'font-display text-h3 font-bold',
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

  return (
    <div className={cn('max-w-3xl', className)} {...props}>
      {eyebrow ? (
        <p
          className={cn(
            'mb-4 text-label font-bold uppercase',
            isDark ? 'text-surface-dark-faint' : 'text-primary',
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <Heading
        className={cn(titleClass[visualRole], isDark ? 'text-surface-dark-foreground' : 'text-foreground')}
      >
        {title}
      </Heading>
      {lead ? (
        <p className={cn('mt-5 text-body-lg', isDark ? 'text-surface-dark-muted' : 'text-muted-foreground')}>
          {lead}
        </p>
      ) : null}
    </div>
  )
}

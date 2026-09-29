import type { ComponentProps } from 'react'

import { cn } from '@/core/lib/utils'

type ContainerProps = ComponentProps<'div'> & {
  size?: 'site' | 'narrow'
}

export function Container({ className, size = 'site', ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-5 sm:px-6',
        size === 'site' && 'max-w-site',
        size === 'narrow' && 'max-w-narrow',
        className,
      )}
      {...props}
    />
  )
}

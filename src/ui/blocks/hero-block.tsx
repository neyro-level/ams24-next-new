import Link from 'next/link'

import type { PageBlockDTO } from '@/core/content/schemas'
import type { BlockRenderContext } from '@/ui/blocks/context'
import { Button } from '@/ui/primitives/button'
import { Container } from '@/ui/shared/container'
import { Section } from '@/ui/shared/section'

export type HeroBlockDTO = Extract<PageBlockDTO, { blockType: 'hero' }>

export function HeroBlock({ block }: { block: HeroBlockDTO; context: BlockRenderContext }) {
  return (
    <Section spacing="hero" className="bg-surface-dark text-surface-dark-foreground">
      <Container>
        {block.eyebrow ? (
          <p className="mb-5 text-label font-bold uppercase text-surface-dark-faint">{block.eyebrow}</p>
        ) : null}
        <h1 className="max-w-4xl font-display text-display font-extrabold">{block.title}</h1>
        {block.lead ? <p className="mt-7 max-w-3xl text-body-lg text-surface-dark-muted">{block.lead}</p> : null}
        {block.cta ? (
          <Button asChild className="mt-9" size="xl">
            <Link href={`#${block.cta.id}`}>{block.cta.label}</Link>
          </Button>
        ) : null}
      </Container>
    </Section>
  )
}

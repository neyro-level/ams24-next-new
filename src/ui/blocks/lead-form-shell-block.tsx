import type { PageBlockDTO } from '@/core/content/schemas'
import type { BlockRenderContext } from '@/ui/blocks/context'
import { LeadForm } from '@/ui/forms/lead-form'
import { Container } from '@/ui/shared/container'
import { Section } from '@/ui/shared/section'

export type LeadFormShellBlockDTO = Extract<PageBlockDTO, { blockType: 'lead-form-shell' }>

export function LeadFormShellBlock({
  block,
  context,
}: {
  block: LeadFormShellBlockDTO
  context: BlockRenderContext
}) {
  return (
    <Section id={block.intentId} className="bg-surface-dark text-surface-dark-foreground">
      <Container size="narrow">
        <LeadForm context={{ ...context.lead, ctaId: block.intentId }} />
      </Container>
    </Section>
  )
}

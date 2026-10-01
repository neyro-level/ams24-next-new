import type { PageBlockDTO } from '@/core/content/schemas'
import type { BlockRenderContext } from '@/ui/blocks/context'
import { RichText } from '@/ui/content/rich-text'
import { Container } from '@/ui/shared/container'
import { Section } from '@/ui/shared/section'

export type RichTextBlockDTO = Extract<PageBlockDTO, { blockType: 'rich-text' }>

export function RichTextBlock({ block }: { block: RichTextBlockDTO; context: BlockRenderContext }) {
  return (
    <Section className="bg-background">
      <Container size="narrow">
        <RichText content={block.body} />
      </Container>
    </Section>
  )
}

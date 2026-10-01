import type { PageBlockDTO } from '@/core/content/schemas'
import type { BlockRenderContext } from '@/ui/blocks/context'
import { Button } from '@/ui/primitives/button'
import { Container } from '@/ui/shared/container'
import { Section, SectionHeader } from '@/ui/shared/section'

export type ProductRoutesBlockDTO = Extract<PageBlockDTO, { blockType: 'product-routes' }>

export function ProductRoutesBlock({
  block,
  context,
}: {
  block: ProductRoutesBlockDTO
  context: BlockRenderContext
}) {
  const products = block.productRefs.map((productRef) => {
    const product = context.products.find((candidate) => candidate.id === productRef)

    if (!product) {
      throw new Error(`Product routes block references unknown product: ${productRef}`)
    }

    return product
  })

  return (
    <Section className="bg-background">
      <Container>
        <SectionHeader eyebrow="Маршруты" title="Выберите продукт под текущую задачу" />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {products.map((product) => (
            <article
              className="flex min-h-72 flex-col rounded-large border border-border bg-surface-elevated p-6 shadow-card"
              key={product.id}
            >
              <p className="text-label font-bold uppercase text-primary">{product.name}</p>
              <h2 className="mt-5 font-display text-h3 font-extrabold text-foreground">{product.shortName}</h2>
              <p className="mt-4 text-body text-muted-foreground">{product.promise}</p>
              <Button asChild variant="outline" className="mt-auto h-11 justify-start px-4">
                <a href={product.path}>{product.primaryCta.label}</a>
              </Button>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  )
}

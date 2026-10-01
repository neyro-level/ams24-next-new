import type { PageBlockDTO } from '@/core/content/schemas'
import type { BlockRenderContext } from '@/ui/blocks/context'
import { Button } from '@/ui/primitives/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/primitives/card'
import { Container } from '@/ui/shared/container'
import { Section } from '@/ui/shared/section'
import { SectionHeader } from '@/ui/shared/section-header'

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
            <Card asChild className="min-h-72" key={product.id}>
              <article>
                <CardHeader>
                  <p className="text-label font-bold uppercase text-primary">{product.name}</p>
                  <CardTitle asChild>
                    <h3>{product.shortName}</h3>
                  </CardTitle>
                  <CardDescription asChild>
                    <p>{product.promise}</p>
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button asChild variant="outline" className="h-11 justify-start px-4">
                    <a href={product.path}>{product.primaryCta.label}</a>
                  </Button>
                </CardFooter>
              </article>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  )
}

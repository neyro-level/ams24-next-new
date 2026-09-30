import type { ArticleEditorialContract } from '@/core/content/services/editorial-contracts'
import { Breadcrumbs } from '@/ui/shell/breadcrumbs'
import { Container } from '@/ui/shared/container'
import { Section } from '@/ui/shared/section'

export function ArticleEditorialTemplate({ contract }: { contract: ArticleEditorialContract }) {
  return (
    <main>
      <Breadcrumbs items={[{ label: 'Статьи', path: '/stati/' }, { label: contract.h1, path: `/stati/${contract.slug}/` }]} />
      <Section spacing="lg" className="bg-surface">
        <Container size="narrow">
          <p className="text-label font-bold uppercase text-primary">Статья · editorial intent</p>
          <h1 className="mt-5 font-display text-h1 font-extrabold">{contract.h1}</h1>
          <p className="mt-6 text-body-lg text-muted-foreground">{contract.jtbd}</p>
          <div className="mt-8 rounded-card border border-border bg-surface-elevated p-5">
            <p className="text-label font-bold uppercase text-primary">Target commercial page</p>
            <a className="mt-3 inline-block text-body font-semibold underline underline-offset-4" href={contract.targetCommercialPage.path}>
              {contract.targetCommercialPage.label}
            </a>
          </div>
          <div className="mt-10 space-y-6">
            {contract.outline.map((section) => (
              <section className="rounded-card border border-border bg-surface-elevated p-5" key={section.heading}>
                <h2 className="font-display text-h3 font-bold">{section.heading}</h2>
                <p className="mt-3 text-body text-muted-foreground">{section.readerQuestion}</p>
                <p className="mt-3 text-body-sm text-muted-foreground">{section.sectionJob}</p>
              </section>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  )
}

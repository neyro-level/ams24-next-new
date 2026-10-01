import type { ArticleDTO } from '@/core/content/schemas'
import { RichText } from '@/ui/content/rich-text'
import { Breadcrumbs } from '@/ui/shell/breadcrumbs'
import { Container } from '@/ui/shared/container'
import { Section } from '@/ui/shared/section'

export function ArticleEditorialTemplate({ article }: { article: ArticleDTO }) {
  return (
    <main>
      <Breadcrumbs items={[{ label: 'Статьи', path: '/stati/' }, { label: article.title, path: article.path }]} />
      <Section spacing="lg" className="bg-surface">
        <Container size="narrow">
          <p className="text-label font-bold uppercase text-primary">Статья</p>
          <h1 className="mt-5 font-display text-h1 font-extrabold">{article.title}</h1>
          <p className="mt-6 text-body-lg text-muted-foreground">{article.seo.description}</p>
          <article className="mt-10 space-y-4 rounded-large border border-border bg-surface-elevated p-6 shadow-card">
            <RichText content={article.body} />
          </article>
        </Container>
      </Section>
    </main>
  )
}

import type { KnowledgeArticleDTO } from '@/core/content/schemas'
import { RichText } from '@/ui/content/rich-text'
import { Breadcrumbs } from '@/ui/shell/breadcrumbs'
import { Container } from '@/ui/shared/container'
import { Section } from '@/ui/shared/section'

export function KnowledgeEditorialTemplate({ article }: { article: KnowledgeArticleDTO }) {
  return (
    <main>
      <Breadcrumbs
        items={[
          { label: 'База знаний', path: '/baza-znaniy/' },
          { label: article.productRef, path: `/${article.productRef}/` },
          { label: article.seo.title, path: article.path },
        ]}
      />
      <Section spacing="lg" className="bg-surface">
        <Container size="narrow">
          <p className="text-label font-bold uppercase text-primary">База знаний</p>
          <h1 className="mt-5 font-display text-h1 font-extrabold">{article.seo.title}</h1>
          <p className="mt-6 text-body-lg text-muted-foreground">{article.seo.description}</p>
          <article className="mt-10 space-y-4 rounded-large border border-border bg-surface-elevated p-6 shadow-card">
            <RichText content={article.body} />
          </article>
        </Container>
      </Section>
    </main>
  )
}

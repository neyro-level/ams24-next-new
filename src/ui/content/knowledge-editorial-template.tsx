import type { KnowledgeEditorialContract } from '@/core/content/services/editorial-contracts'
import { Breadcrumbs } from '@/ui/shell/breadcrumbs'
import { Container } from '@/ui/shared/container'
import { Section } from '@/ui/shared/section'

export function KnowledgeEditorialTemplate({ contract }: { contract: KnowledgeEditorialContract }) {
  return (
    <main>
      <Breadcrumbs
        items={[
          { label: 'База знаний', path: '/baza-znaniy/' },
          { label: contract.product, path: `/${contract.product}/` },
          { label: contract.h1, path: `/baza-znaniy/${contract.product}/${contract.slug}/` },
        ]}
      />
      <Section spacing="lg" className="bg-surface">
        <Container size="narrow">
          <p className="text-label font-bold uppercase text-primary">База знаний · support task</p>
          <h1 className="mt-5 font-display text-h1 font-extrabold">{contract.h1}</h1>
          <p className="mt-6 text-body-lg text-muted-foreground">{contract.expectedOutcome}</p>
          <div className="mt-8 rounded-card border border-border bg-surface-elevated p-5">
            <p className="text-label font-bold uppercase text-primary">Перед началом</p>
            <ul className="mt-4 space-y-2 text-body text-muted-foreground">
              {contract.prerequisites.map((item) => (
                <li key={item}>— {item}</li>
              ))}
            </ul>
          </div>
          <ol className="mt-10 space-y-5">
            {contract.steps.map((step, index) => (
              <li className="rounded-card border border-border bg-surface-elevated p-5" key={step.title}>
                <p className="text-label font-bold uppercase text-primary">Шаг {index + 1}</p>
                <h2 className="mt-3 font-display text-h3 font-bold">{step.title}</h2>
                <p className="mt-3 text-body text-muted-foreground">{step.result}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>
    </main>
  )
}

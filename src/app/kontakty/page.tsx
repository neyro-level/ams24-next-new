import { getRequiredSiteSettings } from '@/core/content/services/site-settings'
import { buildNoindexMetadata } from '@/core/seo'
import { LeadForm } from '@/ui/forms/lead-form'
import { Container } from '@/ui/shared/container'
import { Section, SectionHeader } from '@/ui/shared/section'

export async function generateMetadata() {
  return buildNoindexMetadata({
    title: 'Контакты AMS24 — заявка на расчёт',
    description:
      'Контактная страница AMS24 с безопасной формой заявки. Отправка отключена до финального подключения и юридического согласования.',
    canonicalPath: '/kontakty/',
  }, await getRequiredSiteSettings())
}

export default function ContactsPage() {
  return (
    <main>
      <Section spacing="hero" className="bg-surface-dark text-surface-dark-foreground">
        <Container>
          <SectionHeader
            eyebrow="Контакты"
            title="Оставьте задачу для расчёта"
            level={1}
            tone="dark"
            lead="Страница уже показывает будущий путь заявки, но отправка выключена: мы не отправляем персональные данные без финального подключения, согласия и антиспам-решения."
          />
        </Container>
      </Section>

      <Section className="bg-background">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="rounded-large border border-border bg-surface-elevated p-6 shadow-card">
              <p className="text-label font-bold uppercase text-primary">Что подготовить</p>
              <ul className="mt-5 space-y-3 text-body text-muted-foreground">
                <li>• продукт или задача: Импульс, Пиксель или Защита;</li>
                <li>• ниша, регион и ограничения;</li>
                <li>• желаемый следующий шаг: расчёт, аудит или консультация.</li>
              </ul>
            </div>
            <LeadForm
              context={{ product: 'site', route: '/kontakty/', ctaId: 'contacts-calculation' }}
              surface="light"
            />
          </div>
        </Container>
      </Section>
    </main>
  )
}

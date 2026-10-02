import { getContentRepository } from '@/core/content/services/repository'
import { getRequiredPageByPath, getRequiredSiteSettings } from '@/core/content/services/site-settings'
import type { ProductDTO } from '@/core/content/schemas'
import { buildMetadata } from '@/core/seo'
import { Button } from '@/ui/primitives/button'
import { LeadForm } from '@/ui/forms/lead-form'
import { Container } from '@/ui/shared/container'
import { Section } from '@/ui/shared/section'
import { SectionHeader } from '@/ui/shared/section-header'
import { ErrorBoundaryProbe } from '@/ui/testing/error-boundary-probe'

const trustFacts = [
  '1,5 года рабочей практики',
  'Кейсы в трёх нишах',
  'Три продукта в одной системе',
] as const

export async function generateMetadata() {
  const repository = getContentRepository()
  const [page, settings] = await Promise.all([
    getRequiredPageByPath('/', repository),
    getRequiredSiteSettings(repository),
  ])

  return buildMetadata(page.seo, settings)
}

const proofPreviews = [
  {
    title: 'Кейс в медицинской нише',
    text: 'Покажем исходную задачу, метод запуска и ограничения результата без неподтверждённых обещаний.',
  },
  {
    title: 'Кейс в строительстве',
    text: 'Соберём сценарий привлечения, проверки спроса и передачи лидов в продажи.',
  },
  {
    title: 'Кейс в услугах',
    text: 'Свяжем продукт, аудиторию, стоимость контакта и следующий шаг для отдела продаж.',
  },
] as const

const knowledgePreviews = [
  'Как выбрать продукт: Импульс, Пиксель или Защита',
  'Какие данные нужны для расчёта запуска',
  'Как читать кейс: задача, метод, метрики, ограничения',
] as const

const productRouteSummaries = {
  impuls: 'Маршрут для компаний, которым нужен новый поток обращений и расчёт запуска по нише, региону и ограничениям.',
  pixel: 'Маршрут для бизнеса с собственным сайтом: сначала проверяем трафик, важные страницы и готовность передачи результата в продажи.',
  zashchita: 'Маршрут для ситуации, где нужно оценить риск утечки лидов, собрать симптомы и перейти к безопасному аудиту.',
} as const

export default async function HomePage() {
  const repository = getContentRepository()
  const products = await repository.getProducts()

  return (
    <main>
      <ErrorBoundaryProbe />
      <HomeHeroSection products={products} />
      <TrustFactsSection />
      <ProductRoutesSection products={products} />
      <SystemFlowSection />
      <ProofPreviewSection />
      <KnowledgePreviewSection />
      <HomeLeadSection />
    </main>
  )
}

type HomeProduct = ProductDTO

function HomeHeroSection({ products }: { products: readonly HomeProduct[] }) {
  return (
    <Section spacing="hero" className="bg-surface-dark text-surface-dark-foreground">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.75fr)] lg:items-end">
          <div>
            <p className="mb-5 text-label font-bold uppercase text-surface-dark-faint">AMS24 · Импульс</p>
            <h1 className="max-w-4xl font-display text-display font-extrabold text-surface-dark-foreground">
              Импульс
            </h1>
            <p className="mt-7 max-w-3xl text-body-lg text-surface-dark-muted">
              Платформа маркетинговых продуктов, которая помогает привлекать, определять и защищать
              лиды: от первого выбора маршрута до расчёта запуска.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="xl">
                <a href="#lead-form">Получить расчёт</a>
              </Button>
              <Button asChild variant="outlineDark" size="xl">
                <a href="#products">Выбрать продукт</a>
              </Button>
            </div>
          </div>

          <aside
            aria-label="Карта продуктов"
            className="rounded-large border border-surface-dark-faint bg-surface-dark-elevated p-5 shadow-panel"
          >
            <p className="text-label font-bold uppercase text-surface-dark-faint">Три маршрута</p>
            <div className="mt-5 space-y-3">
              {products.map((product, index) => (
                <a
                  className="block rounded-card border border-surface-dark-faint p-4 transition hover:border-primary hover:bg-surface-dark-hover"
                  href={product.path}
                  key={product.id}
                >
                  <span className="text-caption text-surface-dark-faint">0{index + 1}</span>
                  <span className="mt-2 block font-display text-h3 font-bold">{product.shortName}</span>
                  <span className="mt-2 block text-body-sm text-surface-dark-muted">
                    {productRouteSummaries[product.id]}
                  </span>
                </a>
              ))}
            </div>
          </aside>
        </div>
      </Container>
    </Section>
  )
}

function TrustFactsSection() {
  return (
    <Section spacing="sm" className="bg-surface">
      <Container>
        <div className="grid gap-3 md:grid-cols-3">
          {trustFacts.map((fact) => (
            <div className="rounded-card border border-border bg-surface-elevated p-5 shadow-card" key={fact}>
              <p className="text-label font-bold uppercase text-primary">Подтверждение</p>
              <p className="mt-4 font-display text-h3 font-bold text-foreground">{fact}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}

function ProductRoutesSection({ products }: { products: readonly HomeProduct[] }) {
  return (
    <Section id="products" className="bg-background">
      <Container>
        <SectionHeader
          eyebrow="Маршруты"
          title="Выберите продукт под текущую задачу"
          lead="Главная не дублирует продуктовые страницы: она показывает систему и ведёт в нужный подробный сценарий."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {products.map((product) => (
            <article
              className="flex min-h-80 flex-col rounded-large border border-border bg-surface-elevated p-6 shadow-card"
              key={product.id}
            >
              <p className="text-label font-bold uppercase text-primary">{product.name}</p>
              <h3 className="mt-5 font-display text-h3 font-extrabold text-foreground">{product.shortName}</h3>
              <p className="mt-4 text-body text-muted-foreground">{productRouteSummaries[product.id]}</p>
              <div className="mt-6 rounded-card bg-surface-muted p-4 text-body-sm text-muted-foreground">
                Подходит, когда нужна понятная проверка применимости, входных данных и следующего
                коммерческого шага.
              </div>
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

function SystemFlowSection() {
  return (
    <Section className="bg-surface-muted">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <SectionHeader
            eyebrow="Как работает система"
            title="Один вход — три типа задач"
            lead="Сначала фиксируем вашу цель и ограничения, затем выбираем продукт: запуск привлечения, определение аудитории на своём сайте или аудит защиты от перехвата."
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {['Диагностика задачи', 'Выбор продукта', 'Расчёт запуска'].map((step, index) => (
              <div className="rounded-card border border-border bg-surface-elevated p-5" key={step}>
                <p className="text-label font-bold uppercase text-primary">Шаг 0{index + 1}</p>
                <p className="mt-5 font-display text-h3 font-bold">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}

function ProofPreviewSection() {
  return (
    <Section className="bg-background">
      <Container>
        <SectionHeader
          eyebrow="Доказательства"
          title="Кейсы и материалы готовятся как проверяемые блоки"
          lead="До публикации каждый кейс, отзыв и расчёт получает статус доказательности: публичный, обезличенный или скрытый."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {proofPreviews.map((proof) => (
            <article className="rounded-card border border-border bg-surface-elevated p-6 shadow-card" key={proof.title}>
              <p className="text-label font-bold uppercase text-primary">Материал</p>
              <h3 className="mt-5 font-display text-h3 font-bold">{proof.title}</h3>
              <p className="mt-4 text-body text-muted-foreground">{proof.text}</p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  )
}

function KnowledgePreviewSection() {
  return (
    <Section className="bg-surface">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeader
            eyebrow="База знаний и статьи"
            title="Контентная зона уже заложена в архитектуру"
            lead="Эту зону можно наполнять статьями и базой знаний без переделки маршрутов, SEO-контракта и карточек."
          />
          <div className="space-y-3">
            {knowledgePreviews.map((item) => (
              <div className="rounded-card border border-border bg-surface-elevated p-5" key={item}>
                <p className="font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}

function HomeLeadSection() {
  return (
    <Section id="lead-form" className="bg-surface-dark text-surface-dark-foreground">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-label font-bold uppercase text-surface-dark-faint">Расчёт</p>
            <h2 className="mt-5 font-display text-h2 font-extrabold">
              Опишите задачу — подготовим маршрут запуска
            </h2>
            <p className="mt-5 max-w-2xl text-body-lg text-surface-dark-muted">
              Форма показывает будущий состав полей и состояние согласия, но не отправляет
              персональные данные до финального подключения.
            </p>
          </div>
          <LeadForm context={{ product: 'site', route: '/', ctaId: 'home-calculation' }} headingLevel="h3" />
        </div>
      </Container>
    </Section>
  )
}

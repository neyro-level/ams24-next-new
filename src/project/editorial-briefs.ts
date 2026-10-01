import type { ProductId } from '@/core/content/schemas'
import type { NavigationLink } from '@/project/navigation'

type BriefSource = {
  url: string
  title: string
  publisher: string
  checkedAt: string
  claimSupported: string
  sourceType: 'project' | 'secondary'
  status: 'verified' | 'partial'
}

type EditorialBriefBase = {
  id: string
  h1: string
  seoTitle: string
  slug: string
  objective: string
  audience: string
  jtbd: string
  primaryIntent: string
  buyerStage: 'problem-aware' | 'solution-aware' | 'decision' | 'implementation'
  targetProduct: ProductId
  targetCommercialPage: NavigationLink
  primaryQuery: string
  secondaryQueries: string[]
  verifiedExperience: string
  forbiddenClaims: string[]
  cta: NavigationLink
  sourceLedger: BriefSource[]
}

export type InitialArticleBrief = EditorialBriefBase & {
  kind: 'article'
  angle: string
  outputPath: `/stati/${string}/`
}

export type InitialKnowledgeBrief = EditorialBriefBase & {
  kind: 'knowledge'
  task: string
  expectedOutcome: string
  prerequisites: string[]
  outputPath: `/baza-znaniy/${ProductId}/${string}/`
}

const checkedAt = '2026-09-29'

const productStructureSource: BriefSource = {
  url: 'project://docs/02_PRODUCT_STRUCTURE.md',
  title: 'Product Structure — Demand Cluster Map and Page Role Map',
  publisher: 'AMS project source of truth',
  checkedAt,
  claimSupported: 'Canonical product URLs, page roles, demand clusters and internal-link rules.',
  sourceType: 'project',
  status: 'verified',
}

const prdMinimumSource: BriefSource = {
  url: 'project://docs/01_PRD.md',
  title: 'PRD — Scope первого публичного релиза',
  publisher: 'AMS project source of truth',
  checkedAt,
  claimSupported: 'First release needs 3 substantive articles and 3 KB instructions, at least one tied to each product.',
  sourceType: 'project',
  status: 'verified',
}

const seoBaselineSource: BriefSource = {
  url: 'project://docs/research/COMPETITOR_SEO_BASELINE.md',
  title: 'Competitor and SEO Baseline',
  publisher: 'AMS project research',
  checkedAt,
  claimSupported: 'Baseline clusters include lead generation, visitor identification and protection from lead interception.',
  sourceType: 'project',
  status: 'partial',
}

const leadlifeDataLeadSource: BriefSource = {
  url: 'https://leadlife.pro/datalead',
  title: 'DataLead product page',
  publisher: 'LEADLIFE',
  checkedAt,
  claimSupported: 'Market category uses a separate product page for competitor-lead/interception demand and links it to tariffs, cases, articles and KB.',
  sourceType: 'secondary',
  status: 'partial',
}

const leadlifeWantLeadSource: BriefSource = {
  url: 'https://leadlife.pro/wantlead',
  title: 'WantLead product page',
  publisher: 'LEADLIFE',
  checkedAt,
  claimSupported: 'Market category uses a distinct visitor-identification product page and support materials.',
  sourceType: 'secondary',
  status: 'partial',
}

const leadlifeStopParsingSource: BriefSource = {
  url: 'https://leadlife.pro/stopparsing',
  title: 'StopParsing product page',
  publisher: 'LEADLIFE',
  checkedAt,
  claimSupported: 'Market category separates protection/audit intent from acquisition and visitor-identification pages.',
  sourceType: 'secondary',
  status: 'partial',
}

export const initialArticleBriefs = [
  {
    kind: 'article',
    id: 'article-impuls-operator-audiences',
    h1: 'Когда бизнесу подходит лидогенерация через аудитории операторов',
    seoTitle: 'Лидогенерация через аудитории операторов — Импульс',
    slug: 'kogda-podhodit-lidogeneratsiya-cherez-auditorii-operatorov',
    objective: 'Объяснить, в каких задачах основной продукт «Импульс» уместен, а где нужен другой маршрут.',
    audience: 'владелец бизнеса, руководитель маркетинга или продаж, выбирающий канал привлечения',
    jtbd: 'понять, стоит ли рассматривать «Импульс» как канал привлечения лидов до запроса расчёта',
    primaryIntent: 'разобраться в механике лидогенерации через аудитории без замены продающей страницы /impuls/',
    buyerStage: 'solution-aware',
    targetProduct: 'impuls',
    targetCommercialPage: { label: 'Импульс', path: '/impuls/' },
    primaryQuery: 'лидогенерация для бизнеса',
    secondaryQueries: ['реклама мобильных операторов', 'big data лидогенерация', 'перехват лидов конкурентов'],
    angle: 'практический выбор канала: входные данные, ограничения, формат результата и следующий шаг',
    verifiedExperience: 'project fact: продукт работает около 1,5 лет; конкретные ниши и результаты требуют owner evidence',
    forbiddenClaims: [
      'гарантированное количество лидов',
      'абсолютная законность без юридической проверки формулировок',
      'стоимость контакта или срок запуска без утверждённого тарифа',
    ],
    cta: { label: 'Рассчитать запуск', path: '/impuls/' },
    outputPath: '/stati/kogda-podhodit-lidogeneratsiya-cherez-auditorii-operatorov/',
    sourceLedger: [prdMinimumSource, productStructureSource, seoBaselineSource, leadlifeDataLeadSource],
  },
  {
    kind: 'article',
    id: 'article-pixel-visitor-identification',
    h1: 'Идентификация посетителей сайта: что проверить до установки пикселя',
    seoTitle: 'Идентификация посетителей сайта: подготовка к пикселю',
    slug: 'identifikatsiya-posetiteley-sayta-chto-proverit',
    objective: 'Развести обычную аналитику и продукт «Импульс Пиксель», не обещая невозможных данных.',
    audience: 'компания с собственным сайтом и заметным входящим трафиком',
    jtbd: 'понять, есть ли смысл проверять применимость пикселя для передачи заинтересованной аудитории в продажи',
    primaryIntent: 'информационный разбор требований к сайту, трафику, данным и приватности',
    buyerStage: 'problem-aware',
    targetProduct: 'pixel',
    targetCommercialPage: { label: 'Импульс Пиксель', path: '/pixel/' },
    primaryQuery: 'идентификация посетителей сайта',
    secondaryQueries: ['определение посетителей сайта', 'кто заходил на сайт', 'пиксель для сайта'],
    angle: 'чек-лист применимости: трафик, сценарии продаж, данные, интеграция и правовые ограничения',
    verifiedExperience: 'project product role is approved; exact data boundary and legal wording require later review',
    forbiddenClaims: [
      'раскрытие всех посетителей сайта',
      'передача персональных данных без согласий и правового основания',
      'замена CRM или аналитики без интеграционного scope',
    ],
    cta: { label: 'Проверить применимость пикселя', path: '/pixel/' },
    outputPath: '/stati/identifikatsiya-posetiteley-sayta-chto-proverit/',
    sourceLedger: [prdMinimumSource, productStructureSource, seoBaselineSource, leadlifeWantLeadSource],
  },
  {
    kind: 'article',
    id: 'article-zashchita-lead-interception-risk',
    h1: 'Как понять, что лиды могут перехватывать, и с чего начать защиту',
    seoTitle: 'Риск перехвата лидов: с чего начать защиту',
    slug: 'kak-ponyat-risk-perekhvata-lidov',
    objective: 'Дать безопасную risk-first статью для продукта «Импульс Защита» без абсолютных обещаний.',
    audience: 'компания, которая видит падение качества заявок или подозревает утечку рекламного трафика',
    jtbd: 'оценить симптомы риска и понять, когда нужен аудит защиты',
    primaryIntent: 'объяснить признаки, границы аудита и следующий шаг к /zashchita/',
    buyerStage: 'problem-aware',
    targetProduct: 'zashchita',
    targetCommercialPage: { label: 'Импульс Защита', path: '/zashchita/' },
    primaryQuery: 'защита от перехвата лидов',
    secondaryQueries: ['перехват лидов', 'перехват клиентов конкурентов', 'защита рекламного трафика'],
    angle: 'симптомы, аудит, меры снижения риска и честные ограничения',
    verifiedExperience: 'project rule: protection page explains audit/measures and never promises absolute protection',
    forbiddenClaims: [
      'абсолютная невозможность перехвата',
      'обвинение конкретных конкурентов без доказательств',
      'гарантированное восстановление заявок без диагностики',
    ],
    cta: { label: 'Провести аудит', path: '/zashchita/' },
    outputPath: '/stati/kak-ponyat-risk-perekhvata-lidov/',
    sourceLedger: [prdMinimumSource, productStructureSource, seoBaselineSource, leadlifeStopParsingSource],
  },
] satisfies InitialArticleBrief[]

export const initialKnowledgeBriefs = [
  {
    kind: 'knowledge',
    id: 'kb-impuls-prepare-calculation',
    h1: 'Как подготовить вводные для расчёта запуска Импульса',
    seoTitle: 'Как подготовить вводные для расчёта запуска Импульса',
    slug: 'kak-podgotovit-raschet',
    objective: 'Помочь пользователю собрать минимум данных до запроса расчёта по основному продукту.',
    audience: 'потенциальный клиент, который уже рассматривает запуск привлечения',
    jtbd: 'собрать нишу, регион, объём, ограничения и формат передачи результата перед обращением',
    primaryIntent: 'support instruction for calculation readiness',
    buyerStage: 'implementation',
    targetProduct: 'impuls',
    targetCommercialPage: { label: 'Импульс', path: '/impuls/' },
    primaryQuery: 'как подготовить расчет лидогенерации',
    secondaryQueries: ['расчет лидогенерации', 'запуск лидогенерации вводные'],
    task: 'подготовить вводные для первичного расчёта запуска',
    expectedOutcome: 'пользователь понимает, какие данные отправить для расчёта без раскрытия лишних персональных данных',
    prerequisites: ['выбрана ниша', 'понятен регион запуска', 'есть гипотеза по объёму или бюджету'],
    verifiedExperience: 'project CTA model uses calculation/request; tariffs wait for OD-02',
    forbiddenClaims: ['фиксированная цена без OD-02', 'срок запуска без утверждённого процесса'],
    cta: { label: 'Рассчитать запуск', path: '/impuls/' },
    outputPath: '/baza-znaniy/impuls/kak-podgotovit-raschet/',
    sourceLedger: [prdMinimumSource, productStructureSource],
  },
  {
    kind: 'knowledge',
    id: 'kb-pixel-site-readiness',
    h1: 'Как проверить сайт перед установкой пикселя',
    seoTitle: 'Как проверить сайт перед установкой пикселя',
    slug: 'kak-proverit-sayt-pered-pikselem',
    objective: 'Подготовить владельца сайта к разговору о применимости пикселя и технических требованиях.',
    audience: 'маркетолог или владелец сайта, который хочет передавать заинтересованную аудиторию в продажи',
    jtbd: 'понять, какие страницы, события и ограничения сайта нужно проверить до установки',
    primaryIntent: 'support instruction for pixel readiness',
    buyerStage: 'implementation',
    targetProduct: 'pixel',
    targetCommercialPage: { label: 'Импульс Пиксель', path: '/pixel/' },
    primaryQuery: 'как установить пиксель на сайт',
    secondaryQueries: ['пиксель для сайта', 'подготовить сайт к пикселю'],
    task: 'проверить сайт и вводные перед установкой пикселя',
    expectedOutcome: 'пользователь понимает, какие технические и юридические вопросы нужно закрыть до установки',
    prerequisites: ['есть доступ к сайту или подрядчику', 'понятны ключевые страницы', 'есть согласованный сценарий обработки данных'],
    verifiedExperience: 'project route /pixel/ is approved; exact pixel integration contract comes in later implementation tasks',
    forbiddenClaims: ['самостоятельная публикация кода пикселя без подтверждённого contract', 'обход согласий или политики данных'],
    cta: { label: 'Проверить применимость пикселя', path: '/pixel/' },
    outputPath: '/baza-znaniy/pixel/kak-proverit-sayt-pered-pikselem/',
    sourceLedger: [prdMinimumSource, productStructureSource, leadlifeWantLeadSource],
  },
  {
    kind: 'knowledge',
    id: 'kb-zashchita-primary-audit',
    h1: 'Как подготовиться к первичному аудиту защиты лидов',
    seoTitle: 'Как подготовиться к первичному аудиту защиты лидов',
    slug: 'kak-podgotovitsya-k-auditu-zashchity-lidov',
    objective: 'Собрать безопасную инструкцию для первичного аудита без технических обещаний и обвинений.',
    audience: 'команда маркетинга или продаж, которая хочет проверить риск перехвата лидов',
    jtbd: 'собрать симптомы, рекламные источники, точки контакта и ограничения перед аудитом',
    primaryIntent: 'support instruction for protection audit readiness',
    buyerStage: 'implementation',
    targetProduct: 'zashchita',
    targetCommercialPage: { label: 'Импульс Защита', path: '/zashchita/' },
    primaryQuery: 'аудит защиты лидов',
    secondaryQueries: ['защита от перехвата лидов', 'проверка перехвата лидов'],
    task: 'подготовить вводные для первичного аудита защиты',
    expectedOutcome: 'пользователь понимает, какие данные и наблюдения собрать, не делая публичных обвинений',
    prerequisites: ['есть список рекламных каналов', 'понятны симптомы проблемы', 'есть доступ к базовым отчётам по заявкам'],
    verifiedExperience: 'project rule: protection explains audit and measures, not absolute guarantee',
    forbiddenClaims: ['обещание найти конкретного перехватчика без проверки', 'гарантия полной защиты'],
    cta: { label: 'Провести аудит', path: '/zashchita/' },
    outputPath: '/baza-znaniy/zashchita/kak-podgotovitsya-k-auditu-zashchity-lidov/',
    sourceLedger: [prdMinimumSource, productStructureSource, leadlifeStopParsingSource],
  },
] satisfies InitialKnowledgeBrief[]

export const initialEditorialBriefs = [...initialArticleBriefs, ...initialKnowledgeBriefs]

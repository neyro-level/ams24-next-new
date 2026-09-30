# Product Structure — «Импульс»

Status: Active  
Version: 1.0  
Updated: 2026-09-30

## 1. Решение владельца

Сайт использует архитектурный принцип LEADLIFE: универсальная главная платформы, отдельные продуктовые страницы, тарифы, кейсы, отзывы, статьи и база знаний. Переносятся роли страниц и логика маршрутов, но не тексты, дизайн, медиа, код и фактические обещания конкурента.

Главная представляет все три продукта. `/impuls/` подробно продаёт основной продукт и не дублирует главную дословно.

## 2. Canonical URL Policy

- Primary domain: `https://ams24.ru/`.
- Locale первого релиза: `ru-RU` без префикса в URL.
- Все canonical paths имеют ведущий и завершающий `/`.
- Короткие URL являются стабильными product IDs в публичной структуре.
- Изменение опубликованного path требует постоянного redirect.
- Query-параметры аналитики не образуют отдельные canonical URL.

Зафиксированные короткие продуктовые URL:

```text
/
/impuls/
/pixel/
/zashchita/
```

Длинные варианты `/identifikatsiya-posetiteley-sayta/` и `/zashchita-ot-perekhvata-lidov/` не используются как canonical.

## 3. Sitemap

```text
/
├── impuls/
├── pixel/
├── zashchita/
│
├── tarify/
├── keisy/
│   └── [slug]/
├── otzyvy/
├── raschety/
│
├── stati/
│   └── [slug]/
│
├── baza-znaniy/
│   ├── impuls/
│   │   └── [slug]/
│   ├── pixel/
│   │   └── [slug]/
│   └── zashchita/
│       └── [slug]/
│
├── o-kompanii/
├── kontakty/
├── politika/
├── soglasie/
├── obrabotka-dannyh/
├── rekvizity/
└── 404
```

`/stati/tema/[slug]/` не входит в первый релиз. Тематические страницы создаются только после подтверждения спроса и достаточного уникального контента. Пустые теги, фильтры и thin pages не индексируются и не создаются заранее.

## 4. Header Navigation

```text
Продукты
  ├── Импульс
  ├── Импульс Пиксель
  └── Импульс Защита
Тарифы
Кейсы
Отзывы
Статьи
База знаний
[Получить расчёт]
```

На узких экранах все пункты доступны из одного keyboard-accessible mobile menu. Primary CTA сохраняется в первом уровне навигации.

## 5. Footer Navigation

- Продукты: Импульс, Пиксель, Защита.
- Выбор и доказательства: Тарифы, Расчёты, Кейсы, Отзывы.
- Материалы: Статьи, База знаний.
- Компания: О компании, Контакты, Реквизиты.
- Legal: Политика, Согласие, Обработка данных.

## 6. Page Role Map

| Route | Primary role | Primary intent | Primary CTA | Index |
|---|---|---|---|---|
| `/` | платформа и маршрутизация | понять линейку и выбрать решение | Получить расчёт | index |
| `/impuls/` | продающая страница главного продукта | получить лиды через целевые аудитории | Рассчитать запуск | index |
| `/pixel/` | продуктовая страница пикселя | определить заинтересованных посетителей своего сайта | Проверить применимость | index |
| `/zashchita/` | продуктовая страница защиты | снизить риск перехвата лидов | Провести аудит | index |
| `/tarify/` | сравнение условий | понять модель цены и состав услуги | Получить персональный расчёт | index |
| `/keisy/` | доказательства | найти опыт в своей нише | Обсудить похожую задачу | index |
| `/keisy/[slug]/` | детальное evidence | проверить исходные данные, метод и результат | Повторить сценарий | index if substantive |
| `/otzyvy/` | social proof | проверить доверие к исполнителю | Обсудить задачу | index |
| `/raschety/` | экономика | понять принцип расчёта и диапазоны | Получить расчёт | index |
| `/stati/` | editorial hub | изучить рынок и подходы | Перейти к продукту | index |
| `/stati/[slug]/` | SEO/editorial | получить полный ответ на запрос | context-specific | index if substantive |
| `/baza-znaniy/` | support hub | найти инструкцию | Выбрать продукт | index |
| `/baza-znaniy/.../[slug]/` | инструкция | выполнить конкретное действие | Следующий шаг инструкции | index if useful standalone |
| `/o-kompanii/` | доверие | понять опыт и принципы | Связаться | index |
| `/kontakty/` | контакт | выбрать канал связи | Написать / позвонить | index |
| legal routes | юридическая функция | ознакомиться с условиями | none | noindex, follow by default |
| `/404` | recovery | вернуться в рабочий маршрут | На главную / выбрать продукт | noindex |

## 7. Главная `/`

### Page brief

- Audience: новый пользователь, ещё не выбравший продукт.
- JTBD: понять систему и выбрать маршрут.
- Primary promise: платформа помогает привлекать, идентифицировать и защищать лиды.
- Primary CTA: `Получить расчёт`.
- Evidence: опыт 1,5 года, подтверждённые кейсы, отзывы и прозрачная методика.

### Semantic sections

1. Platform Hero: единое обещание, три направления, CTA.
2. Trust Line: только подтверждённые факты.
3. Product Routes: три маршрутные карточки.
4. How The System Works: связь продуктов без технической перегрузки.
5. Applicability: кому и при каких входных данных подходит платформа.
6. Tariff Preview.
7. Cases From Three Niches.
8. Reviews Preview.
9. Knowledge And Articles Preview.
10. Legal And Transparency.
11. Final Calculation CTA with embedded `LeadForm`.

Главная не раскрывает каждый механизм полностью; она ведёт на соответствующую продуктовую страницу. Финальный CTA содержит встроенную форму, а не только ссылку на отдельный маршрут.

## 8. Продуктовая страница `/impuls/`

- Primary intent: коммерческий спрос на лидогенерацию и работу с аудиториями операторов.
- JTBD: оценить применимость, процесс, стоимость и доказательства.
- Primary CTA: `Рассчитать запуск`.

Sections:

1. Product Hero.
2. Problem / opportunity.
3. Mechanism in plain language.
4. Targeting and eligibility parameters — только подтверждённые.
5. What the client receives.
6. Launch process.
7. Delivery and integrations.
8. Tariff and calculation preview.
9. Product-specific cases.
10. Legal boundaries and limitations.
11. FAQ.
12. Final CTA.

## 9. Продуктовая страница `/pixel/`

- Primary intent: идентификация или определение посетителей собственного сайта.
- JTBD: понять, можно ли выявить часть заинтересованной аудитории и передать результат в продажи.
- Primary CTA: `Проверить применимость пикселя`.

Sections:

1. Product Hero.
2. Which visitors and scenarios matter.
3. Installation concept.
4. Data/result boundary in plain language.
5. Requirements to traffic and site.
6. Delivery/integration.
7. Cases.
8. Legal/privacy explanation.
9. FAQ.
10. CTA.

## 10. Продуктовая страница `/zashchita/`

- Primary intent: защита от перехвата лидов и рекламного трафика.
- JTBD: оценить риск, провести аудит и внедрить меры защиты.
- Primary CTA: `Провести аудит`.

Sections:

1. Product Hero.
2. Threat model in business language.
3. Symptoms and risk indicators.
4. Audit process.
5. Protection measures.
6. What can and cannot be guaranteed.
7. Monitoring and repeat checks.
8. Cases/evidence.
9. FAQ.
10. CTA.

## 11. Supporting Page Contracts

### Тарифы

Единая таблица/система тарифов для трёх продуктов. Публикуются состав, единица расчёта, ограничения, что включено и что рассчитывается индивидуально. Ложная точность запрещена.

### Кейсы

Каждый детальный кейс содержит: нишу, период, исходную задачу, входные условия, продукт, процесс, подтверждённые показатели, методику подсчёта, ограничения и CTA. Фильтры по нишам создаются только после появления достаточного набора материалов.

### Отзывы

Отзыв содержит автора/роль/компанию либо честную отметку об обезличивании, источник и разрешение на публикацию. Отзыв не подменяет измеримый кейс.

### Расчёты

Показывает логику экономики и примеры сценариев без обещания универсального результата. Персональный расчёт остаётся primary conversion.

### Статьи

Editorial/SEO-контент: объяснение рынка, проблем, методов, сравнений, законности и экономики. Статья не дублирует product landing и ведёт в релевантный продукт.

### База знаний

Инструкции по запуску, установке, интеграциям, статусам и решению проблем. Это support-контент, а не второй SEO-блог.

## 12. Demand Cluster Map

Данные ниже — baseline, требующий повторной проверки перед контент-планом.

| Cluster | Target route | Language policy |
|---|---|---|
| бренд «Импульс» / AMS24 | `/` | brand-first |
| лидогенерация для бизнеса | `/impuls/` | основной культурный термин |
| реклама по данным/аудиториям мобильных операторов | `/impuls/` | объяснить механизм без неподтверждённых claims |
| перехват лидов конкурентов | `/impuls/` + articles | использовать как рыночный поисковый термин, не как название продукта |
| идентификация/определение посетителей сайта | `/pixel/` | exact problem language |
| защита от перехвата лидов | `/zashchita/` | risk/protection language |
| тарифы и стоимость | `/tarify/`, `/raschety/` | price intent |
| кейсы по нишам | `/keisy/` + detail | evidence intent |
| настройка/интеграция | `/baza-znaniy/` | support intent |

## 13. Entity Layer

| Entity | Core attributes | Relations |
|---|---|---|
| Product | id, name, shortName, path, promise, status | tariffs, cases, articles, KB |
| Tariff | id, productRef, title, pricingModel, inclusions, limits | product |
| Case | id, path, niche, period, problem, method, metrics, evidenceLevel | product, review |
| Review | id, author, role, company, quote, permissionStatus | case/product optional |
| Article | id, path, title, topic, publishedAt, body | products/cases |
| KnowledgeArticle | id, path, productRef, task, body, updatedAt | product |
| CalculationExample | id, productRef, inputs, assumptions, resultRange | tariff/product |
| LeadIntent | sourcePath, productId, CTA, consentVersion | AMS Leads API |

Relations use stable refs. Product pages never own duplicate embedded copies of case/article entities.

## 14. Internal Linking Rules

- Главная ссылается на все продукты и основные trust-разделы.
- Каждая статья ведёт на один primary product и 1–3 related materials.
- Каждый кейс ведёт на продукт, тариф/расчёт и релевантный CTA.
- Product pages показывают только релевантные кейсы, отзывы, статьи и инструкции.
- KB-инструкция ведёт на следующую инструкцию или product action, а не в общий тупик.
- Footer обеспечивает постоянный доступ к legal и основным hubs.
- Breadcrumbs обязательны для case/article/KB detail pages.

## 15. Thin Content Guard

Маршрут не становится indexable, пока у него нет:

- уникальной роли и intent;
- уникального H1/title/description;
- достаточного самостоятельного содержания;
- понятного следующего действия;
- проверенных внутренних ссылок.

Route skeleton во время разработки имеет `noindex` либо не включается в published content/sitemap.

## 16. Open Decisions

- Финальное коммерческое подназвание продукта «Импульс».
- Названия и приоритет трёх ниш.
- Первый release включает минимум 3 полных кейса, 3 отзыва, 3 статьи и 3 KB-инструкции; конкретные материалы выбираются после evidence inventory.
- Topic hubs `/stati/tema/[slug]/` не входят в первый release и создаются только после появления достаточного уникального контента и спроса.
- Отдельная thank-you page не входит в первый release; успешная отправка показывается inline.

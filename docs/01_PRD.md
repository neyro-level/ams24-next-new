# PRD — платформа «Импульс»

Status: Draft  
Version: 0.1  
Updated: 2026-09-29

## 1. Product Summary

`ams24.ru` становится новым коммерческим сайтом платформы «Импульс». Платформа объединяет три продукта:

1. **Импульс** — таргетированная лидогенерация по релевантным аудиториям с использованием возможностей мобильных операторов.
2. **Импульс Пиксель** — идентификация заинтересованных посетителей собственного сайта после установки пикселя.
3. **Импульс Защита** — снижение риска перехвата лидов и рекламного трафика конкурентами.

Сайт строится с нуля. От действующего `ams24.ru` переносится визуальная система AMS Northline, но не старая структура и не старый runtime.

## 2. Контекст бизнеса

- Продукт работает около 1,5 лет — факт предоставлен владельцем.
- Есть множество кейсов в трёх нишах — факт предоставлен владельцем.
- Названия ниш, количественные результаты и разрешения на публикацию — `TODO`, требуют evidence перед выводом на сайт.
- Главный продукт и бренд линейки — «Импульс».
- Домен — `https://ams24.ru/`.

## 3. Проблема

Потенциальному клиенту сложно быстро понять:

- чем отличаются лидогенерация по аудиториям операторов, идентификация посетителей и защита трафика;
- какой продукт подходит под его задачу;
- как происходит запуск и передача результата;
- сколько это стоит и на каких фактах основаны обещания;
- законно и безопасно ли устроен процесс;
- есть ли подтверждённый опыт в его нише.

Текущий сайт не рассматривается как структурный baseline. Новый сайт должен решить эти вопросы через ясную продуктовую архитектуру, доказательства и короткие маршруты к расчёту.

## 4. Целевые аудитории

### Primary

- владелец бизнеса, отвечающий за рост продаж;
- директор или руководитель маркетинга;
- руководитель отдела продаж;
- performance- или lead-generation специалист, выбирающий канал привлечения.

### Secondary

- агентства и подрядчики, которым нужен технологический партнёр;
- компании, подозревающие утечку или перехват рекламных лидов;
- компании с достаточным собственным трафиком, которым нужна идентификация части аудитории.

Отраслевые сегменты будут подтверждены после инвентаризации трёх ниш и кейсов.

## 5. Jobs To Be Done

1. Понять, какой из трёх продуктов решает текущую задачу бизнеса.
2. Оценить механизм, ограничения, тариф и ожидаемый формат результата.
3. Увидеть доказательства на кейсах и отзывах.
4. Получить расчёт или консультацию без длинного самостоятельного исследования.
5. После покупки найти инструкцию по запуску, пикселю или интеграции в базе знаний.

## 6. Value Proposition

Рабочая формулировка:

> «Импульс» — платформа привлечения, идентификации и защиты лидов для бизнеса.

Публичные обещания строятся только на подтверждённых возможностях и доказательствах. Термин «перехват лидов» используется для объяснения рыночной проблемы и поискового спроса, но не становится названием основного продукта.

## 7. Product Goals

- привести три продукта к одной понятной бренд-архитектуре;
- создать отдельную коммерческую страницу для каждого намерения пользователя;
- превратить существующий опыт и кейсы в доказательный слой продаж;
- создать масштабируемый SEO-контур статей и кейсов;
- создать отдельную базу знаний для продуктовых инструкций;
- обеспечить измеримый путь `страница -> CTA -> заявка -> AMS Leads API`;
- позволить владельцу и AI безопасно развивать контент через Git без CMS на первом этапе.

## 8. Non-goals первого выпуска

- личный кабинет, auth и роли;
- собственная CRM или хранение лидов в frontend-проекте;
- Payload CMS, PostgreSQL, ORM и административная панель;
- онлайн-оплата;
- автоматическое раскрытие персональных или операторских данных;
- гарантии абсолютной защиты или гарантированного числа лидов;
- массовые programmatic SEO-страницы без уникального доказательного контента;
- буквальное копирование текстов, дизайна, медиа или фактов конкурентов.

## 9. Scope первого публичного релиза

- универсальная главная платформы;
- три продуктовые страницы;
- тарифы;
- кейсы и детальные страницы кейсов;
- отзывы;
- примеры расчётов;
- статьи и страницы статей;
- база знаний по трём продуктам;
- о компании и контакты;
- обязательные юридические страницы;
- формы заявки через AMS Leads API;
- SEO metadata, sitemap, robots, canonical, 404;
- Яндекс Метрика и типизированные события без PII;
- статический production deploy с rollback.

Минимальный содержательный состав первого публичного релиза утверждён владельцем:

- 3 полных кейса — по одному на каждую из трёх подтверждённых ниш;
- 3 подтверждённых или прозрачно обезличенных отзыва;
- 3 содержательные статьи;
- 3 инструкции базы знаний — минимум по одной на каждый продукт.

Неполные материалы и пустые hubs не публикуются и не включаются в sitemap. Тарифы и расчёты публикуются только после утверждения коммерческих правил.

## 10. Conversion Model

Primary conversion: **получить расчёт / разобрать задачу**.

Supporting actions:

- выбрать продукт;
- посмотреть кейс своей ниши;
- изучить тариф;
- прочитать методику или инструкцию;
- перейти к контактам.

Успешная отправка формы по умолчанию показывается inline. Отдельная thank-you page создаётся только при доказанной аналитической или рекламной необходимости.

## 10.1 Primary Commercial Route Contracts

Этот раздел задаёт бизнес-контракт основных коммерческих маршрутов. Он не
публикует неподтверждённые тарифы, кейсы, метрики или legal claims. Если
доказательство не приложено, маршрут обязан показывать безопасную формулировку,
`TODO`-статус, draft/hidden/noindex-состояние либо вести к расчёту без ложной
точности.

| Route | WHO / audience | PROBLEM | OFFER / VALUE | MECHANISM | PROOF dependency | LIMITS / objection | NEXT ACTION / CTA | Lead context |
|---|---|---|---|---|---|---|---|---|
| `/` | владелец, маркетинг, продажи, подрядчик, который ещё выбирает продукт | неясно, какой продукт «Импульс» подходит под задачу роста или защиты лидов | единая карта трёх продуктов и короткий путь к расчёту | маршрутные карточки: лидогенерация, пиксель, защита; далее переход на продуктовую страницу | общие факты из PRD, route map и только publishable proof | не раскрывает полный механизм каждого продукта; не обещает KPI | `Получить расчёт` / выбрать продукт | `product=site`, `sourcePath=/`, `ctaId=home-primary` |
| `/impuls/` | бизнесу нужны новые лиды без самостоятельного тестирования множества каналов | текущих лидов недостаточно или канал привлечения не даёт нужного объёма/качества | таргетированная лидогенерация по релевантным аудиториям | подбор аудитории, запуск кампании, передача результата через approved lead flow | кейсы/ниши/метрики только после evidence inventory и owner approval | тарифы, сроки, объём и операторская/юридическая формулировка требуют подтверждения; без гарантии числа лидов | `Рассчитать запуск` | `product=impuls`, `sourcePath=/impuls/`, `ctaId=impuls-primary` |
| `/pixel/` | компания уже имеет сайт и хочет понять часть заинтересованной аудитории | посетители уходят без заявки, и бизнес не понимает, кого можно вернуть в коммуникацию | идентификация заинтересованных посетителей после установки пикселя | установка пикселя, фиксация интереса, передача разрешённого результата через безопасный контур | proof зависит от legal/data wording и технического контракта пикселя | не раскрывает персональные/операторские данные автоматически; применимость зависит от трафика и legal review | `Проверить применимость пикселя` | `product=pixel`, `sourcePath=/pixel/`, `ctaId=pixel-primary` |
| `/zashchita/` | бизнес подозревает потерю заявок, перехват или неэффективность рекламного трафика | часть лидов или рекламных касаний может уходить конкурентам либо не доходить до продаж | аудит и меры снижения риска перехвата лидов | диагностика воронки/каналов, фиксация риска, план защиты и проверяемые меры | доказательства требуют legal/security wording, источника и методики | не обещает абсолютную невозможность перехвата; результат описывается через границы и проверяемые меры | `Провести аудит` | `product=zashchita`, `sourcePath=/zashchita/`, `ctaId=zashchita-primary` |
| `/tarify/` | покупатель сравнивает условия до обращения | непонятно, из чего складывается цена и что входит в запуск | безопасное объяснение модели цены и факторов расчёта | показать факторы стоимости без неподтверждённых чисел | OD-02: тарифы и коммерческие правила | до OD-02 не публиковать цены, диапазоны и обещания результата | `Получить персональный расчёт` | `product=site`, `sourcePath=/tarify/`, `ctaId=tariffs-primary` |
| `/raschety/` | покупатель хочет оценить сценарий запуска до звонка | без вводных сложно понять порядок работ и применимость продукта | расчётная модель с явными assumptions | собрать нишу, регион, продукт, ограничения и передать в расчёт | OD-02 + approved calculation examples | расчётные примеры скрыты до подтверждения коммерческих правил | `Разобрать задачу` | `product=site`, `sourcePath=/raschety/`, `ctaId=calculations-primary` |
| `/keisy/` | пользователь ищет подтверждённый опыт в похожей нише | без кейсов обещание выглядит недоказанным | доказательный слой по нишам и продуктам | фильтрация/карточки кейсов только после evidence permission | OD-01, case source, period, method, permission | неполные кейсы draft/hidden/noindex; не выдумывать результаты | `Посмотреть релевантный кейс` / `Получить расчёт` | `product=site`, `sourcePath=/keisy/`, `ctaId=cases-primary` |
| `/otzyvy/` | пользователь проверяет доверие и качество работы | отзыв без источника и разрешения не является proof | отдельная модель отзывов, не смешанная с кейсами | показывать quote/source/permission only when approved | review source + permission status | непроверенные отзывы не публикуются | `Обсудить похожую задачу` | `product=site`, `sourcePath=/otzyvy/`, `ctaId=reviews-primary` |
| `/kontakty/` | пользователь готов связаться без чтения всех материалов | нужен короткий безопасный контактный путь | контактная страница и disabled-safe lead form | относительный frontend route; live submit только после AMS Leads API/legal approval | EXT-01..04 | live lead submission disabled until approvals; no PII in analytics | `Разобрать задачу` | `product=site`, `sourcePath=/kontakty/`, `ctaId=contacts-primary` |

### Route Contract Invariants

- Each route has one primary audience, one primary problem and one primary next action.
- Public copy must use only `allowed` or otherwise approved evidence. `needs-review`,
  `hidden`, `unsupported-hidden`, draft and internal workflow terms are not public proof.
- CTA context must include `product`, `sourcePath` and `ctaId`; analytics events must
  not include PII or raw form values.
- SEO goals for these routes remain `REQUIRES_MEASUREMENT` or
  `OWNER_DECISION` until measurement baseline and intent ownership are proven.
- `/impuls/` and `/` must avoid paragraph-level duplication: `/` routes the user,
  `/impuls/` explains the main product in depth.

### Conversion and SEO Ownership Placeholders

Пока нет подтверждённой аналитики, PRD фиксирует владельца измерения, а не
числовую цель. Любой KPI, прогноз, тарифный эффект или SEO-обещание до
baseline остаётся `REQUIRES_MEASUREMENT` либо `OWNER_DECISION`.

| Route | Conversion owner | Primary conversion event | SEO intent owner | Measurable SEO placeholder | Release rule |
|---|---|---|---|---|---|
| `/` | owner + implementation | `lead_submit` with `sourcePath=/` or product selection click | SEO + product | `REQUIRES_MEASUREMENT: branded/platform intent baseline` | publishable after route/H1/metadata proof and no unsupported claims |
| `/impuls/` | owner | `lead_submit` with `product=impuls` | SEO + product | `REQUIRES_MEASUREMENT: lead-generation product intent baseline` | publishable only with distinct intent from `/` and safe operator wording |
| `/pixel/` | owner | `lead_submit` with `product=pixel` | SEO + product | `REQUIRES_MEASUREMENT: pixel/visitor-identification intent baseline` | publishable only after legal/data wording is approved |
| `/zashchita/` | owner | `lead_submit` with `product=zashchita` | SEO + product | `REQUIRES_MEASUREMENT: lead-protection/problem intent baseline` | publishable only with bounded, non-absolute protection claims |
| `/tarify/` | owner | `lead_submit` with `sourcePath=/tarify/` | SEO + commercial | `OWNER_DECISION: tariff intent terms and public price policy` | no public prices/ranges until OD-02 is resolved |
| `/raschety/` | owner | `lead_submit` with `sourcePath=/raschety/` | SEO + commercial | `OWNER_DECISION: calculation scenario terms and assumptions` | examples hidden/noindex until calculation rules are approved |
| `/keisy/` | owner + editorial | case detail view and `lead_submit` from cases context | SEO + editorial | `REQUIRES_MEASUREMENT: case/niche intent baseline` | only approved cases with source/period/method/permission |
| `/otzyvy/` | owner + editorial | review-assisted `lead_submit` | SEO + editorial | `OWNER_DECISION: testimonial intent and permission model` | only approved testimonials with source/permission state |
| `/kontakty/` | owner + implementation | `lead_submit` with `sourcePath=/kontakty/` | product | `REQUIRES_MEASUREMENT: contact-route assisted conversion baseline` | live submit only after AMS Leads API/legal/anti-spam approvals |

Conversion ownership means responsibility for accepting public copy, CTA context
and measurement evidence. SEO ownership means responsibility for intent,
indexability, canonical and metadata decisions. Implementation may add guards and
tests, but cannot invent commercial targets or approve claims.

## 11. Success Metrics

До публикации baseline метрик требует проверки. Не выдумывать целевые значения.

| Метрика | Baseline | Target | Owner | Status |
|---|---:|---:|---|---|
| валидные заявки с сайта в месяц | TODO | TODO | owner | `OWNER_DECISION` |
| конверсия ключевых продуктовых страниц | TODO | TODO | owner | `REQUIRES_MEASUREMENT` |
| доля заявок с заполненным source/page context | TODO | TODO | implementation | `REQUIRES_MEASUREMENT` |
| органические переходы на продуктовые кластеры | TODO | TODO | SEO | `REQUIRES_MEASUREMENT` |
| индексируемые страницы без критических SEO-ошибок | TODO | 100% | implementation | mechanical release acceptance |

## 12. Business Rules

- Тарифы и расчёты публикуются только после подтверждения владельцем.
- Результаты кейсов публикуются только с источником, периодом, методикой расчёта и разрешением на идентификацию клиента либо в обезличенном виде.
- Отзывы не смешиваются с кейсами и имеют отдельную модель доказательности.
- Законность, согласия, обработка персональных данных и формулировки о мобильных операторах требуют юридической проверки до release.
- Страница защиты не обещает абсолютную невозможность перехвата; она описывает меры, границы и проверяемый результат.

## 13. Product Risks

| Risk | Mitigation |
|---|---|
| неясность терминов и путаница трёх продуктов | отдельные URL, comparison block, единый product switcher |
| SEO-каннибализация главной и `/impuls/` | разные роли, H1, intent, metadata и content depth |
| неподтверждённые маркетинговые обещания | evidence register, owner approval, editorial QA |
| чувствительная правовая тема | юридическая проверка формулировок и consent contract |
| недостаточно контента для всех разделов к первому релизу | route skeleton и поэтапное наполнение без thin indexable pages |
| визуальная система из другой предметной области | сохранить Northline language, заменить domain-specific imagery/patterns |

## 14. Open Decisions

- `TODO`: названия трёх ниш и приоритет первой ниши.
- `TODO`: подтверждённые тарифы и коммерческие ограничения.
- `TODO`: перечень CRM/каналов доставки лидов; EPIC-01.5 preflight confirms this is not available in the repository yet.
- `TODO`: кто проводит юридическую проверку публичных формулировок; EPIC-01.5 preflight keeps OD-03 open.
- `TODO`: Яндекс Метрика account/config and CAPTCHA/anti-spam provider decision for live forms.
- `TODO`: approved redirect inventory from the current public `ams24.ru` URL set.
- Минимальный набор первого release утверждён в разделе 9; требуется только инвентаризация конкретных материалов.

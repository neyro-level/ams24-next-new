import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

import { describe, expect, it } from 'vitest'

import { createContentRepository, type ContentRepository } from '@/core/content/repository'
import {
  assertValidContentGraph,
  type ContentGraphIssueCode,
  validateContentGraph,
} from '@/core/content/validation'
import { normalizePath } from '@/core/lib/path'
import { localContent } from '@/project/content/local-content'

function collectSourceFiles(root: string): string[] {
  const files: string[] = []

  for (const entry of readdirSync(root)) {
    const path = join(root, entry)
    const stat = statSync(path)

    if (stat.isDirectory()) {
      files.push(...collectSourceFiles(path))
      continue
    }

    if (/\.(ts|tsx)$/.test(entry)) {
      files.push(path)
    }
  }

  return files
}

const canonicalRepository = createContentRepository(localContent)
const canonicalData = {
  siteSettings: await canonicalRepository.getSiteSettings(),
  navigation: await canonicalRepository.getNavigation(),
  products: await canonicalRepository.getProducts(),
  pages: await canonicalRepository.getPages(),
  tariffs: await canonicalRepository.getTariffs(),
  cases: await canonicalRepository.getCases(),
  reviews: await canonicalRepository.getReviews(),
  calculations: await canonicalRepository.getCalculations(),
  articles: await canonicalRepository.getArticles(),
  knowledgeArticles: await canonicalRepository.getKnowledgeArticles(),
}

type RepositoryFixtureData = typeof canonicalData
type RepositoryFixture = ContentRepository & RepositoryFixtureData

function validRepository(): RepositoryFixture {
  return {
    ...canonicalData,
    async getSiteSettings() { return this.siteSettings },
    async getNavigation() { return this.navigation },
    async getProducts() { return this.products },
    async getPages() { return this.pages },
    async getTariffs() { return this.tariffs },
    async getCases() { return this.cases },
    async getReviews() { return this.reviews },
    async getCalculations() { return this.calculations },
    async getArticles() { return this.articles },
    async getKnowledgeArticles() { return this.knowledgeArticles },
    async getProduct(id) { return this.products.find((item) => item.id === id) },
    async getPageByPath(path) { return this.pages.find((item) => item.path === normalizePath(path)) },
    async getCaseByPath(path) { return this.cases.find((item) => item.path === normalizePath(path)) },
    async getArticleByPath(path) { return this.articles.find((item) => item.path === normalizePath(path)) },
    async getKnowledgeArticleByPath(path) {
      return this.knowledgeArticles.find((item) => item.path === normalizePath(path))
    },
    async getTariffsForProduct(productId) { return this.tariffs.filter((item) => item.productRef === productId) },
    async getCasesForProduct(productId) { return this.cases.filter((item) => item.productRefs.includes(productId)) },
    async getReviewsForProduct(productId) { return this.reviews.filter((item) => item.productRef === productId) },
    async getArticlesForProduct(productId) { return this.articles.filter((item) => item.productRefs.includes(productId)) },
  }
}

function invalidRepository(input: unknown): RepositoryFixture {
  return input as RepositoryFixture
}

type NegativeFixture = {
  invariant: string
  code: ContentGraphIssueCode
  build: () => {
    repository: ContentRepository
    options?: Parameters<typeof validateContentGraph>[1]
  }
}

const negativeFixtures: NegativeFixture[] = [
  {
    invariant: 'global IDs are unique across entity collections',
    code: 'duplicate-global-id',
    build: () => ({
      repository: {
        ...validRepository(),
        pages: [
          {
            ...validRepository().pages[0],
            id: 'impuls',
          },
        ],
      },
    }),
  },
  {
    invariant: 'canonical paths are globally unique',
    code: 'duplicate-canonical-path',
    build: () => ({
      repository: {
        ...validRepository(),
        pages: [
          {
            ...validRepository().pages[0],
            id: 'duplicate-product-path',
            path: '/impuls/',
            seo: {
              ...validRepository().pages[0].seo,
              canonicalPath: '/impuls/',
            },
          },
        ],
      },
    }),
  },
  {
    invariant: 'SEO canonical equals the entity path',
    code: 'canonical-mismatch',
    build: () => ({
      repository: {
        ...validRepository(),
        products: [
          {
            ...validRepository().products[0],
            seo: {
              ...validRepository().products[0].seo,
              canonicalPath: '/wrong/',
            },
          },
        ],
      },
    }),
  },
  {
    invariant: 'detail slugs match their canonical path segment',
    code: 'slug-mismatch',
    build: () => ({
      repository: invalidRepository({
        ...validRepository(),
        articles: [
          {
            ...validRepository().articles[0],
            slug: 'wrong-slug',
          },
        ],
      }),
    }),
  },
  {
    invariant: 'entity product references target known products',
    code: 'broken-product-ref',
    build: () => ({
      repository: invalidRepository({
        ...validRepository(),
        articles: [
          {
            ...validRepository().articles[0],
            productRefs: ['unknown'],
          },
        ],
      }),
    }),
  },
  {
    invariant: 'navigation links target known routes',
    code: 'broken-navigation-ref',
    build: () => ({
      repository: {
        ...validRepository(),
        navigation: {
          ...validRepository().navigation!,
          header: [{ label: 'Missing', path: '/missing/' }],
        },
      },
    }),
  },
  {
    invariant: 'Markdown internal links target known routes',
    code: 'broken-link',
    build: () => ({
      repository: {
        ...validRepository(),
        articles: [
          {
            ...validRepository().articles[0],
            body: {
              format: 'markdown',
              value: '[Missing](/missing/)',
            },
          },
        ],
      },
    }),
  },
  {
    invariant: 'media references stay project-owned',
    code: 'invalid-media',
    build: () => ({
      repository: {
        ...validRepository(),
        products: [
          {
            ...validRepository().products[0],
            seo: {
              ...validRepository().products[0].seo,
              ogImage: 'https://example.com/og.png',
            },
          },
        ],
      },
    }),
  },
  {
    invariant: 'redirects have no chains or duplicate/self targets',
    code: 'invalid-redirect',
    build: () => ({
      repository: validRepository(),
      options: {
        redirects: [
          { source: '/a/', destination: '/b/', permanent: true },
          { source: '/b/', destination: '/c/', permanent: true },
        ],
      },
    }),
  },
  {
    invariant: 'product-routes blocks reference known products',
    code: 'broken-block-ref',
    build: () => ({
      repository: invalidRepository({
        ...validRepository(),
        pages: [
          {
            ...validRepository().pages[0],
            blocks: [
              {
                blockType: 'product-routes',
                productRefs: ['unknown'],
              },
            ],
          },
        ],
      }),
    }),
  },
  {
    invariant: 'published content cannot be hidden from indexing',
    code: 'invalid-publication-state',
    build: () => ({
      repository: {
        ...validRepository(),
        pages: [
          {
            ...validRepository().pages[0],
            status: 'published',
            seo: {
              ...validRepository().pages[0].seo,
              robots: 'noindex',
            },
          },
        ],
      },
    }),
  },
  {
    invariant: 'draft editorial content must remain noindex',
    code: 'invalid-publication-state',
    build: () => ({
      repository: invalidRepository({
        ...validRepository(),
        articles: [
          {
            ...validRepository().articles.find((article) => article.status === 'draft')!,
            seo: {
              ...validRepository().articles.find((article) => article.status === 'draft')!.seo,
              robots: 'index',
            },
          },
        ],
      }),
    }),
  },
  {
    invariant: 'sitemap-eligible content has an update timestamp',
    code: 'missing-updated-at',
    build: () => ({
      repository: invalidRepository({
        ...validRepository(),
        products: [
          {
            ...validRepository().products[0],
            updatedAt: undefined,
          },
        ],
      }),
    }),
  },
  {
    invariant: 'SEO fields stay complete after composition',
    code: 'seo-incomplete',
    build: () => ({
      repository: {
        ...validRepository(),
        products: [
          {
            ...validRepository().products[0],
            seo: {
              ...validRepository().products[0].seo,
              title: '',
            },
          },
        ],
      },
    }),
  },
  {
    invariant: 'indexPolicy and SEO robots do not contradict each other',
    code: 'contradictory-index-policy',
    build: () => ({
      repository: {
        ...validRepository(),
        pages: [
          {
            ...validRepository().pages[0],
            indexPolicy: 'index',
            seo: {
              ...validRepository().pages[0].seo,
              robots: 'noindex',
            },
          },
        ],
      },
    }),
  },
]

describe('content graph validator contract', () => {
  it('exposes one canonical validator API for valid repository content', async () => {
    const repository = createContentRepository(localContent)

    await expect(validateContentGraph(repository)).resolves.toEqual([])
    await expect(assertValidContentGraph(repository)).resolves.toBeUndefined()
  })

  it('reports cross-entity graph issues without throwing in report mode', async () => {
    const repository = createContentRepository({
      ...localContent,
      articles: [
        ...localContent.articles!.filter(
          (article) => article.status === 'draft' && article.productRefs.includes('pixel'),
        ),
        {
          ...localContent.articles!.find((article) => article.status === 'draft')!,
          id: 'article-duplicate-intent',
          path: '/stati/duplicate-intent/',
          slug: 'duplicate-intent',
          body: {
            format: 'markdown',
            value: '[Broken](/missing-page/)',
          },
        },
      ],
    })

    await expect(validateContentGraph(repository)).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'broken-link', entity: 'article:article-duplicate-intent' }),
        expect.objectContaining({ code: 'orphan-product', entity: 'product:zashchita' }),
      ]),
    )
  })

  it('fails the content graph explicitly while lexical has no Payload renderer', async () => {
    const repository = invalidRepository({
      ...validRepository(),
      articles: validRepository().articles.map((article, index) =>
        index === 0 ? { ...article, body: { format: 'lexical', value: {} } } : article,
      ),
    })

    await expect(validateContentGraph(repository)).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'unsupported-richtext-format',
          message: 'Unsupported RichText renderer: lexical requires the Payload renderer',
        }),
      ]),
    )
    await expect(assertValidContentGraph(repository)).rejects.toThrow(/Unsupported RichText renderer/)
  })

  it.each(negativeFixtures)('rejects invalid fixture: $invariant', async ({ build, code }) => {
    const { repository, options } = build()

    await expect(validateContentGraph(repository, options)).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining({ code })]),
    )
  })

  it('keeps graph-validation ownership inside core/content/validation', () => {
    const offenders = collectSourceFiles('src').flatMap((file) => {
      const normalized = relative(process.cwd(), file).replaceAll('\\', '/')
      const source = readFileSync(file, 'utf8')
      const declaresGraphValidator = /function\s+validate[A-Za-z]*Graph\b/.test(source)

      return declaresGraphValidator && !normalized.startsWith('src/core/content/validation/')
        ? [normalized]
        : []
    })

    expect(offenders).toEqual([])
  })
})

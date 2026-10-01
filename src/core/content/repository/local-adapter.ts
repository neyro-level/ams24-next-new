import { z } from 'zod'

import {
  articleSchema,
  calculationExampleSchema,
  caseSchema,
  knowledgeArticleSchema,
  navigationSchema,
  pageSchema,
  productSchema,
  reviewSchema,
  siteSettingsSchema,
  tariffSchema,
  type ProductDTO,
} from '@/core/content/schemas'

import type { ContentRepository } from './contract'

const localContentSchema = z.object({
  siteSettings: siteSettingsSchema.optional(),
  navigation: navigationSchema.optional(),
  products: z.array(productSchema).default([]),
  pages: z.array(pageSchema).default([]),
  tariffs: z.array(tariffSchema).default([]),
  cases: z.array(caseSchema).default([]),
  reviews: z.array(reviewSchema).default([]),
  calculations: z.array(calculationExampleSchema).default([]),
  articles: z.array(articleSchema).default([]),
  knowledgeArticles: z.array(knowledgeArticleSchema).default([]),
})

export type LocalContentInput = z.input<typeof localContentSchema>

type LocalContent = z.infer<typeof localContentSchema>

function normalizeLookupPath(path: string) {
  const trimmed = path.trim().toLowerCase()
  const leading = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return leading.endsWith('/') ? leading : `${leading}/`
}

function indexBy<T>(
  rows: T[],
  keyOf: (row: T) => string,
  label: string,
) {
  const index = new Map<string, T>()

  for (const row of rows) {
    const key = keyOf(row)

    if (index.has(key)) {
      throw new Error(`Duplicate ${label}: ${key}`)
    }

    index.set(key, row)
  }

  return index
}

function assertKnownProducts(content: LocalContent, productIndex: Map<string, ProductDTO>) {
  const assert = (productId: string, source: string) => {
    if (!productIndex.has(productId)) {
      throw new Error(`Broken product ref "${productId}" in ${source}`)
    }
  }

  for (const tariff of content.tariffs) {
    assert(tariff.productRef, `tariff:${tariff.id}`)
  }

  for (const item of content.cases) {
    for (const productId of item.productRefs) {
      assert(productId, `case:${item.id}`)
    }
  }

  for (const review of content.reviews) {
    if (review.productRef) {
      assert(review.productRef, `review:${review.id}`)
    }
  }

  for (const item of content.calculations) {
    assert(item.productRef, `calculation:${item.id}`)
  }

  for (const article of content.articles) {
    for (const productId of article.productRefs) {
      assert(productId, `article:${article.id}`)
    }
  }

  for (const article of content.knowledgeArticles) {
    assert(article.productRef, `knowledge:${article.id}`)
  }

  for (const page of content.pages) {
    for (const block of page.blocks) {
      if (block.blockType === 'product-routes') {
        for (const productId of block.productRefs) {
          assert(productId, `page:${page.id}`)
        }
      }
    }
  }
}

function assertUniquePublishedPaths(content: LocalContent) {
  indexBy(
    [
      ...content.pages.map((item) => ({ type: 'page', id: item.id, path: item.path })),
      ...content.cases.map((item) => ({ type: 'case', id: item.id, path: item.path })),
      ...content.articles.map((item) => ({ type: 'article', id: item.id, path: item.path })),
      ...content.knowledgeArticles.map((item) => ({ type: 'knowledge', id: item.id, path: item.path })),
    ],
    (item) => item.path,
    'canonical path',
  )
}

export function createContentRepository(input: LocalContentInput): ContentRepository {
  const content = localContentSchema.parse(input)
  const productIndex = indexBy(content.products, (item) => item.id, 'product id')
  const pageByPath = indexBy(content.pages, (item) => item.path, 'page path')
  const caseByPath = indexBy(content.cases, (item) => item.path, 'case path')
  const articleByPath = indexBy(content.articles, (item) => item.path, 'article path')
  const knowledgeByPath = indexBy(
    content.knowledgeArticles,
    (item) => item.path,
    'knowledge article path',
  )

  assertKnownProducts(content, productIndex)
  assertUniquePublishedPaths(content)

  return {
    ...content,
    getProduct(id) {
      return productIndex.get(id)
    },
    getPageByPath(path) {
      return pageByPath.get(normalizeLookupPath(path))
    },
    getCaseByPath(path) {
      return caseByPath.get(normalizeLookupPath(path))
    },
    getArticleByPath(path) {
      return articleByPath.get(normalizeLookupPath(path))
    },
    getKnowledgeArticleByPath(path) {
      return knowledgeByPath.get(normalizeLookupPath(path))
    },
    getTariffsForProduct(productId) {
      return content.tariffs.filter((item) => item.productRef === productId)
    },
    getCasesForProduct(productId) {
      return content.cases.filter((item) => item.productRefs.includes(productId))
    },
    getReviewsForProduct(productId) {
      return content.reviews.filter((item) => item.productRef === productId)
    },
    getArticlesForProduct(productId) {
      return content.articles.filter((item) => item.productRefs.includes(productId))
    },
    assertProductRef(productId) {
      const product = productIndex.get(productId)

      if (!product) {
        throw new Error(`Unknown product ref: ${productId}`)
      }

      return product
    },
  }
}

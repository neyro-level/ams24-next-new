import { z } from 'zod'

import {
  idSchema,
  indexPolicySchema,
  isoDateSchema,
  localeSchema,
  navigationHrefSchema,
  pathSchema,
  productRefSchema,
  richTextSchema,
  seoSchema,
  slugSchema,
} from './common'

const ctaSchema = z.object({
  id: idSchema,
  label: z.string().trim().min(2),
})

const linkSchema = z.object({
  label: z.string().trim().min(2),
  path: pathSchema,
})

export const productSchema = z.object({
  id: productRefSchema,
  locale: localeSchema,
  name: z.string().trim().min(2),
  shortName: z.string().trim().min(2),
  path: pathSchema,
  promise: z.string().trim().min(20),
  status: z.enum(['active', 'planned', 'hidden']).default('active'),
  primaryCta: ctaSchema,
  seo: seoSchema,
})

export const tariffSchema = z.object({
  id: idSchema,
  locale: localeSchema,
  productRef: productRefSchema,
  title: z.string().trim().min(2),
  pricingModel: z.string().trim().min(2),
  inclusions: z.array(z.string().trim().min(2)).min(1),
  limits: z.array(z.string().trim().min(2)).default([]),
  status: z.enum(['draft', 'published', 'hidden']).default('draft'),
})

export const caseSchema = z.object({
  id: idSchema,
  locale: localeSchema,
  path: pathSchema,
  slug: slugSchema,
  productRefs: z.array(productRefSchema).min(1),
  niche: z.string().trim().min(2),
  period: z.string().trim().min(2),
  problem: z.string().trim().min(20),
  method: z.string().trim().min(20),
  metrics: z.array(z.string().trim().min(2)).default([]),
  evidenceLevel: z.enum(['internal', 'anonymized', 'public']),
  body: richTextSchema,
  seo: seoSchema,
  status: z.enum(['draft', 'published', 'hidden']).default('draft'),
})

export const reviewSchema = z.object({
  id: idSchema,
  locale: localeSchema,
  author: z.string().trim().min(2),
  role: z.string().trim().min(2).optional(),
  company: z.string().trim().min(2).optional(),
  quote: z.string().trim().min(20),
  permissionStatus: z.enum(['approved', 'anonymized', 'internal-only']),
  productRef: productRefSchema.optional(),
  caseRef: idSchema.optional(),
  status: z.enum(['draft', 'published', 'hidden']).default('draft'),
})

export const calculationExampleSchema = z.object({
  id: idSchema,
  locale: localeSchema,
  productRef: productRefSchema,
  title: z.string().trim().min(2),
  inputs: z.array(z.string().trim().min(2)).min(1),
  assumptions: z.array(z.string().trim().min(2)).min(1),
  resultRange: z.string().trim().min(2),
  status: z.enum(['draft', 'published', 'hidden']).default('draft'),
})

export const articleSchema = z.object({
  id: idSchema,
  locale: localeSchema,
  path: pathSchema,
  slug: slugSchema,
  title: z.string().trim().min(5),
  topic: z.string().trim().min(2),
  publishedAt: isoDateSchema.optional(),
  updatedAt: isoDateSchema.optional(),
  productRefs: z.array(productRefSchema).default([]),
  caseRefs: z.array(idSchema).default([]),
  body: richTextSchema,
  seo: seoSchema,
  status: z.enum(['draft', 'published', 'hidden']).default('draft'),
})

export const knowledgeArticleSchema = z.object({
  id: idSchema,
  locale: localeSchema,
  path: pathSchema,
  slug: slugSchema,
  productRef: productRefSchema,
  task: z.string().trim().min(5),
  updatedAt: isoDateSchema,
  body: richTextSchema,
  seo: seoSchema,
  status: z.enum(['draft', 'published', 'hidden']).default('draft'),
})

export const pageBlockSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('hero'),
    eyebrow: z.string().optional(),
    title: z.string().trim().min(5),
    lead: z.string().trim().min(20).optional(),
    cta: ctaSchema.optional(),
  }),
  z.object({
    type: z.literal('product-routes'),
    productRefs: z.array(productRefSchema).min(1),
  }),
  z.object({
    type: z.literal('rich-text'),
    body: richTextSchema,
  }),
  z.object({
    type: z.literal('lead-form-shell'),
    intentId: idSchema,
  }),
])

export const pageSchema = z.object({
  id: idSchema,
  locale: localeSchema,
  path: pathSchema,
  role: z.string().trim().min(2),
  intent: z.string().trim().min(10),
  h1: z.string().trim().min(5),
  seo: seoSchema,
  blocks: z.array(pageBlockSchema).min(1),
  indexPolicy: indexPolicySchema.default('index'),
  status: z.enum(['draft', 'published', 'hidden']).default('draft'),
})

export const navigationSchema = z.object({
  locale: localeSchema,
  header: z.array(linkSchema).min(1),
  footer: z.record(z.string().min(1), z.array(linkSchema).min(1)),
  primaryCta: ctaSchema.extend({ path: navigationHrefSchema }),
})

export const siteSettingsSchema = z.object({
  locale: localeSchema,
  siteName: z.string().trim().min(2),
  domain: z.string().url(),
  defaultSeo: seoSchema,
})

export const leadIntentSchema = z.object({
  sourcePath: pathSchema,
  productId: productRefSchema.optional(),
  ctaId: idSchema,
  consentVersion: idSchema,
})

export type ProductDTO = z.infer<typeof productSchema>
export type TariffDTO = z.infer<typeof tariffSchema>
export type CaseDTO = z.infer<typeof caseSchema>
export type ReviewDTO = z.infer<typeof reviewSchema>
export type CalculationExampleDTO = z.infer<typeof calculationExampleSchema>
export type ArticleDTO = z.infer<typeof articleSchema>
export type KnowledgeArticleDTO = z.infer<typeof knowledgeArticleSchema>
export type PageBlockDTO = z.infer<typeof pageBlockSchema>
export type PageDTO = z.infer<typeof pageSchema>
export type NavigationInput = z.input<typeof navigationSchema>
export type NavigationDTO = z.infer<typeof navigationSchema>
export type SiteSettingsInput = z.input<typeof siteSettingsSchema>
export type SiteSettingsDTO = z.infer<typeof siteSettingsSchema>
export type LeadIntentDTO = z.infer<typeof leadIntentSchema>

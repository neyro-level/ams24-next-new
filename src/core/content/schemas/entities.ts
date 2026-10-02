import { z } from 'zod'

import {
  idSchema,
  indexPolicySchema,
  isoDateSchema,
  localeSchema,
  navigationHrefSchema,
  pathSchema,
  publicationStatusSchema,
  productIdSchema,
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
  id: productIdSchema,
  locale: localeSchema,
  slug: slugSchema,
  name: z.string().trim().min(2),
  shortName: z.string().trim().min(2),
  path: pathSchema,
  updatedAt: isoDateSchema,
  promise: z.string().trim().min(20),
  status: z.enum(['published', 'hidden']),
  primaryCta: ctaSchema,
  seo: seoSchema,
})

export const tariffSchema = z.object({
  id: idSchema,
  locale: localeSchema,
  productRef: productIdSchema,
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
  productRefs: z.array(productIdSchema).min(1),
  niche: z.string().trim().min(2),
  period: z.string().trim().min(2),
  updatedAt: isoDateSchema.optional(),
  problem: z.string().trim().min(20),
  method: z.string().trim().min(20),
  metrics: z.array(z.string().trim().min(2)).default([]),
  evidenceLevel: z.enum(['internal', 'anonymized', 'public']),
  body: richTextSchema,
  seo: seoSchema,
  status: publicationStatusSchema,
}).superRefine((item, context) => {
  if (item.status === 'draft' && item.seo.robots !== 'noindex') {
    context.addIssue({ code: 'custom', message: 'Draft case content must use noindex' })
  }

  if (item.status === 'published' && item.seo.robots === 'index' && !item.updatedAt) {
    context.addIssue({ code: 'custom', message: 'Sitemap-eligible case content requires updatedAt' })
  }
})

export const reviewSchema = z.object({
  id: idSchema,
  locale: localeSchema,
  author: z.string().trim().min(2),
  role: z.string().trim().min(2).optional(),
  company: z.string().trim().min(2).optional(),
  quote: z.string().trim().min(20),
  permissionStatus: z.enum(['approved', 'anonymized', 'internal-only']),
  productRef: productIdSchema.optional(),
  caseRef: idSchema.optional(),
  status: z.enum(['draft', 'published', 'hidden']).default('draft'),
})

export const calculationExampleSchema = z.object({
  id: idSchema,
  locale: localeSchema,
  productRef: productIdSchema,
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
  productRefs: z.array(productIdSchema).default([]),
  caseRefs: z.array(idSchema).default([]),
  body: richTextSchema,
  seo: seoSchema,
  status: publicationStatusSchema,
}).superRefine((item, context) => {
  if (item.status === 'draft' && item.seo.robots !== 'noindex') {
    context.addIssue({ code: 'custom', message: 'Draft article content must use noindex' })
  }

  if (item.status === 'published' && item.seo.robots === 'index' && !item.updatedAt) {
    context.addIssue({ code: 'custom', message: 'Sitemap-eligible article content requires updatedAt' })
  }
})

export const knowledgeArticleSchema = z.object({
  id: idSchema,
  locale: localeSchema,
  path: pathSchema,
  slug: slugSchema,
  productRef: productIdSchema,
  task: z.string().trim().min(5),
  updatedAt: isoDateSchema,
  body: richTextSchema,
  seo: seoSchema,
  status: publicationStatusSchema,
}).superRefine((item, context) => {
  if (item.status === 'draft' && item.seo.robots !== 'noindex') {
    context.addIssue({ code: 'custom', message: 'Draft knowledge content must use noindex' })
  }
})

export const publicArticleSchema = z
  .object({
    path: pathSchema,
    title: z.string().trim().min(5),
    description: z.string().trim().min(20),
    body: richTextSchema,
  })
  .strict()

export const publicKnowledgeArticleSchema = z
  .object({
    path: pathSchema,
    productRef: productIdSchema,
    title: z.string().trim().min(5),
    description: z.string().trim().min(20),
    body: richTextSchema,
  })
  .strict()

export const heroPageBlockSchema = z.object({
  blockType: z.literal('hero'),
  eyebrow: z.string().optional(),
  title: z.string().trim().min(5),
  lead: z.string().trim().min(20).optional(),
  cta: ctaSchema.optional(),
})

export const productRoutesPageBlockSchema = z.object({
  blockType: z.literal('product-routes'),
  productRefs: z.array(productIdSchema).min(1),
})

export const richTextPageBlockSchema = z.object({
  blockType: z.literal('rich-text'),
  body: richTextSchema,
})

export const leadFormShellPageBlockSchema = z.object({
  blockType: z.literal('lead-form-shell'),
  intentId: idSchema,
})

export const pageBlockSchema = z.discriminatedUnion('blockType', [
  heroPageBlockSchema,
  productRoutesPageBlockSchema,
  richTextPageBlockSchema,
  leadFormShellPageBlockSchema,
])

export const pageSchema = z.object({
  id: idSchema,
  locale: localeSchema,
  slug: slugSchema,
  path: pathSchema,
  updatedAt: isoDateSchema,
  role: z.string().trim().min(2),
  intent: z.string().trim().min(10),
  h1: z.string().trim().min(5),
  seo: seoSchema,
  blocks: z.array(pageBlockSchema).min(1),
  indexPolicy: indexPolicySchema.default('index'),
  status: z.enum(['published', 'hidden']),
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
  defaultOgImage: z
    .string()
    .trim()
    .regex(/^\/[a-z0-9][a-z0-9/_-]*\.(?:png|jpe?g|webp)$/, 'Default OG image must be a project-owned raster path'),
  organization: z.object({
    name: z.string().trim().min(2),
    legalName: z.string().trim().min(5),
    taxID: z.string().regex(/^\d{12}$/, 'Individual entrepreneur tax ID must contain 12 digits'),
    telephone: z.string().trim().regex(/^\+7 \d{3} \d{3} \d{4}$/, 'Telephone must use the approved +7 format'),
    email: z.string().trim().email(),
    logo: z
      .string()
      .trim()
      .regex(/^\/[a-z0-9][a-z0-9/_-]*\.(?:png|svg)$/, 'Organization logo must be a project-owned PNG or SVG path'),
  }),
  defaultSeo: seoSchema,
})

export const leadIntentSchema = z.object({
  sourcePath: pathSchema,
  productId: productIdSchema.optional(),
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
export type PublicArticleDTO = z.infer<typeof publicArticleSchema>
export type PublicKnowledgeArticleDTO = z.infer<typeof publicKnowledgeArticleSchema>
export type PageBlockDTO = z.infer<typeof pageBlockSchema>
export type PageDTO = z.infer<typeof pageSchema>
export type NavigationInput = z.input<typeof navigationSchema>
export type NavigationDTO = z.infer<typeof navigationSchema>
export type SiteSettingsInput = z.input<typeof siteSettingsSchema>
export type SiteSettingsDTO = z.infer<typeof siteSettingsSchema>
export type LeadIntentDTO = z.infer<typeof leadIntentSchema>

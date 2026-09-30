import { z } from 'zod'

export const localeSchema = z.enum(['ru-RU']).default('ru-RU')

export const idSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9][a-z0-9-]*$/, 'ID must be a stable lowercase slug-like identifier')

export const slugSchema = idSchema

function normalizePath(value: string) {
  const trimmed = value.trim().toLowerCase()
  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
}

function normalizeNavigationHref(value: string) {
  const trimmed = value.trim().toLowerCase()
  const [pathPart, fragmentPart] = trimmed.split('#')
  const normalizedPath = normalizePath(pathPart || '/')

  if (!fragmentPart) {
    return normalizedPath
  }

  return `${normalizedPath}#${fragmentPart}`
}

export const pathSchema = z
  .string()
  .trim()
  .min(1)
  .transform(normalizePath)
  .pipe(
    z
      .string()
      .regex(
        /^\/(?:[a-z0-9-]+\/)*$/,
        'Canonical path must use lowercase URL segments and leading/trailing slash',
      ),
  )

export const navigationHrefSchema = z
  .string()
  .trim()
  .min(1)
  .transform(normalizeNavigationHref)
  .pipe(
    z
      .string()
      .regex(
        /^\/(?:[a-z0-9-]+\/)*(?:#[a-z0-9-]+)?$/,
        'Navigation href must be a canonical path with an optional fragment',
      ),
  )

export const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD')

export const publicationStatusSchema = z.enum(['draft', 'published', 'hidden']).default('draft')

export const productRefSchema = z.enum(['impuls', 'pixel', 'zashchita'])

export const indexPolicySchema = z.enum(['index', 'noindex']).default('index')

export const richTextSchema = z.object({
  kind: z.enum(['markdown', 'blocks']),
  value: z.string().min(1),
})

export const seoSchema = z.object({
  title: z.string().trim().min(10).max(70),
  description: z.string().trim().min(40).max(180),
  canonicalPath: pathSchema,
  robots: indexPolicySchema.default('index'),
  ogImage: z.string().trim().min(1).optional(),
})

export const mediaSchema = z.object({
  id: idSchema,
  src: z.string().trim().min(1),
  alt: z.string(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
})

export type Locale = z.infer<typeof localeSchema>
export type NavigationHref = z.infer<typeof navigationHrefSchema>
export type SeoDTO = z.infer<typeof seoSchema>
export type MediaDTO = z.infer<typeof mediaSchema>
export type RichTextDTO = z.infer<typeof richTextSchema>

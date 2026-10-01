import { navigationSchema, siteSettingsSchema } from '@/core/content/schemas'
import type {
  NavigationDTO,
  ProductDTO,
  SiteSettingsDTO,
} from '@/core/content/schemas'

import type { ContentRepository } from '../repository'
import { getContentRepository } from './repository'

export type NavigationLinkViewModel = {
  label: string
  path: string
}

export type FooterGroupViewModel = {
  title: string
  links: NavigationLinkViewModel[]
}

export type NavigationViewModel = {
  headerLinks: NavigationLinkViewModel[]
  productLinks: NavigationLinkViewModel[]
  footerGroups: FooterGroupViewModel[]
  firstLevelRoutes: NavigationLinkViewModel[]
  primaryCta: NavigationLinkViewModel
}

export type SiteSettingsViewModel = {
  locale: SiteSettingsDTO['locale']
  siteName: string
  siteOrigin: string
  defaultSeo: SiteSettingsDTO['defaultSeo']
}

export type ContentCatalogViewModel = {
  products: ProductDTO[]
}

function uniqueLinks(links: NavigationLinkViewModel[]) {
  const byPath = new Map<string, NavigationLinkViewModel>()

  for (const link of links) {
    byPath.set(link.path, link)
  }

  return [...byPath.values()]
}

export function createSiteSettingsViewModel(input: unknown): SiteSettingsViewModel {
  const settings = siteSettingsSchema.parse(input)

  return {
    locale: settings.locale,
    siteName: settings.siteName,
    siteOrigin: new URL(settings.domain).origin,
    defaultSeo: settings.defaultSeo,
  }
}

export function createContentCatalogViewModel(repository: ContentRepository): ContentCatalogViewModel {
  return {
    products: repository.products.filter((product) => product.status === 'published'),
  }
}

export function createNavigationViewModel(
  input: unknown,
  content: ContentCatalogViewModel,
): NavigationViewModel {
  const navigation = navigationSchema.parse(input)
  const productLinks = content.products.map((product) => ({
    label: product.shortName,
    path: product.path,
  }))
  const footerGroups = Object.entries(navigation.footer).map(([title, links]) => ({
    title,
    links,
  }))

  return {
    headerLinks: navigation.header,
    productLinks,
    footerGroups,
    firstLevelRoutes: uniqueLinks([
      { label: 'Главная', path: '/' },
      ...productLinks,
      ...navigation.header,
      ...footerGroups.flatMap((group) => group.links),
    ]),
    primaryCta: {
      label: navigation.primaryCta.label,
      path: navigation.primaryCta.path,
    },
  }
}

function requireRepositoryField<T>(
  value: T | undefined,
  fieldName: string,
): T {
  if (!value) {
    throw new Error(`Content repository is missing ${fieldName}`)
  }

  return value
}

export function getContentCatalogViewModel(repository = getContentRepository()) {
  return createContentCatalogViewModel(repository)
}

export function getNavigationViewModel(repository = getContentRepository()) {
  return createNavigationViewModel(
    requireRepositoryField(repository.navigation, 'navigation'),
    createContentCatalogViewModel(repository),
  )
}

export function getSiteSettingsViewModel(repository = getContentRepository()) {
  return createSiteSettingsViewModel(requireRepositoryField(repository.siteSettings, 'siteSettings'))
}

import type {
  ArticleDTO,
  CalculationExampleDTO,
  CaseDTO,
  KnowledgeArticleDTO,
  NavigationDTO,
  PageDTO,
  ProductDTO,
  ReviewDTO,
  SiteSettingsDTO,
  TariffDTO,
} from '@/core/content/schemas'

export type ContentRepository = {
  siteSettings?: SiteSettingsDTO
  navigation?: NavigationDTO
  products: ProductDTO[]
  pages: PageDTO[]
  tariffs: TariffDTO[]
  cases: CaseDTO[]
  reviews: ReviewDTO[]
  calculations: CalculationExampleDTO[]
  articles: ArticleDTO[]
  knowledgeArticles: KnowledgeArticleDTO[]
  getProduct(id: ProductDTO['id']): ProductDTO | undefined
  getPageByPath(path: string, locale?: PageDTO['locale']): PageDTO | undefined
  getCaseByPath(path: string, locale?: CaseDTO['locale']): CaseDTO | undefined
  getArticleByPath(path: string, locale?: ArticleDTO['locale']): ArticleDTO | undefined
  getKnowledgeArticleByPath(path: string, locale?: KnowledgeArticleDTO['locale']): KnowledgeArticleDTO | undefined
  getTariffsForProduct(productId: ProductDTO['id']): TariffDTO[]
  getCasesForProduct(productId: ProductDTO['id']): CaseDTO[]
  getReviewsForProduct(productId: ProductDTO['id']): ReviewDTO[]
  getArticlesForProduct(productId: ProductDTO['id']): ArticleDTO[]
  assertProductRef(productId: string): ProductDTO
}

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
  getSiteSettings(): Promise<SiteSettingsDTO>
  getNavigation(): Promise<NavigationDTO>
  getProducts(): Promise<ProductDTO[]>
  getPages(): Promise<PageDTO[]>
  getTariffs(): Promise<TariffDTO[]>
  getCases(): Promise<CaseDTO[]>
  getReviews(): Promise<ReviewDTO[]>
  getCalculations(): Promise<CalculationExampleDTO[]>
  getArticles(): Promise<ArticleDTO[]>
  getKnowledgeArticles(): Promise<KnowledgeArticleDTO[]>
  getProduct(id: ProductDTO['id']): Promise<ProductDTO | undefined>
  getPageByPath(path: string, locale?: PageDTO['locale']): Promise<PageDTO | undefined>
  getCaseByPath(path: string, locale?: CaseDTO['locale']): Promise<CaseDTO | undefined>
  getArticleByPath(path: string, locale?: ArticleDTO['locale']): Promise<ArticleDTO | undefined>
  getKnowledgeArticleByPath(path: string, locale?: KnowledgeArticleDTO['locale']): Promise<KnowledgeArticleDTO | undefined>
  getTariffsForProduct(productId: ProductDTO['id']): Promise<TariffDTO[]>
  getCasesForProduct(productId: ProductDTO['id']): Promise<CaseDTO[]>
  getReviewsForProduct(productId: ProductDTO['id']): Promise<ReviewDTO[]>
  getArticlesForProduct(productId: ProductDTO['id']): Promise<ArticleDTO[]>
}

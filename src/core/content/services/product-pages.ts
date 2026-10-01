import {
  productPageContent,
  type ProductPageKey,
} from '@/project/content/product-pages'

export function getProductPageContent<Key extends ProductPageKey>(key: Key) {
  return productPageContent[key]
}

export type ProductStep = { readonly title: string; readonly text: string }
export type ProductFaq = { readonly question: string; readonly answer: string }

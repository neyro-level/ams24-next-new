import { createContentRepository, type ContentRepository } from '@/core/content/repository'
import { localContent } from '@/project/content/local-content'

let repository: ContentRepository | undefined

export function getContentRepository() {
  repository ??= createContentRepository(localContent)
  return repository
}

export function resetContentRepositoryForTests() {
  repository = undefined
}

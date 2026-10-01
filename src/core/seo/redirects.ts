import type { RedirectRule } from '@/project/redirects'
import { normalizePath } from '@/core/lib/path'

export function validateRedirects(rules: RedirectRule[]) {
  const sourceToDestination = new Map<string, string>()

  for (const rule of rules) {
    const source = normalizePath(rule.source)
    const destination = normalizePath(rule.destination)

    if (source === destination) {
      throw new Error(`Redirect points to itself: ${source}`)
    }

    if (sourceToDestination.has(source)) {
      throw new Error(`Duplicate redirect source: ${source}`)
    }

    sourceToDestination.set(source, destination)
  }

  for (const [source, destination] of sourceToDestination) {
    if (sourceToDestination.has(destination)) {
      throw new Error(`Redirect chain is not allowed: ${source} -> ${destination}`)
    }
  }

  return rules.map((rule) => ({
    source: normalizePath(rule.source),
    destination: normalizePath(rule.destination),
    permanent: rule.permanent,
  }))
}

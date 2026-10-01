const canonicalSegmentPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function normalizePath(value: string): string {
  const trimmed = value.trim()

  if (!trimmed) {
    throw new Error('Canonical path must not be empty')
  }

  if (
    trimmed.includes('?') ||
    trimmed.includes('#') ||
    trimmed.includes('\\') ||
    trimmed.includes('//') ||
    /[\u0000-\u001f\u007f]/.test(trimmed)
  ) {
    throw new Error(`Canonical path is unsafe or ambiguous: ${value}`)
  }

  const normalized = trimmed.toLowerCase()

  if (normalized === '/') {
    return '/'
  }

  const withLeadingSlash = normalized.startsWith('/') ? normalized : `/${normalized}`
  const withoutTrailingSlash = withLeadingSlash.endsWith('/')
    ? withLeadingSlash.slice(0, -1)
    : withLeadingSlash
  const segments = withoutTrailingSlash.slice(1).split('/')

  if (segments.some((segment) => !canonicalSegmentPattern.test(segment))) {
    throw new Error(`Canonical path contains an unsupported segment: ${value}`)
  }

  return `${withoutTrailingSlash}/`
}

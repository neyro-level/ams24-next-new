import { describe, expect, it } from 'vitest'

import { normalizePath } from '@/core/lib/path'

describe('normalizePath', () => {
  it.each([
    ['/', '/'],
    ['impuls', '/impuls/'],
    ['/impuls', '/impuls/'],
    ['/impuls/', '/impuls/'],
    ['  /Stati/Case-One  ', '/stati/case-one/'],
  ])('normalizes %s to %s', (input, expected) => {
    expect(normalizePath(input)).toBe(expected)
  })

  it.each([
    '',
    '   ',
    '//impuls/',
    '/stati//case/',
    '/stati/../case/',
    '/stati/./case/',
    '/stati/%2e%2e/case/',
    '/stati\\case/',
    '/stati/?page=2',
    '/stati/#intro',
    'https://ams24.ru/stati/',
    '/-stati/',
    '/stati-/',
  ])('rejects unsafe or ambiguous input %j', (input) => {
    expect(() => normalizePath(input)).toThrow(/Canonical path/)
  })
})

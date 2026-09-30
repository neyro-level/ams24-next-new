import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { readFile, readdir, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

const projectRoot = process.cwd()

const forbiddenFilePatterns = [
  /(^|[/\\])middleware\.(?:js|jsx|mjs|ts|tsx)$/,
  /(^|[/\\])src[/\\]middleware\.(?:js|jsx|mjs|ts|tsx)$/,
  /(^|[/\\])proxy\.(?:js|jsx|mjs|ts|tsx)$/,
  /(^|[/\\])src[/\\]proxy\.(?:js|jsx|mjs|ts|tsx)$/,
  /(^|[/\\])app[/\\].*[/\\]route\.(?:js|ts)$/,
  /(^|[/\\])src[/\\]app[/\\].*[/\\]route\.(?:js|ts)$/,
]

const requiredNextConfigRules = [
  {
    name: 'output: export',
    pattern: /output\s*:\s*['"]export['"]/,
  },
  {
    name: 'trailingSlash: true',
    pattern: /trailingSlash\s*:\s*true/,
  },
  {
    name: 'images.unoptimized: true',
    pattern: /images\s*:\s*{[\s\S]*?unoptimized\s*:\s*true[\s\S]*?}/,
  },
]

const forbiddenNextConfigPatterns = [
  {
    name: 'runtime redirects()',
    pattern: /\bredirects\s*\(/,
  },
  {
    name: 'runtime rewrites()',
    pattern: /\brewrites\s*\(/,
  },
  {
    name: 'runtime headers()',
    pattern: /\bheaders\s*\(/,
  },
]

const forbiddenSourcePatterns = [
  {
    name: 'cookies() dynamic request API',
    pattern: /\bcookies\s*\(/,
  },
  {
    name: 'headers() dynamic request API',
    pattern: /\bheaders\s*\(/,
  },
  {
    name: 'draftMode() dynamic request API',
    pattern: /\bdraftMode\s*\(/,
  },
  {
    name: 'NextResponse runtime response API',
    pattern: /\bNextResponse\b/,
  },
  {
    name: 'Server Action directive',
    pattern: /['"]use server['"]/,
  },
  {
    name: 'dynamic runtime opt-in',
    pattern: /export\s+const\s+dynamic\s*=\s*['"]force-dynamic['"]/,
  },
  {
    name: 'runtime edge/node opt-in',
    pattern: /export\s+const\s+runtime\s*=\s*['"](?:edge|nodejs)['"]/,
  },
  {
    name: 'ISR revalidate opt-in',
    pattern: /export\s+const\s+revalidate\s*=/,
  },
  {
    name: 'dynamicParams opt-in',
    pattern: /export\s+const\s+dynamicParams\s*=\s*true/,
  },
  {
    name: 'redirect() runtime navigation API',
    pattern: /\b(?:redirect|permanentRedirect)\s*\(/,
  },
  {
    name: 'suspicious public secret variable',
    pattern: /\bNEXT_PUBLIC_[A-Z0-9_]*(?:SECRET|TOKEN|PASSWORD|API[_-]?KEY)[A-Z0-9_]*\b/i,
  },
  {
    name: 'direct frontend CRM integration URL',
    pattern: /https?:\/\/[^\s'"`]*(?:amocrm|bitrix24|kommo|retailcrm|crm)[^\s'"`]*/i,
  },
]

const sourceExtensions = new Set(['.js', '.jsx', '.mjs', '.ts', '.tsx'])
const ignoredDirectories = new Set([
  '.git',
  '.next',
  '.beads',
  'node_modules',
  'out',
])

async function exists(filePath) {
  try {
    await stat(filePath)
    return true
  } catch {
    return false
  }
}

async function walk(directory, files = []) {
  if (!(await exists(directory))) {
    return files
  }

  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        await walk(fullPath, files)
      }
      continue
    }

    files.push(fullPath)
  }

  return files
}

function toPosixRelative(root, filePath) {
  return path.relative(root, filePath).split(path.sep).join('/')
}

async function assertNextConfig(root, errors) {
  const configPath = path.join(root, 'next.config.ts')

  if (!(await exists(configPath))) {
    errors.push('next.config.ts is required for the static export contract')
    return
  }

  const config = await readFile(configPath, 'utf8')

  for (const rule of requiredNextConfigRules) {
    if (!rule.pattern.test(config)) {
      errors.push(`next.config.ts must include ${rule.name}`)
    }
  }

  for (const rule of forbiddenNextConfigPatterns) {
    if (rule.pattern.test(config)) {
      errors.push(`next.config.ts uses ${rule.name}`)
    }
  }
}

async function assertStaticSources(root, errors) {
  const files = [
    ...(await walk(path.join(root, 'app'))),
    ...(await walk(path.join(root, 'src'))),
  ]

  for (const middlewareName of [
    'middleware.js',
    'middleware.jsx',
    'middleware.mjs',
    'middleware.ts',
    'middleware.tsx',
  ]) {
    const middlewarePath = path.join(root, middlewareName)

    if (await exists(middlewarePath)) {
      files.push(middlewarePath)
    }
  }

  for (const filePath of files) {
    const relativePath = toPosixRelative(root, filePath)
    const platformPath = relativePath.replaceAll('/', path.sep)

    for (const pattern of forbiddenFilePatterns) {
      if (pattern.test(platformPath) || pattern.test(relativePath)) {
        errors.push(`${relativePath} is forbidden in the static export contract`)
      }
    }

    if (!sourceExtensions.has(path.extname(filePath))) {
      continue
    }

    const source = await readFile(filePath, 'utf8')

    for (const rule of forbiddenSourcePatterns) {
      if (rule.pattern.test(source)) {
        errors.push(`${relativePath} uses ${rule.name}`)
      }
    }
  }
}

export async function checkStaticNext(root) {
  const errors = []

  await assertNextConfig(root, errors)
  await assertStaticSources(root, errors)

  return errors
}

async function runSelfTest() {
  const fixtureRoot = mkdtempSync(path.join(tmpdir(), 'ams-static-next-guard-'))

  try {
    const writeValidNextConfig = (root) => {
      writeFileSync(
        path.join(root, 'next.config.ts'),
        [
          "import type { NextConfig } from 'next'",
          'const nextConfig: NextConfig = {',
          "  output: 'export',",
          '  trailingSlash: true,',
          '  images: { unoptimized: true },',
          '}',
          'export default nextConfig',
          '',
        ].join('\n'),
      )
    }

    const fixtures = [
      {
        name: 'valid baseline',
        setup(root) {
          mkdirSync(path.join(root, 'src', 'app'), { recursive: true })
          writeValidNextConfig(root)
          writeFileSync(path.join(root, 'src', 'app', 'page.tsx'), 'export default function Page() { return <main>ok</main> }\n')
        },
        expected: [],
      },
      {
        name: 'missing static config',
        setup(root) {
          mkdirSync(path.join(root, 'src', 'app'), { recursive: true })
          writeFileSync(
            path.join(root, 'next.config.ts'),
            [
              "import type { NextConfig } from 'next'",
              'const nextConfig: NextConfig = {}',
              'export default nextConfig',
              '',
            ].join('\n'),
          )
          writeFileSync(path.join(root, 'src', 'app', 'page.tsx'), 'export default function Page() { return <main>ok</main> }\n')
        },
        expected: ['output: export', 'trailingSlash: true', 'images.unoptimized: true'],
      },
      {
        name: 'runtime config functions',
        setup(root) {
          mkdirSync(path.join(root, 'src', 'app'), { recursive: true })
          writeFileSync(
            path.join(root, 'next.config.ts'),
            [
              "import type { NextConfig } from 'next'",
              'const nextConfig: NextConfig = {',
              "  output: 'export',",
              '  trailingSlash: true,',
              '  images: { unoptimized: true },',
              '  async redirects() { return [] },',
              '  async rewrites() { return [] },',
              '  async headers() { return [] },',
              '}',
              'export default nextConfig',
              '',
            ].join('\n'),
          )
          writeFileSync(path.join(root, 'src', 'app', 'page.tsx'), 'export default function Page() { return <main>ok</main> }\n')
        },
        expected: ['runtime redirects()', 'runtime rewrites()', 'runtime headers()'],
      },
      {
        name: 'forbidden files',
        setup(root) {
          mkdirSync(path.join(root, 'src', 'app', 'api', 'lead'), { recursive: true })
          writeValidNextConfig(root)
          writeFileSync(path.join(root, 'src', 'middleware.ts'), 'export default function middleware() {}\n')
          writeFileSync(path.join(root, 'src', 'proxy.ts'), 'export default function proxy() {}\n')
          writeFileSync(path.join(root, 'src', 'app', 'api', 'lead', 'route.ts'), 'export function GET() { return Response.json({ ok: true }) }\n')
        },
        expected: ['src/middleware.ts', 'src/proxy.ts', 'route.ts'],
      },
      {
        name: 'dynamic source APIs',
        setup(root) {
          mkdirSync(path.join(root, 'src', 'app'), { recursive: true })
          writeValidNextConfig(root)
          writeFileSync(
            path.join(root, 'src', 'app', 'page.tsx'),
            [
              "import { cookies, draftMode, headers } from 'next/headers'",
              "import { redirect, permanentRedirect } from 'next/navigation'",
              "import { NextResponse } from 'next/server'",
              'export const dynamic = "force-dynamic"',
              'export const runtime = "edge"',
              'export const revalidate = 60',
              'export const dynamicParams = true',
              "export async function action() { 'use server' }",
              'export default function Page() {',
              '  cookies()',
              '  headers()',
              '  draftMode()',
              '  redirect("/login/")',
              '  permanentRedirect("/login/")',
              '  return NextResponse.json({ ok: true })',
              '}',
              '',
            ].join('\n'),
          )
        },
        expected: [
          'cookies() dynamic request API',
          'headers() dynamic request API',
          'draftMode() dynamic request API',
          'NextResponse runtime response API',
          'Server Action directive',
          'dynamic runtime opt-in',
          'runtime edge/node opt-in',
          'ISR revalidate opt-in',
          'dynamicParams opt-in',
          'redirect() runtime navigation API',
        ],
      },
      {
        name: 'public secret and CRM URL',
        setup(root) {
          mkdirSync(path.join(root, 'src', 'app'), { recursive: true })
          writeValidNextConfig(root)
          writeFileSync(
            path.join(root, 'src', 'app', 'page.tsx'),
            [
              'const token = process.env.NEXT_PUBLIC_AMOCRM_API_TOKEN',
              "const crmUrl = 'https://example.bitrix24.ru/rest/1/secret/crm.lead.add'",
              'export default function Page() { return <main>{token}{crmUrl}</main> }',
              '',
            ].join('\n'),
          )
        },
        expected: ['suspicious public secret variable', 'direct frontend CRM integration URL'],
      },
    ]

    for (const fixture of fixtures) {
      const root = path.join(fixtureRoot, fixture.name.replaceAll(' ', '-'))
      mkdirSync(root, { recursive: true })
      fixture.setup(root)

      const errors = await checkStaticNext(root)

      if (fixture.expected.length === 0 && errors.length > 0) {
        throw new Error(`Static guard self-test valid fixture failed. Errors: ${errors.join('; ')}`)
      }

      const missing = fixture.expected.filter(
        (expected) => !errors.some((error) => error.includes(expected)),
      )

      if (missing.length > 0) {
        throw new Error(
          `Static guard self-test did not detect ${fixture.name}: ${missing.join(', ')}. Errors: ${errors.join('; ')}`,
        )
      }
    }

    console.log('Static guard self-test: PASS')
  } finally {
    rmSync(fixtureRoot, { force: true, recursive: true })
  }
}

async function main() {
  if (process.argv.includes('--self-test')) {
    await runSelfTest()
    return
  }

  const errors = await checkStaticNext(projectRoot)

  if (errors.length > 0) {
    console.error('Static Next guard: FAIL')
    for (const error of errors) {
      console.error(`- ${error}`)
    }
    process.exitCode = 1
    return
  }

  console.log('Static Next guard: PASS')
}

await main()

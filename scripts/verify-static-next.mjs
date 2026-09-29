import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { readFile, readdir, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

const projectRoot = process.cwd()

const forbiddenFilePatterns = [
  /(^|[/\\])middleware\.(?:js|jsx|mjs|ts|tsx)$/,
  /(^|[/\\])src[/\\]middleware\.(?:js|jsx|mjs|ts|tsx)$/,
  /(^|[/\\])app[/\\].*[/\\]route\.(?:js|ts)$/,
  /(^|[/\\])src[/\\]app[/\\].*[/\\]route\.(?:js|ts)$/,
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

  const required = [
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

  for (const rule of required) {
    if (!rule.pattern.test(config)) {
      errors.push(`next.config.ts must include ${rule.name}`)
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
    mkdirSync(path.join(fixtureRoot, 'src', 'app', 'api', 'lead'), {
      recursive: true,
    })

    writeFileSync(
      path.join(fixtureRoot, 'next.config.ts'),
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

    writeFileSync(
      path.join(fixtureRoot, 'src', 'app', 'page.tsx'),
      [
        "import { cookies } from 'next/headers'",
        'export default function Page() {',
        '  cookies()',
        '  return <main>invalid</main>',
        '}',
        '',
      ].join('\n'),
    )

    writeFileSync(
      path.join(fixtureRoot, 'src', 'app', 'api', 'lead', 'route.ts'),
      "export function GET() { return Response.json({ ok: true }) }\n",
    )

    const errors = await checkStaticNext(fixtureRoot)

    if (
      !errors.some((error) => error.includes('cookies()')) ||
      !errors.some((error) => error.includes('route.ts'))
    ) {
      throw new Error(
        `Static guard self-test did not detect seeded invalid fixture. Errors: ${errors.join('; ')}`,
      )
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

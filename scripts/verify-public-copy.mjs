import { existsSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const forbiddenPublicCopy = [
  ['skeleton', /\bskeleton\b/iu],
  ['representative', /\brepresentative\b/iu],
  ['target commercial page', /target commercial page/iu],
  ['editorial intent', /editorial intent/iu],
  ['Next export', /(?:static\s+)?Next export/iu],
  ['owner-decision marker', /REQUIRES_OWNER_DECISION/iu],
  ['future lead-form wording', /(?:форма|заявк\p{L}*|обращени\p{L}*)[^.!?]{0,100}будущ\p{L}*|будущ\p{L}*[^.!?]{0,100}(?:форма|заявк\p{L}*|обращени\p{L}*)/iu],
  ['placeholder wording', /заглушк\p{L}*/iu],
  ['draft marker', /(?:legal|consent)-draft-[a-z0-9-]+|чернов(?:ик|ая|ой|ого|ую)/iu],
  ['indexing implementation status', /скрыт\p{L}*[^.!?]{0,40}индексац\p{L}*/iu],
  ['internal hub role', /\b(?:editorial|support) hub\b/iu],
  ['publicationStatus', /publicationStatus/iu],
  ['proof preview', /Proof preview/iu],
  ['claim guard', /Claim guard/iu],
  ['data boundary', /Data boundary/iu],
  ['unsupported-hidden', /unsupported-hidden/iu],
  ['test lead endpoint', /\/api\/leads\/test/iu],
  ['foundation', /\bfoundation\b/iu],
  ['publication guard', /publication guard/iu],
  ['epic marker', /EPIC-\d+/iu],
  ['owner-decision id', /OD-[A-Z0-9-]+/iu],
  ['legal-review', /legal-review/iu],
  ['claim register', /claim register/iu],
  ['primary CTA', /Primary CTA/iu],
  ['lead context', /Lead context/iu],
  ['threat model', /Threat model/iu],
  ['evidence boundary', /Evidence boundary/iu],
  ['permission contract', /Permission contract/iu],
  ['evidence contract', /Evidence contract/iu],
  ['permissionState', /permissionState/iu],
  ['blockers', /\bblockers?\b/iu],
  ['public release status', /public release blocked|публичн\p{L}* релиз/iu],
]

function decodeHtml(value) {
  return value
    .replace(/&#x([0-9a-f]+);/giu, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/gu, (_, code) => String.fromCodePoint(Number.parseInt(code, 10)))
    .replace(/&nbsp;/giu, ' ')
    .replace(/&amp;/giu, '&')
    .replace(/&quot;/giu, '"')
    .replace(/&#39;|&apos;/giu, "'")
    .replace(/&lt;/giu, '<')
    .replace(/&gt;/giu, '>')
}

function normalizeText(value) {
  return decodeHtml(value).replace(/\s+/gu, ' ').trim()
}

function getAttribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'iu'))
  return match ? normalizeText(match[1] ?? match[2] ?? match[3] ?? '') : ''
}

function extractPublicSurfaces(html) {
  const surfaces = []
  for (const match of html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/giu)) {
    surfaces.push({ surface: 'title', text: normalizeText(match[1]) })
  }
  for (const match of html.matchAll(/<meta\b[^>]*>/giu)) {
    const content = getAttribute(match[0], 'content')
    if (content) surfaces.push({ surface: 'meta', text: content })
  }

  const visibleText = normalizeText(
    html
      .replace(/<!--[\s\S]*?-->/gu, ' ')
      .replace(/<(script|style|template)\b[\s\S]*?<\/\1>/giu, ' ')
      .replace(/<[^>]+>/gu, ' '),
  )
  if (visibleText) surfaces.push({ surface: 'visible text', text: visibleText })
  return surfaces
}

function scanHtml(html, file = '<fixture>') {
  const findings = []
  for (const { surface, text } of extractPublicSurfaces(html)) {
    for (const [label, pattern] of forbiddenPublicCopy) {
      const match = text.match(pattern)
      if (match) findings.push({ file, surface, label, excerpt: match[0] })
    }
  }
  return findings
}

async function listHtmlFiles(root) {
  const files = []
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const absolute = path.join(root, entry.name)
    if (entry.isDirectory()) files.push(...await listHtmlFiles(absolute))
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(absolute)
  }
  return files
}

function runSelfTest() {
  const safe = '<html><head><title>Импульс — маркетинговые продукты</title><meta name="description" content="Помогаем привлекать и защищать лиды"></head><body><script>const marker = "skeleton"</script><main>Подберите продукт под задачу</main></body></html>'
  if (scanHtml(safe).length) throw new Error('Public copy self-test rejected safe visible copy or scanned script internals.')

  const seeded = '<html><head><title>Representative skeleton</title><meta name="description" content="editorial intent"></head><body><main>Форма показывает будущий сценарий заявки. static Next export. REQUIRES_OWNER_DECISION</main></body></html>'
  const labels = new Set(scanHtml(seeded).map((finding) => finding.label))
  for (const expected of ['skeleton', 'representative', 'editorial intent', 'Next export', 'future lead-form wording', 'owner-decision marker']) {
    if (!labels.has(expected)) throw new Error(`Public copy self-test did not detect ${expected}.`)
  }
  console.log('Public copy artifact guard self-test: PASS')
}

async function main() {
  if (process.argv.includes('--self-test')) {
    runSelfTest()
    return
  }

  const outRoot = path.resolve('out')
  if (!existsSync(outRoot)) throw new Error('Public copy artifact guard requires out/. Run pnpm build first.')

  const htmlFiles = await listHtmlFiles(outRoot)
  if (!htmlFiles.length) throw new Error('Public copy artifact guard found no HTML files in out/.')

  const findings = []
  for (const file of htmlFiles) {
    findings.push(...scanHtml(await readFile(file, 'utf8'), path.relative(outRoot, file).replaceAll('\\', '/')))
  }

  if (findings.length) {
    const details = findings.map((finding) =>
      `- ${finding.file} [${finding.surface}] ${finding.label}: ${JSON.stringify(finding.excerpt)}`,
    )
    throw new Error(`Forbidden public copy found in built artifact:\n${details.join('\n')}`)
  }

  console.log(`Public copy artifact guard: PASS (${htmlFiles.length} HTML files, no public allowlist)`)
}

await main()

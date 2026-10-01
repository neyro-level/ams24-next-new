import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { gunzipSync, gzipSync } from 'node:zlib'

const extensions = new Set(['.css', '.html', '.js', '.svg', '.txt', '.xml'])

async function walk(directory) {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...(await walk(absolute)))
    else if (entry.isFile() && extensions.has(path.extname(entry.name).toLowerCase())) files.push(absolute)
  }
  return files.sort()
}

async function compress(directory) {
  const files = await walk(directory)
  for (const file of files) {
    const source = await readFile(file)
    await writeFile(`${file}.gz`, gzipSync(source, { level: 9, mtime: 0 }))
  }
  return files
}

async function selfTest() {
  const fixture = await mkdtemp(path.join(tmpdir(), 'ams24-gzip-'))
  try {
    const file = path.join(fixture, 'fixture.svg')
    await writeFile(file, '<svg><title>fixture</title></svg>\n')
    await compress(fixture)
    const first = await readFile(`${file}.gz`)
    await compress(fixture)
    const second = await readFile(`${file}.gz`)
    if (!first.equals(second) || gunzipSync(first).toString() !== '<svg><title>fixture</title></svg>\n') {
      throw new Error('deterministic gzip round-trip failed')
    }
    console.log('Precompressed asset self-test: PASS')
  } finally {
    await rm(fixture, { recursive: true, force: true })
  }
}

if (process.argv.includes('--self-test')) await selfTest()
else {
  const files = await compress(path.join(process.cwd(), 'out'))
  console.log(`Precompressed assets: PASS (${files.length} gzip files)`)
}

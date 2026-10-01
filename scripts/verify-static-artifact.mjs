import { verifyStaticArtifact } from './lib/static-artifact-verifier.mjs'

const findings = verifyStaticArtifact()

if (findings.length > 0) {
  console.error('Static artifact guard: FAIL')
  for (const finding of findings) console.error(`- ${finding}`)
  process.exit(1)
}

console.log('Static artifact guard: PASS')

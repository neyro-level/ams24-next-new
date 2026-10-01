import { buildLegalMetadata, getLegalPage } from '@/core/content/services/legal-pages'
import { LegalPage } from '@/ui/legal/legal-page'

const page = getLegalPage('policy')

export async function generateMetadata() {
  return buildLegalMetadata(page)
}

export default function PolicyPage() {
  return <LegalPage page={page} />
}

import { buildLegalMetadata } from '@/core/content/services/legal-pages'
import { LegalPage } from '@/ui/legal/legal-page'

export const metadata = buildLegalMetadata('policy')

export default function PolicyPage() {
  return <LegalPage kind="policy" />
}

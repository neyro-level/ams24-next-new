import { buildLegalMetadata } from '@/core/content/services/legal-pages'
import { LegalPage } from '@/ui/legal/legal-page'

export const metadata = buildLegalMetadata('data-processing')

export default function DataProcessingPage() {
  return <LegalPage kind="data-processing" />
}

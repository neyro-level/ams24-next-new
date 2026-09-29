import { buildLegalMetadata, LegalPage } from '@/ui/legal/legal-page'

export const metadata = buildLegalMetadata('consent')

export default function ConsentPage() {
  return <LegalPage kind="consent" />
}

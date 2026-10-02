'use client'

import { useEffect, useState } from 'react'

export const errorBoundaryProbeEvent = 'ams24:error-boundary-probe'

export function ErrorBoundaryProbe() {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const fail = () => setFailed(true)
    window.addEventListener(errorBoundaryProbeEvent, fail)
    return () => window.removeEventListener(errorBoundaryProbeEvent, fail)
  }, [])

  if (failed) throw new Error('Deterministic client error-boundary probe')
  return null
}

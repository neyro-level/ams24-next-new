'use client'

import { useEffect } from 'react'

import { leadFormLifecycleEventName } from '@/core/leads'

import { dispatchLeadFormAnalytics } from './lead-form-analytics'

export function AnalyticsBridge() {
  useEffect(() => {
    const handleLeadFormLifecycle = (event: Event) => {
      if (!(event instanceof CustomEvent)) return
      dispatchLeadFormAnalytics(event.detail)
    }

    window.addEventListener(leadFormLifecycleEventName, handleLeadFormLifecycle)
    return () => window.removeEventListener(leadFormLifecycleEventName, handleLeadFormLifecycle)
  }, [])

  return null
}

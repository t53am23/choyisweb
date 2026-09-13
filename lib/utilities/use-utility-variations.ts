"use client"

import * as React from "react"
import { getUtilityVariations, type UtilityVariation } from "@/lib/utilities/vtpass"

export function useUtilityVariations(serviceId: string) {
  const [requestVersion, retry] = React.useReducer((version) => version + 1, 0)
  const requestKey = `${serviceId}:${requestVersion}`
  const [result, setResult] = React.useState<{
    key: string
    variations: UtilityVariation[]
    error: string
  }>({ key: "", variations: [], error: "" })

  React.useEffect(() => {
    const controller = new AbortController()

    getUtilityVariations(serviceId, controller.signal)
      .then((variations) => setResult({ key: requestKey, variations, error: "" }))
      .catch((reason: unknown) => {
        if (controller.signal.aborted) return
        setResult({
          key: requestKey,
          variations: [],
          error: reason instanceof Error ? reason.message : "Could not load live plans.",
        })
      })

    return () => controller.abort()
  }, [requestKey, serviceId])

  const isCurrentRequest = result.key === requestKey

  return {
    variations: isCurrentRequest ? result.variations : [],
    loading: !isCurrentRequest,
    error: isCurrentRequest ? result.error : "",
    retry,
  }
}

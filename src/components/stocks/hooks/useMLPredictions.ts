// hooks/useMLPredictions.ts - CLEAN VERSION
import { useState, useEffect, useCallback } from 'react'
import { EarningsOnly, MLPredictions } from '../../../types/mlPredictions'
import mlPredictionsApi from '@/features/tools/stocks/utils/mlPredictionsApi'
import { useMLPredictionsCache } from './useMLPredictionsCache'


export interface UseMLPredictionsOptions {
  enableCache?: boolean
  onError?: (error: string) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSuccess?: (data: any) => void
}

// ================================
// MAIN HOOK (CLEAN & SIMPLE)
// ================================

export function useMLPredictions(
  symbol: string | null,
  showFullAnalysis: boolean = true,
  options: UseMLPredictionsOptions = {}
) {
  const { enableCache = true, onError, onSuccess } = options

  // State
  const [data, setData] = useState<MLPredictions | null>(null)
  const [earningsOnly, setEarningsOnly] = useState<EarningsOnly | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cache hook
  const { getCachedData, setCachedData, clearCache: clearCacheInternal } = useMLPredictionsCache(enableCache)

  // Fetch function
  const fetchPredictions = useCallback(async (forceRefresh: boolean = false) => {
    if (!symbol) {
      setData(null)
      setEarningsOnly(null)
      setError(null)
      return
    }

    // Check cache first
    if (!forceRefresh && enableCache) {
      const cached = getCachedData(symbol, showFullAnalysis)
      if (cached) {
        setEarningsOnly(cached.earnings)
        if (cached.full) setData(cached.full)
        return
      }
    }

    setLoading(true)
    setError(null)

    try {
      const result = await mlPredictionsApi.fetchPredictions(symbol, showFullAnalysis)

      setEarningsOnly(result.earnings)
      if (result.full) setData(result.full)

      if (enableCache) {
        setCachedData(symbol, showFullAnalysis, result)
      }

      onSuccess?.(result)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [symbol, showFullAnalysis, enableCache, getCachedData, setCachedData, onError, onSuccess])

  // Effects
  useEffect(() => {
    fetchPredictions(false)
  }, [fetchPredictions])

  // Actions
  const refetch = useCallback(() => fetchPredictions(true), [fetchPredictions])
  const clearCache = useCallback(() => clearCacheInternal(), [clearCacheInternal])

  // Computed values
  const hasData = Boolean(data || earningsOnly)
  const confidence = data?.earnings?.nextQuarter?.confidence || earningsOnly?.confidence || 0
  const sectorInfo = data?.sector ? {
    name: data.sector,
    performance: data.marketContext?.sectorPerformance || 0,
    pe: data.marketContext?.sectorPE || 0
  } : null

  return {
    // Data
    data,
    earningsOnly,

    // State
    loading,
    error,

    // Computed
    hasData,
    hasFullData: Boolean(data),
    confidence,
    sectorInfo,

    // Actions
    refetch,
    clearCache,

    // Utilities
    isLoading: loading,
    isError: Boolean(error),
    isSuccess: hasData && !error,
    isEmpty: !hasData && !loading && !error
  }
}

// hooks/useMLPredictionsBatch.ts - FIXED
import { useCallback, useState, useEffect } from "react"
import { EarningsOnly } from "../../../types/mlPredictions"
import mlPredictionsApi from "../../../utils/mlPredictionsApi"


export interface UseMLPredictionsBatchOptions {
  maxConcurrent?: number
  enableCache?: boolean
  onProgress?: (completed: number, total: number) => void
  onError?: (symbol: string, error: string) => void
}

interface BatchResult {
  [symbol: string]: EarningsOnly
}

interface BatchErrors {
  [symbol: string]: string
}

export function useMLPredictionsBatch(
  symbols: string[],
  options: UseMLPredictionsBatchOptions = {}
) {
  const {
    maxConcurrent = 5,
    // enableCache = true,
    onProgress,
    onError
  } = options

  const [results, setResults] = useState<BatchResult>({})
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<BatchErrors>({})
  const [progress, setProgress] = useState({ completed: 0, total: 0 })

  const fetchBatch = useCallback(async () => {
    if (!symbols.length) return

    setLoading(true)
    setResults({})
    setErrors({})
    setProgress({ completed: 0, total: symbols.length })

    const newResults: BatchResult = {}
    const newErrors: BatchErrors = {}
    let completed = 0

    // Process symbols in batches
    for (let i = 0; i < symbols.length; i += maxConcurrent) {
      const batch = symbols.slice(i, i + maxConcurrent)

      const batchPromises = batch.map(async (symbol) => {
        try {
          const result = await mlPredictionsApi.fetchEarningsOnly(symbol)
          newResults[symbol] = result

          completed++
          setProgress({ completed, total: symbols.length })
          onProgress?.(completed, symbols.length)

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          newErrors[symbol] = errorMessage
          onError?.(symbol, errorMessage)

          completed++
          setProgress({ completed, total: symbols.length })
          onProgress?.(completed, symbols.length)
        }
      })

      await Promise.allSettled(batchPromises)

      // Update state after each batch
      setResults(prev => ({ ...prev, ...newResults }))
      setErrors(prev => ({ ...prev, ...newErrors }))

      // Small delay between batches to avoid overwhelming the API
      if (i + maxConcurrent < symbols.length) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }

    setLoading(false)
  }, [symbols, maxConcurrent, onProgress, onError])

  useEffect(() => {
    fetchBatch()
  }, [fetchBatch])

  // Get successful results only
  const successfulResults = Object.entries(results).reduce((acc, [symbol, data]) => {
    if (!errors[symbol]) {
      acc[symbol] = data
    }
    return acc
  }, {} as BatchResult)

  // Get results with status
  const resultsWithStatus = symbols.map(symbol => ({
    symbol,
    data: results[symbol] || null,
    error: errors[symbol] || null,
    status: errors[symbol] ? 'error' : results[symbol] ? 'success' : 'pending'
  }))

  return {
    // Data
    results,
    errors,
    successfulResults,
    resultsWithStatus,

    // State
    loading,
    progress,

    // Stats
    successCount: Object.keys(successfulResults).length,
    errorCount: Object.keys(errors).length,
    totalCount: symbols.length,
    completionRate: symbols.length > 0 ? (progress.completed / symbols.length) * 100 : 0,

    // Actions
    refetch: fetchBatch,

    // Utilities
    isComplete: progress.completed === symbols.length,
    hasErrors: Object.keys(errors).length > 0,
    hasResults: Object.keys(results).length > 0
  }
}

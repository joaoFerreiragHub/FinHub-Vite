// hooks/useMLPredictionsEnhanced.ts - COMPOSITOR
import { useMLPredictions, UseMLPredictionsOptions } from './useMLPredictions'
import { useMLPredictionsCache } from './useMLPredictionsCache'
import { useMLPredictionsRealTime } from './useMLPredictionsRealtime'

import React from 'react'

interface UseMLPredictionsEnhancedOptions extends UseMLPredictionsOptions {
  enableRealtime?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
}

/**
 * Enhanced ML Predictions hook that combines:
 * - Basic predictions (useMLPredictions)
 * - Real-time updates (useMLPredictionsRealTime)
 * - Advanced caching (useMLPredictionsCache)
 * - Auto-refresh capabilities
 */
export function useMLPredictionsEnhanced(
  symbol: string | null,
  showFullAnalysis: boolean = true,
  options: UseMLPredictionsEnhancedOptions = {}
) {
  const {
    enableRealtime = false,
    autoRefresh = false,
    refreshInterval = 300000, // 5 minutes
    ...baseOptions
  } = options

  // Base predictions hook
  const predictions = useMLPredictions(symbol, showFullAnalysis, baseOptions)

  // Real-time updates (optional)
  const realtime = useMLPredictionsRealTime(
    enableRealtime && symbol ? symbol : '',
    {
      autoReconnect: enableRealtime,
      onConnect: () => console.log(`🔗 Real-time connected for ${symbol}`),
      onError: (error) => console.error('Real-time error:', error)
    }
  )

  // Cache utilities
  const cache = useMLPredictionsCache(baseOptions.enableCache !== false)

  // Auto-refresh setup
  React.useEffect(() => {
    if (!autoRefresh || !symbol || predictions.loading) return

    const interval = setInterval(() => {
      predictions.refetch()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, symbol, predictions.loading, predictions.refetch, refreshInterval])

  // Merge real-time data with cached data
  const mergedData = React.useMemo(() => {
    if (enableRealtime && realtime.realtimeData) {
      return {
        ...predictions.data,
        ...realtime.realtimeData.data,
        isRealtime: true,
        lastRealtimeUpdate: realtime.lastUpdate
      }
    }
    return predictions.data
  }, [predictions.data, realtime.realtimeData, realtime.lastUpdate, enableRealtime])

  return {
    // Core data (enhanced with real-time)
    ...predictions,
    data: mergedData,

    // Real-time features
    realtime: {
      enabled: enableRealtime,
      connected: realtime.connected,
      lastUpdate: realtime.lastUpdate,
      connectionStatus: realtime.connectionStatus,
      reconnect: realtime.reconnect
    },

    // Cache features
    cache: {
      stats: cache.getCacheStats(),
      clearAll: cache.clearCache,
      clearSymbol: () => symbol && cache.clearSymbolCache(symbol),
      cleanup: cache.cleanupExpired
    },

    // Enhanced utilities
    isEnhanced: true,
    features: {
      realtime: enableRealtime,
      autoRefresh,
      cache: baseOptions.enableCache !== false
    }
  }
}

export default useMLPredictionsEnhanced

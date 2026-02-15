// src/features/hub/news/stores/useNewsAutoRefresh.ts
import { useEffect, useRef, useCallback } from 'react'
import { useNewsSelectors, useNewsStore } from '~/features/hub/news/stores/useNewsStore'

interface UseNewsAutoRefreshOptions {
  enabled?: boolean
  interval?: number
  onlyWhenVisible?: boolean
  pauseOnError?: boolean
  maxRetries?: number
}

/**
 * Hook especializado para controlo automático de refresh das notícias
 * Gere intervalos, visibilidade da página, e retry logic
 */
export const useNewsAutoRefresh = (options: UseNewsAutoRefreshOptions = {}) => {
  const {
    enabled = true,
    interval = 10 * 60 * 1000, // 10 minutos por default
    onlyWhenVisible = true,
    pauseOnError = true,
    maxRetries = 3,
  } = options

  // === STORE STATE ===
  const { loadNews, setAutoRefresh, setRefreshInterval, autoRefresh, refreshInterval } =
    useNewsStore()

  const { needsRefresh, hasError, isLoading } = useNewsSelectors()

  // === REFS para controlo interno ===
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const retryCountRef = useRef(0)
  const isVisibleRef = useRef(true)

  // === RESET RETRY COUNTER quando tudo corre bem ===
  useEffect(() => {
    if (!hasError && !isLoading) {
      retryCountRef.current = 0
    }
  }, [hasError, isLoading])

  // === FUNÇÃO DE REFRESH com retry logic ===
  const performRefresh = useCallback(async () => {
    // Não fazer refresh se estiver a carregar ou se atingiu max retries
    if (isLoading || (pauseOnError && hasError && retryCountRef.current >= maxRetries)) {
      console.log('🔄 Auto-refresh: skipped (loading ou max retries)')
      return
    }

    // Não fazer refresh se a página não estiver visível
    if (onlyWhenVisible && !isVisibleRef.current) {
      console.log('🔄 Auto-refresh: skipped (página não visível)')
      return
    }

    try {
      console.log('🔄 Auto-refresh: executando...')
      await loadNews(true)
      retryCountRef.current = 0 // Reset counter em caso de sucesso
    } catch (error) {
      retryCountRef.current += 1
      console.error(
        `❌ Auto-refresh falhou (tentativa ${retryCountRef.current}/${maxRetries}):`,
        error,
      )
    }
  }, [isLoading, hasError, pauseOnError, maxRetries, onlyWhenVisible, loadNews])

  // === CONFIGURAR INTERVAL ===
  const startInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    if (enabled && interval > 0) {
      console.log(`🔄 Auto-refresh: iniciado com intervalo de ${interval}ms`)
      intervalRef.current = setInterval(performRefresh, interval)
    }
  }, [enabled, interval, performRefresh])

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
      console.log('🔄 Auto-refresh: parado')
    }
  }, [])

  // === CONFIGURAR AUTO-REFRESH no store ===
  useEffect(() => {
    setAutoRefresh(enabled)
    setRefreshInterval(interval)
  }, [enabled, interval, setAutoRefresh, setRefreshInterval])

  // === GERIR INTERVAL ===
  useEffect(() => {
    if (enabled) {
      startInterval()
    } else {
      stopInterval()
    }

    return () => stopInterval()
  }, [enabled, startInterval, stopInterval])

  // === VISIBILITY CHANGE HANDLER ===
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden

      if (!document.hidden) {
        console.log('👁️ Página voltou a ser visível')

        // Se precisar de refresh, fazer imediatamente
        if (needsRefresh) {
          performRefresh()
        }

        // Reiniciar interval se estiver ativo
        if (enabled) {
          startInterval()
        }
      } else {
        console.log('👁️ Página ficou oculta')

        // Parar interval quando página não está visível (se configurado)
        if (onlyWhenVisible) {
          stopInterval()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [needsRefresh, performRefresh, enabled, startInterval, stopInterval, onlyWhenVisible])

  // === FORÇA REFRESH se há erro e ainda não atingiu max retries ===
  useEffect(() => {
    if (hasError && enabled && retryCountRef.current < maxRetries && !pauseOnError) {
      const retryTimeout = setTimeout(() => {
        console.log(`🔄 Retry automático após erro (${retryCountRef.current + 1}/${maxRetries})`)
        performRefresh()
      }, 5000) // Retry após 5 segundos

      return () => clearTimeout(retryTimeout)
    }
  }, [hasError, enabled, maxRetries, pauseOnError, performRefresh])

  // === CLEANUP ao desmontar ===
  useEffect(() => {
    return () => {
      stopInterval()
    }
  }, [stopInterval])

  // === RETORNO DO HOOK ===
  return {
    // Estado
    isEnabled: enabled && autoRefresh,
    currentInterval: refreshInterval,
    isVisible: isVisibleRef.current,
    retryCount: retryCountRef.current,
    maxRetries,
    hasReachedMaxRetries: retryCountRef.current >= maxRetries,

    // Controlo manual
    start: startInterval,
    stop: stopInterval,
    forceRefresh: performRefresh,
    resetRetries: () => {
      retryCountRef.current = 0
    },

    // Configuração dinâmica
    updateInterval: (newInterval: number) => {
      setRefreshInterval(newInterval)
    },

    toggle: () => {
      setAutoRefresh(!autoRefresh)
    },

    // Status informativos
    nextRefreshIn: intervalRef.current ? interval : null,
    isRunning: !!intervalRef.current,
    canRetry: retryCountRef.current < maxRetries,
  }
}

export default useNewsAutoRefresh

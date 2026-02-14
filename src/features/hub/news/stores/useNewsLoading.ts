// src/stores/news/useNewsLoading.ts - Store de Estados de Loading

import { create } from 'zustand'

// ===== INTERFACES =====
export interface LoadingStates {
  initial: boolean // Carregamento inicial (primeiras notícias)
  loadingMore: boolean // Carregando mais notícias (incremental)
  refresh: boolean // Refresh manual/automático
  filter: boolean // Aplicando filtros
}

export interface ErrorState {
  message: string | null
  code?: string
  timestamp?: string
  retryable?: boolean
  source?: 'api' | 'network' | 'validation' | 'unknown'
}

// Interface do store
interface NewsLoadingStore {
  // === ESTADO ===
  loading: LoadingStates
  error: ErrorState
  lastLoadTime: string | null
  loadingProgress: number // 0-100 para progress bars

  // === LOADING ACTIONS ===
  setInitialLoading: (loading: boolean) => void
  setLoadingMore: (loading: boolean) => void
  setRefreshLoading: (loading: boolean) => void
  setFilterLoading: (loading: boolean) => void

  // === GENERIC LOADING ACTIONS ===
  setLoading: (type: keyof LoadingStates, loading: boolean) => void
  setMultipleLoading: (states: Partial<LoadingStates>) => void
  clearAllLoading: () => void

  // === ERROR ACTIONS ===
  setError: (error: string | ErrorState) => void
  clearError: () => void
  setRetryableError: (message: string, source?: ErrorState['source']) => void
  setFatalError: (message: string, source?: ErrorState['source']) => void

  // === PROGRESS ACTIONS ===
  setProgress: (progress: number) => void
  incrementProgress: (amount: number) => void
  resetProgress: () => void

  // === COMPUTED GETTERS ===
  isAnyLoading: () => boolean
  getLoadingMessage: () => string
  canPerformAction: (action: 'loadMore' | 'refresh' | 'filter') => boolean
  getLoadingType: () => keyof LoadingStates | null

  // === UTILITIES ===
  updateLastLoadTime: () => void
  getTimeSinceLastLoad: () => number
  shouldShowProgress: () => boolean
}

// ===== CONSTANTS =====
const initialLoadingStates: LoadingStates = {
  initial: false,
  loadingMore: false,
  refresh: false,
  filter: false,
}

const initialErrorState: ErrorState = {
  message: null,
  code: undefined,
  timestamp: undefined,
  retryable: undefined,
  source: undefined,
}

// ===== HELPERS =====
const createErrorState = (
  message: string,
  options: Partial<Omit<ErrorState, 'message'>> = {},
): ErrorState => ({
  message,
  timestamp: new Date().toISOString(),
  retryable: true,
  source: 'unknown',
  ...options,
})

const getLoadingMessage = (loading: LoadingStates): string => {
  if (loading.initial) return 'Carregando notícias...'
  if (loading.refresh) return 'Atualizando notícias...'
  if (loading.loadingMore) return 'Carregando mais notícias...'
  if (loading.filter) return 'Aplicando filtros...'
  return 'Processando...'
}

const getActiveLoadingType = (loading: LoadingStates): keyof LoadingStates | null => {
  const activeTypes = Object.entries(loading).filter(([, isLoading]) => isLoading)
  return activeTypes.length > 0 ? (activeTypes[0][0] as keyof LoadingStates) : null
}

const isAnyLoadingActive = (loading: LoadingStates): boolean => {
  return Object.values(loading).some(Boolean)
}

// ===== STORE PRINCIPAL =====
export const useNewsLoading = create<NewsLoadingStore>((set, get) => ({
  // === ESTADO INICIAL ===
  loading: initialLoadingStates,
  error: initialErrorState,
  lastLoadTime: null,
  loadingProgress: 0,

  // === LOADING ACTIONS ESPECÍFICAS ===
  setInitialLoading: (loading: boolean) => {
    console.log(`🔄 [Loading] Initial loading: ${loading}`)
    set((state) => ({
      loading: { ...state.loading, initial: loading },
      // Limpar outros loadings quando inicia o loading inicial
      ...(loading && {
        loading: { ...initialLoadingStates, initial: true },
        error: initialErrorState,
        loadingProgress: loading ? 0 : state.loadingProgress,
      }),
    }))
  },

  setLoadingMore: (loading: boolean) => {
    console.log(`➕ [Loading] Loading more: ${loading}`)
    set((state) => ({
      loading: { ...state.loading, loadingMore: loading },
      ...(loading && { error: initialErrorState }),
    }))
  },

  setRefreshLoading: (loading: boolean) => {
    console.log(`🔄 [Loading] Refresh loading: ${loading}`)
    set((state) => ({
      loading: { ...state.loading, refresh: loading },
      ...(loading && {
        error: initialErrorState,
        loadingProgress: 0,
      }),
    }))
  },

  setFilterLoading: (loading: boolean) => {
    console.log(`🔍 [Loading] Filter loading: ${loading}`)
    set((state) => ({
      loading: { ...state.loading, filter: loading },
      ...(loading && { error: initialErrorState }),
    }))
  },

  // === LOADING ACTIONS GENÉRICAS ===
  setLoading: (type: keyof LoadingStates, loading: boolean) => {
    console.log(`⚙️ [Loading] Setting ${type}: ${loading}`)
    set((state) => ({
      loading: { ...state.loading, [type]: loading },
      ...(loading && { error: initialErrorState }),
    }))
  },

  setMultipleLoading: (states: Partial<LoadingStates>) => {
    console.log(`⚙️ [Loading] Setting multiple:`, states)
    set((state) => ({
      loading: { ...state.loading, ...states },
      error: initialErrorState,
    }))
  },

  clearAllLoading: () => {
    console.log(`🧹 [Loading] Clearing all loading states`)
    set({
      loading: initialLoadingStates,
      loadingProgress: 0,
    })
  },

  // === ERROR ACTIONS ===
  setError: (error: string | ErrorState) => {
    const errorState =
      typeof error === 'string'
        ? createErrorState(error)
        : { ...error, timestamp: new Date().toISOString() }

    console.error(`❌ [Loading] Error set:`, errorState.message)
    set({
      error: errorState,
      loading: initialLoadingStates, // Limpar todos os loadings em caso de erro
      loadingProgress: 0,
    })
  },

  clearError: () => {
    console.log(`🧹 [Loading] Clearing error`)
    set({ error: initialErrorState })
  },

  setRetryableError: (message: string, source: ErrorState['source'] = 'api') => {
    get().setError(createErrorState(message, { retryable: true, source }))
  },

  setFatalError: (message: string, source: ErrorState['source'] = 'api') => {
    get().setError(createErrorState(message, { retryable: false, source }))
  },

  // === PROGRESS ACTIONS ===
  setProgress: (progress: number) => {
    const clampedProgress = Math.max(0, Math.min(100, progress))
    set({ loadingProgress: clampedProgress })
  },

  incrementProgress: (amount: number) => {
    const state = get()
    const newProgress = Math.min(100, state.loadingProgress + amount)
    set({ loadingProgress: newProgress })
  },

  resetProgress: () => {
    set({ loadingProgress: 0 })
  },

  // === COMPUTED GETTERS ===
  isAnyLoading: () => {
    const state = get()
    return isAnyLoadingActive(state.loading)
  },

  getLoadingMessage: () => {
    const state = get()
    return getLoadingMessage(state.loading)
  },

  canPerformAction: (action: 'loadMore' | 'refresh' | 'filter') => {
    const state = get()
    const { loading } = state

    switch (action) {
      case 'loadMore':
        // Pode carregar mais se não estiver carregando inicialmente ou fazendo refresh
        return !loading.initial && !loading.refresh && !loading.loadingMore

      case 'refresh':
        // Pode fazer refresh se não estiver fazendo nenhum outro carregamento
        return !isAnyLoadingActive(loading)

      case 'filter':
        // Pode filtrar se não estiver carregando inicialmente
        return !loading.initial && !loading.filter

      default:
        return false
    }
  },

  getLoadingType: () => {
    const state = get()
    return getActiveLoadingType(state.loading)
  },

  // === UTILITIES ===
  updateLastLoadTime: () => {
    set({ lastLoadTime: new Date().toISOString() })
  },

  getTimeSinceLastLoad: () => {
    const state = get()
    if (!state.lastLoadTime) return Infinity
    return Date.now() - new Date(state.lastLoadTime).getTime()
  },

  shouldShowProgress: () => {
    const state = get()
    return state.loadingProgress > 0 && state.loadingProgress < 100 && get().isAnyLoading()
  },
}))

// ===== HOOKS ESPECIALIZADOS =====

/**
 * Hook para controle básico de loading
 */
export const useLoadingControl = () => {
  const store = useNewsLoading()

  return {
    // Estados
    loading: store.loading,
    isLoading: store.isAnyLoading(),
    error: store.error,

    // Actions
    setInitialLoading: store.setInitialLoading,
    setLoadingMore: store.setLoadingMore,
    setRefreshLoading: store.setRefreshLoading,
    clearAllLoading: store.clearAllLoading,

    // Error handling
    setError: store.setError,
    clearError: store.clearError,

    // Utilities
    loadingMessage: store.getLoadingMessage(),
    canLoadMore: store.canPerformAction('loadMore'),
    canRefresh: store.canPerformAction('refresh'),
  }
}

/**
 * Hook para gestão de progresso
 */
export const useLoadingProgress = () => {
  const { loadingProgress, setProgress, incrementProgress, resetProgress, shouldShowProgress } =
    useNewsLoading()

  return {
    progress: loadingProgress,
    setProgress,
    incrementProgress,
    resetProgress,
    shouldShow: shouldShowProgress(),

    // Helper para simular progresso automático
    simulateProgress: (duration: number = 3000) => {
      resetProgress()
      const steps = 20
      const increment = 100 / steps
      const interval = duration / steps

      let currentStep = 0
      const timer = setInterval(() => {
        currentStep++
        incrementProgress(increment)

        if (currentStep >= steps) {
          clearInterval(timer)
        }
      }, interval)

      return () => clearInterval(timer)
    },
  }
}

/**
 * Hook para gestão de erros
 */
export const useErrorHandling = () => {
  const { error, clearError, setRetryableError, setFatalError } = useNewsLoading()

  const handleApiError = (error: unknown, context?: string) => {
    console.error(`[Error] ${context || 'API Error'}:`, error)

    if (error instanceof Error) {
      if (error.message.includes('rate limit') || error.message.includes('429')) {
        setRetryableError(`Limite de requisições atingido. ${context || ''}`, 'api')
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        setRetryableError(`Erro de conexão. ${context || ''}`, 'network')
      } else {
        setRetryableError(error.message, 'api')
      }
    } else {
      setRetryableError(`Erro desconhecido. ${context || ''}`, 'unknown')
    }
  }

  const handleValidationError = (message: string) => {
    setFatalError(message, 'validation')
  }

  return {
    error,
    hasError: !!error.message,
    isRetryable: error.retryable,
    errorSource: error.source,

    // Actions
    clearError,
    handleApiError,
    handleValidationError,
    setRetryableError,
    setFatalError,

    // Computed
    errorAge: error.timestamp
      ? Math.floor((Date.now() - new Date(error.timestamp).getTime()) / 1000)
      : 0,
  }
}

/**
 * Hook para coordenação de loading states
 */
export const useLoadingCoordinator = () => {
  const store = useNewsLoading()

  const startOperation = async (
    type: keyof LoadingStates,
    operation: () => Promise<void>,
    showProgress: boolean = false,
  ) => {
    try {
      store.setLoading(type, true)
      store.clearError()

      if (showProgress) {
        store.resetProgress()
        store.incrementProgress(10)
      }

      await operation()

      if (showProgress) {
        store.setProgress(100)
        setTimeout(() => store.resetProgress(), 500)
      }

      store.updateLastLoadTime()
    } catch (error) {
      console.error(`Operation ${type} failed:`, error)
      if (error instanceof Error) {
        store.setError(error.message)
      }
    } finally {
      store.setLoading(type, false)
    }
  }

  return {
    // Estados
    isAnyLoading: store.isAnyLoading(),
    activeLoadingType: store.getLoadingType(),
    timeSinceLastLoad: store.getTimeSinceLastLoad(),

    // Operações coordenadas
    startOperation,

    // Quick operations
    withInitialLoading: (operation: () => Promise<void>) =>
      startOperation('initial', operation, true),

    withLoadMore: (operation: () => Promise<void>) => startOperation('loadingMore', operation),

    withRefresh: (operation: () => Promise<void>) => startOperation('refresh', operation, true),

    withFilter: (operation: () => Promise<void>) => startOperation('filter', operation),
  }
}

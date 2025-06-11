// hooks/useMLPredictionsRealtime.ts - FIXED
import { useEffect, useRef, useState, useCallback } from "react"
import { EarningsOnly, MLPredictions } from "../../../types/mlPredictions"


interface RealtimeData {
  type: 'earnings' | 'full' | 'update'
  data: EarningsOnly | MLPredictions
  timestamp: string
}

interface UseMLPredictionsRealtimeOptions {
  autoReconnect?: boolean
  reconnectDelay?: number
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error: Event) => void
}

export function useMLPredictionsRealTime(
  symbol: string,
  options: UseMLPredictionsRealtimeOptions = {}
) {
  const {
    autoReconnect = true,
    reconnectDelay = 5000,
    onConnect,
    onDisconnect,
    onError
  } = options

  const [realtimeData, setRealtimeData] = useState<RealtimeData | null>(null)
  const [connected, setConnected] = useState(false)
  const [connectionAttempts, setConnectionAttempts] = useState(0)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const connect = useCallback(() => {
    if (!symbol || wsRef.current?.readyState === WebSocket.OPEN) return

    try {
      const wsUrl = `${process.env.REACT_APP_WS_URL}/ml/predictions/${symbol}`
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        setConnected(true)
        setConnectionAttempts(0)
        console.log(`🔗 Connected to ML predictions stream for ${symbol}`)
        onConnect?.()
      }

      ws.onmessage = (event) => {
        try {
          const data: RealtimeData = JSON.parse(event.data)
          setRealtimeData(data)
          setLastUpdate(data.timestamp)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      ws.onclose = (event) => {
        setConnected(false)
        console.log(`🔌 Disconnected from ML predictions stream for ${symbol}`)
        onDisconnect?.()

        // Auto-reconnect if enabled and not a manual close
        if (autoReconnect && !event.wasClean) {
          setConnectionAttempts(prev => prev + 1)
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, reconnectDelay)
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setConnected(false)
        onError?.(error)
      }

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
      setConnected(false)
    }
  }, [symbol, autoReconnect, reconnectDelay, onConnect, onDisconnect, onError])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect')
      wsRef.current = null
    }

    setConnected(false)
  }, [])

  const reconnect = useCallback(() => {
    disconnect()
    setTimeout(connect, 100)
  }, [disconnect, connect])

  useEffect(() => {
    if (symbol) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [symbol, connect, disconnect])

  return {
    // Data
    realtimeData,
    lastUpdate,

    // Connection state
    connected,
    connectionAttempts,

    // Actions
    connect,
    disconnect,
    reconnect,

    // Utilities
    isConnected: connected,
    hasData: Boolean(realtimeData),
    connectionStatus: connected ? 'connected' :
                    connectionAttempts > 0 ? 'reconnecting' : 'disconnected'
  }
}

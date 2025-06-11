// utils/mlPredictionsApi.ts - SIMPLE VERSION
import type { MLPredictions, EarningsOnly, MLPredictionsApiResponse } from '../types/mlPredictions'

// ================================
// SIMPLE API CLIENT
// ================================

const API_BASE = '/api'  // localhost:3000/api

// Simple fetch wrapper with error handling
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function apiFetch(url: string): Promise<any> {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      const message = response.status === 404
        ? 'Previsões não encontradas para este símbolo'
        : `Erro na API: ${response.status}`
      throw new Error(message)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Erro desconhecido na API')
  }
}

// ================================
// API FUNCTIONS
// ================================

// Fetch earnings only
export async function fetchEarningsOnly(symbol: string): Promise<EarningsOnly> {
  if (!symbol) throw new Error('Símbolo é obrigatório')

  const url = `${API_BASE}/ml/earnings/${symbol.toUpperCase()}`
  const data = await apiFetch(url)

  // Basic validation
  if (!data.symbol) {
    throw new Error('Resposta inválida da API')
  }

  return data
}

// Fetch full predictions
export async function fetchFullPredictions(symbol: string): Promise<MLPredictions> {
  if (!symbol) throw new Error('Símbolo é obrigatório')

  const url = `${API_BASE}/ml/predictions/${symbol.toUpperCase()}`
  const data = await apiFetch(url)

  // Basic validation
  if (!data.symbol || !data.earnings) {
    throw new Error('Resposta inválida da API')
  }

  return data
}

// Fetch both (earnings + optional full)
export async function fetchPredictions(
  symbol: string,
  includeFullAnalysis: boolean = false
): Promise<MLPredictionsApiResponse> {

  if (includeFullAnalysis) {
    // Fetch both in parallel
    const [earnings, full] = await Promise.all([
      fetchEarningsOnly(symbol),
      fetchFullPredictions(symbol)
    ])
    return { earnings, full }
  } else {
    // Fetch only earnings
    const earnings = await fetchEarningsOnly(symbol)
    return { earnings }
  }
}

// ================================
// DEFAULT EXPORT
// ================================

export const mlPredictionsApi = {
  fetchEarningsOnly,
  fetchFullPredictions,
  fetchPredictions
}

export default mlPredictionsApi

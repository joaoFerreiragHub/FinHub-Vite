import { apiClient } from '@/lib/api/client'
import type {
  CreateFireHoldingInput,
  CreateFirePortfolioInput,
  DeleteFireEntityResult,
  FirePortfolioDetail,
  FirePortfolioListQuery,
  FirePortfolioListResponse,
  FireSimulationInput,
  FireSimulationResult,
  UpdateFireHoldingInput,
  UpdateFirePortfolioInput,
} from '../types/firePortfolio'

const FIRE_PORTFOLIO_BASE_PATH = '/portfolio'

export const firePortfolioService = {
  async listPortfolios(query: FirePortfolioListQuery = {}): Promise<FirePortfolioListResponse> {
    const response = await apiClient.get<FirePortfolioListResponse>(FIRE_PORTFOLIO_BASE_PATH, {
      params: {
        page: query.page,
        limit: query.limit,
      },
    })
    return response.data
  },

  async createPortfolio(payload: CreateFirePortfolioInput) {
    const response = await apiClient.post(FIRE_PORTFOLIO_BASE_PATH, payload)
    return response.data as FirePortfolioDetail
  },

  async getPortfolio(portfolioId: string) {
    const response = await apiClient.get<FirePortfolioDetail>(
      `${FIRE_PORTFOLIO_BASE_PATH}/${encodeURIComponent(portfolioId)}`,
    )
    return response.data
  },

  async updatePortfolio(portfolioId: string, payload: UpdateFirePortfolioInput) {
    const response = await apiClient.patch<FirePortfolioDetail>(
      `${FIRE_PORTFOLIO_BASE_PATH}/${encodeURIComponent(portfolioId)}`,
      payload,
    )
    return response.data
  },

  async deletePortfolio(portfolioId: string) {
    const response = await apiClient.delete<DeleteFireEntityResult>(
      `${FIRE_PORTFOLIO_BASE_PATH}/${encodeURIComponent(portfolioId)}`,
    )
    return response.data
  },

  async addHolding(portfolioId: string, payload: CreateFireHoldingInput) {
    const response = await apiClient.post(
      `${FIRE_PORTFOLIO_BASE_PATH}/${encodeURIComponent(portfolioId)}/holdings`,
      payload,
    )
    return response.data
  },

  async updateHolding(portfolioId: string, holdingId: string, payload: UpdateFireHoldingInput) {
    const response = await apiClient.patch(
      `${FIRE_PORTFOLIO_BASE_PATH}/${encodeURIComponent(portfolioId)}/holdings/${encodeURIComponent(
        holdingId,
      )}`,
      payload,
    )
    return response.data
  },

  async deleteHolding(portfolioId: string, holdingId: string) {
    const response = await apiClient.delete<DeleteFireEntityResult>(
      `${FIRE_PORTFOLIO_BASE_PATH}/${encodeURIComponent(portfolioId)}/holdings/${encodeURIComponent(
        holdingId,
      )}`,
    )
    return response.data
  },

  async simulatePortfolio(portfolioId: string, payload: FireSimulationInput = {}) {
    const response = await apiClient.post<FireSimulationResult>(
      `${FIRE_PORTFOLIO_BASE_PATH}/${encodeURIComponent(portfolioId)}/simulate`,
      payload,
    )
    return response.data
  },
}

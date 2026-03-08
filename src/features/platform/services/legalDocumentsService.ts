import { apiClient } from '@/lib/api/client'

export type LegalDocumentKey = 'terms' | 'privacy' | 'cookies' | 'financial-disclaimer'

export interface LegalDocument {
  key: LegalDocumentKey
  title: string
  version: string
  lastUpdatedAt: string
  requiredAtSignup: boolean
  routePath: string
  summary: string
  content: string
}

interface LegalDocumentListResponse {
  documents?: LegalDocument[]
}

interface LegalDocumentResponse {
  document: LegalDocument
}

export const legalDocumentsService = {
  list: async (): Promise<LegalDocument[]> => {
    const response = await apiClient.get<LegalDocumentListResponse>('/platform/legal/documents')
    return Array.isArray(response.data.documents) ? response.data.documents : []
  },

  getByKey: async (documentKey: LegalDocumentKey): Promise<LegalDocument> => {
    const response = await apiClient.get<LegalDocumentResponse>(`/platform/legal/${documentKey}`)
    return response.data.document
  },
}

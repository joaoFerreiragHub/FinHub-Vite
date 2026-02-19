export interface StoredCreatorDocument {
  _id: string
  creatorId: string
  title: string
  topic: string
  originalName: string
  mimeType: string
  url: string
  createdAt: string
}

export interface CreatorContentVisibility {
  files: boolean
  welcomeVideo: boolean
}

const DOCUMENTS_STORAGE_KEY = 'creator-documents:v1'
const VISIBILITY_STORAGE_KEY = 'creator-content-visibility:v1'

type DocumentRecord = Record<string, StoredCreatorDocument[]>
type VisibilityRecord = Record<string, Partial<CreatorContentVisibility>>

const DEFAULT_VISIBILITY: CreatorContentVisibility = {
  files: true,
  welcomeVideo: true,
}

const isBrowser = typeof window !== 'undefined'

const readStorage = <T>(key: string, fallback: T): T => {
  if (!isBrowser) return fallback

  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

const writeStorage = <T>(key: string, value: T): void => {
  if (!isBrowser) return

  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore storage errors to keep UI usable.
  }
}

export const listCreatorDocuments = (creatorId: string): StoredCreatorDocument[] => {
  if (!creatorId) return []
  const documentMap = readStorage<DocumentRecord>(DOCUMENTS_STORAGE_KEY, {})
  return documentMap[creatorId] ?? []
}

export const addCreatorDocument = (creatorId: string, document: StoredCreatorDocument): void => {
  if (!creatorId) return
  const documentMap = readStorage<DocumentRecord>(DOCUMENTS_STORAGE_KEY, {})
  const next = [...(documentMap[creatorId] ?? []), document]
  writeStorage(DOCUMENTS_STORAGE_KEY, { ...documentMap, [creatorId]: next })
}

export const updateCreatorDocument = (
  creatorId: string,
  documentId: string,
  patch: Pick<StoredCreatorDocument, 'title' | 'topic'>,
): void => {
  if (!creatorId) return
  const documentMap = readStorage<DocumentRecord>(DOCUMENTS_STORAGE_KEY, {})
  const current = documentMap[creatorId] ?? []
  const updated = current.map((entry) =>
    entry._id === documentId ? { ...entry, title: patch.title, topic: patch.topic } : entry,
  )
  writeStorage(DOCUMENTS_STORAGE_KEY, { ...documentMap, [creatorId]: updated })
}

export const removeCreatorDocument = (creatorId: string, documentId: string): void => {
  if (!creatorId) return
  const documentMap = readStorage<DocumentRecord>(DOCUMENTS_STORAGE_KEY, {})
  const current = documentMap[creatorId] ?? []
  const updated = current.filter((entry) => entry._id !== documentId)
  writeStorage(DOCUMENTS_STORAGE_KEY, { ...documentMap, [creatorId]: updated })
}

export const getCreatorContentVisibility = (creatorId: string): CreatorContentVisibility => {
  if (!creatorId) return DEFAULT_VISIBILITY
  const visibilityMap = readStorage<VisibilityRecord>(VISIBILITY_STORAGE_KEY, {})
  return {
    ...DEFAULT_VISIBILITY,
    ...(visibilityMap[creatorId] ?? {}),
  }
}

export const setCreatorContentVisibility = (
  creatorId: string,
  patch: Partial<CreatorContentVisibility>,
): CreatorContentVisibility => {
  if (!creatorId) return DEFAULT_VISIBILITY
  const visibilityMap = readStorage<VisibilityRecord>(VISIBILITY_STORAGE_KEY, {})
  const next = {
    ...DEFAULT_VISIBILITY,
    ...(visibilityMap[creatorId] ?? {}),
    ...patch,
  }
  writeStorage(VISIBILITY_STORAGE_KEY, { ...visibilityMap, [creatorId]: next })
  return next
}

export const resolveUploadUrl = (url: string): string => {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url

  const configuredApiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  try {
    const apiBaseUrl = new URL(
      configuredApiBase,
      isBrowser ? window.location.origin : 'http://localhost:5000',
    )
    const origin = `${apiBaseUrl.protocol}//${apiBaseUrl.host}`
    return `${origin}${url.startsWith('/') ? url : `/${url}`}`
  } catch {
    return url
  }
}

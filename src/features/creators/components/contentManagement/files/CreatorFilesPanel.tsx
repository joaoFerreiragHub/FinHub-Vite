import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { apiClient } from '@/lib/api/client'
import { Switch } from '@/components/ui'
import type { FileData } from '@/features/creators/types/file'
import type { CreatorFile } from '@/features/creators/types/creatorFile'
import FileUploadForm, { type UploadedCreatorFile } from './filesForm/FileUploadForm'
import FilesGrid from './FilesGrid'
import {
  addCreatorDocument,
  getCreatorContentVisibility,
  listCreatorDocuments,
  removeCreatorDocument,
  resolveUploadUrl,
  setCreatorContentVisibility,
  updateCreatorDocument,
  type StoredCreatorDocument,
} from '../shared/creatorContentStorage'

const toFileData = (entry: StoredCreatorDocument): FileData => ({
  _id: entry._id,
  originalName: entry.originalName,
  cleanOriginalName: entry.title || entry.originalName,
  mimeType: entry.mimeType,
  topic: entry.topic,
  creator: entry.creatorId,
  url: entry.url,
  createdAt: entry.createdAt,
})

const toCreatorFile = (file: FileData): CreatorFile => ({
  _id: file._id,
  name: file.cleanOriginalName,
  url: resolveUploadUrl(file.url),
  topic: file.topic,
  mimeType: file.mimeType,
  createdAt: file.createdAt,
})

export default function CreatorFilesPanel() {
  const user = useAuthStore((state) => state.user)
  const [files, setFiles] = useState<FileData[]>([])
  const [fileVisibility, setFileVisibility] = useState(true)
  const [loading, setLoading] = useState(false)

  const fetchFiles = useCallback(() => {
    if (!user) return
    setLoading(true)
    try {
      const documents = listCreatorDocuments(user.id)
      setFiles(documents.map(toFileData))
    } catch {
      toast.error('Erro ao carregar ficheiros.')
    } finally {
      setLoading(false)
    }
  }, [user])

  const fetchVisibility = useCallback(() => {
    if (!user) return
    const visibility = getCreatorContentVisibility(user.id)
    setFileVisibility(visibility.files)
  }, [user])

  useEffect(() => {
    if (!user) return
    fetchFiles()
    fetchVisibility()
  }, [user, fetchFiles, fetchVisibility])

  const toggleVisibility = () => {
    if (!user) return
    const nextValue = !fileVisibility
    setCreatorContentVisibility(user.id, { files: nextValue })
    setFileVisibility(nextValue)
    toast.success('Visibilidade atualizada.')
  }

  const handleUploadSuccess = (uploadedFile: UploadedCreatorFile) => {
    if (!user) return

    const record: StoredCreatorDocument = {
      _id: uploadedFile._id,
      creatorId: user.id,
      title: uploadedFile.title,
      topic: uploadedFile.topic,
      originalName: uploadedFile.originalName,
      mimeType: uploadedFile.mimeType,
      url: uploadedFile.url,
      createdAt: uploadedFile.createdAt,
    }

    addCreatorDocument(user.id, record)
    setFiles((prev) => [...prev, toFileData(record)])
  }

  const handleFileDelete = async (id: string) => {
    if (!user || !confirm('Queres mesmo apagar este ficheiro?')) return

    const file = files.find((entry) => entry._id === id)
    if (!file) return

    try {
      await apiClient.delete('/upload', {
        data: { url: file.url },
      })
      removeCreatorDocument(user.id, id)
      setFiles((prev) => prev.filter((entry) => entry._id !== id))
      toast.success('Ficheiro apagado com sucesso.')
    } catch {
      toast.error('Erro ao apagar o ficheiro.')
    }
  }

  const handleFileUpdate = (id: string, patch: Pick<CreatorFile, 'name' | 'topic'>) => {
    if (!user) return
    updateCreatorDocument(user.id, id, { title: patch.name, topic: patch.topic || '' })
    setFiles((prev) =>
      prev.map((entry) =>
        entry._id === id
          ? { ...entry, cleanOriginalName: patch.name, topic: patch.topic || entry.topic }
          : entry,
      ),
    )
  }

  if (!user) {
    return <p className="text-sm text-muted-foreground">A carregar utilizador...</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestao de Ficheiros</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Mostrar ficheiros</span>
          <Switch checked={fileVisibility} onCheckedChange={toggleVisibility} />
        </div>
      </div>

      <FileUploadForm onUploadSuccess={handleUploadSuccess} />

      <FilesGrid
        files={files.map(toCreatorFile)}
        onDelete={handleFileDelete}
        onUpdate={handleFileUpdate}
        loading={loading}
      />
    </div>
  )
}

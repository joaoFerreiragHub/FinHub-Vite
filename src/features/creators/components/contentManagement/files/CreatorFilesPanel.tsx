import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { Switch } from '@/components/ui'
import type { FileData } from '@/features/creators/types/file'
import FileUploadForm from './filesForm/FileUploadForm'
import FilesGrid from './FilesGrid'
import type { CreatorFile } from '@/features/creators/types/creatorFile'
import { mockCreatorFiles } from '@/lib/mock/mockFiles'

const adaptFileData = (file: FileData): CreatorFile => ({
  _id: file._id,
  name: file.cleanOriginalName,
  url: `${import.meta.env.VITE_API_URL}/fileRoutes/download/${file._id}`,
  topic: file.topic,
  mimeType: file.mimeType,
  createdAt: file.createdAt,
})

export default function CreatorFilesPanel() {
  const { user } = useAuthStore()
  const accessToken = useAuthStore((state) => state.accessToken)
  const [files, setFiles] = useState<FileData[]>([])
  const [fileVisibility, setFileVisibility] = useState(true)
  const [loading, setLoading] = useState(false)

  const isDev = true

  const fetchFiles = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      if (isDev) {
        setFiles(
          mockCreatorFiles.map((file) => ({
            _id: file._id,
            originalName: file.name,
            cleanOriginalName: file.name,
            mimeType: file.mimeType || 'application/octet-stream',
            topic: file.topic || 'Outro',
            creator: user.id,
            createdAt: file.createdAt || new Date().toISOString(),
          })),
        )
      } else {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/fileRoutes/files/${user.id}`,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        )
        setFiles(response.data as FileData[])
      }
    } catch {
      toast.error('Erro ao carregar ficheiros.')
    } finally {
      setLoading(false)
    }
  }, [accessToken, isDev, user])

  const fetchVisibility = useCallback(async () => {
    if (!user) return
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${user.id}/visibility`,
      )
      setFileVisibility(data?.files ?? true)
    } catch {
      toast.error('Erro ao buscar visibilidade.')
    }
  }, [user])

  useEffect(() => {
    if (user) {
      void fetchFiles()
      void fetchVisibility()
    }
  }, [user, fetchFiles, fetchVisibility])

  const toggleVisibility = async () => {
    if (!user) return
    try {
      const newValue = !fileVisibility
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/${user.id}/visibility`,
        { contentVisibility: { files: newValue } },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      )
      setFileVisibility(newValue)
      toast.success('Visibilidade atualizada.')
    } catch {
      toast.error('Erro ao atualizar visibilidade.')
    }
  }

  const handleFileDelete = async (id: string) => {
    if (!user || !confirm('Queres mesmo apagar este ficheiro?')) return
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/fileRoutes/files/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      setFiles((prev) => prev.filter((f) => f._id !== id))
      toast.success('Ficheiro apagado com sucesso.')
    } catch {
      toast.error('Erro ao apagar o ficheiro.')
    }
  }

  if (!user) {
    return <p className="text-sm text-muted-foreground">A carregar utilizador...</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestão de Ficheiros</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Mostrar ficheiros</span>
          <Switch checked={fileVisibility} onCheckedChange={toggleVisibility} />
        </div>
      </div>

      <FileUploadForm
        creatorId={user.id}
        onUploadSuccess={(uploadedFile) => {
          const newFile: FileData = {
            _id: uploadedFile._id,
            originalName: uploadedFile.originalName,
            cleanOriginalName: uploadedFile.title, // ou usa outro campo se existir
            mimeType: uploadedFile.mimeType,
            topic: uploadedFile.topic,
            creator: user.id,
            createdAt: uploadedFile.createdAt,
          }

          setFiles((prev) => [...prev, newFile])
        }}
      />

      <FilesGrid files={files.map(adaptFileData)} onDelete={handleFileDelete} loading={loading} />
    </div>
  )
}

import { useState } from 'react'
import { toast } from 'react-toastify'
import { apiClient } from '@/lib/api/client'
import { Label } from '@/components/ui'
import { Input } from '@/components/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'
import { Button } from '@/components/ui'

export interface UploadedCreatorFile {
  _id: string
  title: string
  topic: string
  originalName: string
  mimeType: string
  url: string
  createdAt: string
}

interface UploadDocumentResponse {
  filename: string
  originalName: string
  mimetype: string
  url: string
}

const topicOptions = [
  'ETFs',
  'Acoes',
  'Reits',
  'Cryptos',
  'Financas Pessoais',
  'Poupanca',
  'Imobiliario',
  'Obrigacoes',
  'Fundos Mutuos',
  'Empreendedorismo',
  'Futuros e Opcoes',
  'Trading',
]

interface Props {
  onUploadSuccess: (file: UploadedCreatorFile) => void
}

export default function FileUploadForm({ onUploadSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [topic, setTopic] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    if (!file || !topic || !title) {
      toast.error('Preenche todos os campos antes de fazer upload.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('topic', topic)
    formData.append('title', title)

    setLoading(true)
    try {
      const { data } = await apiClient.post<UploadDocumentResponse>('/upload/document', formData)

      const uploadedFile: UploadedCreatorFile = {
        _id: data?.filename || `${Date.now()}`,
        title,
        topic,
        originalName: data?.originalName || file.name,
        mimeType: data?.mimetype || file.type || 'application/octet-stream',
        url: data?.url || '',
        createdAt: new Date().toISOString(),
      }

      onUploadSuccess(uploadedFile)
      toast.success('Ficheiro carregado com sucesso')
      setFile(null)
      setTitle('')
      setTopic('')
    } catch {
      toast.error('Erro ao carregar ficheiro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titulo</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Guia de ETFs"
          />
        </div>

        <div className="space-y-2">
          <Label>Tema</Label>
          <Select value={topic} onValueChange={setTopic}>
            <SelectTrigger>
              <SelectValue placeholder="Seleciona um tema" />
            </SelectTrigger>
            <SelectContent>
              {topicOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">Ficheiro</Label>
        <Input
          type="file"
          id="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          key={file?.name || ''}
        />
      </div>

      <Button onClick={handleUpload} disabled={loading || !file || !topic || !title}>
        {loading ? 'A carregar...' : 'Carregar Ficheiro'}
      </Button>
    </div>
  )
}

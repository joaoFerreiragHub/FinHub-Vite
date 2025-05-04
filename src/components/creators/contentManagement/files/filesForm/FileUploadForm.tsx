// src/components/creators/files/FileUploadForm.tsx

import { useState } from "react"
import { toast } from "react-toastify"
import axios from "axios"
import { Label } from "../../../../ui/label"
import { Input } from "../../../../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../ui/select"
import { Button } from "../../../../ui/button"

export interface CreatorFile {
  _id: string
  title: string
  topic: string
  originalName: string
  mimeType: string
  url: string
  createdAt: string
}

const topicOptions = [
  "ETFs",
  "Ações",
  "Reits",
  "Cryptos",
  "Finanças Pessoais",
  "Poupança",
  "Imobiliário",
  "Obrigações",
  "Fundos Mútuos",
  "Empreendedorismo",
  "Futuros e Opções",
  "Trading",
]

interface Props {
  onUploadSuccess: (file: CreatorFile) => void
  creatorId: string
}

export default function FileUploadForm({ onUploadSuccess, creatorId }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [topic, setTopic] = useState("")
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    if (!file || !topic || !title) {
      toast.error("Preenche todos os campos antes de fazer upload.")
      return
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("topic", topic)
    formData.append("title", title)
    formData.append("creator", creatorId)

    setLoading(true)
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/files/upload`,
        formData
      )
      toast.success("Ficheiro carregado com sucesso")
      onUploadSuccess(data.fileRecord)
      setFile(null)
      setTitle("")
      setTopic("")
    } catch{
      toast.error("Erro ao carregar ficheiro")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
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
                <SelectItem key={option} value={option}>{option}</SelectItem>
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
            key={file?.name || ""} // 🔁 Força re-render para limpar o input
          />
      </div>

    <Button onClick={handleUpload} disabled={loading || !file || !topic || !title}>
      {loading ? "A carregar..." : "Carregar Ficheiro"}
    </Button>
    </div>
  )
}

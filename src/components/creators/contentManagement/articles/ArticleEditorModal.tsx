import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../ui/dialog"
import { Input } from "../../../ui/input"
import { Button } from "../../../ui/button"
import { Article } from "../../../../types/article"
import ArticleTopicDropdown from "./ArticleTopicDropdown"

// SSR-safe importação condicional (sem causar erro no build do servidor)
let RichTextEditor: typeof import('@mantine/rte').RichTextEditor | null = null
if (typeof window !== 'undefined') {
  RichTextEditor = require('@mantine/rte').RichTextEditor
}

interface ArticleEditorModalProps {
  initialData?: Article
  onClose: () => void
  onSuccess: () => void
}

export default function ArticleEditorModal({ initialData, onClose, onSuccess }: ArticleEditorModalProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [topic, setTopic] = useState(initialData?.topic || "")
  const [content, setContent] = useState(initialData?.content || "")
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "")

  const handleSubmit = () => {
    // Aqui chamar o hook de create/edit com { title, topic, content, imageUrl }
    onSuccess()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Artigo" : "Novo Artigo"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} />
          <ArticleTopicDropdown value={topic} onChange={setTopic} />
          <Input placeholder="URL da Imagem" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />

          <div className="border border-border rounded-md min-h-[200px]">
            {RichTextEditor ? (
              <RichTextEditor value={content} onChange={setContent} />
            ) : (
              <p className="text-muted-foreground">A carregar editor...</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSubmit}>{initialData ? "Guardar" : "Publicar"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

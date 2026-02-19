import { useState, type MouseEvent } from 'react'
import { toast } from 'react-toastify'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import type { CreatorFile } from '@/features/creators/types/creatorFile'
import { Button } from '@/components/ui'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui'
import { Input } from '@/components/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'

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
  file: CreatorFile
  onDelete: (id: string) => void
  onUpdate?: (id: string, patch: Pick<CreatorFile, 'name' | 'topic'>) => void
  showActions?: boolean
}

export default function FileItem({ file, onDelete, onUpdate, showActions = true }: Props) {
  const { user } = useAuthStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [name, setName] = useState(file.name)
  const [topic, setTopic] = useState(file.topic || '')

  const handleDownloadClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (user?.role === 'visitor') {
      event.preventDefault()
      setDialogOpen(true)
    }
  }

  const handleDelete = () => {
    if (confirm(`Tens a certeza que queres apagar o ficheiro "${file.name}"?`)) {
      onDelete(file._id)
    }
  }

  const handleUpdate = () => {
    if (!name.trim()) {
      toast.error('O titulo nao pode estar vazio.')
      return
    }

    onUpdate?.(file._id, { name: name.trim(), topic })
    toast.success('Ficheiro atualizado com sucesso.')
    setEditDialogOpen(false)
  }

  const getIcon = () => {
    if (file.mimeType?.includes('pdf')) return '/icons/pdf.svg'
    if (file.mimeType?.includes('spreadsheet')) return '/icons/excel.svg'
    return '/icons/file.svg'
  }

  return (
    <div className="flex items-start gap-4 border p-4 rounded-xl bg-muted/30">
      <img src={getIcon()} alt="tipo de ficheiro" className="w-12 h-12 object-contain" />

      <div className="flex-1 space-y-1">
        <p className="font-medium text-sm leading-tight line-clamp-2">{file.name}</p>
        <p className="text-muted-foreground text-xs">{file.topic}</p>
        <a
          href={file.url}
          download
          onClick={handleDownloadClick}
          className="text-primary underline text-sm"
        >
          Descarregar
        </a>
      </div>

      {showActions && (
        <div className="flex flex-col gap-1 items-end">
          <Button
            size="sm"
            className="bg-muted hover:bg-primary/10 text-primary"
            onClick={() => setEditDialogOpen(true)}
          >
            Editar
          </Button>

          <Button size="sm" variant="ghost" className="text-destructive" onClick={handleDelete}>
            Apagar
          </Button>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Acesso Restrito</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Para descarregar este ficheiro, tens de fazer login.
            </p>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setDialogOpen(false)} variant="outline">
                Cancelar
              </Button>
              <Button onClick={() => (window.location.href = '/login')}>Login</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Ficheiro</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Titulo</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tema</label>
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
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdate}>Guardar Alteracoes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

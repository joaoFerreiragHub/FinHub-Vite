import React, {  useState } from 'react'
import { CreatorFile } from '../../types/creatorFile'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { useUserStore } from '../../stores/useUserStore'



type Props = {
  file: CreatorFile
  onDelete?: (fileId: string) => void
  showActions?: boolean
  fetchFiles?: () => void
}

export const FileItem: React.FC<Props> = ({
  file,
  onDelete,
  showActions = true,
}) => {
  const { user } = useUserStore()
  const [dialogVisible, setDialogVisible] = useState(false)

  const downloadUrl = `${import.meta.env.VITE_API_URL}/fileRoutes/download/${file.id}`


  const handleDownloadClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (user?.role === 'visitor') {
      e.preventDefault()
      setDialogVisible(true)
    }
  }

  const handleDeleteClick = async () => {
    if (
      window.confirm(`Tens a certeza que queres apagar o ficheiro "${file.cleanOriginalName}"?`)

    ) {
      try {
        onDelete?.(file.id)
      } catch (error) {
        console.error('Erro ao apagar o ficheiro:', error)
      }
    }
  }

  const fileImageSrc =
    file.mimeType === 'application/pdf'
      ? '/assets/files/pdfFiles.webp'
      : '/assets/files/excelFiles.webp'

  return (
    <div className="flex flex-col items-center bg-card border rounded-lg shadow-sm p-4 text-center">
      <img
        src={fileImageSrc}
        alt={file.cleanOriginalName}
        className="w-20 h-20 object-contain mb-3"
      />
      <h4 className="text-sm font-medium text-foreground mb-2">
        {file.cleanOriginalName}
      </h4>
      <a
        href={downloadUrl}
        download
        onClick={handleDownloadClick}
        className="text-sm text-primary underline hover:opacity-80"
      >
        Descarregar
      </a>

      {showActions && (
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDeleteClick}
          className="mt-2"
        >
          Apagar
        </Button>
      )}

      <Dialog open={dialogVisible} onOpenChange={setDialogVisible}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Acesso Restrito</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground space-y-4">
            <p>Para descarregar este ficheiro, é necessário fazer login.</p>
            <div className="flex justify-center gap-3 mt-4">
              <Button onClick={() => (window.location.href = '/login')}>
                Login
              </Button>
              <Button variant="secondary" onClick={() => setDialogVisible(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

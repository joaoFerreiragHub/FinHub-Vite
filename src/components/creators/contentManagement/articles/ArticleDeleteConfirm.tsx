import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../ui/dialog"
import { Button } from "../../../ui/button"

interface ArticleDeleteConfirmProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  articleTitle: string
}

export default function ArticleDeleteConfirm({ open, onClose, onConfirm, articleTitle }: ArticleDeleteConfirmProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apagar Artigo</DialogTitle>
        </DialogHeader>
        <p>Queres mesmo apagar o artigo <strong>{articleTitle}</strong>?</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="destructive" onClick={onConfirm}>Apagar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

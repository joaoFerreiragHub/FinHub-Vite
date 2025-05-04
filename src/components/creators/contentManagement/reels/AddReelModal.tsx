import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { ReelType } from "../../../../mock/mockReels"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../ui/dialog"
import { Label } from "../../../ui/label"
import { Input } from "../../../ui/input"
import { Button } from "../../../ui/button"

interface AddReelModalProps {
  open: boolean
  onClose: () => void
  onSuccess: (newReel: ReelType) => void
  initialData?: ReelType // <- Aqui está a nova prop
}

export default function AddReelModal({
  open,
  onClose,
  onSuccess,
  initialData,
}: AddReelModalProps) {
  const [newReel, setNewReel] = useState<Partial<ReelType>>({
    title: "",
    platform: "youtube",
    url: "",
    topic: "",
    isVisible: true,
  })

  // Preenche os dados se estiver a editar
  useEffect(() => {
    if (initialData) {
      setNewReel(initialData)
    } else {
      setNewReel({ title: "", platform: "youtube", url: "", topic: "", isVisible: true })
    }
  }, [initialData, open])

  const handleSubmit = () => {
    if (!newReel.title || !newReel.url) {
      toast.error("Preenche todos os campos obrigatórios.")
      return
    }

    const reel: ReelType = {
      ...(newReel as ReelType),
      id: initialData?.id || crypto.randomUUID(),
      createdAt: initialData?.createdAt || new Date().toISOString(),
    }

    onSuccess(reel)
    toast.success("Reel guardado com sucesso!")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Reel" : "Adicionar Reel"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Título</Label>
            <Input
              value={newReel.title}
              onChange={(e) => setNewReel((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Como poupar com ETFs"
            />
          </div>

          <div className="space-y-2">
            <Label>Plataforma</Label>
            <select
              className="w-full border rounded px-3 py-2"
              value={newReel.platform}
              onChange={(e) =>
                setNewReel((prev) => ({
                  ...prev,
                  platform: e.target.value as ReelType["platform"],
                }))
              }
            >
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>URL</Label>
            <Input
              value={newReel.url}
              onChange={(e) => setNewReel((prev) => ({ ...prev, url: e.target.value }))}
              placeholder="https://..."
            />
          </div>

          <div className="pt-2">
            <Button className="w-full" onClick={handleSubmit}>
              Guardar Reel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

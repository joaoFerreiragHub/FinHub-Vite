// 5. LockedFeatureDialog.tsx
// Exibe um aviso quando o criador tenta aceder algo bloqueado

import { AlertTriangle } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui'

interface LockedFeatureDialogProps {
  open: boolean
  onClose: () => void
  requiredLevel: number
}

export function LockedFeatureDialog({ open, onClose, requiredLevel }: LockedFeatureDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="text-center">
        <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
        <p className="text-sm">
          Esta funcionalidade está disponível a partir do nível {requiredLevel}.
        </p>
      </DialogContent>
    </Dialog>
  )
}

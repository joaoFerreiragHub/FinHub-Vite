import { Label } from '@/components/ui'
import { toast } from 'react-toastify'
import { Switch } from '@/components/ui/switch'

interface ToggleProps {
  isVisible: boolean
  onToggle: (visible: boolean) => void
}

export default function AnnouncementVisibilityToggle({ isVisible, onToggle }: ToggleProps) {
  const handleToggle = async () => {
    try {
      // Simula um patch ou lógica mock
      await new Promise((res) => setTimeout(res, 500))
      onToggle(!isVisible)
      toast.success(`Anúncios agora estão ${!isVisible ? 'visíveis' : 'ocultos'}!`)
    } catch {
      toast.error('Erro ao atualizar visibilidade.')
    }
  }

  return (
    <div className="flex items-center space-x-4">
      <Label>Mostrar Anúncios</Label>
      <Switch checked={isVisible} onCheckedChange={handleToggle} />
    </div>
  )
}

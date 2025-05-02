import { Switch } from "../../../ui/switch"

interface ArticleVisibilityToggleProps {
  isVisible: boolean
  onToggle: () => void
}

export default function ArticleVisibilityToggle({ isVisible, onToggle }: ArticleVisibilityToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">Mostrar Artigos:</span>
      <Switch checked={isVisible} onCheckedChange={onToggle} />
    </div>
  )
}

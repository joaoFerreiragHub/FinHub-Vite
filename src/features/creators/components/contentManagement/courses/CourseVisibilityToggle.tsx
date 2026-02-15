// src/components/contentManagement/courses/CourseVisibilityToggle.tsx

import { Switch } from '@/components/ui'

interface CourseVisibilityToggleProps {
  isVisible: boolean
  onToggle: () => void
}

export default function CourseVisibilityToggle({
  isVisible,
  onToggle,
}: CourseVisibilityToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">Mostrar Cursos:</span>
      <Switch checked={isVisible} onCheckedChange={onToggle} />
    </div>
  )
}

// src/features/creators/components/dashboard/ChecklistCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Checkbox } from '@/components/ui'

const tasks = [
  { id: 1, label: 'Responder aos comentários' },
  { id: 2, label: 'Partilhar um conteúdo nas redes' },
  { id: 3, label: 'Ver estatísticas da semana' },
]

export default function ChecklistCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Checklist Pessoal</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center gap-2">
              <Checkbox id={`task-${task.id}`} />
              <label htmlFor={`task-${task.id}`} className="text-sm">
                {task.label}
              </label>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

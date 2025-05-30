import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card"
import { CheckCircle } from "lucide-react"

const mockMissions = [
  { id: 1, title: "Publicar o 1º Reels", completed: true },
  { id: 2, title: "Atingir 50 visualizações", completed: true },
  { id: 3, title: "Publicar 5 artigos", completed: false },
  { id: 4, title: "Receber 10 interações", completed: false },
]

export default function MissionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Missões do Criador</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {mockMissions.map((mission) => (
          <div
            key={mission.id}
            className={`flex items-center justify-between rounded-md p-2 ${
              mission.completed ? "bg-green-50" : "bg-muted"
            }`}
          >
            <span className="text-sm">{mission.title}</span>
            {mission.completed && <CheckCircle className="w-4 h-4 text-green-600" />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

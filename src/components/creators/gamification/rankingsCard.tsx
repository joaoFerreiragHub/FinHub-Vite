import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card"

const mockRanking = [
  { id: 1, name: "Joana Silva", level: 5, xp: 2100 },
  { id: 2, name: "Pedro Costa", level: 4, xp: 1850 },
  { id: 3, name: "Ana Ramos", level: 4, xp: 1600 },
  { id: 4, name: "Luís Martins", level: 3, xp: 1100 },
  { id: 5, name: "Marta Rocha", level: 3, xp: 950 },
]

export default function RankingsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Criadores</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {mockRanking.map((creator, index) => (
          <div key={creator.id} className="flex justify-between items-center text-sm">
            <span>#{index + 1} {creator.name}</span>
            <span className="text-muted-foreground">Lv {creator.level} | {creator.xp} XP</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// components/creators/marketing/estatisticas/CoursesStats.tsx

import { GraduationCap, CheckCircle, Users, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"

const mockStats = {
  totalCourses: 6,
  totalEnrollments: 410,
  totalCompletions: 215,
  avgDuration: 2.5,
  topCourses: [
    { title: "Domina o Orçamento Pessoal", enrollments: 180 },
    { title: "Investir sem Medo", enrollments: 150 },
  ],
}

export default function CoursesStats() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <GraduationCap className="w-4 h-4 text-primary" />
              Total de Cursos
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{mockStats.totalCourses}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-blue-500" />
              Inscrições
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{mockStats.totalEnrollments}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Conclusões
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{mockStats.totalCompletions}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-yellow-500" />
              Duração Média
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {mockStats.avgDuration.toFixed(1)} h
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-base font-semibold mb-2">Cursos Mais Populares</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          {mockStats.topCourses.map((course, i) => (
            <div key={i} className="flex justify-between">
              <span>{course.title}</span>
              <span>{course.enrollments} inscrições</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

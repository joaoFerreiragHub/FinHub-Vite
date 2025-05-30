// components/creators/gamification/GamificationDashboard.tsx

import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"

import MissionsCard from "./missionsCard"
import RankingsCard from "./rankingsCard"
import LevelAccessInfo from "./LevelAccessInfo"
import ChallengeCreator from "./ChallengeCreator"
import XPProgressCard from "../dashboard/XPProgressCard"

export default function GamificationDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Progresso e Níveis</h1>

      {/* Secção de progresso e nível */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <XPProgressCard />
        <LevelAccessInfo />
      </div>

      {/* Secção de missões e ranking */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MissionsCard />
        <RankingsCard />
      </div>

      {/* Criar desafio (admin ou gestor) */}
      <div className="pt-4">
        <Card>
          <CardHeader>
            <CardTitle>Criar Novo Desafio</CardTitle>
          </CardHeader>
          <CardContent>
            <ChallengeCreator />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

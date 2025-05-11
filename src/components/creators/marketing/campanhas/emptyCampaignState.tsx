// components/creators/marketing/campanhas/emptyCampaignState.tsx

import { Megaphone } from "lucide-react"
import { Button } from "../../../ui/button"
import { Card, CardContent } from "../../../ui/card"

interface EmptyCampaignStateProps {
  onCreateCampaign?: () => void
}

export default function EmptyCampaignState({ onCreateCampaign }: EmptyCampaignStateProps) {
  return (
    <Card className="text-center py-10 px-6 border-dashed border-2 border-muted">
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center justify-center space-y-2">
          <Megaphone className="w-10 h-10 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Ainda não tens campanhas ativas</h2>
          <p className="text-sm text-muted-foreground">
            Começa a promover os teus conteúdos, produtos ou perfil e alcança mais utilizadores.
          </p>
        </div>

        <Button onClick={onCreateCampaign} className="mt-4">
          Criar Primeira Campanha
        </Button>
      </CardContent>
    </Card>
  )
}

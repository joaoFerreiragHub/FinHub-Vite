// components/creators/marketing/campanhas/emptyCampaignState.tsx

import { Megaphone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card"
import { Button } from "../../../ui/button"

export default function EmptyCampaignState() {
  return (
    <Card className="border-dashed border-2 border-muted p-6 text-center">
      <CardHeader className="flex flex-col items-center justify-center gap-2">
        <Megaphone className="w-8 h-8 text-muted-foreground" />
        <CardTitle className="text-lg">Ainda não criaste nenhuma campanha</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Cria a tua primeira campanha para promover os teus produtos ou serviços na plataforma.
        </p>
        <Button>+ Criar Campanha</Button>
      </CardContent>
    </Card>
  )
}

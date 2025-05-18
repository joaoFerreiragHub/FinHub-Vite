// components/creators/marketing/campanhas/adCreationWizard.tsx

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card"
import { Button } from "../../../ui/button"
import { Input } from "../../../ui/input"
import { Textarea } from "../../../ui/textarea"
import { Label } from "../../../ui/label"
import { Tabs, TabsList, TabsTrigger } from "../../../ui/tabs"


export default function AdCreationWizard() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    type: "produto",
    title: "",
    description: "",
    image: "",
    budget: 20,
    duration: 7,
  })

  const nextStep = () => setStep((prev) => prev + 1)
  const prevStep = () => setStep((prev) => prev - 1)

  const handleChange = <T extends keyof typeof formData>(field: T, value: typeof formData[T]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar Nova Campanha</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {step === 1 && (
          <>
            <Label>Tipo de Anúncio</Label>
            <Tabs defaultValue={formData.type} onValueChange={(val) => handleChange("type", val)}>
              <TabsList>
                <TabsTrigger value="produto">Produto</TabsTrigger>
                <TabsTrigger value="perfil">Perfil</TabsTrigger>
                <TabsTrigger value="conteudo">Conteúdo</TabsTrigger>
              </TabsList>
            </Tabs>
          </>
        )}

        {step === 2 && (
          <>
            <Label>Título</Label>
            <Input value={formData.title} onChange={(e) => handleChange("title", e.target.value)} />
            <Label>Descrição</Label>
            <Textarea value={formData.description} onChange={(e) => handleChange("description", e.target.value)} />
            <Label>Imagem (URL mock)</Label>
            <Input value={formData.image} onChange={(e) => handleChange("image", e.target.value)} />
          </>
        )}

        {step === 3 && (
          <>
            <Label>Orçamento (€)</Label>
            <Input
              type="number"
              value={formData.budget}
              onChange={(e) => handleChange("budget", Number(e.target.value))}
            />
            <Label>Duração (dias)</Label>
            <Input
              type="number"
              value={formData.duration}
              onChange={(e) => handleChange("duration", Number(e.target.value))}
            />
          </>
        )}

        {step === 4 && (
          <div>
            <h3 className="font-semibold mb-2">Pré-visualização</h3>
            <img src={formData.image} className="h-40 object-cover rounded" />
            <p className="mt-2 font-bold">{formData.title}</p>
            <p className="text-muted-foreground">{formData.description}</p>
            <p className="text-sm mt-2">Orçamento: {formData.budget}€ por {formData.duration} dias</p>
          </div>
        )}

        <div className="flex justify-between pt-4">
          {step > 1 && (
            <Button variant="outline" onClick={prevStep}>
              Anterior
            </Button>
          )}
          {step < 4 ? (
            <Button onClick={nextStep}>Seguinte</Button>
          ) : (
            <Button onClick={() => alert("Campanha criada!")}>Submeter</Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

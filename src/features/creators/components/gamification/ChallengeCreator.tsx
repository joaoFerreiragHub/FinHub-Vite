import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Input } from '@/components/ui'
import { Textarea } from '@/components/ui'
import { Button } from '@/components/ui'
import { Label } from '@/components/ui'

export default function ChallengeCreator() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [xp, setXp] = useState(10)
  const [success, setSuccess] = useState(false)

  const handleCreate = () => {
    // Aqui seria enviado para API
    setSuccess(true)
    setTitle('')
    setDescription('')
    setXp(10)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar Desafio</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Título</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <Label>Descrição</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <Label>XP Recompensa</Label>
          <Input type="number" value={xp} onChange={(e) => setXp(Number(e.target.value))} />
        </div>
        <Button onClick={handleCreate}>Criar Desafio</Button>
        {success && <p className="text-green-600 text-sm">Desafio criado com sucesso (mock)!</p>}
      </CardContent>
    </Card>
  )
}

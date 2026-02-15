// features/creators/components/marketing/campanhas/promoQuickUpload.tsx

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { Label } from '@/components/ui'
import { Input } from '@/components/ui'
import { Button } from '@/components/ui'
import { Textarea } from '@/components/ui'

export default function PromoQuickUpload() {
  const [title, setTitle] = useState('')
  const [cta, setCta] = useState('')
  const [image, setImage] = useState<File | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0])
    }
  }

  const handleSubmit = () => {
    if (!title || !cta || !image) {
      alert('Preenche todos os campos.')
      return
    }
    // Aqui tratarias o envio para o backend (ex: FormData + API)
    alert(`Promoção pronta: ${title} | CTA: ${cta}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Rápido de Promoção</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="image">Imagem</Label>
          <Input type="file" id="image" accept="image/*" onChange={handleImageChange} />
        </div>
        <div>
          <Label htmlFor="title">Título da Promoção</Label>
          <Textarea id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="cta">Texto do Botão (CTA)</Label>
          <Input id="cta" value={cta} onChange={(e) => setCta(e.target.value)} />
        </div>
        <Button onClick={handleSubmit}>Guardar Promoção</Button>
      </CardContent>
    </Card>
  )
}

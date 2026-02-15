import { useState, useEffect, ChangeEvent } from 'react'

import { LiveEventFormValues } from '../LiveEventModal'
import { Label } from '@/components/ui'
import { Input } from '@/components/ui'
import { Button } from '@/components/ui'

export interface LiveEventFormProps {
  initialValues?: LiveEventFormValues | null
  initialId?: string
  onSubmit: (values: LiveEventFormValues) => void
  onDelete?: (id: string) => void
}

// Simulação de upload (substituir por chamada real à API ou AWS)
async function uploadImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(URL.createObjectURL(file)), 1000)
  })
}

export default function LiveEventForm({
  initialValues,
  initialId,
  onSubmit,
  onDelete,
}: LiveEventFormProps) {
  const [form, setForm] = useState<LiveEventFormValues>({
    title: '',
    type: 'online',
    description: '',
    startTime: '',
    endTime: '',
    coverImage: '',
    address: '',
    eventCreatorName: '',
  })

  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    if (initialValues) {
      setForm(initialValues)
      if (initialValues.coverImage) {
        setImagePreview(initialValues.coverImage)
      }
    }
  }, [initialValues])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setForm((prev) => ({ ...prev, [id]: value }))
  }

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Simula upload (substitui por upload real)
    const url = await uploadImage(file)
    setForm((prev) => ({ ...prev, coverImage: url }))
    setImagePreview(url)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Título</Label>
        <Input id="title" value={form.title} onChange={handleChange} required />
      </div>

      <div>
        <Label htmlFor="type">Tipo</Label>
        <select
          id="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="online">Online</option>
          <option value="presencial">Presencial</option>
        </select>
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Input id="description" value={form.description} onChange={handleChange} />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="startTime">Início</Label>
          <Input
            type="datetime-local"
            id="startTime"
            value={form.startTime}
            onChange={handleChange}
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="endTime">Término</Label>
          <Input type="datetime-local" id="endTime" value={form.endTime} onChange={handleChange} />
        </div>
      </div>

      <div>
        <Label htmlFor="coverImage">Imagem de Capa</Label>
        <Input type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview da imagem"
            className="mt-2 max-h-48 rounded shadow"
          />
        )}
      </div>

      {form.type === 'presencial' && (
        <div>
          <Label htmlFor="address">Morada</Label>
          <Input id="address" value={form.address} onChange={handleChange} />
        </div>
      )}

      <div>
        <Label htmlFor="eventCreatorName">Criador</Label>
        <Input id="eventCreatorName" value={form.eventCreatorName} onChange={handleChange} />
      </div>

      <div className="flex justify-between mt-4">
        <Button type="submit">Guardar</Button>
        {initialId && onDelete && (
          <Button type="button" variant="destructive" onClick={() => onDelete(initialId)}>
            Eliminar
          </Button>
        )}
      </div>
    </form>
  )
}

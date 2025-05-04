// src/components/contentManagement/podcasts/podcastsForm/PodcastForm.tsx
import { useFormik } from "formik"
import { Button } from "../../../../ui/button"
import { Input } from "../../../../ui/input"
import { Textarea } from "../../../../ui/textarea"
import { Podcast } from "../../../../../types/podcast"

export interface PodcastFormValues {
  title: string
  description: string
  imageUrl?: string
  author?: string
}

interface Props {
  podcast?: Podcast
  onSave: (data: PodcastFormValues) => void
  onCancel: () => void
}

export default function PodcastForm({ podcast, onSave, onCancel }: Props) {
  const formik = useFormik({
    initialValues: {
      title: podcast?.title || "",
      description: podcast?.description || "",
      imageUrl: podcast?.imageUrl || "",
      author: podcast?.author || "",
    },
    onSubmit: (values) => {
      onSave(values)
    },
  })

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Título</label>
        <Input name="title" value={formik.values.title} onChange={formik.handleChange} required />
      </div>

      <div>
        <label className="block text-sm font-medium">Descrição</label>
        <Textarea name="description" value={formik.values.description} onChange={formik.handleChange} />
      </div>

      <div>
        <label className="block text-sm font-medium">Imagem (URL)</label>
        <Input name="imageUrl" value={formik.values.imageUrl} onChange={formik.handleChange} />
      </div>

      <div>
        <label className="block text-sm font-medium">Autor</label>
        <Input name="author" value={formik.values.author} onChange={formik.handleChange} />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Guardar Podcast</Button>
      </div>
    </form>
  )
}

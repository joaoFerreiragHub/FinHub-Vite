
import { FormikProps } from "formik"
import { Label } from "../../../../ui/label"
import { Input } from "../../../../ui/input"
import { CourseFormValues } from '@/features/hub/courses/schemas/courseFormSchema'

interface Props {
  formik: FormikProps<CourseFormValues>
  isInvalid: (name: keyof CourseFormValues) => boolean
  errorMessage: (name: keyof CourseFormValues) => React.ReactNode
}

const statusOptions = [
  { value: "draft", label: "Rascunho" },
  { value: "published", label: "Publicado" },
]

export default function StepCourseLinksAndStatus({ formik, errorMessage }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="purchaseLink">Link de Compra</Label>
        <Input
          id="purchaseLink"
          name="purchaseLink"
          placeholder="https://"
          value={formik.values.purchaseLink}
          onChange={formik.handleChange}
        />
        {errorMessage("purchaseLink")}
      </div>

      <div>
        <Label htmlFor="status">Estado do Curso</Label>
        <select
          id="status"
          name="status"
          value={formik.values.status}
          onChange={formik.handleChange}
          className="w-full border border-border rounded-md p-2"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errorMessage("status")}
      </div>
    </div>
  )
}

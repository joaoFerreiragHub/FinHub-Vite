// src/components/contentManagement/courses/steps/StepCourseDescription.tsx
import { CourseFormValues } from '@/features/hub/courses/schemas/courseFormSchema'
import { FormikProps } from 'formik'
import { Textarea } from '@/components/ui'

interface Props {
  formik: FormikProps<CourseFormValues>
  isInvalid: (name: keyof CourseFormValues) => boolean
  errorMessage: (name: keyof CourseFormValues) => React.ReactNode
}

export default function StepCourseDescription({ formik, errorMessage }: Props) {
  return (
    <div>
      <Textarea
        name="description"
        placeholder="Descrição do curso"
        value={formik.values.description}
        onChange={formik.handleChange}
      />
      {errorMessage('description')}
    </div>
  )
}

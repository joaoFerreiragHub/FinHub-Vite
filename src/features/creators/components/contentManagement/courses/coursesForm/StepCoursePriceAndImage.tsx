// StepCoursePriceAndImage.tsx

import { FormikProps } from 'formik'
import { Input } from '@/components/ui'
import { CourseFormValues } from '@/features/hub/courses/schemas/courseFormSchema'

interface Props {
  formik: FormikProps<CourseFormValues>
  isInvalid: (name: keyof CourseFormValues) => boolean
  errorMessage: (name: keyof CourseFormValues) => React.ReactNode
}

export default function StepCoursePriceAndImage({ formik, errorMessage }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <Input
          type="number"
          name="price"
          placeholder="Preço (€)"
          value={formik.values.price}
          onChange={formik.handleChange}
        />
        {errorMessage('price')}
      </div>

      <div>
        <Input
          type="file"
          name="bannerImage"
          onChange={(e) => {
            const file = e.currentTarget.files?.[0] || null
            formik.setFieldValue('bannerImage', file)
          }}
        />
        {errorMessage('bannerImage')}
      </div>
    </div>
  )
}

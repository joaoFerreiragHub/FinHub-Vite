
import { FormikProps } from "formik"
import { CourseFormValues } from "../../../../../schemas/courseFormSchema"
import { Input } from "../../../../ui/input"


interface Props {
  formik: FormikProps<CourseFormValues>
  isInvalid: (name: keyof CourseFormValues) => boolean
  errorMessage: (name: keyof CourseFormValues) => React.ReactNode
}

export default function StepCourseNameAndTopic({ formik, errorMessage }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <Input
          name="courseName"
          placeholder="Nome do Curso"
          value={formik.values.courseName}
          onChange={formik.handleChange}
        />
        {errorMessage("courseName")}
      </div>
      <div>
        <Input
          name="topic"
          placeholder="Tópico"
          value={formik.values.topic}
          onChange={formik.handleChange}
        />
        {errorMessage("topic")}
      </div>
    </div>
  )
}

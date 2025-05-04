// CourseForm.tsx
import { useFormik } from "formik"
import { useState } from "react"
import { toast } from "react-toastify"
import { courseFormSchema, CourseFormValues } from "../../../../schemas/courseFormSchema"

import { Button } from "../../../ui/button"
import { Course } from "../../../../types/course"
import { validateWithZod } from "../../../auth/userForm/formikZodValidator"
import StepCourseNameAndTopic from "./coursesForm/StepCourseNameAndTopic"
import StepCourseDescription from "./coursesForm/StepCourseDescription"
import StepCoursePriceAndImage from "./coursesForm/StepCoursePriceAndImage"
import StepCourseLinksAndStatus from "./coursesForm/StepCourseLinksAndStatus"

interface Props {
  course?: Course | null
  onSave: (data: Partial<Course>) => void
  onCancel: () => void
}

export default function CourseForm({ course, onSave, onCancel }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formik = useFormik<CourseFormValues>({
    initialValues: {
      courseName: course?.courseName || "",
      description: course?.description || "",
      price: course?.price || 0,
      topic: course?.topic || "",
      bannerImage: undefined,
      purchaseLink: course?.purchaseLink || "",
      status: course?.status || "draft",
    },
    validate: (values) => validateWithZod(courseFormSchema, values),
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true)
        onSave(values)
      } catch {
        toast.error("Erro ao guardar curso.")
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  const isInvalid = (name: keyof CourseFormValues) =>
    !!(formik.touched[name] && formik.errors[name])

const errorMessage = (name: keyof CourseFormValues) => {
  const error = formik.errors[name]
  return isInvalid(name) && typeof error === "string" ? (
    <p className="text-red-500 text-xs mt-1">{error}</p>
  ) : null
}


  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">
      <StepCourseNameAndTopic formik={formik} isInvalid={isInvalid} errorMessage={errorMessage} />
      <StepCourseDescription formik={formik} isInvalid={isInvalid} errorMessage={errorMessage} />
      <StepCoursePriceAndImage formik={formik} isInvalid={isInvalid} errorMessage={errorMessage} />
      <StepCourseLinksAndStatus formik={formik} isInvalid={isInvalid} errorMessage={errorMessage} />

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "A guardar..." : "Guardar Curso"}
        </Button>
      </div>
    </form>
  )
}

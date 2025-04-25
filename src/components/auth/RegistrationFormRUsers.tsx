import { useFormik } from "formik"
import { useState } from "react"
import { Button } from "../ui/button"
import { toast } from "react-toastify"
import StepUserDetails from "./userForm/StepUserDetails"
import StepPassword from "./userForm/StepPassword"
import StepDateOfBirth from "./userForm/StepDateOfBirth"
import StepTopics from "./userForm/StepTopics"
import StepTerms from "./userForm/StepTerms"
import { userFormSchema } from "../../schemas/userFormSchema"
import { validateWithZod } from "./userForm/formikZodValidator"


export interface FormValues {
  userName: string
  name: string
  lastName: string
  email: string
  password: string
  dateOfBirth: Date | null
  termsAccepted: boolean
  topics: string[]
}

const RegistrationFormRUsers = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const checkExists = async (
    endpoint: string,
    key: "userName" | "email",
    value: string
  ): Promise<boolean> => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: value }),
      })
      const data = await res.json()
      return data.exists
    } catch {
      return false
    }
  }

  const postData = async (data: FormValues) => {
    try {
      setIsSubmitting(true)
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}users/addusers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, role: "RegularUser" }),
        }
      )

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Erro ao registar.")

      toast.success("Conta criada com sucesso!")
      window.location.href = "/login"
    } catch {
      toast.error("Erro ao processar o registo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formik = useFormik<FormValues>({
    initialValues: {
      userName: "",
      name: "",
      lastName: "",
      email: "",
      password: "",
      dateOfBirth: null,
      termsAccepted: false,
      topics: [],
    },
    validate: (values) =>
      validateWithZod(userFormSchema, values, async (errors) => {
        if (
          !errors.userName &&
          (await checkExists("/authRoutes/checkUsername", "userName", values.userName))
        ) {
          errors.userName = "Username já existe"
        }

        if (
          !errors.email &&
          (await checkExists("/authRoutes/checkEmail", "email", values.email))
        ) {
          errors.email = "Email já registado"
        }
      }),
    onSubmit: postData,
  })

  const isInvalid = (name: keyof FormValues) =>
    !!(formik.touched[name] && formik.errors[name])

  const errorMessage = (name: keyof FormValues) =>
    isInvalid(name) && (
      <p className="text-red-500 text-xs mt-1">{formik.errors[name]}</p>
    )

  return (
    <div className="w-full max-w-lg p-6 bg-background border border-border rounded-2xl shadow-xl">
      <h2 className="text-3xl font-semibold mb-6 text-center">Criar Conta</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <StepUserDetails formik={formik} isInvalid={isInvalid} errorMessage={errorMessage} />
        <StepPassword formik={formik} isInvalid={isInvalid} errorMessage={errorMessage} />
        <StepDateOfBirth formik={formik} isInvalid={isInvalid} errorMessage={errorMessage} />
        <StepTopics formik={formik} isInvalid={isInvalid} errorMessage={errorMessage} />
        <StepTerms formik={formik} isInvalid={isInvalid} errorMessage={errorMessage} />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 rounded-xl font-semibold text-white bg-primary transition-all hover:bg-primary/90 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "A criar..." : "Criar Conta"}
        </Button>
      </form>
    </div>
  )
}

export default RegistrationFormRUsers

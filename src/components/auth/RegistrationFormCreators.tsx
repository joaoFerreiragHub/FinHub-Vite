// RegistrationFormCreatorsWizard.tsx
import { useEffect, useState } from "react"
import StepBasic from "./creatorForm/StepBasic"
import StepExtra from "./creatorForm/StepExtra"
import { toast } from "react-toastify"
import { FormDataType } from "../../types/creatorForm"
import { creatorFormSchema } from "../../schemas/creatorFormSchema"

export default function RegistrationFormCreators() {
  const [step, setStep] = useState<"basic" | "extra">("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [attemptedNext, setAttemptedNext] = useState(false)
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)

const [formData, setFormData] = useState<FormDataType>({
  userName: "",
  name: "",
  lastName: "",
  email: "",
  password: "",
  dateOfBirth: null,
  bio: "",
  topics: [],
  termsAgreement: false,
  contentLicenseAgreement: false,
  paymentTermsAgreement: false,
})

  const basicFields = ["userName", "name", "lastName", "email", "password"] as const

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    if (name in formData) {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const isInvalid = (field: keyof typeof formData) => {
    return (
      formData[field] === "" ||
      (Array.isArray(formData[field]) && (formData[field] as string[]).length === 0)
    )
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [step])

  const isStrongPassword = (pw: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pw)

  const validateBasicFields = () => {
    for (const field of basicFields) {
      if (isInvalid(field)) return "Preenche todos os campos obrigatórios."
    }
    if (!isValidEmail(formData.email)) return "Insere um email válido."
    if (!isStrongPassword(formData.password)) {
      return "A password deve ter pelo menos 8 caracteres, uma letra maiúscula e um número."
    }
    return null
  }

  const handleNext = () => {
    setAttemptedNext(true)
    const error = validateBasicFields()
    if (error) {
      toast.error(error)
      return
    }
    setStep("extra")
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setAttemptedSubmit(true)

  const parsed = creatorFormSchema.safeParse(formData)

  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0]
    toast.error(firstError || "Erro ao validar os dados.")
    return
  }

  // Continua com o envio
  setIsSubmitting(true)
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}users/addusers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, role: "CreatorUser" }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "Erro ao registar.")

    toast.success("Conta de Criador criada com sucesso!")
    window.location.href = "/login"
  } catch {
    toast.error("Erro ao criar conta. Tenta novamente.")
  } finally {
    setIsSubmitting(false)
  }
}

  return (
    <div className="max-w-2xl mx-auto p-6 bg-background border border-border rounded-2xl shadow-xl">
      <h2 className="text-3xl font-semibold mb-6 text-center">Criar Conta de Criador</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {step === "basic" && (
          <StepBasic
            formData={formData}
            onChange={handleChange}
            onNext={handleNext}
            isSubmitting={isSubmitting}
            attemptedNext={attemptedNext}
          />
        )}

        {step === "extra" && (
          <StepExtra
            formData={formData}
            onChange={handleChange}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            attemptedSubmit={attemptedSubmit}
            onBack={() => {
              setAttemptedSubmit(false)
              setStep("basic")
            }}
          />
        )}
      </form>
    </div>
  )
}

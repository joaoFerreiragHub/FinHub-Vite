import { FormDataType } from '@/features/auth/types/creatorForm'
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Button } from "../../ui/button"
import { cn } from "../../../lib/utils"

export interface StepBasicProps {
  formData: FormDataType
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onNext: () => void
  isSubmitting: boolean
  attemptedNext: boolean
}

const basicFields = ["userName", "name", "lastName", "email", "password"] as const

export default function StepBasic({
  formData,
  onChange,
  onNext,
  isSubmitting,
  attemptedNext
}: StepBasicProps) {
  const isInvalid = (field: keyof FormDataType) =>
    formData[field] === ""

  return (
    <>
      {basicFields.map((field) => (
        <div key={field}>
          <Label htmlFor={field}>
            {field === "userName"
              ? "Username"
              : field === "lastName"
              ? "Apelido"
              : field === "name"
              ? "Nome"
              : field.charAt(0).toUpperCase() + field.slice(1)} *
          </Label>
          <Input
            id={field}
            name={field}
            type={field === "password" ? "password" : "text"}
            value={formData[field]}
            onChange={onChange}
            autoComplete="off"
            className={cn({ "border-red-500": attemptedNext && isInvalid(field) })}
          />
        </div>
      ))}
      <div className="flex justify-end">
        <Button type="button" onClick={onNext} disabled={isSubmitting}>
          Próximo
        </Button>
      </div>
    </>
  )
}

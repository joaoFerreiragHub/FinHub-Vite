// userForm/StepPassword.tsx
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { cn } from "../../../lib/utils"
import { FormikProps } from "formik"
import { FormValues } from "../../../types/FormValues"


interface Props {
  formik: FormikProps<FormValues>
  isInvalid: (name: keyof FormValues) => boolean
  errorMessage: (name: keyof FormValues) => React.ReactNode
}

export default function StepPassword({ formik, isInvalid, errorMessage }: Props) {
  return (
    <div>
      <Label htmlFor="password">Password *</Label>
      <Input
        id="password"
        type="password"
        name="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        className={cn({ "border-red-500": isInvalid("password") })}
      />
      <p className="text-xs text-muted-foreground mt-1">
        Deve conter 1 letra maiúscula, 1 minúscula, 1 número e ter no mínimo 8 caracteres.
      </p>
      {errorMessage("password")}
    </div>
  )
}

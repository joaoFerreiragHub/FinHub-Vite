// components/userForm/StepTerms.tsx
import { Checkbox } from "../../ui/checkbox"
import { Label } from "../../ui/label"
import { cn } from "../../../lib/utils"
import { FormikProps } from "formik"
import { FormValues } from "../RegistrationFormRUsers"

interface Props {
  formik: FormikProps<FormValues>
  isInvalid: (name: keyof FormValues) => boolean
  errorMessage: (name: keyof FormValues) => React.ReactNode
}

export default function StepTerms({ formik, isInvalid, errorMessage }: Props) {
  return (
    <>
      <div className="flex items-start gap-2">
        <Checkbox
          id="termsAccepted"
          checked={formik.values.termsAccepted}
          onCheckedChange={(checked) =>
            formik.setFieldValue("termsAccepted", !!checked)
          }
          className={cn(isInvalid("termsAccepted") && "border-red-500")}
        />
        <Label htmlFor="termsAccepted" className="text-sm">
          Aceito os <a href="/termos" className="underline">termos e condições</a> *
        </Label>
      </div>
      {errorMessage("termsAccepted")}
    </>
  )
}

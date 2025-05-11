import { cn } from "../../../lib/utils"
import { FormValues } from "../../../types/FormValues"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { FormikProps } from "formik"




interface Props {
  formik: FormikProps<FormValues>
  isInvalid: (name: keyof FormValues) => boolean
  errorMessage: (name: keyof FormValues) => React.ReactNode
}

const fields = ["userName", "name", "lastName", "email"] as const
type Field = typeof fields[number]



export default function StepUserDetails({ formik, isInvalid, errorMessage }: Props) {
  return (
    <>
     {fields.map((field: Field) => (
        <div key={field}>
          <Label htmlFor={field}>
            {field === "userName"
              ? "Username"
              : field === "name"
              ? "Nome"
              : field === "lastName"
              ? "Apelido"
              : "Email"} *
          </Label>
          <Input
            id={field}
            name={field}
            value={formik.values[field]}
            onChange={formik.handleChange}
            autoComplete="off"
            className={cn({ "border-red-500": isInvalid(field) })}
          />
          {errorMessage(field)}
        </div>
      ))}
    </>
  )
}

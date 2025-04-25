// components/userForm/StepDateOfBirth.tsx
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { pt } from "date-fns/locale"
import { cn } from "../../../lib/utils"
import { Button } from "../../ui/button"
import { Label } from "../../ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"
import { Calendar } from "../../ui/calendar"
import { FormikProps } from "formik"
import { FormValues } from "../RegistrationFormRUsers"

interface Props {
  formik: FormikProps<FormValues>
  isInvalid: (name: keyof FormValues) => boolean
  errorMessage: (name: keyof FormValues) => React.ReactNode
}

export default function StepDateOfBirth({ formik, isInvalid, errorMessage }: Props) {
  return (
    <div>
      <Label htmlFor="dateOfBirth">Data de Nascimento *</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !formik.values.dateOfBirth && "text-muted-foreground",
              isInvalid("dateOfBirth") && "border-red-500"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formik.values.dateOfBirth
              ? format(formik.values.dateOfBirth, "dd/MM/yyyy")
              : "Escolher data"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={formik.values.dateOfBirth ?? undefined}
            onSelect={(date) => formik.setFieldValue("dateOfBirth", date)}
            initialFocus
            locale={pt}
          />
        </PopoverContent>
      </Popover>
      {errorMessage("dateOfBirth")}
    </div>
  )
}

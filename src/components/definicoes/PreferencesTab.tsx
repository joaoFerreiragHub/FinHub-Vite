
import StepDateOfBirth from "../auth/userForm/StepDateOfBirth";
import StepTopics from "../auth/userForm/StepTopics";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { mockFormik } from '@/lib/mock/mockFormik';
import StepSocialLinks from "./SocialLinksTab";
import { Button } from "../ui/button";
import { FormValues } from '@/features/auth/types/FormValues';
import { FormikProps } from "formik"

interface PreferencesTabProps {
  onSave: () => void
}

export default function PreferencesTab({ onSave }: PreferencesTabProps) {
  return (
    <div className="space-y-6">
      <StepTopics
        formik={mockFormik as FormikProps<FormValues>}
        isInvalid={() => false}
        errorMessage={() => null}
      />

      <div>
        <Label htmlFor="website">Website</Label>
        <Input id="website" defaultValue={(mockFormik.values as FormValues).website} />
      </div>

      <StepSocialLinks />

      <StepDateOfBirth
          formik={mockFormik as FormikProps<FormValues>}
        isInvalid={() => false}
        errorMessage={() => null}
      />

      <Button onClick={onSave}>Guardar Alterações</Button>
    </div>
  )
}

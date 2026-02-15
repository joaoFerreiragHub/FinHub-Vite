import StepDateOfBirth from '../forms/userForm/StepDateOfBirth'
import StepTopics from '../forms/userForm/StepTopics'
import { Input } from '@/components/ui'
import { Label } from '@/components/ui'
import { mockFormik } from '@/lib/mock/mockFormik'
import StepSocialLinks from './SocialLinksTab'
import { Button } from '@/components/ui'
import { FormValues } from '@/features/auth/types/FormValues'
import { FormikProps } from 'formik'

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

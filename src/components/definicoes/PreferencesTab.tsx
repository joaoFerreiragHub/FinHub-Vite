
import StepDateOfBirth from "../auth/userForm/StepDateOfBirth";
import StepTopics from "../auth/userForm/StepTopics";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { mockFormik } from "../../mock/mockFormik";
import StepSocialLinks from "./SocialLinksTab";

export default function PreferencesTab() {
  return (
    <div className="space-y-6">
      <StepTopics
        formik={mockFormik}
        isInvalid={() => false}
        errorMessage={() => null}
      />

      <div>
        <Label htmlFor="website">Website</Label>
        <Input id="website" defaultValue={mockFormik.values.website} />
      </div>
  <StepSocialLinks />
      <StepDateOfBirth
        formik={mockFormik}
        isInvalid={() => false}
        errorMessage={() => null}
      />
    </div>
  )
}


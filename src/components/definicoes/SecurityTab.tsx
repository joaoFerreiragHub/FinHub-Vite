import StepPassword from "../auth/userForm/StepPassword";
import { mockFormik } from "../../mock/mockFormik";


export default function SecurityTab() {
  return (
    <div className="space-y-6">
      <StepPassword
        formik={mockFormik}
        isInvalid={() => false}
        errorMessage={() => null}
      />
    </div>
  )
}

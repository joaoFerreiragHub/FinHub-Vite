import { FormikProps } from "formik"
import { FormValues } from '@/features/auth/types/FormValues'


export const mockFormik: Partial<FormikProps<FormValues>> = {
  values: {
    userName: "criador123",
    name: "João",
    lastName: "Silva",
    email: "joao@email.com",
    password: "",
    confirmPassword: "",
    termsAccepted: true,
    topics: ["ETFs"],
    website: "https://meusite.com",
    dateOfBirth: new Date(),
  },
  setFieldValue: async () => Promise.resolve(),
  handleChange: () => {},
}

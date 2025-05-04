import { FormValues } from "../components/auth/RegistrationFormRUsers";


export const mockFormik = {
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
  } as FormValues,
  setFieldValue: async () => Promise.resolve(),
  handleChange: () => {},
} as any // cast to 'any' apenas para mock local

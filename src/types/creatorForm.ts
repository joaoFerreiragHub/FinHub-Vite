import { z } from "zod"
import { creatorFormSchema } from "../schemas/creatorFormSchema"

export type FormDataType = z.input<typeof creatorFormSchema>

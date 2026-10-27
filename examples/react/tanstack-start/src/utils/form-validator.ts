import { createServerValidateHelper } from '@tanstack/react-form'
import { start } from '@tanstack/react-form-start'

export const createServerValidate = createServerValidateHelper({
  framework: start(),
})

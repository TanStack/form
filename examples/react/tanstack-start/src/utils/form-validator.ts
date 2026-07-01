import { serverValidateHelper } from '@tanstack/react-form'
import { start } from '@tanstack/react-form-start'

export const { createServerValidate } = serverValidateHelper({
  framework: start(),
})

import { createFormHook, createFormHookContexts } from '@tanstack/react-form'

//
// fields
//
import { TextField } from './FieldComponents/TextField'

//
// components
//
import { SubmitButton } from './FormComponents/SubmitButton'

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField: TextField },
  formComponents: { SubmitButton },
})

export default useAppForm

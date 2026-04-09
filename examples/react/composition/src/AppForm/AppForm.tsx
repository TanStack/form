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

const { useAppForm, extendForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField },
  formComponents: { SubmitButton },
})

export { extendForm }
export default useAppForm

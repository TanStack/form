import { createFormHook } from '@tanstack/react-form'
import { TanStackFormTextInput } from './fields-ui/text-input'
import { TanStackFormSubmitButton } from './form-ui/submit-button'
import { TanStackFormElement } from './form-ui/form'

export const { appFormOptions, useSchemaAppForm } = createFormHook({
  fieldComponents: {
    TextInput: TanStackFormTextInput,
  },
  formComponents: {
    SubmitButton: TanStackFormSubmitButton,
    Form: TanStackFormElement,
  },
})

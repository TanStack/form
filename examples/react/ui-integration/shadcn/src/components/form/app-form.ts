import { createFormHook } from '@tanstack/react-form'
import { TanStackFormTextInput } from './fields-ui/text-input'
import { TanStackFormSubmitButton } from './form-ui/submit-button'
import { TanStackFormElement } from './form-ui/form'
import { TanStackFormField } from './fields-ui/field'
import { TanStackFormLabel } from './fields-ui/label'
import { TanStackFormError } from './fields-ui/error'
import { TanStackFormDescription } from './fields-ui/description'
import { TanStackFormTextField } from './wrappers/text-field'
import { TanStackFormDateRangePicker } from './wrappers/date-range-picker'

export const { appFormOptions, useSchemaAppForm } = createFormHook({
  fieldComponents: {
    // Granular elements for when you need full control
    TextInput: TanStackFormTextInput,
    Field: TanStackFormField,
    Label: TanStackFormLabel,
    Error: TanStackFormError,
    Description: TanStackFormDescription,

    // General wrappers for the usual cases
    TextInputField: TanStackFormTextField,
    DateRangePicker: TanStackFormDateRangePicker,
  },
  formComponents: {
    SubmitButton: TanStackFormSubmitButton,
    Form: TanStackFormElement,
  },
})

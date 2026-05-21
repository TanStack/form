import { createFormHook } from '@tanstack/react-form'
import { AppFormStringField } from './StringField'
import { AppFormFieldError } from './FieldError'
import { AppFormNumberField } from './NumberField'
import { AppFormSelectMenu } from './SelectMenu'

export const {
  useAppForm,
  appFormOptions,
  useSchemaAppForm,
  useNullableSchemaAppForm,
} = createFormHook({
  fieldComponents: {
    Text: AppFormStringField,
    Error: AppFormFieldError,
    Number: AppFormNumberField,
    SelectMenu: AppFormSelectMenu,
  },
  formComponents: {},
})

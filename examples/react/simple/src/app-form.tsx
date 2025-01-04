import { useForm } from '@tanstack/react-form'
import { createContext, useContext, useMemo } from 'react'
import { TextInput } from '@mantine/core'
import type {
  FieldApi,
  FieldComponent,
  FormOptions,
  ReactFormExtendedApi,
} from '@tanstack/react-form'

/**
 * `any` might frighten you here, but it's not inherently a bad thing.
 *
 * Think of this file as a library that you maintain. Library code is often
 * more permissive than application code.
 *
 * What's more important is that the library's app-facing API is type-safe.
 */
type AnyFieldApi = FieldApi<any, any, any, any, any>

// We should never hit the `null` case here
const FormFieldContext = createContext<AnyFieldApi>(null as never)

function useFieldContext() {
  const field = useContext(FormFieldContext)
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!field) {
    throw new Error('useFieldContext must be used within a FormFieldContext')
  }
  return field
}

interface TextFieldProps {
  label: string
}

function TextField({ label }: TextFieldProps) {
  const field = useFieldContext()
  return (
    <TextInput
      label={label}
      error={
        field.state.meta.errors.length > 0 ? field.state.meta.errors[0] : null
      }
      defaultValue={field.options.defaultValue}
    />
  )
}

type AppField<TFormData> = FieldComponent<TFormData> & {
  TextField: typeof TextField
}

export function useAppForm<TFormData>(
  props: FormOptions<TFormData>,
): ReactFormExtendedApi<TFormData> & {
  AppField: AppField<TFormData>
} {
  const form = useForm(props)

  const AppField = useMemo(() => {
    return (({ children, ...props }) => {
      return (
        <form.Field {...props}>
          {(field) => (
            <FormFieldContext.Provider value={field}>
              {children(
                Object.assign(field, {
                  TextField,
                }),
              )}
            </FormFieldContext.Provider>
          )}
        </form.Field>
      )
    }) satisfies AppField<TFormData>
  }, [form])

  return {
    ...form,
    AppField,
  }
}

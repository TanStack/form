import { useForm } from '@tanstack/react-form'
import { createContext, useContext, useMemo } from 'react'
import { TextInput } from '@mantine/core'
import type {
  FieldApi,
  FieldComponent,
  FormOptions,
  ReactFormExtendedApi,
} from '@tanstack/react-form'

// If you're using a validator, you might replace `undefined` with the type of the Form validator.
type ValidatorType = undefined

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
      value={field.state.value}
      onChange={(e) => field.setValue(e.currentTarget.value)}
      label={label}
      error={
        field.state.meta.errors.length > 0 ? field.state.meta.errors[0] : null
      }
      defaultValue={field.options.defaultValue}
    />
  )
}

interface NumberFieldProps {
  label: string
}

function NumberField({ label }: NumberFieldProps) {
  const field = useFieldContext()
  return (
    <TextInput
      value={field.state.value}
      onChange={(e) => field.setValue(e.currentTarget.valueAsNumber)}
      label={label}
      type="number"
      error={
        field.state.meta.errors.length > 0 ? field.state.meta.errors[0] : null
      }
      defaultValue={field.options.defaultValue}
    />
  )
}

const FieldComponents = {
  TextField,
  NumberField,
} as const

type AppField<TFormData> = FieldComponent<
  TFormData,
  ValidatorType,
  typeof FieldComponents
>

export function useAppForm<TFormData>(
  props: FormOptions<TFormData, ValidatorType>,
): ReactFormExtendedApi<TFormData> & {
  AppField: AppField<TFormData>
} {
  // You can override the default form options here by adding keys to the `props` object.
  const form = useForm({ ...props })

  const AppField = useMemo(() => {
    return (({ children, ...props }) => {
      return (
        <form.Field {...props}>
          {(field) => (
            <FormFieldContext.Provider value={field}>
              {children(Object.assign(field, FieldComponents))}
            </FormFieldContext.Provider>
          )}
        </form.Field>
      )
    }) satisfies AppField<TFormData>
  }, [form])

  const extendedForm = useMemo(() => {
    return Object.assign(form, {
      AppField,
    })
  }, [form, AppField])

  return extendedForm
}

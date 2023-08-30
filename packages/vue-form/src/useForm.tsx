import type { FormOptions, FormSubmitEvent } from '@tanstack/form-core'
import { FormApi } from '@tanstack/form-core'
import { type UseField, type FieldComponent, Field, useField } from './useField'
import { provideFormContext } from './formContext'
import type { SetupContext } from 'vue-demi'

declare module '@tanstack/form-core' {
  // eslint-disable-next-line no-shadow
  interface FormApi<TFormData> {
    Provider: (_: never, context: SetupContext) => any
    getFormProps: () => FormProps
    Field: FieldComponent<TFormData, TFormData>
    useField: UseField<TFormData>
  }
}

export type FormProps = {
  onSubmit: (e: FormSubmitEvent) => void
  disabled: boolean
}

export function useForm<TData>(opts?: FormOptions<TData>): FormApi<TData> {
  const formApi = (() => {
    // @ts-ignore
    const api = new FormApi<TData>(opts)

    api.Provider = (_, context: SetupContext) => {
      provideFormContext({ formApi: api })
      return context.slots.default!()
    }
    api.getFormProps = () => {
      return {
        onSubmit: formApi.handleSubmit,
        disabled: api.state.isSubmitting,
      }
    }
    api.Field = Field as any
    api.useField = useField as any

    return api
  })()

  // formApi.useStore((state) => state.isSubmitting)
  formApi.update(opts)

  return formApi as any
}

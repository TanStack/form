import type {
  FormState,
  FormOptions,
  FormSubmitEvent,
} from '@tanstack/form-core'
import { FormApi } from '@tanstack/form-core'
import { type UseField, useField } from './useField'
import Field from './Field.vue'
import { provideFormContext } from './formContext'

declare module '@tanstack/form-core' {
  // eslint-disable-next-line no-shadow
  interface FormApi<TFormData> {
    Provider: (props: { children: any }) => any
    getFormProps: () => FormProps
    Field: typeof Field
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

    // eslint-disable-next-line react/display-name
    api.Provider = ({ children }) => {
      provideFormContext({ formApi: api })
      return children
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

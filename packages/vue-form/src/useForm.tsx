import type { FormOptions, FormSubmitEvent } from '@tanstack/form-core'
import { FormApi, FormState, functionalUpdate } from '@tanstack/form-core'
import { type UseField, type FieldComponent, Field, useField } from './useField'
import { provideFormContext } from './formContext'
import { defineComponent } from 'vue-demi'
import { useStore } from './vue-store'
import { NoInfer } from './types'

declare module '@tanstack/form-core' {
  // eslint-disable-next-line no-shadow
  interface FormApi<TFormData> {
    Provider: (props: Record<string, any> & {}) => any
    getFormProps: () => FormProps
    Field: FieldComponent<TFormData, TFormData>
    useField: UseField<TFormData>
    useStore: <TSelected = NoInfer<FormState<TFormData>>>(
      selector?: (state: NoInfer<FormState<TFormData>>) => TSelected,
    ) => TSelected
    Subscribe: <TSelected = NoInfer<FormState<TFormData>>>(props: {
      selector?: (state: NoInfer<FormState<TFormData>>) => TSelected
    }) => any
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

    api.Provider = defineComponent(
      (_, context) => {
        provideFormContext({ formApi })
        return () => context.slots.default!()
      },
      { name: 'Provider' },
    )
    api.getFormProps = () => {
      return {
        onSubmit: formApi.handleSubmit,
        disabled: api.state.isSubmitting,
      }
    }
    api.Field = Field as any
    api.useField = useField as any
    api.useStore = (
      // @ts-ignore
      selector,
    ) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useStore(api.store as any, selector as any) as any
    }
    api.Subscribe = defineComponent(
      (props, context) => {
        const allProps = { ...props, ...context.attrs }
        const data = useStore(api.store as any, allProps.selector as any)
        return () => context.slots.default!(data.value)
      },
      {
        name: 'Subscribe',
        inheritAttrs: false,
      },
    )

    return api
  })()

  // formApi.useStore((state) => state.isSubmitting)
  formApi.update(opts)

  return formApi as any
}

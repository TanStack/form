import { FormApi, type FormState, type FormOptions } from '@tanstack/form-core'
import { useStore } from '@tanstack/vue-store'
import { type UseField, type FieldComponent, Field, useField } from './useField'
import { provideFormContext } from './formContext'
import {
  type EmitsOptions,
  type SlotsType,
  type SetupContext,
  defineComponent,
} from 'vue-demi'
import type { NoInfer } from './types'

declare module '@tanstack/form-core' {
  // eslint-disable-next-line no-shadow
  interface FormApi<TFormData> {
    Provider: (props: Record<string, any> & {}) => any
    provideFormContext: () => void
    Field: FieldComponent<TFormData, TFormData>
    useField: UseField<TFormData>
    useStore: <TSelected = NoInfer<FormState<TFormData>>>(
      selector?: (state: NoInfer<FormState<TFormData>>) => TSelected,
    ) => TSelected
    Subscribe: <TSelected = NoInfer<FormState<TFormData>>>(
      props: {
        selector?: (state: NoInfer<FormState<TFormData>>) => TSelected
      },
      context: SetupContext<
        EmitsOptions,
        SlotsType<{ default: NoInfer<FormState<TFormData>> }>
      >,
    ) => any
  }
}

export function useForm<TData>(opts?: FormOptions<TData>): FormApi<TData> {
  const formApi = (() => {
    const api = new FormApi<TData>(opts)

    api.Provider = defineComponent(
      (_, context) => {
        provideFormContext({ formApi })
        return () => context.slots.default!()
      },
      { name: 'Provider' },
    )
    api.provideFormContext = () => {
      provideFormContext({ formApi })
    }
    api.Field = Field as never
    api.useField = useField as never
    api.useStore = (selector) => {
      return useStore(api.store as never, selector as never) as never
    }
    api.Subscribe = defineComponent(
      (props, context) => {
        const allProps = { ...props, ...context.attrs }
        const selector = allProps.selector ?? ((state) => state)
        const data = useStore(api.store as never, selector as never)
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

  return formApi as never
}

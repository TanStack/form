import { FormApi } from '@tanstack/form-core'
import { useStore } from '@tanstack/vue-store'
import { defineComponent, onMounted } from 'vue'
import { Field, useField } from './useField'
import { provideFormContext } from './formContext'
import type { FormState, FormOptions, Validator } from '@tanstack/form-core'
import type { NoInfer } from '@tanstack/vue-store'
import type { EmitsOptions, SlotsType, SetupContext, Ref } from 'vue'
import type { UseField, FieldComponent } from './useField'

declare module '@tanstack/form-core' {
  // eslint-disable-next-line no-shadow
  interface FormApi<TFormData, TFormValidator> {
    Provider: (props: Record<string, any> & {}) => any
    provideFormContext: () => void
    Field: FieldComponent<TFormData, TFormValidator>
    useField: UseField<TFormData, TFormValidator>
    useStore: <TSelected = NoInfer<FormState<TFormData>>>(
      selector?: (state: NoInfer<FormState<TFormData>>) => TSelected,
    ) => Readonly<Ref<TSelected>>
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

export function useForm<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
>(
  opts?: FormOptions<TFormData, TFormValidator>,
): FormApi<TFormData, TFormValidator> {
  const formApi = (() => {
    const api = new FormApi<TFormData, TFormValidator>(opts)

    api.Provider = defineComponent(
      (_, context) => {
        onMounted(api.mount)
        provideFormContext({ formApi: formApi as never })
        return () => context.slots.default!()
      },
      { name: 'Provider' },
    )
    api.provideFormContext = () => {
      onMounted(api.mount)
      provideFormContext({ formApi: formApi as never })
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

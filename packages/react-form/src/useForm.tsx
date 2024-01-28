import type { FormState, FormOptions, Validator } from '@tanstack/form-core'
import { FormApi, functionalUpdate } from '@tanstack/form-core'
import type { NoInfer } from '@tanstack/react-store'
import { useStore } from '@tanstack/react-store'
import React, {
  type PropsWithChildren,
  type ReactNode,
  useState,
} from 'rehackt'
import { type UseField, type FieldComponent, Field, useField } from './useField'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

declare module '@tanstack/form-core' {
  // eslint-disable-next-line no-shadow
  interface FormApi<TFormData, TFormValidator> {
    Field: FieldComponent<TFormData, TFormValidator>
    useField: UseField<TFormData, TFormValidator>
    useStore: <TSelected = NoInfer<FormState<TFormData>>>(
      selector?: (state: NoInfer<FormState<TFormData>>) => TSelected,
    ) => TSelected
    Subscribe: <TSelected = NoInfer<FormState<TFormData>>>(props: {
      selector?: (state: NoInfer<FormState<TFormData>>) => TSelected
      children: ((state: NoInfer<TSelected>) => ReactNode) | ReactNode
    }) => JSX.Element
  }
}

export function useForm<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
>(
  opts?: FormOptions<TFormData, TFormValidator>,
): FormApi<TFormData, TFormValidator> {
  const [formApi] = useState(() => {
    // @ts-ignore
    const api = new FormApi<TFormData, TFormValidator>(opts)
    api.Field = (props) => <Field {...props} form={api} />
    api.useField = (props) => useField({ ...props, form: api })
    api.useStore = (
      // @ts-ignore
      selector,
    ) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useStore(api.store as any, selector as any) as any
    }
    api.Subscribe = (
      // @ts-ignore
      props,
    ) => {
      return functionalUpdate(
        props.children,
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useStore(api.store as any, props.selector as any),
      ) as any
    }

    return api
  })

  useIsomorphicLayoutEffect(formApi.mount, [])

  formApi.useStore((state) => state.isSubmitting)

  /**
   * formApi.update should not have any side effects. Think of it like a `useRef`
   * that we need to keep updated every render with the most up-to-date information.
   */
  useIsomorphicLayoutEffect(() => {
    formApi.update(opts)
  })

  return formApi as any
}

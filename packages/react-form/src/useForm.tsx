import { FormApi, functionalUpdate } from '@tanstack/form-core'
import { useStore } from '@tanstack/react-store'
import React, {
  type PropsWithChildren,
  type ReactNode,
  useState,
} from 'rehackt'
import { Field, useField } from './useField'
import { formContext } from './formContext'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'
import type { NoInfer } from '@tanstack/react-store'
import type { FormOptions, FormState, Validator } from '@tanstack/form-core'
import type { FieldComponent, UseField } from './useField'

declare module '@tanstack/form-core' {
  // eslint-disable-next-line no-shadow
  interface FormApi<TFormData, TFormValidator> {
    Provider: (props: PropsWithChildren) => JSX.Element
    Field: FieldComponent<TFormData, TFormValidator>
    useField: UseField<TFormData>
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

    api.Provider = function Provider(props) {
      useIsomorphicLayoutEffect(api.mount, [])
      return (
        <formContext.Provider {...props} value={{ formApi: api as never }} />
      )
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

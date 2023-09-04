import type { FormState, FormOptions } from '@tanstack/form-core'
import { FormApi, functionalUpdate } from '@tanstack/form-core'
import type { NoInfer } from '@tanstack/react-store'
import { useStore } from '@tanstack/react-store'
import React, { type ReactNode, useCallback, useState } from 'react'
import { type UseField, type FieldComponent, Field, useField } from './useField'
import { formContext } from './formContext'
import { useStableFormOpts } from './utils/useStableOptions'
import { useIsomorphicLayoutEffect } from './utils/useIsomorphicLayoutEffect'

declare module '@tanstack/form-core' {
  // eslint-disable-next-line no-shadow
  interface FormApi<TFormData> {
    Provider: (props: { children: any }) => any
    Field: FieldComponent<TFormData, TFormData>
    useField: UseField<TFormData>
    useStore: <TSelected = NoInfer<FormState<TFormData>>>(
      selector?: (state: NoInfer<FormState<TFormData>>) => TSelected,
    ) => TSelected
    Subscribe: <TSelected = NoInfer<FormState<TFormData>>>(props: {
      selector?: (state: NoInfer<FormState<TFormData>>) => TSelected
      children: ((state: NoInfer<TSelected>) => ReactNode) | ReactNode
    }) => any
  }
}

export function useForm<TData>(opts?: FormOptions<TData>): FormApi<TData> {
  const [formApi] = useState(() => {
    // @ts-ignore
    const api = new FormApi<TData>(opts)

    // eslint-disable-next-line react/display-name
    api.Provider = (props) => (
      <formContext.Provider {...props} value={{ formApi: api }} />
    )
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

  const options = useStableFormOpts(opts)

  useIsomorphicLayoutEffect(() => {
    formApi.update(options)
  }, [formApi, options])

  return formApi as any
}

/**
 * This is a hack to get around the fact that the type of useCallback does not
 * allow for the props type to be inferred. This is a known issue:
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/52873#issuecomment-845806435
 */
export const useFormCallback = useCallback as never as <
  Props extends Array<any>,
  Return,
>(
  fn: (...props: Props) => Return,
  deps: Array<any>,
) => typeof fn

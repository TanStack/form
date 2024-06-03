import { FormApi, functionalUpdate } from '@tanstack/form-core'
import { useStore } from '@tanstack/react-store'
import React, { useState } from 'rehackt'
import { Field, type FieldComponent, type UseField, useField } from './useField'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'
import type { NoInfer } from '@tanstack/react-store'
import type { FormOptions, FormState, Validator } from '@tanstack/form-core'
import type { NodeType } from './types'

declare module '@tanstack/form-core' {
  // eslint-disable-next-line no-shadow
  interface FormApi<TFormData, TFormValidator> {
    Field: FieldComponent<TFormData, TFormValidator>
    useField: UseField<TFormData, TFormValidator>
    useStore: <TSelected = NoInfer<FormState<TFormData>>>(
      selector?: (state: NoInfer<FormState<TFormData>>) => TSelected,
    ) => TSelected
    Subscribe: <TSelected = NoInfer<FormState<TFormData>>>(props: {
      /**
      TypeScript versions <=5.0.4 have a bug that prevents
      the type of the `TSelected` generic from being inferred
      from the return type of this method.

      In these versions, `TSelected` will fall back to the default
      type (or `unknown` if that's not defined).

      @see {@link https://github.com/TanStack/form/pull/606/files#r1506715714 | This discussion on GitHub for the details}
      @see {@link https://github.com/microsoft/TypeScript/issues/52786 | The bug report in `microsoft/TypeScript`}
      */
      selector?: (state: NoInfer<FormState<TFormData>>) => TSelected
      children: ((state: NoInfer<TSelected>) => NodeType) | NodeType
    }) => NodeType
  }
}

export function useForm<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
>(
  opts?: FormOptions<TFormData, TFormValidator>,
): FormApi<TFormData, TFormValidator> {
  const [formApi] = useState(() => {
    const api = new FormApi<TFormData, TFormValidator>(opts)
    api.Field = function APIField(props) {
      return (<Field {...props} form={api} />) as never
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
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

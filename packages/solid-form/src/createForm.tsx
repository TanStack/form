import type { FormOptions, FormState } from '@tanstack/form-core'
import { FormApi, functionalUpdate } from '@tanstack/form-core'
import { createComputed, type JSXElement } from 'solid-js'
import { useStore } from '@tanstack/solid-store'
import {
  Field,
  createField,
  type CreateField,
  type FieldComponent,
} from './createField'
import { formContext } from './formContext'

type NoInfer<T> = [T][T extends any ? 0 : never]

declare module '@tanstack/form-core' {
  // eslint-disable-next-line no-shadow
  interface FormApi<TFormData, ValidatorType> {
    Provider: (props: { children: any }) => any
    Field: FieldComponent<TFormData, ValidatorType>
    createField: CreateField<TFormData>
    useStore: <TSelected = NoInfer<FormState<TFormData>>>(
      selector?: (state: NoInfer<FormState<TFormData>>) => TSelected,
    ) => () => TSelected
    Subscribe: <TSelected = NoInfer<FormState<TFormData>>>(props: {
      selector?: (state: NoInfer<FormState<TFormData>>) => TSelected
      children: ((state: () => NoInfer<TSelected>) => JSXElement) | JSXElement
    }) => any
  }
}

export function createForm<TData, FormValidator>(
  opts?: () => FormOptions<TData, FormValidator>,
): FormApi<TData, FormValidator> {
  const options = opts?.()
  const formApi = new FormApi<TData, FormValidator>(options)

  formApi.Provider = function Provider(props) {
    return <formContext.Provider {...props} value={{ formApi: formApi }} />
  }
  formApi.Field = Field as any
  formApi.createField = createField as CreateField<TData>
  formApi.useStore = (selector) => useStore(formApi.store, selector)
  formApi.Subscribe = (props) =>
    functionalUpdate(props.children, useStore(formApi.store, props.selector))

  /**
   * formApi.update should not have any side effects. Think of it like a `useRef`
   * that we need to keep updated every render with the most up-to-date information.
   */
  createComputed(() => formApi.update(opts?.()))

  return formApi
}

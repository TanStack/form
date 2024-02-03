import { FormApi, functionalUpdate } from '@tanstack/form-core'
import { createComputed, onMount, type JSXElement } from 'solid-js'
import { useStore } from '@tanstack/solid-store'
import {
  Field,
  createField,
  type CreateField,
  type FieldComponent,
} from './createField'
import { formContext } from './formContext'
import type { FormOptions, FormState, Validator } from '@tanstack/form-core'

type NoInfer<T> = [T][T extends any ? 0 : never]

declare module '@tanstack/form-core' {
  // eslint-disable-next-line no-shadow
  interface FormApi<TFormData, TFormValidator> {
    Provider: (props: { children: any }) => JSXElement
    Field: FieldComponent<TFormData, TFormValidator>
    createField: CreateField<TFormData>
    useStore: <TSelected = NoInfer<FormState<TFormData>>>(
      selector?: (state: NoInfer<FormState<TFormData>>) => TSelected,
    ) => () => TSelected
    Subscribe: <TSelected = NoInfer<FormState<TFormData>>>(props: {
      selector?: (state: NoInfer<FormState<TFormData>>) => TSelected
      children: ((state: () => NoInfer<TSelected>) => JSXElement) | JSXElement
    }) => JSXElement
  }
}

export function createForm<
  TParentData,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
>(
  opts?: () => FormOptions<TParentData, TFormValidator>,
): FormApi<TParentData, TFormValidator> {
  const options = opts?.()
  const formApi = new FormApi<TParentData, TFormValidator>(options)

  formApi.Provider = function Provider(props) {
    onMount(formApi.mount)
    return (
      <formContext.Provider {...props} value={{ formApi: formApi as never }} />
    )
  }
  formApi.Field = Field as any
  formApi.createField = createField as CreateField<TParentData>
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

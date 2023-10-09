import type { FormOptions, FormState } from '@tanstack/form-core'
import { FormApi, functionalUpdate } from '@tanstack/form-core'
import { createComputed, on, onCleanup, type JSXElement } from 'solid-js'
import { createStore } from 'solid-js/store'

import { formContext } from './formContext'
import {
  Field,
  createField,
  type FieldComponent,
  type CreateField,
} from './createField'

type NoInfer<T> = [T][T extends any ? 0 : never]

declare module '@tanstack/form-core' {
  // eslint-disable-next-line no-shadow
  interface FormApi<TFormData> {
    Provider: (props: { children: any }) => any
    Field: FieldComponent<TFormData>
    useField: CreateField<TFormData>
    useStore: <TSelected = NoInfer<FormState<TFormData>>>(
      selector?: (state: NoInfer<FormState<TFormData>>) => TSelected,
    ) => TSelected
    Subscribe: <TSelected = NoInfer<FormState<TFormData>>>(props: {
      selector?: (state: NoInfer<FormState<TFormData>>) => TSelected
      children: ((state: NoInfer<TSelected>) => JSXElement) | JSXElement
    }) => any
  }
}

export function createForm<TData>(
  opts?: () => FormOptions<TData>,
): FormApi<TData> {
  const options = opts?.()
  const formApi = new FormApi<TData>(options)
  const [formApiStore, setFormApiStore] = createStore(formApi.store.state)
  const unsubscribeFromStore = formApi.store.subscribe(() =>
    setFormApiStore(formApi.store.state),
  )
  onCleanup(unsubscribeFromStore)
  formApi.Provider = function Provider(props) {
    return <formContext.Provider {...props} value={{ formApi: formApi }} />
  }
  formApi.Field = Field as any
  formApi.useField = createField<TData>
  formApi.useStore = (selector) =>
    (selector ? selector(formApiStore) : formApiStore) as any
  formApi.Subscribe = (props) =>
    functionalUpdate(
      props.children,
      (props.selector ? props.selector(formApiStore) : formApiStore) as any,
    )

  /**
   * formApi.update should not have any side effects. Think of it like a `useRef`
   * that we need to keep updated every render with the most up-to-date information.
   */
  createComputed(() => formApi.update(opts?.()))

  return formApi
}

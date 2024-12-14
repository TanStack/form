import { FormApi, functionalUpdate } from '@tanstack/form-core'
import { createComputed, onMount } from 'solid-js'
import { useStore } from '@tanstack/solid-store'
import { Field, createField } from './createField'
import type { JSXElement } from 'solid-js'
import type { CreateField, FieldComponent } from './createField'
import type {
  FormOptions,
  FormState,
  StandardSchemaValidator,
  Validator,
} from '@tanstack/form-core'

type NoInfer<T> = [T][T extends any ? 0 : never]

export interface SolidFormApi<
  TFormData,
  TFormValidator extends Validator<
    TFormData,
    unknown
  > = StandardSchemaValidator,
> {
  Field: FieldComponent<TFormData, TFormValidator>
  createField: CreateField<TFormData, TFormValidator>
  useStore: <TSelected = NoInfer<FormState<TFormData>>>(
    selector?: (state: NoInfer<FormState<TFormData>>) => TSelected,
  ) => () => TSelected
  Subscribe: <TSelected = NoInfer<FormState<TFormData>>>(props: {
    selector?: (state: NoInfer<FormState<TFormData>>) => TSelected
    children: ((state: () => NoInfer<TSelected>) => JSXElement) | JSXElement
  }) => JSXElement
}

export function createForm<
  TParentData,
  TFormValidator extends Validator<
    TParentData,
    unknown
  > = StandardSchemaValidator,
>(opts?: () => FormOptions<TParentData, TFormValidator>) {
  const options = opts?.()
  const api = new FormApi<TParentData, TFormValidator>(options)
  const extendedApi: typeof api & SolidFormApi<TParentData, TFormValidator> =
    api as never

  extendedApi.Field = (props) => <Field {...props} form={api} />
  extendedApi.createField = (props) =>
    createField(() => {
      return { ...props(), form: api }
    })
  extendedApi.useStore = (selector) => useStore(api.store, selector)
  extendedApi.Subscribe = (props) =>
    functionalUpdate(props.children, useStore(api.store, props.selector))

  onMount(api.mount)

  /**
   * formApi.update should not have any side effects. Think of it like a `useRef`
   * that we need to keep updated every render with the most up-to-date information.
   */
  createComputed(() => api.update(opts?.()))

  return extendedApi
}

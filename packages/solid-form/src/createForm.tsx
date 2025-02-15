import { FormApi, functionalUpdate } from '@tanstack/form-core'
import { createComputed, onMount } from 'solid-js'
import { useStore } from '@tanstack/solid-store'
import { Field, createField } from './createField'
import type { JSXElement } from 'solid-js'
import type { CreateField, FieldComponent } from './createField'
import type { FormOptions, FormState, Validator } from '@tanstack/form-core'

type NoInfer<T> = [T][T extends any ? 0 : never]

export interface SolidFormApi<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
  TFormOnMountReturn = undefined,
  TFormOnChangeReturn = undefined,
  TFormOnChangeAsyncReturn = undefined,
  TFormOnBlurReturn = undefined,
  TFormOnBlurAsyncReturn = undefined,
  TFormOnSubmitReturn = undefined,
  TFormOnSubmitAsyncReturn = undefined,
  TFormOnServerReturn = undefined,
> {
  Field: FieldComponent<
    TFormData,
    TFormValidator,
    TFormOnMountReturn,
    TFormOnChangeReturn,
    TFormOnChangeAsyncReturn,
    TFormOnBlurReturn,
    TFormOnBlurAsyncReturn,
    TFormOnSubmitReturn,
    TFormOnSubmitAsyncReturn,
    TFormOnServerReturn
  >
  createField: CreateField<
    TFormData,
    TFormValidator,
    TFormOnMountReturn,
    TFormOnChangeReturn,
    TFormOnChangeAsyncReturn,
    TFormOnBlurReturn,
    TFormOnBlurAsyncReturn,
    TFormOnSubmitReturn,
    TFormOnSubmitAsyncReturn,
    TFormOnServerReturn
  >
  useStore: <
    TSelected = NoInfer<
      FormState<
        TFormData,
        TFormOnMountReturn,
        TFormOnChangeReturn,
        TFormOnChangeAsyncReturn,
        TFormOnBlurReturn,
        TFormOnBlurAsyncReturn,
        TFormOnSubmitReturn,
        TFormOnSubmitAsyncReturn,
        TFormOnServerReturn
      >
    >,
  >(
    selector?: (
      state: NoInfer<
        FormState<
          TFormData,
          TFormOnMountReturn,
          TFormOnChangeReturn,
          TFormOnChangeAsyncReturn,
          TFormOnBlurReturn,
          TFormOnBlurAsyncReturn,
          TFormOnSubmitReturn,
          TFormOnSubmitAsyncReturn,
          TFormOnServerReturn
        >
      >,
    ) => TSelected,
  ) => () => TSelected
  Subscribe: <
    TSelected = NoInfer<
      FormState<
        TFormData,
        TFormOnMountReturn,
        TFormOnChangeReturn,
        TFormOnChangeAsyncReturn,
        TFormOnBlurReturn,
        TFormOnBlurAsyncReturn,
        TFormOnSubmitReturn,
        TFormOnSubmitAsyncReturn,
        TFormOnServerReturn
      >
    >,
  >(props: {
    selector?: (
      state: NoInfer<
        FormState<
          TFormData,
          TFormOnMountReturn,
          TFormOnChangeReturn,
          TFormOnChangeAsyncReturn,
          TFormOnBlurReturn,
          TFormOnBlurAsyncReturn,
          TFormOnSubmitReturn,
          TFormOnSubmitAsyncReturn,
          TFormOnServerReturn
        >
      >,
    ) => TSelected
    children: ((state: () => NoInfer<TSelected>) => JSXElement) | JSXElement
  }) => JSXElement
}

export function createForm<
  TParentData,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  TFormOnMountReturn = undefined,
  TFormOnChangeReturn = undefined,
  TFormOnChangeAsyncReturn = undefined,
  TFormOnBlurReturn = undefined,
  TFormOnBlurAsyncReturn = undefined,
  TFormOnSubmitReturn = undefined,
  TFormOnSubmitAsyncReturn = undefined,
  TFormOnServerReturn = undefined,
>(
  opts?: () => FormOptions<
    TParentData,
    TFormValidator,
    TFormOnMountReturn,
    TFormOnChangeReturn,
    TFormOnChangeAsyncReturn,
    TFormOnBlurReturn,
    TFormOnBlurAsyncReturn,
    TFormOnSubmitReturn,
    TFormOnSubmitAsyncReturn,
    TFormOnServerReturn
  >,
) {
  const options = opts?.()
  const api = new FormApi<
    TParentData,
    TFormValidator,
    TFormOnMountReturn,
    TFormOnChangeReturn,
    TFormOnChangeAsyncReturn,
    TFormOnBlurReturn,
    TFormOnBlurAsyncReturn,
    TFormOnSubmitReturn,
    TFormOnSubmitAsyncReturn,
    TFormOnServerReturn
  >(options)
  const extendedApi: typeof api &
    SolidFormApi<
      TParentData,
      TFormValidator,
      TFormOnMountReturn,
      TFormOnChangeReturn,
      TFormOnChangeAsyncReturn,
      TFormOnBlurReturn,
      TFormOnBlurAsyncReturn,
      TFormOnSubmitReturn,
      TFormOnSubmitAsyncReturn,
      TFormOnServerReturn
    > = api as never

  extendedApi.Field = (props) => <Field {...props} form={api} />
  extendedApi.createField = (props) =>
    createField(() => {
      return { ...props(), form: api }
    }) as never
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

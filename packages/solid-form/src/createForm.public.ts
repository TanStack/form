import { createRenderEffect, untrack } from 'solid-js'
import { initializeForm } from './SolidFormApi.lib'
import type {
  FieldApi,
  FieldApiOptions,
  FormApi,
  FormOptions,
  FormState,
  FormValidator,
} from '@tanstack/form-core-v2'
import type { Accessor, JSX } from 'solid-js'

export interface SolidFormSubscribeProps<TFormData, TSelected> {
  /**
   * Select from the full form state. Children receive a Solid accessor for the
   * selected value.
   */
  selector: (state: FormState<TFormData>) => TSelected
  children: JSX.Element | ((state: Accessor<TSelected>) => JSX.Element)
}

export interface SolidFormFieldProps<
  TData,
  TFormValidators extends Array<FormValidator<TData>>,
  TFieldValue,
> extends FieldApiOptions<TData, TFormValidators, TFieldValue> {
  children: (
    fieldApi: Accessor<FieldApi<TData, TFormValidators>>,
  ) => JSX.Element
}

export interface SolidFormArrayFieldProps<
  TData,
  TFormValidators extends Array<FormValidator<TData>>,
  TFieldValue,
> extends FieldApiOptions<TData, TFormValidators, TFieldValue> {
  children: (
    fieldApi: Accessor<FieldApi<TData, TFormValidators>>,
  ) => JSX.Element
}

export interface SolidTanStackFormComponents<
  TFormData,
  TFormValidators extends Array<FormValidator<TFormData>>,
> {
  /**
   * TODO docs
   */
  Field: <TFieldValue>(
    props: SolidFormFieldProps<TFormData, TFormValidators, TFieldValue>,
  ) => JSX.Element
  ArrayField: <TFieldValue>(
    props: SolidFormArrayFieldProps<TFormData, TFormValidators, TFieldValue>,
  ) => JSX.Element
  Subscribe: <TSelected>(
    props: SolidFormSubscribeProps<TFormData, TSelected>,
  ) => JSX.Element
}

export interface SolidFormApi<
  TFormData,
  TFormValidators extends Array<FormValidator<TFormData>>,
>
  extends
    FormApi<TFormData, TFormValidators>,
    SolidTanStackFormComponents<TFormData, TFormValidators> {}

/**
 * TODO docs
 */
export function createForm<
  TData,
  TFormValidators extends Array<FormValidator<TData>>,
>(
  options: Accessor<FormOptions<TData, TFormValidators>>,
): SolidFormApi<TData, TFormValidators> {
  const form = untrack(() => initializeForm(options()))

  createRenderEffect(() => {
    form._update(options())
  })

  return form
}

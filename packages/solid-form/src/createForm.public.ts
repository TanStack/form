import { createRenderEffect, untrack } from 'solid-js'
import { initializeForm } from './SolidFormApi.lib'
import type {
  DeepKeys,
  DeepKeysWhereValueIncludes,
  DeepValue,
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
  TFormData,
  TFormValidators extends ReadonlyArray<FormValidator<TFormData>>,
  TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
> extends FieldApiOptions<TFormData, TFormValidators, TFieldName, TFieldValue> {
  children: (
    fieldApi: Accessor<
      FieldApi<TFormData, TFormValidators, TFieldName, TFieldValue>
    >,
  ) => JSX.Element
}

export interface SolidFormArrayFieldProps<
  TFormData,
  TFormValidators extends ReadonlyArray<FormValidator<TFormData>>,
  TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
> extends FieldApiOptions<TFormData, TFormValidators, TFieldName, TFieldValue> {
  children: (
    fieldApi: Accessor<
      FieldApi<TFormData, TFormValidators, TFieldName, TFieldValue>
    >,
  ) => JSX.Element
}

export interface SolidTanStackFormComponents<
  TFormData,
  TFormValidators extends ReadonlyArray<FormValidator<TFormData>>,
> {
  /**
   * TODO docs
   */
  Field: <
    TFieldName extends DeepKeys<TFormData>,
    TFieldValue extends DeepValue<TFormData, TFieldName>,
  >(
    props: SolidFormFieldProps<
      TFormData,
      TFormValidators,
      TFieldName,
      TFieldValue
    >,
  ) => JSX.Element
  ArrayField: <
    TFieldName extends DeepKeysWhereValueIncludes<TFormData, Array<any>>,
    TFieldValue extends DeepValue<TFormData, TFieldName>,
  >(
    props: SolidFormArrayFieldProps<
      TFormData,
      TFormValidators,
      TFieldName,
      TFieldValue
    >,
  ) => JSX.Element
  Subscribe: <TSelected>(
    props: SolidFormSubscribeProps<TFormData, TSelected>,
  ) => JSX.Element
}

export interface SolidFormApi<
  TFormData,
  TFormValidators extends ReadonlyArray<FormValidator<TFormData>>,
>
  extends
    FormApi<TFormData, TFormValidators>,
    SolidTanStackFormComponents<TFormData, TFormValidators> {}

/**
 * TODO docs
 */
export function createForm<
  TData,
  TFormValidators extends ReadonlyArray<FormValidator<TData>>,
>(
  options: Accessor<FormOptions<TData, TFormValidators>>,
): SolidFormApi<TData, TFormValidators> {
  const form = untrack(() => initializeForm(options()))

  createRenderEffect(() => {
    form._update(options())
  })

  return form
}

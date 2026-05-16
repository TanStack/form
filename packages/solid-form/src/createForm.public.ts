import { createRenderEffect, untrack } from 'solid-js'
import { initializeForm } from './SolidFormApi.lib'
import type {
  DeepKeys,
  DeepKeysWhereValueIncludes,
  DeepValue,
  FieldApi,
  FieldApiOptions,
  FieldValidators,
  FormApi,
  FormOptions,
  FormState,
  FormValidators,
} from '@tanstack/form-core-v2'
import type { Accessor, JSX } from 'solid-js'

export interface SolidFormSubscribeProps<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSelected,
> {
  /**
   * Select from the full form state. Children receive a Solid accessor for the
   * selected value.
   */
  selector: (state: FormState<TFormData, TFormValidators>) => TSelected
  children: JSX.Element | ((state: Accessor<TSelected>) => JSX.Element)
}

export interface SolidFormFieldProps<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
  TFieldValidators extends FieldValidators<TFormData, TFieldName, TFieldValue>,
> extends FieldApiOptions<
  TFormData,
  TFormValidators,
  TFieldName,
  TFieldValue,
  TFieldValidators
> {
  children: (
    fieldApi: Accessor<
      FieldApi<
        TFormData,
        TFormValidators,
        TFieldName,
        TFieldValue,
        TFieldValidators
      >
    >,
  ) => JSX.Element
}

export interface SolidFormArrayFieldProps<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TFieldName extends DeepKeysWhereValueIncludes<TFormData, Array<any>>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
  TFieldValidators extends FieldValidators<TFormData, TFieldName, TFieldValue>,
> extends FieldApiOptions<
  TFormData,
  TFormValidators,
  TFieldName,
  TFieldValue,
  TFieldValidators
> {
  children: (
    fieldApi: Accessor<
      FieldApi<
        TFormData,
        TFormValidators,
        TFieldName,
        TFieldValue,
        TFieldValidators
      >
    >,
  ) => JSX.Element
}

export interface SolidTanStackFormComponents<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
> {
  /**
   * TODO docs
   */
  Field: <
    TFieldName extends DeepKeys<TFormData>,
    TFieldValue extends DeepValue<TFormData, TFieldName>,
    TFieldValidators extends FieldValidators<
      TFormData,
      TFieldName,
      TFieldValue
    >,
  >(
    props: SolidFormFieldProps<
      TFormData,
      TFormValidators,
      TFieldName,
      TFieldValue,
      TFieldValidators
    >,
  ) => JSX.Element
  ArrayField: <
    TFieldName extends DeepKeysWhereValueIncludes<TFormData, Array<any>>,
    TFieldValue extends DeepValue<TFormData, TFieldName>,
    TFieldValidators extends FieldValidators<
      TFormData,
      TFieldName,
      TFieldValue
    >,
  >(
    props: SolidFormArrayFieldProps<
      TFormData,
      TFormValidators,
      TFieldName,
      TFieldValue,
      TFieldValidators
    >,
  ) => JSX.Element
  Subscribe: <TSelected>(
    props: SolidFormSubscribeProps<TFormData, TFormValidators, TSelected>,
  ) => JSX.Element
}

export interface SolidFormApi<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
>
  extends
    FormApi<TFormData, TFormValidators>,
    SolidTanStackFormComponents<TFormData, TFormValidators> {}

/**
 * TODO docs
 */
export function createForm<
  TData,
  TFormValidators extends FormValidators<TData>,
>(
  options: Accessor<FormOptions<TData, TFormValidators>>,
): SolidFormApi<TData, TFormValidators> {
  const form = untrack(() => initializeForm(options()))

  createRenderEffect(() => {
    form._update(options())
  })

  return form
}

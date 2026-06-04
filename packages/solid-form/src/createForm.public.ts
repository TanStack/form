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
  TSubmitReturn,
  TSelected,
> {
  /**
   * Select from the full form state. Children receive a Solid accessor for the
   * selected value.
   */
  selector: (
    state: FormState<TFormData, TFormValidators, TSubmitReturn>,
  ) => TSelected
  children: JSX.Element | ((state: Accessor<TSelected>) => JSX.Element)
}

export interface SolidFormFieldProps<
  TFormData,
  TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
  TFieldValidators extends FieldValidators<TFormData, TFieldName, TFieldValue>,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
> extends FieldApiOptions<
  TFormData,
  TFieldName,
  TFieldValue,
  TFieldValidators,
  [],
  TFormData,
  TFormValidators,
  TSubmitReturn
> {
  children: (
    fieldApi: Accessor<
      FieldApi<
        TFormData,
        TFieldName,
        TFieldValue,
        TFieldValidators,
        [],
        TFormData,
        TFormValidators,
        TSubmitReturn
      >
    >,
  ) => JSX.Element
}

export interface SolidFormArrayFieldProps<
  TFormData,
  TFieldName extends DeepKeysWhereValueIncludes<TFormData, Array<any>>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
  TFieldValidators extends FieldValidators<TFormData, TFieldName, TFieldValue>,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
> extends FieldApiOptions<
  TFormData,
  TFieldName,
  TFieldValue,
  TFieldValidators,
  [],
  TFormData,
  TFormValidators,
  TSubmitReturn
> {
  children: (
    fieldApi: Accessor<
      FieldApi<
        TFormData,
        TFieldName,
        TFieldValue,
        TFieldValidators,
        [],
        TFormData,
        TFormValidators,
        TSubmitReturn
      >
    >,
  ) => JSX.Element
}

export interface SolidTanStackFormComponents<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
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
      TFieldName,
      TFieldValue,
      TFieldValidators,
      TFormValidators,
      TSubmitReturn
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
      TFieldName,
      TFieldValue,
      TFieldValidators,
      TFormValidators,
      TSubmitReturn
    >,
  ) => JSX.Element
  Subscribe: <TSelected>(
    props: SolidFormSubscribeProps<
      TFormData,
      TFormValidators,
      TSubmitReturn,
      TSelected
    >,
  ) => JSX.Element
}

export interface SolidFormApi<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>
  extends
    FormApi<TFormData, TFormValidators, TSubmitReturn>,
    SolidTanStackFormComponents<TFormData, TFormValidators, TSubmitReturn> {}

/**
 * TODO docs
 */
export function createForm<
  TData,
  const TFormValidators extends FormValidators<TData>,
  TSubmitReturn,
>(
  options: Accessor<FormOptions<TData, TFormValidators, TSubmitReturn>>,
): SolidFormApi<TData, TFormValidators, TSubmitReturn> {
  const form = untrack(() => initializeForm(options()))

  createRenderEffect(() => {
    form._update(options())
  })

  return form
}

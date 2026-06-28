import { createRenderEffect, onCleanup, untrack } from 'solid-js'
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
  FormValidatorMetas,
  FormValidators,
  ToFieldValidatorMetas,
  ToFormGroupValidatorMetas,
  ToFormValidatorMetas,
  ToSubmitMeta,
} from '@tanstack/form-core'
import type { Accessor, JSX } from 'solid-js'

export interface SolidFormSubscribeProps<
  TFormData,
  TFormValidatorMetas extends FormValidatorMetas,
  TSubmitReturn,
  TSelected,
> {
  /**
   * Select from the full form state. Children receive a Solid accessor for the
   * selected value.
   */
  selector: (
    state: FormState<TFormData, TFormValidatorMetas, TSubmitReturn>,
  ) => TSelected
  children: JSX.Element | ((state: Accessor<TSelected>) => JSX.Element)
}

export interface SolidFormFieldProps<
  TFormData,
  TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
  TFieldValidators extends FieldValidators<TFormData, TFieldName, TFieldValue>,
  TFormValidatorMetas extends FormValidatorMetas,
  TSubmitReturn,
> extends FieldApiOptions<
  TFormData,
  TFieldName,
  TFieldValue,
  TFieldValidators,
  [],
  TFormData,
  TFormValidatorMetas,
  TSubmitReturn
> {
  children: (
    fieldApi: Accessor<
      FieldApi<
        TFieldName,
        TFieldValue,
        ToFieldValidatorMetas<TFieldValidators>,
        ToFormGroupValidatorMetas<[]>,
        TFormData,
        TFormValidatorMetas,
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
  TFormValidatorMetas extends FormValidatorMetas,
  TSubmitReturn,
> extends FieldApiOptions<
  TFormData,
  TFieldName,
  TFieldValue,
  TFieldValidators,
  [],
  TFormData,
  TFormValidatorMetas,
  TSubmitReturn
> {
  children: (
    fieldApi: Accessor<
      FieldApi<
        TFieldName,
        TFieldValue,
        ToFieldValidatorMetas<TFieldValidators>,
        ToFormGroupValidatorMetas<[]>,
        TFormData,
        TFormValidatorMetas,
        TSubmitReturn
      >
    >,
  ) => JSX.Element
}

export interface SolidTanStackFormComponents<
  TFormData,
  TFormValidatorMetas extends FormValidatorMetas,
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
      TFormValidatorMetas,
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
      TFormValidatorMetas,
      TSubmitReturn
    >,
  ) => JSX.Element
  Subscribe: <TSelected>(
    props: SolidFormSubscribeProps<
      TFormData,
      TFormValidatorMetas,
      TSubmitReturn,
      TSelected
    >,
  ) => JSX.Element
}

export interface SolidFormApi<
  TFormData,
  TFormValidatorMetas extends FormValidatorMetas,
  TSubmitReturn,
>
  extends
    FormApi<TFormData, TFormValidatorMetas, TSubmitReturn>,
    SolidTanStackFormComponents<
      TFormData,
      TFormValidatorMetas,
      TSubmitReturn
    > {}

/**
 * TODO docs
 */
export function createForm<
  TData,
  const TFormValidators extends FormValidators<TData>,
  TSubmitReturn,
>(
  options: Accessor<FormOptions<TData, TFormValidators, TSubmitReturn>>,
): SolidFormApi<
  TData,
  ToFormValidatorMetas<TFormValidators>,
  ToSubmitMeta<TSubmitReturn>
> {
  const form = untrack(() => initializeForm(options()))

  createRenderEffect(() => {
    form._update(options() as never)
  })

  const unmount = form.mount()
  onCleanup(unmount)

  return form as never
}

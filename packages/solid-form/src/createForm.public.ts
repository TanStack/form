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
  FormErrorTypes,
  FormOptions,
  FormState,
  FormValidators,
  ToFieldError,
  ToFormErrorTypes,
} from '@tanstack/form-core'
import type { Accessor, JSX } from 'solid-js'

export interface SolidFormSubscribeProps<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TSelected,
> {
  /**
   * Select from the full form state. Children receive a Solid accessor for the
   * selected value.
   */
  selector: (state: FormState<TFormData, TFormErrorTypes>) => TSelected
  children: JSX.Element | ((state: Accessor<TSelected>) => JSX.Element)
}

export interface SolidFormFieldProps<
  TFormData,
  TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
  TFieldValidators extends FieldValidators<TFormData, TFieldName, TFieldValue>,
  TFormErrorTypes extends FormErrorTypes,
> extends FieldApiOptions<
  TFormData,
  TFieldName,
  TFieldValue,
  TFieldValidators,
  [],
  TFormData,
  TFormErrorTypes
> {
  children: (
    fieldApi: Accessor<
      FieldApi<
        TFieldName,
        TFieldValue,
        ToFieldError<TFieldValidators, [], TFormErrorTypes>,
        TFormData,
        TFormErrorTypes
      >
    >,
  ) => JSX.Element
}

export interface SolidFormArrayFieldProps<
  TFormData,
  TFieldName extends DeepKeysWhereValueIncludes<TFormData, Array<any>>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
  TFieldValidators extends FieldValidators<TFormData, TFieldName, TFieldValue>,
  TFormErrorTypes extends FormErrorTypes,
> extends FieldApiOptions<
  TFormData,
  TFieldName,
  TFieldValue,
  TFieldValidators,
  [],
  TFormData,
  TFormErrorTypes
> {
  children: (
    fieldApi: Accessor<
      FieldApi<
        TFieldName,
        TFieldValue,
        ToFieldError<TFieldValidators, [], TFormErrorTypes>,
        TFormData,
        TFormErrorTypes
      >
    >,
  ) => JSX.Element
}

export interface SolidTanStackFormComponents<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
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
      TFormErrorTypes
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
      TFormErrorTypes
    >,
  ) => JSX.Element
  Subscribe: <TSelected>(
    props: SolidFormSubscribeProps<TFormData, TFormErrorTypes, TSelected>,
  ) => JSX.Element
}

export interface SolidFormApi<TFormData, TFormErrorTypes extends FormErrorTypes>
  extends
    FormApi<TFormData, TFormErrorTypes>,
    SolidTanStackFormComponents<TFormData, TFormErrorTypes> {}

/**
 * TODO docs
 */
export function createForm<
  TData,
  const TFormValidators extends FormValidators<TData>,
  TSubmitReturn,
>(
  options: Accessor<FormOptions<TData, TFormValidators, TSubmitReturn>>,
): SolidFormApi<TData, ToFormErrorTypes<TFormValidators, TSubmitReturn>> {
  const form = untrack(() => initializeForm(options()))

  createRenderEffect(() => {
    form._update(options() as never)
  })

  const unmount = form.mount()
  onCleanup(unmount)

  return form as never
}

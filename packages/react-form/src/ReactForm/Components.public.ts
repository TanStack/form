import type {
  DeepKeys,
  DeepKeysWhereValueIncludes,
  DeepValue,
  FieldApi,
  FieldApiOptions,
  FieldValidators,
  FormState,
  FormValidators,
} from '@tanstack/form-core-v2'
import type { SubscribeProps } from '../Subscribe.public'
import type { CrossVersionReactNode } from '../types.public'
import type { FunctionComponent } from 'react'
import type { FieldComponentsMatchingType } from '../AppForm/createComponents.public'

/**
 * Subscribe to `form.store` (full form state). The selector receives the full
 * {@link FormState}.
 */
export type ReactFormSubscribeProps<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TSelected,
> = Omit<
  SubscribeProps<
    FormState<TFormData, TFormValidators, TSubmitReturn>,
    TSelected
  >,
  'source'
>

export type ReactFormSubscribeComponent<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
> = <TSelected>(
  props: ReactFormSubscribeProps<
    TFormData,
    TFormValidators,
    TSubmitReturn,
    TSelected
  >,
) => CrossVersionReactNode

export interface ReactFormFieldProps<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
  TFieldValidators extends FieldValidators<TFormData, TFieldName, TFieldValue>,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> extends FieldApiOptions<
  TFormData,
  TFormValidators,
  TSubmitReturn,
  TFieldName,
  TFieldValue,
  TFieldValidators
> {
  children: (
    fieldApi: FieldApi<
      TFormData,
      TFormValidators,
      TSubmitReturn,
      TFieldName,
      TFieldValue,
      TFieldValidators
    > &
      FieldComponentsMatchingType<TFieldComponents, TFieldValue>,
  ) => CrossVersionReactNode
}

export type ReactFormFieldComponent<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = <
  TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
  TFieldValidators extends FieldValidators<TFormData, TFieldName, TFieldValue>,
>(
  props: ReactFormFieldProps<
    TFormData,
    TFormValidators,
    TSubmitReturn,
    TFieldName,
    TFieldValue,
    TFieldValidators,
    TFieldComponents
  >,
) => CrossVersionReactNode

export interface ReactFormArrayFieldProps<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TFieldName extends DeepKeysWhereValueIncludes<TFormData, Array<any>>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
  TFieldValidators extends FieldValidators<TFormData, TFieldName, TFieldValue>,
> extends FieldApiOptions<
  TFormData,
  TFormValidators,
  TSubmitReturn,
  TFieldName,
  TFieldValue,
  TFieldValidators
> {
  children: (
    fieldApi: FieldApi<
      TFormData,
      TFormValidators,
      TSubmitReturn,
      TFieldName,
      TFieldValue,
      TFieldValidators
    >,
  ) => CrossVersionReactNode
}

export type ReactFormArrayFieldComponent<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
> = <
  TFieldName extends DeepKeysWhereValueIncludes<TFormData, Array<any>>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
  TFieldValidators extends FieldValidators<TFormData, TFieldName, TFieldValue>,
>(
  props: ReactFormArrayFieldProps<
    TFormData,
    TFormValidators,
    TSubmitReturn,
    TFieldName,
    TFieldValue,
    TFieldValidators
  >,
) => CrossVersionReactNode

export interface ReactTanStackFormComponents<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> {
  /**
   * TODO docs
   */
  Field: ReactFormFieldComponent<
    TFormData,
    TFormValidators,
    TSubmitReturn,
    TFieldComponents
  >

  ArrayField: ReactFormArrayFieldComponent<
    TFormData,
    TFormValidators,
    TSubmitReturn
  >

  Subscribe: ReactFormSubscribeComponent<
    TFormData,
    TFormValidators,
    TSubmitReturn
  >
}

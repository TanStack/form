import type {
  DeepKeys,
  DeepKeysWhereValueIncludes,
  DeepValue,
  FieldApi,
  FieldApiOptions,
  FieldValidators,
  FormGroupApi,
  FormGroupOptions,
  FormGroupValidators,
  FormState,
  FormValidators,
} from '@tanstack/form-core-v2'
import type { SubscribeProps } from '../Subscribe.public'
import type { CrossVersionReactNode } from '../reactTypes.public'
import type { FunctionComponent } from 'react'

type ExactFieldBrand<TValue> = {
  readonly __tanstackFieldExactType: TValue
}

type AcceptsFieldBrand<TAcceptedValue> = {
  readonly __tanstackFieldAcceptsType: TAcceptedValue
}

type IsSame<TTypeA, TTypeB> = [TTypeA] extends [TTypeB]
  ? [TTypeB] extends [TTypeA]
    ? true
    : false
  : false

type ExactBrandValue<T> =
  T extends ExactFieldBrand<infer TValue> ? TValue : never

type AcceptsBrandValue<T> =
  T extends AcceptsFieldBrand<infer TValue> ? TValue : never

type HasExactBrand<T> = T extends ExactFieldBrand<any> ? true : false

type HasAcceptsBrand<T> = T extends AcceptsFieldBrand<any> ? true : false

type CompatibleFieldKey<TKey, TComponent, TTargetValue> =
  HasExactBrand<TComponent> extends true
    ? IsSame<ExactBrandValue<TComponent>, TTargetValue> extends true
      ? TKey
      : never
    : HasAcceptsBrand<TComponent> extends true
      ? [TTargetValue] extends [AcceptsBrandValue<TComponent>]
        ? TKey
        : never
      : TKey

type FieldComponentsMatchingType<
  TFieldComponents extends Record<string, FunctionComponent<any>>,
  TTargetValue,
> = {
  [K in keyof TFieldComponents as CompatibleFieldKey<
    K,
    TFieldComponents[K],
    TTargetValue
  >]: TFieldComponents[K]
}

export type ReactFieldApi<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
  TFieldValidators extends FieldValidators<TFormData, TFieldName, TFieldValue>,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = FieldApi<
  TFormData,
  TFormValidators,
  TSubmitReturn,
  TFieldName,
  TFieldValue,
  TFieldValidators
> &
  FieldComponentsMatchingType<TFieldComponents, TFieldValue>

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
    fieldApi: ReactFieldApi<
      TFormData,
      TFormValidators,
      TSubmitReturn,
      TFieldName,
      TFieldValue,
      TFieldValidators,
      TFieldComponents
    >,
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
    fieldApi: ReactFieldApi<
      TFormData,
      TFormValidators,
      TSubmitReturn,
      TFieldName,
      TFieldValue,
      TFieldValidators,
      TFieldComponents
    >,
  ) => CrossVersionReactNode
}

export type ReactFormArrayFieldComponent<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
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
    TFieldValidators,
    TFieldComponents
  >,
) => CrossVersionReactNode

export interface ReactFormGroupProps<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  TGroupValidators extends FormGroupValidators<
    TFormData,
    TGroupName,
    TGroupValue
  >,
> extends FormGroupOptions<
  TFormData,
  TFormValidators,
  TSubmitReturn,
  TGroupName,
  TGroupValue,
  TGroupValidators
> {
  children: (
    groupApi: FormGroupApi<
      TFormData,
      TFormValidators,
      TSubmitReturn,
      TGroupName,
      TGroupValue,
      TGroupValidators
    >,
  ) => CrossVersionReactNode
}

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
    TSubmitReturn,
    TFieldComponents
  >

  Subscribe: ReactFormSubscribeComponent<
    TFormData,
    TFormValidators,
    TSubmitReturn
  >
}

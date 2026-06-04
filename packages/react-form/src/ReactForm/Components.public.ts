import type {
  DeepKeys,
  DeepKeysWhereValueIncludes,
  DeepValue,
  FieldApi,
  FieldApiOptions,
  FieldValidators,
  FormGroupApi,
  FormGroupOptions,
  FormGroupState,
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
  TFieldData,
  TFieldName extends DeepKeys<TFieldData>,
  TFieldValue extends DeepValue<TFieldData, TFieldName>,
  TFieldValidators extends FieldValidators<TFieldData, TFieldName, TFieldValue>,
  TGroupValidators extends FormGroupValidators<any>,
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = FieldApi<
  TFieldData,
  TFieldName,
  TFieldValue,
  TFieldValidators,
  TGroupValidators,
  TFormData,
  TFormValidators,
  TSubmitReturn
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
  TFieldData,
  TFieldName extends DeepKeys<TFieldData>,
  TFieldValue extends DeepValue<TFieldData, TFieldName>,
  TFieldValidators extends FieldValidators<TFieldData, TFieldName, TFieldValue>,
  TGroupValidators extends FormGroupValidators<any>,
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> extends FieldApiOptions<
  TFieldData,
  TFieldName,
  TFieldValue,
  TFieldValidators,
  TGroupValidators,
  TFormData,
  TFormValidators,
  TSubmitReturn
> {
  children: (
    fieldApi: ReactFieldApi<
      TFieldData,
      TFieldName,
      TFieldValue,
      TFieldValidators,
      TGroupValidators,
      TFormData,
      TFormValidators,
      TSubmitReturn,
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
    TFieldName,
    TFieldValue,
    TFieldValidators,
    [],
    TFormData,
    TFormValidators,
    TSubmitReturn,
    TFieldComponents
  >,
) => CrossVersionReactNode

export interface ReactFormArrayFieldProps<
  TFieldData,
  TFieldName extends DeepKeysWhereValueIncludes<TFieldData, Array<any>>,
  TFieldValue extends DeepValue<TFieldData, TFieldName>,
  TFieldValidators extends FieldValidators<TFieldData, TFieldName, TFieldValue>,
  TGroupValidators extends FormGroupValidators<any>,
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> extends FieldApiOptions<
  TFieldData,
  TFieldName,
  TFieldValue,
  TFieldValidators,
  TGroupValidators,
  TFormData,
  TFormValidators,
  TSubmitReturn
> {
  children: (
    fieldApi: ReactFieldApi<
      TFieldData,
      TFieldName,
      TFieldValue,
      TFieldValidators,
      TGroupValidators,
      TFormData,
      TFormValidators,
      TSubmitReturn,
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
    TFieldName,
    TFieldValue,
    TFieldValidators,
    [],
    TFormData,
    TFormValidators,
    TSubmitReturn,
    TFieldComponents
  >,
) => CrossVersionReactNode

export type ReactFormGroupSubscribeProps<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  TSelected,
> = Omit<
  SubscribeProps<FormGroupState<TFormData, TGroupName, TGroupValue>, TSelected>,
  'source'
>

export type ReactFormGroupSubscribeComponent<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
> = <TSelected>(
  props: ReactFormGroupSubscribeProps<
    TFormData,
    TGroupName,
    TGroupValue,
    TSelected
  >,
) => CrossVersionReactNode

export type ReactFormGroupFieldComponent<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  TGroupValidators extends FormGroupValidators<TGroupValue>,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = <
  TFieldName extends DeepKeys<TGroupValue>,
  TFieldValue extends DeepValue<TGroupValue, TFieldName>,
  TFieldValidators extends FieldValidators<
    TGroupValue,
    TFieldName,
    TFieldValue
  >,
>(
  props: ReactFormFieldProps<
    TGroupValue,
    TFieldName,
    TFieldValue,
    TFieldValidators,
    TGroupValidators,
    TFormData,
    TFormValidators,
    TSubmitReturn,
    TFieldComponents
  >,
) => CrossVersionReactNode

export type ReactFormGroupArrayFieldComponent<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  TGroupValidators extends FormGroupValidators<TGroupValue>,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = <
  TFieldName extends DeepKeysWhereValueIncludes<TGroupValue, Array<any>>,
  TFieldValue extends DeepValue<TGroupValue, TFieldName>,
  TFieldValidators extends FieldValidators<
    TGroupValue,
    TFieldName,
    TFieldValue
  >,
>(
  props: ReactFormArrayFieldProps<
    TGroupValue,
    TFieldName,
    TFieldValue,
    TFieldValidators,
    TGroupValidators,
    TFormData,
    TFormValidators,
    TSubmitReturn,
    TFieldComponents
  >,
) => CrossVersionReactNode

export type ReactFormGroupApi<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  TGroupValidators extends FormGroupValidators<TGroupValue>,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = FormGroupApi<
  TFormData,
  TGroupName,
  TGroupValue,
  TGroupValidators,
  TFormValidators,
  TSubmitReturn
> & {
  Field: ReactFormGroupFieldComponent<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidators,
    TFormValidators,
    TSubmitReturn,
    TFieldComponents
  >
  ArrayField: ReactFormGroupArrayFieldComponent<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidators,
    TFormValidators,
    TSubmitReturn,
    TFieldComponents
  >
  Subscribe: ReactFormGroupSubscribeComponent<
    TFormData,
    TGroupName,
    TGroupValue
  >
}

export interface ReactFormGroupProps<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  TGroupValidators extends FormGroupValidators<TGroupValue>,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> extends Omit<
  FormGroupOptions<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidators,
    TFormValidators,
    TSubmitReturn
  >,
  'form'
> {
  children: (
    groupApi: ReactFormGroupApi<
      TFormData,
      TGroupName,
      TGroupValue,
      TGroupValidators,
      TFormValidators,
      TSubmitReturn,
      TFieldComponents
    >,
  ) => CrossVersionReactNode
}

export type ReactFormGroupComponent<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = <
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  TGroupValidators extends FormGroupValidators<TGroupValue>,
>(
  props: ReactFormGroupProps<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidators,
    TFormValidators,
    TSubmitReturn,
    TFieldComponents
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
    TSubmitReturn,
    TFieldComponents
  >

  Subscribe: ReactFormSubscribeComponent<
    TFormData,
    TFormValidators,
    TSubmitReturn
  >

  FormGroup: ReactFormGroupComponent<
    TFormData,
    TFormValidators,
    TSubmitReturn,
    TFieldComponents
  >
}

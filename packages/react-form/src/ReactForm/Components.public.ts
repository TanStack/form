import type {
  DeepKeys,
  DeepKeysWhereValueIncludes,
  DeepValue,
  FieldApi,
  FieldApiOptions,
  FieldValidatorMetas,
  FieldValidators,
  FormGroupApi,
  FormGroupOptions,
  FormGroupState,
  FormGroupValidatorMetas,
  FormGroupValidators,
  FormState,
  FormValidatorMetas,
  ToFieldValidatorMetas,
  ToFormGroupValidatorMetas,
} from '@tanstack/form-core-v2'
import type { SubscribeProps } from '../Subscribe.public'
import type { CrossVersionReactNode } from '../reactTypes.public'
import type {
  FunctionComponent,
  LazyExoticComponent,
  MemoExoticComponent,
} from 'react'

type ExactFieldBrand<TValue> = {
  readonly __tanstackFieldExactType: TValue
}

type AcceptsFieldBrand<TAcceptedValue> = {
  readonly __tanstackFieldAcceptsType: TAcceptedValue
}

type CompatibleFieldKey<TKey, TComponent, TTargetValue> =
  [TComponent] extends [ExactFieldBrand<infer TExact>]
    ? [TExact] extends [TTargetValue]
      ? [TTargetValue] extends [TExact]
        ? TKey
        : never
      : never
    : [TComponent] extends [AcceptsFieldBrand<infer TLoose>]
      ? [TTargetValue] extends [TLoose]
        ? TKey
        : never
      : TKey

type UnwrapComponent<TComponent> =
  TComponent extends LazyExoticComponent<infer TInner>
    ? UnwrapComponent<TInner>
    : TComponent extends MemoExoticComponent<infer TInner>
      ? UnwrapComponent<TInner>
      : TComponent

type UnwrappedFieldComponents<
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = {
  [K in keyof TFieldComponents]: UnwrapComponent<TFieldComponents[K]>
}

type FilteredFieldComponents<
  TFieldComponents extends Record<string, FunctionComponent<any>>,
  TTargetValue,
  TUnwrappedFieldComponents extends {
    [K in keyof TFieldComponents]: any
  } = UnwrappedFieldComponents<TFieldComponents>,
> = {
  [K in keyof TFieldComponents as CompatibleFieldKey<
    K,
    TUnwrappedFieldComponents[K],
    TTargetValue
  >]: TFieldComponents[K]
}

type FieldComponentsMatchingType<
  TFieldComponents extends Record<string, FunctionComponent<any>>,
  TTargetValue,
> = unknown extends TTargetValue
  ? TFieldComponents
  : string extends keyof TFieldComponents
    ? TFieldComponents
    : FilteredFieldComponents<TFieldComponents, TTargetValue>

export type ReactFieldApi<
  TFieldData,
  TFieldName extends DeepKeys<TFieldData>,
  TFieldValue extends DeepValue<TFieldData, TFieldName>,
  TFieldValidatorMetas extends FieldValidatorMetas,
  TGroupValidatorMetas extends FormGroupValidatorMetas,
  TFormData,
  TFormValidatorMetas extends FormValidatorMetas,
  TSubmitReturn,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = FieldApi<
  TFieldData,
  TFieldName,
  TFieldValue,
  TFieldValidatorMetas,
  TGroupValidatorMetas,
  TFormData,
  TFormValidatorMetas,
  TSubmitReturn
> &
  FieldComponentsMatchingType<TFieldComponents, TFieldValue>

/**
 * Subscribe to `form.store` (full form state). The selector receives the full
 * {@link FormState}.
 */
export type ReactFormSubscribeProps<
  TFormData,
  TFormValidatorMetas extends FormValidatorMetas,
  TSubmitReturn,
  TSelected,
> = Omit<
  SubscribeProps<
    FormState<TFormData, TFormValidatorMetas, TSubmitReturn>,
    TSelected
  >,
  'source'
>

export type ReactFormSubscribeComponent<
  TFormData,
  TFormValidatorMetas extends FormValidatorMetas,
  TSubmitReturn,
> = <TSelected>(
  props: ReactFormSubscribeProps<
    TFormData,
    TFormValidatorMetas,
    TSubmitReturn,
    TSelected
  >,
) => CrossVersionReactNode

export interface ReactFormFieldProps<
  TFieldData,
  TFieldName extends DeepKeys<TFieldData>,
  TFieldValue extends DeepValue<TFieldData, TFieldName>,
  TFieldValidators extends FieldValidators<TFieldData, TFieldName, TFieldValue>,
  TGroupValidators extends FormGroupValidatorMetas,
  TFormData,
  TFormValidatorMetas extends FormValidatorMetas,
  TSubmitReturn,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> extends FieldApiOptions<
  TFieldData,
  TFieldName,
  TFieldValue,
  TFieldValidators,
  TGroupValidators,
  TFormData,
  TFormValidatorMetas,
  TSubmitReturn
> {
  children: (
    fieldApi: ReactFieldApi<
      TFieldData,
      TFieldName,
      TFieldValue,
      ToFieldValidatorMetas<TFieldValidators>,
      TGroupValidators,
      TFormData,
      TFormValidatorMetas,
      TSubmitReturn,
      TFieldComponents
    >,
  ) => CrossVersionReactNode
}

export type ReactFormFieldComponent<
  TFormData,
  TFormValidatorMetas extends FormValidatorMetas,
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
    TFormValidatorMetas,
    TSubmitReturn,
    TFieldComponents
  >,
) => CrossVersionReactNode

export interface ReactFormArrayFieldProps<
  TFieldData,
  TFieldName extends DeepKeysWhereValueIncludes<TFieldData, Array<any>>,
  TFieldValue extends DeepValue<TFieldData, TFieldName>,
  TFieldValidators extends FieldValidators<TFieldData, TFieldName, TFieldValue>,
  TGroupValidatorMetas extends FormGroupValidatorMetas,
  TFormData,
  TFormValidatorMetas extends FormValidatorMetas,
  TSubmitReturn,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> extends FieldApiOptions<
  TFieldData,
  TFieldName,
  TFieldValue,
  TFieldValidators,
  TGroupValidatorMetas,
  TFormData,
  TFormValidatorMetas,
  TSubmitReturn
> {
  children: (
    fieldApi: ReactFieldApi<
      TFieldData,
      TFieldName,
      TFieldValue,
      ToFieldValidatorMetas<TFieldValidators>,
      TGroupValidatorMetas,
      TFormData,
      TFormValidatorMetas,
      TSubmitReturn,
      TFieldComponents
    >,
  ) => CrossVersionReactNode
}

export type ReactFormArrayFieldComponent<
  TFormData,
  TFormValidatorMetas extends FormValidatorMetas,
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
    TFormValidatorMetas,
    TSubmitReturn,
    TFieldComponents
  >,
) => CrossVersionReactNode

export type ReactFormGroupSubscribeProps<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  TGroupValidatorMetas extends FormGroupValidatorMetas,
  TSelected,
> = Omit<
  SubscribeProps<
    FormGroupState<TFormData, TGroupName, TGroupValue, TGroupValidatorMetas>,
    TSelected
  >,
  'source'
>

export type ReactFormGroupSubscribeComponent<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  TGroupValidatorMetas extends FormGroupValidatorMetas,
> = <TSelected>(
  props: ReactFormGroupSubscribeProps<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidatorMetas,
    TSelected
  >,
) => CrossVersionReactNode

export type ReactFormGroupFieldComponent<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  TGroupValidators extends FormGroupValidatorMetas,
  TFormValidatorMetas extends FormValidatorMetas,
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
    TFormValidatorMetas,
    TSubmitReturn,
    TFieldComponents
  >,
) => CrossVersionReactNode

export type ReactFormGroupArrayFieldComponent<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  TGroupValidatorMetas extends FormGroupValidatorMetas,
  TFormValidatorMetas extends FormValidatorMetas,
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
    TGroupValidatorMetas,
    TFormData,
    TFormValidatorMetas,
    TSubmitReturn,
    TFieldComponents
  >,
) => CrossVersionReactNode

export type ReactFormGroupApi<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  TGroupValidatorMetas extends FormGroupValidatorMetas,
  TFormValidatorMetas extends FormValidatorMetas,
  TSubmitReturn,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = FormGroupApi<
  TFormData,
  TGroupName,
  TGroupValue,
  TGroupValidatorMetas,
  TFormValidatorMetas,
  TSubmitReturn
> & {
  Field: ReactFormGroupFieldComponent<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidatorMetas,
    TFormValidatorMetas,
    TSubmitReturn,
    TFieldComponents
  >
  ArrayField: ReactFormGroupArrayFieldComponent<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidatorMetas,
    TFormValidatorMetas,
    TSubmitReturn,
    TFieldComponents
  >
  Subscribe: ReactFormGroupSubscribeComponent<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidatorMetas
  >
}

export interface ReactFormGroupProps<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  TGroupValidators extends FormGroupValidators<TGroupValue>,
  TFormValidatorMetas extends FormValidatorMetas,
  TSubmitReturn,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> extends Omit<
  FormGroupOptions<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidators,
    TFormValidatorMetas,
    TSubmitReturn
  >,
  'form'
> {
  children: (
    groupApi: ReactFormGroupApi<
      TFormData,
      TGroupName,
      TGroupValue,
      ToFormGroupValidatorMetas<TGroupValidators>,
      TFormValidatorMetas,
      TSubmitReturn,
      TFieldComponents
    >,
  ) => CrossVersionReactNode
}

export type ReactFormGroupComponent<
  TFormData,
  TFormValidatorMetas extends FormValidatorMetas,
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
    TFormValidatorMetas,
    TSubmitReturn,
    TFieldComponents
  >,
) => CrossVersionReactNode

export interface ReactTanStackFormComponents<
  TFormData,
  TFormValidatorMetas extends FormValidatorMetas,
  TSubmitReturn,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> {
  /**
   * TODO docs
   */
  Field: ReactFormFieldComponent<
    TFormData,
    TFormValidatorMetas,
    TSubmitReturn,
    TFieldComponents
  >

  ArrayField: ReactFormArrayFieldComponent<
    TFormData,
    TFormValidatorMetas,
    TSubmitReturn,
    TFieldComponents
  >

  Subscribe: ReactFormSubscribeComponent<
    TFormData,
    TFormValidatorMetas,
    TSubmitReturn
  >

  FormGroup: ReactFormGroupComponent<
    TFormData,
    TFormValidatorMetas,
    TSubmitReturn,
    TFieldComponents
  >
}

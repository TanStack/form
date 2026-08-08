import type {
  DeepKeys,
  DeepKeysWhereValueIncludes,
  DeepValue,
  FieldApi,
  FieldApiOptions,
  FieldValidators,
  FormErrorTypes,
  FormGroupApi,
  FormGroupOptions,
  FormGroupState,
  FormGroupValidators,
  FormState,
  ToFieldError,
  ToFormGroupErrorTypes,
} from '@tanstack/form-core'
import type { Accessor, Component, JSX } from 'solid-js'

type ExactFieldBrand<out TValue> = {
  readonly __tanstackFieldExactType: TValue
}

type AcceptsFieldBrand<out TAcceptedValue> = {
  readonly __tanstackFieldAcceptsType: TAcceptedValue
}

type CompatibleFieldKey<TKey, TComponent, TTargetValue> =
  TComponent extends ExactFieldBrand<infer TExact>
    ? [TExact] extends [TTargetValue]
      ? [TTargetValue] extends [TExact]
        ? TKey
        : never
      : never
    : TComponent extends AcceptsFieldBrand<infer TLoose>
      ? [TTargetValue] extends [TLoose]
        ? TKey
        : never
      : TKey

type FilteredFieldComponents<
  TFieldComponents extends Record<string, Component<any>>,
  TTargetValue,
> = {
  [
    K in keyof TFieldComponents as CompatibleFieldKey<
      K,
      TFieldComponents[K],
      TTargetValue
    >
  ]: TFieldComponents[K]
}

type FieldComponentsMatchingType<
  TFieldComponents extends Record<string, Component<any>>,
  TTargetValue,
> = unknown extends TTargetValue
  ? TFieldComponents
  : string extends keyof TFieldComponents
    ? TFieldComponents
    : FilteredFieldComponents<TFieldComponents, TTargetValue>

export type SolidFieldApi<
  TFieldName,
  TFieldValue,
  TFieldError,
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TFieldComponents extends Record<string, Component<any>>,
> = Accessor<
  FieldApi<TFieldName, TFieldValue, TFieldError, TFormData, TFormErrorTypes>
> &
  FieldComponentsMatchingType<TFieldComponents, TFieldValue>

interface SolidSubscribeProps<TSourceData, TSelected> {
  selector: (state: TSourceData) => TSelected
  when?: (selected: NoInfer<TSelected>) => boolean
  children: ((state: Accessor<NoInfer<TSelected>>) => JSX.Element) | JSX.Element
}

export type SolidFormSubscribeProps<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TSelected,
> = SolidSubscribeProps<FormState<TFormData, TFormErrorTypes>, TSelected>

export type SolidFormSubscribeComponent<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
> = <TSelected>(
  props: SolidFormSubscribeProps<TFormData, TFormErrorTypes, TSelected>,
) => JSX.Element

export interface SolidFormFieldProps<
  TFieldData,
  TFieldName,
  TFieldValue,
  TFieldValidators extends FieldValidators<TFieldData, TFieldName, TFieldValue>,
  TGroupFieldError,
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TFieldComponents extends Record<string, Component<any>>,
> extends FieldApiOptions<
  TFieldData,
  TFieldName,
  TFieldValue,
  TFieldValidators,
  TGroupFieldError,
  TFormData,
  TFormErrorTypes
> {
  children: (
    fieldApi: SolidFieldApi<
      TFieldName,
      TFieldValue,
      ToFieldError<
        NoInfer<TFieldValidators>,
        TGroupFieldError,
        TFormErrorTypes
      >,
      TFormData,
      TFormErrorTypes,
      TFieldComponents
    >,
  ) => JSX.Element
}

export interface SolidFormArrayFieldProps<
  TFormData,
  TFieldName,
  TFieldValue,
  TFieldValidators extends FieldValidators<TFormData, TFieldName, TFieldValue>,
  TFormErrorTypes extends FormErrorTypes,
> extends SolidFormFieldProps<
  TFormData,
  TFieldName,
  TFieldValue,
  TFieldValidators,
  never,
  TFormData,
  TFormErrorTypes,
  Record<never, never>
> {}

export interface SolidFormFieldComponent<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TFieldComponents extends Record<string, Component<any>>,
> {
  <
    TFieldName extends DeepKeys<TFormData>,
    const TFieldValidators extends FieldValidators<
      TFormData,
      TFieldName,
      DeepValue<TFormData, TFieldName>
    >,
  >(
    props: SolidFormFieldProps<
      TFormData,
      TFieldName,
      DeepValue<TFormData, TFieldName>,
      TFieldValidators,
      never,
      TFormData,
      TFormErrorTypes,
      TFieldComponents
    >,
  ): JSX.Element
}

export interface SolidFormArrayFieldComponent<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TFieldComponents extends Record<string, Component<any>>,
> {
  <
    TFieldName extends DeepKeysWhereValueIncludes<TFormData, Array<any>>,
    const TFieldValidators extends FieldValidators<
      TFormData,
      TFieldName,
      DeepValue<TFormData, TFieldName>
    >,
  >(
    props: SolidFormFieldProps<
      TFormData,
      TFieldName,
      DeepValue<TFormData, TFieldName>,
      TFieldValidators,
      never,
      TFormData,
      TFormErrorTypes,
      TFieldComponents
    >,
  ): JSX.Element
}

export type SolidFormGroupSubscribeProps<
  TGroupValue,
  TGroupErrorTypes extends FormErrorTypes,
  TSelected,
> = SolidSubscribeProps<
  FormGroupState<TGroupValue, TGroupErrorTypes>,
  TSelected
>

export type SolidFormGroupSubscribeComponent<
  TGroupValue,
  TGroupErrorTypes extends FormErrorTypes,
> = <TSelected>(
  props: SolidFormGroupSubscribeProps<TGroupValue, TGroupErrorTypes, TSelected>,
) => JSX.Element

export interface SolidFormGroupFieldComponent<
  TFormData,
  TGroupValue,
  TGroupErrorTypes extends FormErrorTypes,
  TFormErrorTypes extends FormErrorTypes,
  TFieldComponents extends Record<string, Component<any>>,
> {
  <
    TFieldName extends DeepKeys<TGroupValue>,
    const TFieldValidators extends FieldValidators<
      TGroupValue,
      TFieldName,
      DeepValue<TGroupValue, TFieldName>
    >,
  >(
    props: SolidFormFieldProps<
      TGroupValue,
      TFieldName,
      DeepValue<TGroupValue, TFieldName>,
      TFieldValidators,
      TGroupErrorTypes['fieldError'],
      TFormData,
      TFormErrorTypes,
      TFieldComponents
    >,
  ): JSX.Element
}

export interface SolidFormGroupArrayFieldComponent<
  TFormData,
  TGroupValue,
  TGroupErrorTypes extends FormErrorTypes,
  TFormErrorTypes extends FormErrorTypes,
  TFieldComponents extends Record<string, Component<any>>,
> {
  <
    TFieldName extends DeepKeysWhereValueIncludes<TGroupValue, Array<any>>,
    const TFieldValidators extends FieldValidators<
      TGroupValue,
      TFieldName,
      DeepValue<TGroupValue, TFieldName>
    >,
  >(
    props: SolidFormFieldProps<
      TGroupValue,
      TFieldName,
      DeepValue<TGroupValue, TFieldName>,
      TFieldValidators,
      TGroupErrorTypes['fieldError'],
      TFormData,
      TFormErrorTypes,
      TFieldComponents
    >,
  ): JSX.Element
}

export interface SolidFormGroupApi<
  TFormData,
  TGroupName,
  TGroupValue,
  TGroupErrorTypes extends FormErrorTypes,
  TFormErrorTypes extends FormErrorTypes,
  TFieldComponents extends Record<string, Component<any>>,
> extends FormGroupApi<
  TFormData,
  TGroupName,
  TGroupValue,
  TGroupErrorTypes,
  TFormErrorTypes
> {
  Field: SolidFormGroupFieldComponent<
    TFormData,
    TGroupValue,
    TGroupErrorTypes,
    TFormErrorTypes,
    TFieldComponents
  >
  ArrayField: SolidFormGroupArrayFieldComponent<
    TFormData,
    TGroupValue,
    TGroupErrorTypes,
    TFormErrorTypes,
    TFieldComponents
  >
  Subscribe: SolidFormGroupSubscribeComponent<TGroupValue, TGroupErrorTypes>
}

export type SolidFormGroupAccessor<
  TFormData,
  TGroupName,
  TGroupValue,
  TGroupErrorTypes extends FormErrorTypes,
  TFormErrorTypes extends FormErrorTypes,
  TFieldComponents extends Record<string, Component<any>>,
> = Accessor<
  SolidFormGroupApi<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupErrorTypes,
    TFormErrorTypes,
    TFieldComponents
  >
> &
  Pick<
    SolidFormGroupApi<
      TFormData,
      TGroupName,
      TGroupValue,
      TGroupErrorTypes,
      TFormErrorTypes,
      TFieldComponents
    >,
    'Field' | 'ArrayField' | 'Subscribe'
  >

export interface SolidFormGroupProps<
  TFormData,
  TGroupName,
  TGroupValue,
  TGroupValidators extends FormGroupValidators<TGroupValue>,
  TFormErrorTypes extends FormErrorTypes,
  TFieldComponents extends Record<string, Component<any>>,
> extends Omit<
  FormGroupOptions<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidators,
    TFormErrorTypes
  >,
  'form'
> {
  children: (
    groupApi: SolidFormGroupAccessor<
      TFormData,
      TGroupName,
      TGroupValue,
      ToFormGroupErrorTypes<NoInfer<TGroupValidators>>,
      TFormErrorTypes,
      TFieldComponents
    >,
  ) => JSX.Element
}

export interface SolidFormGroupComponent<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TFieldComponents extends Record<string, Component<any>>,
> {
  <
    TGroupName extends DeepKeys<TFormData>,
    TGroupValue extends DeepValue<TFormData, TGroupName>,
    const TGroupValidators extends FormGroupValidators<TGroupValue>,
  >(
    props: SolidFormGroupProps<
      TFormData,
      TGroupName,
      TGroupValue,
      TGroupValidators,
      TFormErrorTypes,
      TFieldComponents
    >,
  ): JSX.Element
}

export interface SolidTanStackFormComponents<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TFieldComponents extends Record<string, Component<any>> = Record<
    never,
    never
  >,
> {
  Field: SolidFormFieldComponent<TFormData, TFormErrorTypes, TFieldComponents>
  ArrayField: SolidFormArrayFieldComponent<
    TFormData,
    TFormErrorTypes,
    TFieldComponents
  >
  Subscribe: SolidFormSubscribeComponent<TFormData, TFormErrorTypes>
  FormGroup: SolidFormGroupComponent<
    TFormData,
    TFormErrorTypes,
    TFieldComponents
  >
}

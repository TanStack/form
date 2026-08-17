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
import type { Component, PublicProps } from 'vue'
import type { VueComponentInstance } from '../vueTypes.lib'

declare const fieldComponentsType: unique symbol

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
  TFieldComponents extends Record<string, Component>,
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
  TFieldComponents extends Record<string, Component>,
  TTargetValue,
> = unknown extends TTargetValue
  ? TFieldComponents
  : string extends keyof TFieldComponents
    ? TFieldComponents
    : FilteredFieldComponents<TFieldComponents, TTargetValue>

export type VueFieldApi<
  TFieldName,
  TFieldValue,
  TFieldError,
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TFieldComponents extends Record<string, Component>,
> = FieldApi<TFieldName, TFieldValue, TFieldError, TFormData, TFormErrorTypes> &
  FieldComponentsMatchingType<TFieldComponents, TFieldValue>

interface VueSubscribeProps<in out TSourceData, in out TSelected> {
  selector: (state: TSourceData) => TSelected
  when?: (selected: NoInfer<TSelected>) => boolean
}

export type VueFormSubscribeProps<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TSelected,
> = VueSubscribeProps<FormState<TFormData, TFormErrorTypes>, TSelected>

export type VueFormSubscribeComponent<
  in out TFormData,
  in out TFormErrorTypes extends FormErrorTypes,
> = new <const TSelected>(
  props: VueFormSubscribeProps<TFormData, TFormErrorTypes, TSelected> &
    PublicProps,
) => VueComponentInstance<
  VueFormSubscribeProps<TFormData, TFormErrorTypes, TSelected>,
  { default: NoInfer<TSelected> }
>

export interface VueFormFieldProps<
  in out TFieldData,
  in out TFieldName,
  in out TFieldValue,
  in out TFieldValidators extends FieldValidators<
    TFieldData,
    TFieldName,
    TFieldValue
  >,
  in out TGroupFieldError,
  in out TFormData,
  in out TFormErrorTypes extends FormErrorTypes,
  in out TFieldComponents extends Record<string, Component>,
> extends FieldApiOptions<
  TFieldData,
  TFieldName,
  TFieldValue,
  TFieldValidators,
  TGroupFieldError,
  TFormData,
  TFormErrorTypes
> {
  readonly [fieldComponentsType]?: TFieldComponents
}

export type VueFormFieldComponent<
  in out TFormData,
  in out TFormErrorTypes extends FormErrorTypes,
  in out TFieldComponents extends Record<string, Component>,
> = new <
  TFieldName extends DeepKeys<TFormData>,
  const TFieldValidators extends FieldValidators<
    TFormData,
    TFieldName,
    DeepValue<TFormData, TFieldName>
  >,
>(
  props: VueFormFieldProps<
    TFormData,
    TFieldName,
    DeepValue<TFormData, TFieldName>,
    TFieldValidators,
    never,
    TFormData,
    TFormErrorTypes,
    TFieldComponents
  > &
    PublicProps,
) => VueComponentInstance<
  VueFormFieldProps<
    TFormData,
    TFieldName,
    DeepValue<TFormData, TFieldName>,
    TFieldValidators,
    never,
    TFormData,
    TFormErrorTypes,
    TFieldComponents
  >,
  {
    default: {
      field: VueFieldApi<
        TFieldName,
        DeepValue<TFormData, TFieldName>,
        ToFieldError<NoInfer<TFieldValidators>, never, TFormErrorTypes>,
        TFormData,
        TFormErrorTypes,
        TFieldComponents
      >
    }
  }
>

export type VueFormArrayFieldComponent<
  in out TFormData,
  in out TFormErrorTypes extends FormErrorTypes,
  in out TFieldComponents extends Record<string, Component>,
> = new <
  TFieldName extends DeepKeysWhereValueIncludes<TFormData, Array<any>>,
  const TFieldValidators extends FieldValidators<
    TFormData,
    TFieldName,
    DeepValue<TFormData, TFieldName>
  >,
>(
  props: VueFormFieldProps<
    TFormData,
    TFieldName,
    DeepValue<TFormData, TFieldName>,
    TFieldValidators,
    never,
    TFormData,
    TFormErrorTypes,
    TFieldComponents
  > &
    PublicProps,
) => VueComponentInstance<
  VueFormFieldProps<
    TFormData,
    TFieldName,
    DeepValue<TFormData, TFieldName>,
    TFieldValidators,
    never,
    TFormData,
    TFormErrorTypes,
    TFieldComponents
  >,
  {
    default: {
      field: VueFieldApi<
        TFieldName,
        DeepValue<TFormData, TFieldName>,
        ToFieldError<NoInfer<TFieldValidators>, never, TFormErrorTypes>,
        TFormData,
        TFormErrorTypes,
        TFieldComponents
      >
    }
  }
>

export type VueFormGroupSubscribeProps<
  TGroupValue,
  TGroupErrorTypes extends FormErrorTypes,
  TSelected,
> = VueSubscribeProps<FormGroupState<TGroupValue, TGroupErrorTypes>, TSelected>

export type VueFormGroupSubscribeComponent<
  in out TGroupValue,
  in out TGroupErrorTypes extends FormErrorTypes,
> = new <const TSelected>(
  props: VueFormGroupSubscribeProps<TGroupValue, TGroupErrorTypes, TSelected> &
    PublicProps,
) => VueComponentInstance<
  VueFormGroupSubscribeProps<TGroupValue, TGroupErrorTypes, TSelected>,
  { default: NoInfer<TSelected> }
>

export type VueFormGroupFieldComponent<
  in out TFormData,
  in out TGroupValue,
  in out TGroupErrorTypes extends FormErrorTypes,
  in out TFormErrorTypes extends FormErrorTypes,
  in out TFieldComponents extends Record<string, Component>,
> = new <
  TFieldName extends DeepKeys<TGroupValue>,
  const TFieldValidators extends FieldValidators<
    TGroupValue,
    TFieldName,
    DeepValue<TGroupValue, TFieldName>
  >,
>(
  props: VueFormFieldProps<
    TGroupValue,
    TFieldName,
    DeepValue<TGroupValue, TFieldName>,
    TFieldValidators,
    TGroupErrorTypes['fieldError'],
    TFormData,
    TFormErrorTypes,
    TFieldComponents
  > &
    PublicProps,
) => VueComponentInstance<
  VueFormFieldProps<
    TGroupValue,
    TFieldName,
    DeepValue<TGroupValue, TFieldName>,
    TFieldValidators,
    TGroupErrorTypes['fieldError'],
    TFormData,
    TFormErrorTypes,
    TFieldComponents
  >,
  {
    default: {
      field: VueFieldApi<
        TFieldName,
        DeepValue<TGroupValue, TFieldName>,
        ToFieldError<
          NoInfer<TFieldValidators>,
          TGroupErrorTypes['fieldError'],
          TFormErrorTypes
        >,
        TFormData,
        TFormErrorTypes,
        TFieldComponents
      >
    }
  }
>

export type VueFormGroupArrayFieldComponent<
  in out TFormData,
  in out TGroupValue,
  in out TGroupErrorTypes extends FormErrorTypes,
  in out TFormErrorTypes extends FormErrorTypes,
  in out TFieldComponents extends Record<string, Component>,
> = new <
  TFieldName extends DeepKeysWhereValueIncludes<TGroupValue, Array<any>>,
  const TFieldValidators extends FieldValidators<
    TGroupValue,
    TFieldName,
    DeepValue<TGroupValue, TFieldName>
  >,
>(
  props: VueFormFieldProps<
    TGroupValue,
    TFieldName,
    DeepValue<TGroupValue, TFieldName>,
    TFieldValidators,
    TGroupErrorTypes['fieldError'],
    TFormData,
    TFormErrorTypes,
    TFieldComponents
  > &
    PublicProps,
) => VueComponentInstance<
  VueFormFieldProps<
    TGroupValue,
    TFieldName,
    DeepValue<TGroupValue, TFieldName>,
    TFieldValidators,
    TGroupErrorTypes['fieldError'],
    TFormData,
    TFormErrorTypes,
    TFieldComponents
  >,
  {
    default: {
      field: VueFieldApi<
        TFieldName,
        DeepValue<TGroupValue, TFieldName>,
        ToFieldError<
          NoInfer<TFieldValidators>,
          TGroupErrorTypes['fieldError'],
          TFormErrorTypes
        >,
        TFormData,
        TFormErrorTypes,
        TFieldComponents
      >
    }
  }
>

export interface VueFormGroupApi<
  in out TFormData,
  in out TGroupName,
  in out TGroupValue,
  in out TGroupErrorTypes extends FormErrorTypes,
  in out TFormErrorTypes extends FormErrorTypes,
  in out TFieldComponents extends Record<string, Component>,
> extends FormGroupApi<
  TFormData,
  TGroupName,
  TGroupValue,
  TGroupErrorTypes,
  TFormErrorTypes
> {
  Field: VueFormGroupFieldComponent<
    TFormData,
    TGroupValue,
    TGroupErrorTypes,
    TFormErrorTypes,
    TFieldComponents
  >
  ArrayField: VueFormGroupArrayFieldComponent<
    TFormData,
    TGroupValue,
    TGroupErrorTypes,
    TFormErrorTypes,
    TFieldComponents
  >
  Subscribe: VueFormGroupSubscribeComponent<TGroupValue, TGroupErrorTypes>
}

export interface VueFormGroupProps<
  in out TFormData,
  in out TGroupName,
  in out TGroupValue,
  in out TGroupValidators extends FormGroupValidators<TGroupValue>,
  in out TFormErrorTypes extends FormErrorTypes,
  in out TFieldComponents extends Record<string, Component>,
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
  readonly [fieldComponentsType]?: TFieldComponents
}

export type VueFormGroupComponent<
  in out TFormData,
  in out TFormErrorTypes extends FormErrorTypes,
  in out TFieldComponents extends Record<string, Component>,
> = new <
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  const TGroupValidators extends FormGroupValidators<TGroupValue>,
>(
  props: VueFormGroupProps<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidators,
    TFormErrorTypes,
    TFieldComponents
  > &
    PublicProps,
) => VueComponentInstance<
  VueFormGroupProps<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidators,
    TFormErrorTypes,
    TFieldComponents
  >,
  {
    default: {
      group: VueFormGroupApi<
        TFormData,
        TGroupName,
        TGroupValue,
        ToFormGroupErrorTypes<NoInfer<TGroupValidators>>,
        TFormErrorTypes,
        TFieldComponents
      >
    }
  }
>

export interface VueTanStackFormComponents<
  in out TFormData,
  in out TFormErrorTypes extends FormErrorTypes,
  in out TFieldComponents extends Record<string, Component> = Record<
    never,
    never
  >,
> {
  Field: VueFormFieldComponent<TFormData, TFormErrorTypes, TFieldComponents>
  ArrayField: VueFormArrayFieldComponent<
    TFormData,
    TFormErrorTypes,
    TFieldComponents
  >
  Subscribe: VueFormSubscribeComponent<TFormData, TFormErrorTypes>
  FormGroup: VueFormGroupComponent<TFormData, TFormErrorTypes, TFieldComponents>
}

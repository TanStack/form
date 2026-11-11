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
  ScopedErrorTypes,
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
  TFormError extends ScopedErrorTypes,
  TFieldComponents extends Record<string, Component>,
> = FieldApi<TFieldName, TFieldValue, TFieldError, TFormData, TFormError> &
  FieldComponentsMatchingType<TFieldComponents, TFieldValue>

interface VueSubscribeProps<in out TSourceData, in out TSelected> {
  selector: (state: TSourceData) => TSelected
  when?: (selected: NoInfer<TSelected>) => boolean
}

export type VueFormSubscribeProps<
  TFormData,
  TFormError extends ScopedErrorTypes,
  TSelected,
> = VueSubscribeProps<FormState<TFormData, TFormError>, TSelected>

export type VueFormSubscribeComponent<
  in out TFormData,
  in out TFormError extends ScopedErrorTypes,
> = new <const TSelected>(
  props: VueFormSubscribeProps<TFormData, TFormError, TSelected> & PublicProps,
) => VueComponentInstance<
  VueFormSubscribeProps<TFormData, TFormError, TSelected>,
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
  in out TFormError extends ScopedErrorTypes,
  in out TFieldComponents extends Record<string, Component>,
> extends FieldApiOptions<
  TFieldData,
  TFieldName,
  TFieldValue,
  TFieldValidators,
  TGroupFieldError,
  TFormData,
  TFormError
> {
  readonly [fieldComponentsType]?: TFieldComponents
}

export type VueFormFieldComponent<
  in out TFormData,
  in out TFormError extends ScopedErrorTypes,
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
    TFormError,
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
    TFormError,
    TFieldComponents
  >,
  {
    default: {
      field: VueFieldApi<
        TFieldName,
        DeepValue<TFormData, TFieldName>,
        ToFieldError<NoInfer<TFieldValidators>, never, TFormError>,
        TFormData,
        TFormError,
        TFieldComponents
      >
    }
  }
>

export type VueFormArrayFieldComponent<
  in out TFormData,
  in out TFormError extends ScopedErrorTypes,
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
    TFormError,
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
    TFormError,
    TFieldComponents
  >,
  {
    default: {
      field: VueFieldApi<
        TFieldName,
        DeepValue<TFormData, TFieldName>,
        ToFieldError<NoInfer<TFieldValidators>, never, TFormError>,
        TFormData,
        TFormError,
        TFieldComponents
      >
    }
  }
>

export type VueFormGroupSubscribeProps<
  TGroupValue,
  TGroupError extends ScopedErrorTypes,
  TSelected,
> = VueSubscribeProps<FormGroupState<TGroupValue, TGroupError>, TSelected>

export type VueFormGroupSubscribeComponent<
  in out TGroupValue,
  in out TGroupError extends ScopedErrorTypes,
> = new <const TSelected>(
  props: VueFormGroupSubscribeProps<TGroupValue, TGroupError, TSelected> &
    PublicProps,
) => VueComponentInstance<
  VueFormGroupSubscribeProps<TGroupValue, TGroupError, TSelected>,
  { default: NoInfer<TSelected> }
>

export type VueFormGroupFieldComponent<
  in out TFormData,
  in out TGroupValue,
  in out TGroupError extends ScopedErrorTypes,
  in out TFormError extends ScopedErrorTypes,
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
    TGroupError['subfieldError'],
    TFormData,
    TFormError,
    TFieldComponents
  > &
    PublicProps,
) => VueComponentInstance<
  VueFormFieldProps<
    TGroupValue,
    TFieldName,
    DeepValue<TGroupValue, TFieldName>,
    TFieldValidators,
    TGroupError['subfieldError'],
    TFormData,
    TFormError,
    TFieldComponents
  >,
  {
    default: {
      field: VueFieldApi<
        TFieldName,
        DeepValue<TGroupValue, TFieldName>,
        ToFieldError<
          NoInfer<TFieldValidators>,
          TGroupError['subfieldError'],
          TFormError
        >,
        TFormData,
        TFormError,
        TFieldComponents
      >
    }
  }
>

export type VueFormGroupArrayFieldComponent<
  in out TFormData,
  in out TGroupValue,
  in out TGroupError extends ScopedErrorTypes,
  in out TFormError extends ScopedErrorTypes,
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
    TGroupError['subfieldError'],
    TFormData,
    TFormError,
    TFieldComponents
  > &
    PublicProps,
) => VueComponentInstance<
  VueFormFieldProps<
    TGroupValue,
    TFieldName,
    DeepValue<TGroupValue, TFieldName>,
    TFieldValidators,
    TGroupError['subfieldError'],
    TFormData,
    TFormError,
    TFieldComponents
  >,
  {
    default: {
      field: VueFieldApi<
        TFieldName,
        DeepValue<TGroupValue, TFieldName>,
        ToFieldError<
          NoInfer<TFieldValidators>,
          TGroupError['subfieldError'],
          TFormError
        >,
        TFormData,
        TFormError,
        TFieldComponents
      >
    }
  }
>

export interface VueFormGroupApi<
  in out TFormData,
  in out TGroupName,
  in out TGroupValue,
  in out TGroupError extends ScopedErrorTypes,
  in out TFormError extends ScopedErrorTypes,
  in out TFieldComponents extends Record<string, Component>,
> extends FormGroupApi<
  TFormData,
  TGroupName,
  TGroupValue,
  TGroupError,
  TFormError
> {
  Field: VueFormGroupFieldComponent<
    TFormData,
    TGroupValue,
    TGroupError,
    TFormError,
    TFieldComponents
  >
  ArrayField: VueFormGroupArrayFieldComponent<
    TFormData,
    TGroupValue,
    TGroupError,
    TFormError,
    TFieldComponents
  >
  Subscribe: VueFormGroupSubscribeComponent<TGroupValue, TGroupError>
}

export interface VueFormGroupProps<
  in out TFormData,
  in out TGroupName,
  in out TGroupValue,
  in out TGroupValidators extends FormGroupValidators<TGroupValue>,
  in out TFormError extends ScopedErrorTypes,
  in out TFieldComponents extends Record<string, Component>,
> extends Omit<
  FormGroupOptions<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidators,
    TFormError
  >,
  'form'
> {
  readonly [fieldComponentsType]?: TFieldComponents
}

export type VueFormGroupComponent<
  in out TFormData,
  in out TFormError extends ScopedErrorTypes,
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
    TFormError,
    TFieldComponents
  > &
    PublicProps,
) => VueComponentInstance<
  VueFormGroupProps<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidators,
    TFormError,
    TFieldComponents
  >,
  {
    default: {
      group: VueFormGroupApi<
        TFormData,
        TGroupName,
        TGroupValue,
        ToFormGroupErrorTypes<NoInfer<TGroupValidators>>,
        TFormError,
        TFieldComponents
      >
    }
  }
>

export interface VueTanStackFormComponents<
  in out TFormData,
  in out TFormError extends ScopedErrorTypes,
  in out TFieldComponents extends Record<string, Component> = Record<
    never,
    never
  >,
> {
  Field: VueFormFieldComponent<TFormData, TFormError, TFieldComponents>
  ArrayField: VueFormArrayFieldComponent<
    TFormData,
    TFormError,
    TFieldComponents
  >
  Subscribe: VueFormSubscribeComponent<TFormData, TFormError>
  FormGroup: VueFormGroupComponent<TFormData, TFormError, TFieldComponents>
}

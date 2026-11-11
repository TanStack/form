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
import type { CrossVersionPreactNode } from '../preactTypes.public'
import type { FunctionComponent, MemoExoticComponent } from 'preact/compat'

type ExactFieldBrand<out TValue> = {
  readonly __tanstackFieldExactType: TValue
}

type AcceptsFieldBrand<out TAcceptedValue> = {
  readonly __tanstackFieldAcceptsType: TAcceptedValue
}

type CompatibleFieldKey<TKey, TComponent, TTargetValue> = [TComponent] extends [
  ExactFieldBrand<infer TExact>,
]
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
  TComponent extends MemoExoticComponent<infer TInner>
    ? UnwrapComponent<TInner>
    : TComponent

type UnwrappedFieldComponents<
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
> = {
  [K in keyof TFieldComponents]: UnwrapComponent<TFieldComponents[K]>
}

type FilteredFieldComponents<
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
  in out TTargetValue,
  in out TUnwrappedFieldComponents extends {
    [K in keyof TFieldComponents]: any
  } = UnwrappedFieldComponents<TFieldComponents>,
> = {
  [
    K in keyof TFieldComponents as CompatibleFieldKey<
      K,
      TUnwrappedFieldComponents[K],
      TTargetValue
    >
  ]: TFieldComponents[K]
}

type FieldComponentsMatchingType<
  TFieldComponents extends Record<string, FunctionComponent<any>>,
  TTargetValue,
> = unknown extends TTargetValue
  ? TFieldComponents
  : string extends keyof TFieldComponents
    ? TFieldComponents
    : FilteredFieldComponents<TFieldComponents, TTargetValue>

export type PreactFieldApi<
  TFieldName,
  TFieldValue,
  TFieldError,
  TFormData,
  TFormError extends ScopedErrorTypes,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = FieldApi<TFieldName, TFieldValue, TFieldError, TFormData, TFormError> &
  FieldComponentsMatchingType<TFieldComponents, TFieldValue>

/**
 * Subscribe to `form.atom` (full form state). The selector receives the full
 * {@link FormState}.
 */
interface PreactSubscribeProps<in out TSourceData, in out TSelected> {
  selector: (state: TSourceData) => TSelected
  when?: (selected: NoInfer<TSelected>) => boolean
  children:
    | ((state: NoInfer<TSelected>) => CrossVersionPreactNode)
    | CrossVersionPreactNode
}

export type PreactFormSubscribeProps<
  TFormData,
  TFormError extends ScopedErrorTypes,
  TSelected,
> = PreactSubscribeProps<FormState<TFormData, TFormError>, TSelected>

export type PreactFormSubscribeComponent<
  in out TFormData,
  in out TFormError extends ScopedErrorTypes,
> = <const TSelected>(
  props: PreactFormSubscribeProps<TFormData, TFormError, TSelected>,
) => CrossVersionPreactNode

export interface PreactFormFieldProps<
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
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
> extends FieldApiOptions<
  TFieldData,
  TFieldName,
  TFieldValue,
  TFieldValidators,
  TGroupFieldError,
  TFormData,
  TFormError
> {
  children: (
    fieldApi: PreactFieldApi<
      TFieldName,
      TFieldValue,
      ToFieldError<NoInfer<TFieldValidators>, TGroupFieldError, TFormError>,
      TFormData,
      TFormError,
      TFieldComponents
    >,
  ) => CrossVersionPreactNode
}

export type PreactFormFieldComponent<
  in out TFormData,
  in out TFormError extends ScopedErrorTypes,
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
> = {
  <
    TFieldName extends DeepKeys<TFormData>,
    const TFieldValidators extends FieldValidators<
      TFormData,
      TFieldName,
      DeepValue<TFormData, TFieldName>
    >,
  >(
    props: PreactFormFieldProps<
      TFormData,
      TFieldName,
      DeepValue<TFormData, TFieldName>,
      TFieldValidators,
      never,
      TFormData,
      TFormError,
      TFieldComponents
    >,
  ): CrossVersionPreactNode
}

export type PreactFormArrayFieldComponent<
  in out TFormData,
  in out TFormError extends ScopedErrorTypes,
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
> = {
  <
    TFieldName extends DeepKeysWhereValueIncludes<TFormData, Array<any>>,
    const TFieldValidators extends FieldValidators<
      TFormData,
      TFieldName,
      DeepValue<TFormData, TFieldName>
    >,
  >(
    props: PreactFormFieldProps<
      TFormData,
      TFieldName,
      DeepValue<TFormData, TFieldName>,
      TFieldValidators,
      never,
      TFormData,
      TFormError,
      TFieldComponents
    >,
  ): CrossVersionPreactNode
}

export type PreactFormGroupSubscribeProps<
  TGroupValue,
  TFormError extends ScopedErrorTypes,
  TSelected,
> = PreactSubscribeProps<FormGroupState<TGroupValue, TFormError>, TSelected>

export type PreactFormGroupSubscribeComponent<
  in out TGroupValue,
  in out TGroupError extends ScopedErrorTypes,
> = <const TSelected>(
  props: PreactFormGroupSubscribeProps<TGroupValue, TGroupError, TSelected>,
) => CrossVersionPreactNode

export interface PreactFormGroupFieldComponent<
  in out TFormData,
  in out TGroupValue,
  in out TGroupError extends ScopedErrorTypes,
  in out TFormError extends ScopedErrorTypes,
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
> {
  <
    TFieldName extends DeepKeys<TGroupValue>,
    const TFieldValidators extends FieldValidators<
      TGroupValue,
      TFieldName,
      DeepValue<TGroupValue, TFieldName>
    >,
  >(
    props: PreactFormFieldProps<
      TGroupValue,
      TFieldName,
      DeepValue<TGroupValue, TFieldName>,
      TFieldValidators,
      TGroupError['subfieldError'],
      TFormData,
      TFormError,
      TFieldComponents
    >,
  ): CrossVersionPreactNode
}

export type PreactFormGroupArrayFieldComponent<
  in out TFormData,
  in out TGroupValue,
  in out TGroupError extends ScopedErrorTypes,
  in out TFormError extends ScopedErrorTypes,
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
> = {
  <
    TFieldName extends DeepKeysWhereValueIncludes<TGroupValue, Array<any>>,
    const TFieldValidators extends FieldValidators<
      TGroupValue,
      TFieldName,
      DeepValue<TGroupValue, TFieldName>
    >,
  >(
    props: PreactFormFieldProps<
      TGroupValue,
      TFieldName,
      DeepValue<TGroupValue, TFieldName>,
      TFieldValidators,
      TGroupError['subfieldError'],
      TFormData,
      TFormError,
      TFieldComponents
    >,
  ): CrossVersionPreactNode
}

export interface PreactFormGroupApi<
  in out TFormData,
  in out TGroupName,
  in out TGroupValue,
  in out TGroupError extends ScopedErrorTypes,
  in out TFormError extends ScopedErrorTypes,
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
> extends FormGroupApi<
  TFormData,
  TGroupName,
  TGroupValue,
  TGroupError,
  TFormError
> {
  Field: PreactFormGroupFieldComponent<
    TFormData,
    TGroupValue,
    TGroupError,
    TFormError,
    TFieldComponents
  >
  ArrayField: PreactFormGroupArrayFieldComponent<
    TFormData,
    TGroupValue,
    TGroupError,
    TFormError,
    TFieldComponents
  >
  Subscribe: PreactFormGroupSubscribeComponent<TGroupValue, TGroupError>
}

export interface PreactFormGroupProps<
  in out TFormData,
  in out TGroupName,
  in out TGroupValue,
  in out TGroupValidators extends FormGroupValidators<TGroupValue>,
  in out TFormError extends ScopedErrorTypes,
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
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
  children: (
    groupApi: PreactFormGroupApi<
      TFormData,
      TGroupName,
      TGroupValue,
      ToFormGroupErrorTypes<NoInfer<TGroupValidators>>,
      TFormError,
      TFieldComponents
    >,
  ) => CrossVersionPreactNode
}

export interface PreactFormGroupComponent<
  in out TFormData,
  in out TFormError extends ScopedErrorTypes,
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
> {
  <
    TGroupName extends DeepKeys<TFormData>,
    TGroupValue extends DeepValue<TFormData, TGroupName>,
    const TGroupValidators extends FormGroupValidators<TGroupValue>,
  >(
    props: PreactFormGroupProps<
      TFormData,
      TGroupName,
      TGroupValue,
      TGroupValidators,
      TFormError,
      TFieldComponents
    >,
  ): CrossVersionPreactNode
}

export interface PreactTanStackFormComponents<
  in out TFormData,
  in out TFormError extends ScopedErrorTypes,
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
> {
  /**
   * TODO docs
   */
  Field: PreactFormFieldComponent<TFormData, TFormError, TFieldComponents>

  ArrayField: PreactFormArrayFieldComponent<
    TFormData,
    TFormError,
    TFieldComponents
  >

  Subscribe: PreactFormSubscribeComponent<TFormData, TFormError>

  FormGroup: PreactFormGroupComponent<TFormData, TFormError, TFieldComponents>
}

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
import type {
  Component,
  ComponentConstructorOptions,
  Snippet,
  SvelteComponent,
} from 'svelte'

export type WithoutFunction<T> = {
  [K in keyof T as T[K] extends Function ? never : K]: T[K]
}

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

export type SvelteFieldApi<
  TFieldName,
  TFieldValue,
  TFieldError,
  TFormData,
  TFormError extends ScopedErrorTypes,
  TFieldComponents extends Record<string, Component<any>>,
> = FieldApi<TFieldName, TFieldValue, TFieldError, TFormData, TFormError> &
  FieldComponentsMatchingType<TFieldComponents, TFieldValue>

interface SvelteSubscribeProps<TSourceData, TSelected> {
  selector: (state: TSourceData) => TSelected
  when?: (selected: NoInfer<TSelected>) => boolean
  children: Snippet<[NoInfer<TSelected>]>
}

export type SvelteFormSubscribeProps<
  TFormData,
  TFormError extends ScopedErrorTypes,
  TSelected,
> = SvelteSubscribeProps<FormState<TFormData, TFormError>, TSelected>

export type SvelteFormSubscribeComponent<
  TFormData,
  TFormError extends ScopedErrorTypes,
> = (new <const TSelected>(
  options: ComponentConstructorOptions<
    SvelteFormSubscribeProps<TFormData, TFormError, TSelected>
  >,
) => SvelteComponent) &
  Component<any> &
  WithoutFunction<Component>

export interface SvelteFormFieldProps<
  TFieldData,
  TFieldName,
  TFieldValue,
  TFieldValidators extends FieldValidators<TFieldData, TFieldName, TFieldValue>,
  TGroupFieldError,
  TFormData,
  TFormError extends ScopedErrorTypes,
  TFieldComponents extends Record<string, Component<any>>,
> extends FieldApiOptions<
  TFieldData,
  TFieldName,
  TFieldValue,
  TFieldValidators,
  TGroupFieldError,
  TFormData,
  TFormError
> {
  children: Snippet<
    [
      SvelteFieldApi<
        TFieldName,
        TFieldValue,
        ToFieldError<NoInfer<TFieldValidators>, TGroupFieldError, TFormError>,
        TFormData,
        TFormError,
        TFieldComponents
      >,
    ]
  >
}

export type SvelteFormFieldComponent<
  TFormData,
  TFormError extends ScopedErrorTypes,
  TFieldComponents extends Record<string, Component<any>>,
> = (new <
  TFieldName extends DeepKeys<TFormData>,
  const TFieldValidators extends FieldValidators<
    TFormData,
    TFieldName,
    DeepValue<TFormData, TFieldName>
  >,
>(
  options: ComponentConstructorOptions<
    SvelteFormFieldProps<
      TFormData,
      TFieldName,
      DeepValue<TFormData, TFieldName>,
      TFieldValidators,
      never,
      TFormData,
      TFormError,
      TFieldComponents
    >
  >,
) => SvelteComponent) &
  Component<any> &
  WithoutFunction<Component>

export type SvelteFormArrayFieldComponent<
  TFormData,
  TFormError extends ScopedErrorTypes,
  TFieldComponents extends Record<string, Component<any>>,
> = (new <
  TFieldName extends DeepKeysWhereValueIncludes<TFormData, Array<any>>,
  const TFieldValidators extends FieldValidators<
    TFormData,
    TFieldName,
    DeepValue<TFormData, TFieldName>
  >,
>(
  options: ComponentConstructorOptions<
    SvelteFormFieldProps<
      TFormData,
      TFieldName,
      DeepValue<TFormData, TFieldName>,
      TFieldValidators,
      never,
      TFormData,
      TFormError,
      TFieldComponents
    >
  >,
) => SvelteComponent) &
  Component<any> &
  WithoutFunction<Component>

export type SvelteFormGroupSubscribeComponent<
  TGroupValue,
  TGroupError extends ScopedErrorTypes,
> = (new <const TSelected>(
  options: ComponentConstructorOptions<
    SvelteSubscribeProps<FormGroupState<TGroupValue, TGroupError>, TSelected>
  >,
) => SvelteComponent) &
  Component<any> &
  WithoutFunction<Component>

export type SvelteFormGroupFieldComponent<
  TFormData,
  TGroupValue,
  TGroupError extends ScopedErrorTypes,
  TFormError extends ScopedErrorTypes,
  TFieldComponents extends Record<string, Component<any>>,
> = (new <
  TFieldName extends DeepKeys<TGroupValue>,
  const TFieldValidators extends FieldValidators<
    TGroupValue,
    TFieldName,
    DeepValue<TGroupValue, TFieldName>
  >,
>(
  options: ComponentConstructorOptions<
    SvelteFormFieldProps<
      TGroupValue,
      TFieldName,
      DeepValue<TGroupValue, TFieldName>,
      TFieldValidators,
      TGroupError['subfieldError'],
      TFormData,
      TFormError,
      TFieldComponents
    >
  >,
) => SvelteComponent) &
  Component<any> &
  WithoutFunction<Component>

export type SvelteFormGroupArrayFieldComponent<
  TFormData,
  TGroupValue,
  TGroupError extends ScopedErrorTypes,
  TFormError extends ScopedErrorTypes,
  TFieldComponents extends Record<string, Component<any>>,
> = (new <
  TFieldName extends DeepKeysWhereValueIncludes<TGroupValue, Array<any>>,
  const TFieldValidators extends FieldValidators<
    TGroupValue,
    TFieldName,
    DeepValue<TGroupValue, TFieldName>
  >,
>(
  options: ComponentConstructorOptions<
    SvelteFormFieldProps<
      TGroupValue,
      TFieldName,
      DeepValue<TGroupValue, TFieldName>,
      TFieldValidators,
      TGroupError['subfieldError'],
      TFormData,
      TFormError,
      TFieldComponents
    >
  >,
) => SvelteComponent) &
  Component<any> &
  WithoutFunction<Component>

export interface SvelteFormGroupApi<
  TFormData,
  TGroupName,
  TGroupValue,
  TGroupError extends ScopedErrorTypes,
  TFormError extends ScopedErrorTypes,
  TFieldComponents extends Record<string, Component<any>>,
> extends FormGroupApi<
  TFormData,
  TGroupName,
  TGroupValue,
  TGroupError,
  TFormError
> {
  Field: SvelteFormGroupFieldComponent<
    TFormData,
    TGroupValue,
    TGroupError,
    TFormError,
    TFieldComponents
  >
  ArrayField: SvelteFormGroupArrayFieldComponent<
    TFormData,
    TGroupValue,
    TGroupError,
    TFormError,
    TFieldComponents
  >
  Subscribe: SvelteFormGroupSubscribeComponent<TGroupValue, TGroupError>
}

export interface SvelteFormGroupProps<
  TFormData,
  TGroupName,
  TGroupValue,
  TGroupValidators extends FormGroupValidators<TGroupValue>,
  TFormError extends ScopedErrorTypes,
  TFieldComponents extends Record<string, Component<any>>,
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
  children: Snippet<
    [
      SvelteFormGroupApi<
        TFormData,
        TGroupName,
        TGroupValue,
        ToFormGroupErrorTypes<NoInfer<TGroupValidators>>,
        TFormError,
        TFieldComponents
      >,
    ]
  >
}

export type SvelteFormGroupComponent<
  TFormData,
  TFormError extends ScopedErrorTypes,
  TFieldComponents extends Record<string, Component<any>>,
> = (new <
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  const TGroupValidators extends FormGroupValidators<TGroupValue>,
>(
  options: ComponentConstructorOptions<
    SvelteFormGroupProps<
      TFormData,
      TGroupName,
      TGroupValue,
      TGroupValidators,
      TFormError,
      TFieldComponents
    >
  >,
) => SvelteComponent) &
  Component<any> &
  WithoutFunction<Component>

export interface SvelteTanStackFormComponents<
  TFormData,
  TFormError extends ScopedErrorTypes,
  TFieldComponents extends Record<string, Component<any>> = Record<
    never,
    never
  >,
> {
  Field: SvelteFormFieldComponent<TFormData, TFormError, TFieldComponents>
  ArrayField: SvelteFormArrayFieldComponent<
    TFormData,
    TFormError,
    TFieldComponents
  >
  Subscribe: SvelteFormSubscribeComponent<TFormData, TFormError>
  FormGroup: SvelteFormGroupComponent<TFormData, TFormError, TFieldComponents>
}

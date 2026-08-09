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
  TFormErrorTypes extends FormErrorTypes,
  TFieldComponents extends Record<string, Component<any>>,
> = FieldApi<TFieldName, TFieldValue, TFieldError, TFormData, TFormErrorTypes> &
  FieldComponentsMatchingType<TFieldComponents, TFieldValue>

interface SvelteSubscribeProps<TSourceData, TSelected> {
  selector: (state: TSourceData) => TSelected
  when?: (selected: NoInfer<TSelected>) => boolean
  children: Snippet<[NoInfer<TSelected>]>
}

export type SvelteFormSubscribeProps<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TSelected,
> = SvelteSubscribeProps<FormState<TFormData, TFormErrorTypes>, TSelected>

export type SvelteFormSubscribeComponent<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
> = (new <TSelected>(
  options: ComponentConstructorOptions<
    SvelteFormSubscribeProps<TFormData, TFormErrorTypes, TSelected>
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
  children: Snippet<
    [
      SvelteFieldApi<
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
    ]
  >
}

export type SvelteFormFieldComponent<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
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
      TFormErrorTypes,
      TFieldComponents
    >
  >,
) => SvelteComponent) &
  Component<any> &
  WithoutFunction<Component>

export type SvelteFormArrayFieldComponent<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
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
      TFormErrorTypes,
      TFieldComponents
    >
  >,
) => SvelteComponent) &
  Component<any> &
  WithoutFunction<Component>

export type SvelteFormGroupSubscribeComponent<
  TGroupValue,
  TGroupErrorTypes extends FormErrorTypes,
> = (new <TSelected>(
  options: ComponentConstructorOptions<
    SvelteSubscribeProps<
      FormGroupState<TGroupValue, TGroupErrorTypes>,
      TSelected
    >
  >,
) => SvelteComponent) &
  Component<any> &
  WithoutFunction<Component>

export type SvelteFormGroupFieldComponent<
  TFormData,
  TGroupValue,
  TGroupErrorTypes extends FormErrorTypes,
  TFormErrorTypes extends FormErrorTypes,
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
      TGroupErrorTypes['fieldError'],
      TFormData,
      TFormErrorTypes,
      TFieldComponents
    >
  >,
) => SvelteComponent) &
  Component<any> &
  WithoutFunction<Component>

export type SvelteFormGroupArrayFieldComponent<
  TFormData,
  TGroupValue,
  TGroupErrorTypes extends FormErrorTypes,
  TFormErrorTypes extends FormErrorTypes,
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
      TGroupErrorTypes['fieldError'],
      TFormData,
      TFormErrorTypes,
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
  Field: SvelteFormGroupFieldComponent<
    TFormData,
    TGroupValue,
    TGroupErrorTypes,
    TFormErrorTypes,
    TFieldComponents
  >
  ArrayField: SvelteFormGroupArrayFieldComponent<
    TFormData,
    TGroupValue,
    TGroupErrorTypes,
    TFormErrorTypes,
    TFieldComponents
  >
  Subscribe: SvelteFormGroupSubscribeComponent<TGroupValue, TGroupErrorTypes>
}

export interface SvelteFormGroupProps<
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
  children: Snippet<
    [
      SvelteFormGroupApi<
        TFormData,
        TGroupName,
        TGroupValue,
        ToFormGroupErrorTypes<NoInfer<TGroupValidators>>,
        TFormErrorTypes,
        TFieldComponents
      >,
    ]
  >
}

export type SvelteFormGroupComponent<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
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
      TFormErrorTypes,
      TFieldComponents
    >
  >,
) => SvelteComponent) &
  Component<any> &
  WithoutFunction<Component>

export interface SvelteTanStackFormComponents<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TFieldComponents extends Record<string, Component<any>> = Record<
    never,
    never
  >,
> {
  Field: SvelteFormFieldComponent<TFormData, TFormErrorTypes, TFieldComponents>
  ArrayField: SvelteFormArrayFieldComponent<
    TFormData,
    TFormErrorTypes,
    TFieldComponents
  >
  Subscribe: SvelteFormSubscribeComponent<TFormData, TFormErrorTypes>
  FormGroup: SvelteFormGroupComponent<
    TFormData,
    TFormErrorTypes,
    TFieldComponents
  >
}

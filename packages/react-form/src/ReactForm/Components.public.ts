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
} from '@tanstack/form-core'
import type { CrossVersionReactNode } from '../reactTypes.public'
import type {
  FunctionComponent,
  LazyExoticComponent,
  MemoExoticComponent,
} from 'react'

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
  TComponent extends LazyExoticComponent<infer TInner>
    ? UnwrapComponent<TInner>
    : TComponent extends MemoExoticComponent<infer TInner>
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

type NonNullish<TValue> = Exclude<TValue, null | undefined>

type UndefinedIfNullish<TValue> = [Extract<TValue, null | undefined>] extends [
  never,
]
  ? never
  : undefined

type SimpleFieldName<TValue> =
  NonNullish<TValue> extends infer TNonNullish
    ? TNonNullish extends ReadonlyArray<any>
      ? never
      : keyof TNonNullish & string
    : never

type SimpleFieldValue<TValue, TFieldName extends string> =
  | (NonNullish<TValue> extends infer TNonNullish
      ? TNonNullish extends any
        ? TFieldName extends keyof TNonNullish
          ? TNonNullish[TFieldName]
          : never
        : never
      : never)
  | (NonNullish<TValue> extends infer TNonNullish
      ? TNonNullish extends any
        ? TFieldName extends keyof TNonNullish
          ? never
          : undefined
        : never
      : never)
  | UndefinedIfNullish<TValue>

export type ReactFieldApi<
  TFieldName,
  TFieldValue,
  TFieldValidatorMetas extends FieldValidatorMetas,
  TGroupValidatorMetas extends FormGroupValidatorMetas,
  TFormData,
  TFormValidatorMetas extends FormValidatorMetas,
  TSubmitReturn,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = FieldApi<
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
 * Subscribe to `form.atom` (full form state). The selector receives the full
 * {@link FormState}.
 */
interface ReactSubscribeProps<in out TSourceData, in out TSelected> {
  selector: (state: TSourceData) => TSelected
  when?: (selected: NoInfer<TSelected>) => boolean
  children:
    | ((state: NoInfer<TSelected>) => CrossVersionReactNode)
    | CrossVersionReactNode
}

export type ReactFormSubscribeProps<
  TFormData,
  TFormValidatorMetas extends FormValidatorMetas,
  TSubmitReturn,
  TSelected,
> = ReactSubscribeProps<
  FormState<TFormData, TFormValidatorMetas, TSubmitReturn>,
  TSelected
>

export type ReactFormSubscribeComponent<
  in out TFormData,
  in out TFormValidatorMetas extends FormValidatorMetas,
  in out TSubmitReturn,
> = <TSelected>(
  props: ReactFormSubscribeProps<
    TFormData,
    TFormValidatorMetas,
    TSubmitReturn,
    TSelected
  >,
) => CrossVersionReactNode

export interface ReactFormFieldProps<
  in out TFieldData,
  in out TFieldName,
  in out TFieldValue,
  in out TFieldValidators extends FieldValidators<
    TFieldData,
    TFieldName,
    TFieldValue
  >,
  in out TGroupValidators extends FormGroupValidatorMetas,
  in out TFormData,
  in out TFormValidatorMetas extends FormValidatorMetas,
  in out TSubmitReturn,
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
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
  in out TFormData,
  in out TFormValidatorMetas extends FormValidatorMetas,
  in out TSubmitReturn,
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
> = <
  TFieldName extends DeepKeys<TFormData>,
  TFieldValue = DeepValue<TFormData, TFieldName>,
  TFieldValidators extends FieldValidators<TFormData, TFieldName, TFieldValue> =
    [],
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
  in out TFieldData,
  in out TFieldName,
  in out TFieldValue,
  in out TFieldValidators extends FieldValidators<
    TFieldData,
    TFieldName,
    TFieldValue
  >,
  in out TGroupValidatorMetas extends FormGroupValidatorMetas,
  in out TFormData,
  in out TFormValidatorMetas extends FormValidatorMetas,
  in out TSubmitReturn,
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
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
  in out TFormData,
  in out TFormValidatorMetas extends FormValidatorMetas,
  in out TSubmitReturn,
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
> = <
  TFieldName extends DeepKeysWhereValueIncludes<TFormData, Array<any>>,
  TFieldValue = DeepValue<TFormData, TFieldName>,
  TFieldValidators extends FieldValidators<TFormData, TFieldName, TFieldValue> =
    [],
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
  TGroupValue,
  TGroupValidatorMetas extends FormGroupValidatorMetas,
  TSelected,
> = ReactSubscribeProps<
  FormGroupState<TGroupValue, TGroupValidatorMetas>,
  TSelected
>

export type ReactFormGroupSubscribeComponent<
  in out TGroupValue,
  in out TGroupValidatorMetas extends FormGroupValidatorMetas,
> = <TSelected>(
  props: ReactFormGroupSubscribeProps<
    TGroupValue,
    TGroupValidatorMetas,
    TSelected
  >,
) => CrossVersionReactNode

export interface ReactFormGroupFieldComponent<
  in out TFormData,
  in out TGroupValue,
  in out TGroupValidators extends FormGroupValidatorMetas,
  in out TFormValidatorMetas extends FormValidatorMetas,
  in out TSubmitReturn,
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
> {
  <
    TFieldName extends SimpleFieldName<TGroupValue>,
    TFieldValue = SimpleFieldValue<TGroupValue, TFieldName>,
    TFieldValidators extends FieldValidators<
      TGroupValue,
      TFieldName,
      TFieldValue
    > = [],
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
  ): CrossVersionReactNode
  <
    TFieldName extends DeepKeys<TGroupValue>,
    TFieldValue = DeepValue<TGroupValue, TFieldName>,
    TFieldValidators extends FieldValidators<
      TGroupValue,
      TFieldName,
      TFieldValue
    > = [],
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
  ): CrossVersionReactNode
}

export type ReactFormGroupArrayFieldComponent<
  in out TFormData,
  in out TGroupValue,
  in out TGroupValidatorMetas extends FormGroupValidatorMetas,
  in out TFormValidatorMetas extends FormValidatorMetas,
  in out TSubmitReturn,
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
> = <
  TFieldName extends DeepKeysWhereValueIncludes<TGroupValue, Array<any>>,
  TFieldValue = DeepValue<TGroupValue, TFieldName>,
  TFieldValidators extends FieldValidators<
    TGroupValue,
    TFieldName,
    TFieldValue
  > = [],
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

export interface ReactFormGroupApi<
  in out TFormData,
  in out TGroupName,
  in out TGroupValue,
  in out TGroupValidatorMetas extends FormGroupValidatorMetas,
  in out TFormValidatorMetas extends FormValidatorMetas,
  in out TSubmitReturn,
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
> extends FormGroupApi<
  TFormData,
  TGroupName,
  TGroupValue,
  TGroupValidatorMetas,
  TFormValidatorMetas,
  TSubmitReturn
> {
  Field: ReactFormGroupFieldComponent<
    TFormData,
    TGroupValue,
    TGroupValidatorMetas,
    TFormValidatorMetas,
    TSubmitReturn,
    TFieldComponents
  >
  ArrayField: ReactFormGroupArrayFieldComponent<
    TFormData,
    TGroupValue,
    TGroupValidatorMetas,
    TFormValidatorMetas,
    TSubmitReturn,
    TFieldComponents
  >
  Subscribe: ReactFormGroupSubscribeComponent<TGroupValue, TGroupValidatorMetas>
}

export interface ReactFormGroupProps<
  in out TFormData,
  in out TGroupName,
  in out TGroupValue,
  in out TGroupValidators extends FormGroupValidators<TGroupValue>,
  in out TFormValidatorMetas extends FormValidatorMetas,
  in out TSubmitReturn,
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
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

export interface ReactFormGroupComponent<
  in out TFormData,
  in out TFormValidatorMetas extends FormValidatorMetas,
  in out TSubmitReturn,
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
> {
  <
    TGroupName extends SimpleFieldName<TFormData>,
    TGroupValue = SimpleFieldValue<TFormData, TGroupName>,
    TGroupValidators extends FormGroupValidators<TGroupValue> =
      FormGroupValidators<TGroupValue>,
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
  ): CrossVersionReactNode
  <
    TGroupName extends DeepKeys<TFormData>,
    TGroupValue = DeepValue<TFormData, TGroupName>,
    TGroupValidators extends FormGroupValidators<TGroupValue> =
      FormGroupValidators<TGroupValue>,
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
  ): CrossVersionReactNode
}

export interface ReactTanStackFormComponents<
  in out TFormData,
  in out TFormValidatorMetas extends FormValidatorMetas,
  in out TSubmitReturn,
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
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

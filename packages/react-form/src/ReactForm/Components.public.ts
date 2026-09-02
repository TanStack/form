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
  FunctionComponent,
  LazyExoticComponent,
  MemoExoticComponent,
  ReactNode,
} from 'react'
import type { ReactComponentTree } from '../AppForm/componentMap.public'

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

type FilteredFieldComponents<
  in out TFieldComponents extends ReactComponentTree,
  in out TTargetValue,
> = {
  [
    K in keyof TFieldComponents as TFieldComponents[K] extends FunctionComponent<any>
      ? CompatibleFieldKey<
          K,
          UnwrapComponent<TFieldComponents[K]>,
          TTargetValue
        >
      : K
  ]: TFieldComponents[K] extends infer TComp extends FunctionComponent<any>
    ? TComp
    : TFieldComponents[K] extends ReactComponentTree
      ? FieldComponentsMatchingType<TFieldComponents[K], TTargetValue>
      : never
}

type FieldComponentsMatchingType<
  TFieldComponents extends ReactComponentTree,
  TTargetValue,
> = unknown extends TTargetValue
  ? TFieldComponents
  : string extends keyof TFieldComponents
    ? TFieldComponents
    : FilteredFieldComponents<TFieldComponents, TTargetValue>

export type ReactFieldApi<
  TFieldName,
  TFieldValue,
  TFieldError,
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TFieldComponents extends ReactComponentTree,
> = FieldApi<TFieldName, TFieldValue, TFieldError, TFormData, TFormErrorTypes> &
  FieldComponentsMatchingType<TFieldComponents, TFieldValue>

/**
 * Subscribe to `form.atom` (full form state). The selector receives the full
 * {@link FormState}.
 */
interface ReactSubscribeProps<in out TSourceData, in out TSelected> {
  selector: (state: TSourceData) => TSelected
  when?: (selected: NoInfer<TSelected>) => boolean
  children: ((state: NoInfer<TSelected>) => ReactNode) | ReactNode
}

export type ReactFormSubscribeProps<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TSelected,
> = ReactSubscribeProps<FormState<TFormData, TFormErrorTypes>, TSelected>

export type ReactFormSubscribeComponent<
  in out TFormData,
  in out TFormErrorTypes extends FormErrorTypes,
> = <const TSelected>(
  props: ReactFormSubscribeProps<TFormData, TFormErrorTypes, TSelected>,
) => ReactNode

export interface ReactFormFieldProps<
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
  in out TFieldComponents extends ReactComponentTree,
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
    fieldApi: ReactFieldApi<
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
  ) => ReactNode
}

export type ReactFormFieldComponent<
  in out TFormData,
  in out TFormErrorTypes extends FormErrorTypes,
  in out TFieldComponents extends ReactComponentTree,
> = {
  <
    TFieldName extends DeepKeys<TFormData>,
    const TFieldValidators extends FieldValidators<
      TFormData,
      TFieldName,
      DeepValue<TFormData, TFieldName>
    >,
  >(
    props: ReactFormFieldProps<
      TFormData,
      TFieldName,
      DeepValue<TFormData, TFieldName>,
      TFieldValidators,
      never,
      TFormData,
      TFormErrorTypes,
      TFieldComponents
    >,
  ): ReactNode
}

export type ReactFormArrayFieldComponent<
  in out TFormData,
  in out TFormErrorTypes extends FormErrorTypes,
  in out TFieldComponents extends ReactComponentTree,
> = {
  <
    TFieldName extends DeepKeysWhereValueIncludes<TFormData, Array<any>>,
    const TFieldValidators extends FieldValidators<
      TFormData,
      TFieldName,
      DeepValue<TFormData, TFieldName>
    >,
  >(
    props: ReactFormFieldProps<
      TFormData,
      TFieldName,
      DeepValue<TFormData, TFieldName>,
      TFieldValidators,
      never,
      TFormData,
      TFormErrorTypes,
      TFieldComponents
    >,
  ): ReactNode
}

export type ReactFormGroupSubscribeProps<
  TGroupValue,
  TGroupErrorTypes extends FormErrorTypes,
  TSelected,
> = ReactSubscribeProps<
  FormGroupState<TGroupValue, TGroupErrorTypes>,
  TSelected
>

export type ReactFormGroupSubscribeComponent<
  in out TGroupValue,
  in out TGroupErrorTypes extends FormErrorTypes,
> = <const TSelected>(
  props: ReactFormGroupSubscribeProps<TGroupValue, TGroupErrorTypes, TSelected>,
) => ReactNode

export interface ReactFormGroupFieldComponent<
  in out TFormData,
  in out TGroupValue,
  in out TGroupErrorTypes extends FormErrorTypes,
  in out TFormErrorTypes extends FormErrorTypes,
  in out TFieldComponents extends ReactComponentTree,
> {
  <
    TFieldName extends DeepKeys<TGroupValue>,
    const TFieldValidators extends FieldValidators<
      TGroupValue,
      TFieldName,
      DeepValue<TGroupValue, TFieldName>
    >,
  >(
    props: ReactFormFieldProps<
      TGroupValue,
      TFieldName,
      DeepValue<TGroupValue, TFieldName>,
      TFieldValidators,
      TGroupErrorTypes['fieldError'],
      TFormData,
      TFormErrorTypes,
      TFieldComponents
    >,
  ): ReactNode
}

export type ReactFormGroupArrayFieldComponent<
  in out TFormData,
  in out TGroupValue,
  in out TGroupErrorTypes extends FormErrorTypes,
  in out TFormErrorTypes extends FormErrorTypes,
  in out TFieldComponents extends ReactComponentTree,
> = {
  <
    TFieldName extends DeepKeysWhereValueIncludes<TGroupValue, Array<any>>,
    const TFieldValidators extends FieldValidators<
      TGroupValue,
      TFieldName,
      DeepValue<TGroupValue, TFieldName>
    >,
  >(
    props: ReactFormFieldProps<
      TGroupValue,
      TFieldName,
      DeepValue<TGroupValue, TFieldName>,
      TFieldValidators,
      TGroupErrorTypes['fieldError'],
      TFormData,
      TFormErrorTypes,
      TFieldComponents
    >,
  ): ReactNode
}

export interface ReactFormGroupApi<
  in out TFormData,
  in out TGroupName,
  in out TGroupValue,
  in out TGroupErrorTypes extends FormErrorTypes,
  in out TFormErrorTypes extends FormErrorTypes,
  in out TFieldComponents extends ReactComponentTree,
> extends FormGroupApi<
  TFormData,
  TGroupName,
  TGroupValue,
  TGroupErrorTypes,
  TFormErrorTypes
> {
  Field: ReactFormGroupFieldComponent<
    TFormData,
    TGroupValue,
    TGroupErrorTypes,
    TFormErrorTypes,
    TFieldComponents
  >
  ArrayField: ReactFormGroupArrayFieldComponent<
    TFormData,
    TGroupValue,
    TGroupErrorTypes,
    TFormErrorTypes,
    TFieldComponents
  >
  Subscribe: ReactFormGroupSubscribeComponent<TGroupValue, TGroupErrorTypes>
}

export interface ReactFormGroupProps<
  in out TFormData,
  in out TGroupName,
  in out TGroupValue,
  in out TGroupValidators extends FormGroupValidators<TGroupValue>,
  in out TFormErrorTypes extends FormErrorTypes,
  in out TFieldComponents extends ReactComponentTree,
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
    groupApi: ReactFormGroupApi<
      TFormData,
      TGroupName,
      TGroupValue,
      ToFormGroupErrorTypes<NoInfer<TGroupValidators>>,
      TFormErrorTypes,
      TFieldComponents
    >,
  ) => ReactNode
}

export interface ReactFormGroupComponent<
  in out TFormData,
  in out TFormErrorTypes extends FormErrorTypes,
  in out TFieldComponents extends ReactComponentTree,
> {
  <
    TGroupName extends DeepKeys<TFormData>,
    TGroupValue extends DeepValue<TFormData, TGroupName>,
    const TGroupValidators extends FormGroupValidators<TGroupValue>,
  >(
    props: ReactFormGroupProps<
      TFormData,
      TGroupName,
      TGroupValue,
      TGroupValidators,
      TFormErrorTypes,
      TFieldComponents
    >,
  ): ReactNode
}

export interface ReactTanStackFormComponents<
  in out TFormData,
  in out TFormErrorTypes extends FormErrorTypes,
  in out TFieldComponents extends ReactComponentTree,
> {
  /**
   * TODO docs
   */
  Field: ReactFormFieldComponent<TFormData, TFormErrorTypes, TFieldComponents>

  ArrayField: ReactFormArrayFieldComponent<
    TFormData,
    TFormErrorTypes,
    TFieldComponents
  >

  Subscribe: ReactFormSubscribeComponent<TFormData, TFormErrorTypes>

  FormGroup: ReactFormGroupComponent<
    TFormData,
    TFormErrorTypes,
    TFieldComponents
  >
}

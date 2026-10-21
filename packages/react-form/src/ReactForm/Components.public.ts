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
  ScopedErrorTypes,
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
  TFormError extends ScopedErrorTypes,
  TFieldComponents extends ReactComponentTree,
> = FieldApi<TFieldName, TFieldValue, TFieldError, TFormData, TFormError> &
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
  TFormError extends ScopedErrorTypes,
  TSelected,
> = ReactSubscribeProps<FormState<TFormData, TFormError>, TSelected>

export type ReactFormSubscribeComponent<
  in out TFormData,
  in out TFormError extends ScopedErrorTypes,
> = <const TSelected>(
  props: ReactFormSubscribeProps<TFormData, TFormError, TSelected>,
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
  in out TFormError extends ScopedErrorTypes,
  in out TFieldComponents extends ReactComponentTree,
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
    fieldApi: ReactFieldApi<
      TFieldName,
      TFieldValue,
      NoInfer<ToFieldError<TFieldValidators, TGroupFieldError, TFormError>>,
      TFormData,
      TFormError,
      TFieldComponents
    >,
  ) => ReactNode
}

export type ReactFormFieldComponent<
  in out TFormData,
  in out TFormError extends ScopedErrorTypes,
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
      TFormError,
      TFieldComponents
    >,
  ): ReactNode
}

export type ReactFormArrayFieldComponent<
  in out TFormData,
  in out TFormError extends ScopedErrorTypes,
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
      TFormError,
      TFieldComponents
    >,
  ): ReactNode
}

export type ReactFormGroupSubscribeProps<
  TGroupValue,
  TGroupError extends ScopedErrorTypes,
  TSelected,
> = ReactSubscribeProps<FormGroupState<TGroupValue, TGroupError>, TSelected>

export type ReactFormGroupSubscribeComponent<
  in out TGroupValue,
  in out TGroupError extends ScopedErrorTypes,
> = <const TSelected>(
  props: ReactFormGroupSubscribeProps<TGroupValue, TGroupError, TSelected>,
) => ReactNode

export interface ReactFormGroupFieldComponent<
  in out TFormData,
  in out TGroupValue,
  in out TGroupError extends ScopedErrorTypes,
  in out TFormError extends ScopedErrorTypes,
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
      TGroupError['subfieldError'],
      TFormData,
      TFormError,
      TFieldComponents
    >,
  ): ReactNode
}

export type ReactFormGroupArrayFieldComponent<
  in out TFormData,
  in out TGroupValue,
  in out TGroupError extends ScopedErrorTypes,
  in out TFormError extends ScopedErrorTypes,
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
      // TODO this disparity between groups and forms is a bit weird.
      // Stick to treating both the same when possible.
      TGroupError['subfieldError'],
      TFormData,
      TFormError,
      TFieldComponents
    >,
  ): ReactNode
}

export interface ReactFormGroupApi<
  in out TFormData,
  in out TGroupName,
  in out TGroupValue,
  in out TGroupError extends ScopedErrorTypes,
  in out TFormError extends ScopedErrorTypes,
  in out TFieldComponents extends ReactComponentTree,
> extends FormGroupApi<
  TFormData,
  TGroupName,
  TGroupValue,
  TGroupError,
  TFormError
> {
  Field: ReactFormGroupFieldComponent<
    TFormData,
    TGroupValue,
    TGroupError,
    TFormError,
    TFieldComponents
  >
  ArrayField: ReactFormGroupArrayFieldComponent<
    TFormData,
    TGroupValue,
    TGroupError,
    TFormError,
    TFieldComponents
  >
  Subscribe: ReactFormGroupSubscribeComponent<TGroupValue, TGroupError>
}

export interface ReactFormGroupProps<
  in out TFormData,
  in out TGroupName,
  in out TGroupValue,
  in out TGroupValidators extends FormGroupValidators<TGroupValue>,
  in out TFormError extends ScopedErrorTypes,
  in out TFieldComponents extends ReactComponentTree,
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
    groupApi: ReactFormGroupApi<
      TFormData,
      TGroupName,
      TGroupValue,
      ToFormGroupErrorTypes<NoInfer<TGroupValidators>>,
      TFormError,
      TFieldComponents
    >,
  ) => ReactNode
}

export interface ReactFormGroupComponent<
  in out TFormData,
  in out TFormError extends ScopedErrorTypes,
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
      TFormError,
      TFieldComponents
    >,
  ): ReactNode
}

export interface ReactTanStackFormComponents<
  in out TFormData,
  in out TFormError extends ScopedErrorTypes,
  in out TFieldComponents extends ReactComponentTree,
> {
  /**
   * TODO docs
   */
  Field: ReactFormFieldComponent<TFormData, TFormError, TFieldComponents>

  ArrayField: ReactFormArrayFieldComponent<
    TFormData,
    TFormError,
    TFieldComponents
  >

  Subscribe: ReactFormSubscribeComponent<TFormData, TFormError>

  FormGroup: ReactFormGroupComponent<TFormData, TFormError, TFieldComponents>
}

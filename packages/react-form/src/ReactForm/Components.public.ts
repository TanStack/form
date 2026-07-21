import type {
  DeepKeys,
  DeepKeysWhereValueIncludes,
  DeepValue,
  FieldApi,
  FieldApiOptions,
  FieldListeners,
  FieldValidators,
  FormErrorTypes,
  FormGroupApi,
  FormGroupOptions,
  FormGroupState,
  FormGroupSubmitContext,
  FormGroupValidateResult,
  FormGroupValidatorMetas,
  FormGroupValidators,
  FormState,
  ToFieldError,
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

export type ReactFieldApi<
  TFieldName,
  TFieldValue,
  TFieldError,
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = FieldApi<TFieldName, TFieldValue, TFieldError, TFormData, TFormErrorTypes> &
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
  TFormErrorTypes extends FormErrorTypes,
  TSelected,
> = ReactSubscribeProps<FormState<TFormData, TFormErrorTypes>, TSelected>

export type ReactFormSubscribeComponent<
  in out TFormData,
  in out TFormErrorTypes extends FormErrorTypes,
> = <TSelected>(
  props: ReactFormSubscribeProps<TFormData, TFormErrorTypes, TSelected>,
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
  in out TFormErrorTypes extends FormErrorTypes,
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
> extends FieldApiOptions<
  TFieldData,
  TFieldName,
  TFieldValue,
  TFieldValidators,
  TGroupValidators,
  TFormData,
  TFormErrorTypes
> {
  children: (
    fieldApi: ReactFieldApi<
      TFieldName,
      TFieldValue,
      ToFieldError<TFieldValidators, TGroupValidators, TFormErrorTypes>,
      TFormData,
      TFormErrorTypes,
      TFieldComponents
    >,
  ) => CrossVersionReactNode
}

export type ReactFormFieldComponent<
  in out TFormData,
  in out TFormErrorTypes extends FormErrorTypes,
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
    props: ReactFormFieldPropsWithValidators<
      TFormData,
      TFieldName,
      DeepValue<TFormData, TFieldName>,
      TFieldValidators,
      [],
      TFormData,
      TFormErrorTypes,
      TFieldComponents
    >,
  ): CrossVersionReactNode
  <TFieldName extends DeepKeys<TFormData>>(
    props: ReactFormFieldPropsWithoutValidators<
      TFormData,
      TFieldName,
      DeepValue<TFormData, TFieldName>,
      [],
      TFormData,
      TFormErrorTypes,
      TFieldComponents
    >,
  ): CrossVersionReactNode
}

type ReactFormFieldPropsForError<
  TFieldData,
  TFieldName,
  TFieldValue,
  TFieldValidators extends FieldValidators<TFieldData, TFieldName, TFieldValue>,
  TFieldError,
  TGroupValidatorMetas extends FormGroupValidatorMetas,
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = Omit<
  ReactFormFieldProps<
    TFieldData,
    TFieldName,
    TFieldValue,
    TFieldValidators,
    TGroupValidatorMetas,
    TFormData,
    TFormErrorTypes,
    TFieldComponents
  >,
  'children' | 'listeners' | 'validators'
> & {
  listeners?: FieldListeners<
    TFieldData,
    TFieldName,
    TFieldValue,
    TFieldError,
    TFormData,
    TFormErrorTypes
  >
  children: (
    fieldApi: ReactFieldApi<
      TFieldName,
      TFieldValue,
      TFieldError,
      TFormData,
      TFormErrorTypes,
      TFieldComponents
    >,
  ) => CrossVersionReactNode
}

type ReactFormFieldPropsWithValidators<
  TFieldData,
  TFieldName,
  TFieldValue,
  TFieldValidators extends FieldValidators<TFieldData, TFieldName, TFieldValue>,
  TGroupValidatorMetas extends FormGroupValidatorMetas,
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = ReactFormFieldPropsForError<
  TFieldData,
  TFieldName,
  TFieldValue,
  TFieldValidators,
  ToFieldError<
    NoInfer<TFieldValidators>,
    TGroupValidatorMetas,
    TFormErrorTypes
  >,
  TGroupValidatorMetas,
  TFormData,
  TFormErrorTypes,
  TFieldComponents
> & {
  validators: TFieldValidators
}

type ReactFormFieldPropsWithoutValidators<
  TFieldData,
  TFieldName,
  TFieldValue,
  TGroupValidatorMetas extends FormGroupValidatorMetas,
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = ReactFormFieldPropsForError<
  TFieldData,
  TFieldName,
  TFieldValue,
  [],
  ToFieldError<[], TGroupValidatorMetas, TFormErrorTypes>,
  TGroupValidatorMetas,
  TFormData,
  TFormErrorTypes,
  TFieldComponents
> & {
  validators?: undefined
}

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
  in out TFormErrorTypes extends FormErrorTypes,
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
> extends FieldApiOptions<
  TFieldData,
  TFieldName,
  TFieldValue,
  TFieldValidators,
  TGroupValidatorMetas,
  TFormData,
  TFormErrorTypes
> {
  children: (
    fieldApi: ReactFieldApi<
      TFieldName,
      TFieldValue,
      ToFieldError<TFieldValidators, TGroupValidatorMetas, TFormErrorTypes>,
      TFormData,
      TFormErrorTypes,
      TFieldComponents
    >,
  ) => CrossVersionReactNode
}

export type ReactFormArrayFieldComponent<
  in out TFormData,
  in out TFormErrorTypes extends FormErrorTypes,
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
    props: ReactFormArrayFieldPropsWithValidators<
      TFormData,
      TFieldName,
      DeepValue<TFormData, TFieldName>,
      TFieldValidators,
      [],
      TFormData,
      TFormErrorTypes,
      TFieldComponents
    >,
  ): CrossVersionReactNode
  <TFieldName extends DeepKeysWhereValueIncludes<TFormData, Array<any>>>(
    props: ReactFormArrayFieldPropsWithoutValidators<
      TFormData,
      TFieldName,
      DeepValue<TFormData, TFieldName>,
      [],
      TFormData,
      TFormErrorTypes,
      TFieldComponents
    >,
  ): CrossVersionReactNode
}

type ReactFormArrayFieldPropsForError<
  TFieldData,
  TFieldName,
  TFieldValue,
  TFieldValidators extends FieldValidators<TFieldData, TFieldName, TFieldValue>,
  TFieldError,
  TGroupValidatorMetas extends FormGroupValidatorMetas,
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = Omit<
  ReactFormArrayFieldProps<
    TFieldData,
    TFieldName,
    TFieldValue,
    TFieldValidators,
    TGroupValidatorMetas,
    TFormData,
    TFormErrorTypes,
    TFieldComponents
  >,
  'children' | 'listeners' | 'validators'
> & {
  listeners?: FieldListeners<
    TFieldData,
    TFieldName,
    TFieldValue,
    TFieldError,
    TFormData,
    TFormErrorTypes
  >
  children: (
    fieldApi: ReactFieldApi<
      TFieldName,
      TFieldValue,
      TFieldError,
      TFormData,
      TFormErrorTypes,
      TFieldComponents
    >,
  ) => CrossVersionReactNode
}

type ReactFormArrayFieldPropsWithValidators<
  TFieldData,
  TFieldName,
  TFieldValue,
  TFieldValidators extends FieldValidators<TFieldData, TFieldName, TFieldValue>,
  TGroupValidatorMetas extends FormGroupValidatorMetas,
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = ReactFormArrayFieldPropsForError<
  TFieldData,
  TFieldName,
  TFieldValue,
  TFieldValidators,
  ToFieldError<
    NoInfer<TFieldValidators>,
    TGroupValidatorMetas,
    TFormErrorTypes
  >,
  TGroupValidatorMetas,
  TFormData,
  TFormErrorTypes,
  TFieldComponents
> & {
  validators: TFieldValidators
}

type ReactFormArrayFieldPropsWithoutValidators<
  TFieldData,
  TFieldName,
  TFieldValue,
  TGroupValidatorMetas extends FormGroupValidatorMetas,
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = ReactFormArrayFieldPropsForError<
  TFieldData,
  TFieldName,
  TFieldValue,
  [],
  ToFieldError<[], TGroupValidatorMetas, TFormErrorTypes>,
  TGroupValidatorMetas,
  TFormData,
  TFormErrorTypes,
  TFieldComponents
> & {
  validators?: undefined
}

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
  in out TFormErrorTypes extends FormErrorTypes,
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
    props: ReactFormFieldPropsWithValidators<
      TGroupValue,
      TFieldName,
      DeepValue<TGroupValue, TFieldName>,
      TFieldValidators,
      TGroupValidators,
      TFormData,
      TFormErrorTypes,
      TFieldComponents
    >,
  ): CrossVersionReactNode
  <TFieldName extends DeepKeys<TGroupValue>>(
    props: ReactFormFieldPropsWithoutValidators<
      TGroupValue,
      TFieldName,
      DeepValue<TGroupValue, TFieldName>,
      TGroupValidators,
      TFormData,
      TFormErrorTypes,
      TFieldComponents
    >,
  ): CrossVersionReactNode
}

export type ReactFormGroupArrayFieldComponent<
  in out TFormData,
  in out TGroupValue,
  in out TGroupValidatorMetas extends FormGroupValidatorMetas,
  in out TFormErrorTypes extends FormErrorTypes,
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
    props: ReactFormArrayFieldPropsWithValidators<
      TGroupValue,
      TFieldName,
      DeepValue<TGroupValue, TFieldName>,
      TFieldValidators,
      TGroupValidatorMetas,
      TFormData,
      TFormErrorTypes,
      TFieldComponents
    >,
  ): CrossVersionReactNode
  <TFieldName extends DeepKeysWhereValueIncludes<TGroupValue, Array<any>>>(
    props: ReactFormArrayFieldPropsWithoutValidators<
      TGroupValue,
      TFieldName,
      DeepValue<TGroupValue, TFieldName>,
      TGroupValidatorMetas,
      TFormData,
      TFormErrorTypes,
      TFieldComponents
    >,
  ): CrossVersionReactNode
}

export interface ReactFormGroupApi<
  in out TFormData,
  in out TGroupName,
  in out TGroupValue,
  in out TGroupValidatorMetas extends FormGroupValidatorMetas,
  in out TFormErrorTypes extends FormErrorTypes,
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
> extends FormGroupApi<
  TFormData,
  TGroupName,
  TGroupValue,
  TGroupValidatorMetas,
  TFormErrorTypes
> {
  Field: ReactFormGroupFieldComponent<
    TFormData,
    TGroupValue,
    TGroupValidatorMetas,
    TFormErrorTypes,
    TFieldComponents
  >
  ArrayField: ReactFormGroupArrayFieldComponent<
    TFormData,
    TGroupValue,
    TGroupValidatorMetas,
    TFormErrorTypes,
    TFieldComponents
  >
  Subscribe: ReactFormGroupSubscribeComponent<TGroupValue, TGroupValidatorMetas>
}

export interface ReactFormGroupProps<
  in out TFormData,
  in out TGroupName,
  in out TGroupValue,
  in out TGroupValidators extends FormGroupValidators<TGroupValue>,
  in out TFormErrorTypes extends FormErrorTypes,
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
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
      ToFormGroupValidatorMetas<TGroupValidators>,
      TFormErrorTypes,
      TFieldComponents
    >,
  ) => CrossVersionReactNode
}

type ReactFormGroupPropsWithValidators<
  TFormData,
  TGroupName,
  TGroupValue,
  TGroupValidators extends FormGroupValidators<TGroupValue>,
  TFormErrorTypes extends FormErrorTypes,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = ReactFormGroupPropsForValidatorMetas<
  TFormData,
  TGroupName,
  TGroupValue,
  TGroupValidators,
  ToFormGroupValidatorMetas<NoInfer<TGroupValidators>>,
  TFormErrorTypes,
  TFieldComponents
> & {
  validators: TGroupValidators
}

type ReactFormGroupPropsWithoutValidators<
  TFormData,
  TGroupName,
  TGroupValue,
  TFormErrorTypes extends FormErrorTypes,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = ReactFormGroupPropsForValidatorMetas<
  TFormData,
  TGroupName,
  TGroupValue,
  [],
  [],
  TFormErrorTypes,
  TFieldComponents
> & {
  validators?: undefined
}

type ReactFormGroupPropsForValidatorMetas<
  TFormData,
  TGroupName,
  TGroupValue,
  TGroupValidators extends FormGroupValidators<TGroupValue>,
  TGroupValidatorMetas extends FormGroupValidatorMetas,
  TFormErrorTypes extends FormErrorTypes,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = Omit<
  ReactFormGroupProps<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidators,
    TFormErrorTypes,
    TFieldComponents
  >,
  'children' | 'onSubmit' | 'onSubmitInvalid' | 'validators'
> & {
  onSubmit?: (
    context: FormGroupSubmitContext<
      TFormData,
      TGroupName,
      TGroupValue,
      TGroupValidatorMetas,
      TFormErrorTypes
    >,
  ) => void | Promise<void>
  onSubmitInvalid?: (
    context: FormGroupSubmitContext<
      TFormData,
      TGroupName,
      TGroupValue,
      TGroupValidatorMetas,
      TFormErrorTypes
    > & {
      errors: Array<FormGroupValidateResult<TGroupValue>>
    },
  ) => void | Promise<void>
  children: (
    groupApi: ReactFormGroupApi<
      TFormData,
      TGroupName,
      TGroupValue,
      TGroupValidatorMetas,
      TFormErrorTypes,
      TFieldComponents
    >,
  ) => CrossVersionReactNode
}

export interface ReactFormGroupComponent<
  in out TFormData,
  in out TFormErrorTypes extends FormErrorTypes,
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
> {
  <
    TGroupName extends DeepKeys<TFormData>,
    const TGroupValidators extends FormGroupValidators<
      DeepValue<TFormData, TGroupName>
    >,
  >(
    props: ReactFormGroupPropsWithValidators<
      TFormData,
      TGroupName,
      DeepValue<TFormData, TGroupName>,
      TGroupValidators,
      TFormErrorTypes,
      TFieldComponents
    >,
  ): CrossVersionReactNode
  <TGroupName extends DeepKeys<TFormData>>(
    props: ReactFormGroupPropsWithoutValidators<
      TFormData,
      TGroupName,
      DeepValue<TFormData, TGroupName>,
      TFormErrorTypes,
      TFieldComponents
    >,
  ): CrossVersionReactNode
}

export interface ReactTanStackFormComponents<
  in out TFormData,
  in out TFormErrorTypes extends FormErrorTypes,
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
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

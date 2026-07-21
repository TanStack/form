import type {
  DeepKeys,
  DeepKeysWhereValueIncludes,
  DeepValue,
  FieldValidators,
  FormApiArrayMethods,
  FormApiFieldMethods,
  FormErrorTypes,
  FormGroupValidatorMetas,
  FormState,
} from '@tanstack/form-core'
import type { FunctionComponent } from 'react'
import type { CrossVersionReactNode } from '../reactTypes.public'
import type {
  ReactFormArrayFieldProps,
  ReactFormFieldProps,
  ReactFormSubscribeProps,
} from '../ReactForm/Components.public'
import type { ReadonlyAtom } from '@tanstack/react-store'

type FieldGroupFieldPropsWithValidators<
  TFieldData,
  TFieldName extends string,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = Omit<
  ReactFormFieldProps<
    TFieldData,
    TFieldName,
    DeepValue<TFieldData, TFieldName>,
    FieldValidators<TFieldData, TFieldName, DeepValue<TFieldData, TFieldName>>,
    FormGroupValidatorMetas,
    unknown,
    FormErrorTypes,
    TFieldComponents
  >,
  'validators'
> & {
  validators: FieldValidators<
    TFieldData,
    TFieldName,
    DeepValue<TFieldData, TFieldName>
  >
}

type FieldGroupFieldPropsWithoutValidators<
  TFieldData,
  TFieldName extends string,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = Omit<
  ReactFormFieldProps<
    TFieldData,
    TFieldName,
    DeepValue<TFieldData, TFieldName>,
    [],
    FormGroupValidatorMetas,
    unknown,
    FormErrorTypes,
    TFieldComponents
  >,
  'validators'
> & {
  validators?: undefined
}

type FieldGroupArrayFieldPropsWithValidators<
  TFieldData,
  TFieldName extends string,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = Omit<
  ReactFormArrayFieldProps<
    TFieldData,
    TFieldName,
    DeepValue<TFieldData, TFieldName>,
    FieldValidators<TFieldData, TFieldName, DeepValue<TFieldData, TFieldName>>,
    FormGroupValidatorMetas,
    unknown,
    FormErrorTypes,
    TFieldComponents
  >,
  'validators'
> & {
  validators: FieldValidators<
    TFieldData,
    TFieldName,
    DeepValue<TFieldData, TFieldName>
  >
}

type FieldGroupArrayFieldPropsWithoutValidators<
  TFieldData,
  TFieldName extends string,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = Omit<
  ReactFormArrayFieldProps<
    TFieldData,
    TFieldName,
    DeepValue<TFieldData, TFieldName>,
    [],
    FormGroupValidatorMetas,
    unknown,
    FormErrorTypes,
    TFieldComponents
  >,
  'validators'
> & {
  validators?: undefined
}

export interface FieldGroupFieldComponent<
  in out TFieldData,
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
> {
  <const TFieldName extends DeepKeys<TFieldData>>(
    props: FieldGroupFieldPropsWithValidators<
      TFieldData,
      TFieldName,
      TFieldComponents
    >,
  ): CrossVersionReactNode
  <const TFieldName extends DeepKeys<TFieldData>>(
    props: FieldGroupFieldPropsWithoutValidators<
      TFieldData,
      TFieldName,
      TFieldComponents
    >,
  ): CrossVersionReactNode
}

export interface FieldGroupArrayFieldComponent<
  in out TFieldData,
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
> {
  <const TFieldName extends DeepKeysWhereValueIncludes<TFieldData, Array<any>>>(
    props: FieldGroupArrayFieldPropsWithValidators<
      TFieldData,
      TFieldName,
      TFieldComponents
    >,
  ): CrossVersionReactNode
  <const TFieldName extends DeepKeysWhereValueIncludes<TFieldData, Array<any>>>(
    props: FieldGroupArrayFieldPropsWithoutValidators<
      TFieldData,
      TFieldName,
      TFieldComponents
    >,
  ): CrossVersionReactNode
}

export type FieldGroupSubscribeProps<TSelected> = ReactFormSubscribeProps<
  unknown,
  FormErrorTypes,
  TSelected
>

export type FieldGroupSubscribeComponent = <TSelected>(
  props: FieldGroupSubscribeProps<TSelected>,
) => CrossVersionReactNode

export interface FieldGroupApi<
  in out TFieldData,
  in out TFieldComponents extends Record<string, FunctionComponent<any>> =
    Record<never, never>,
>
  extends FormApiFieldMethods<TFieldData>, FormApiArrayMethods<TFieldData> {
  atom: ReadonlyAtom<TFieldData>
  Field: FieldGroupFieldComponent<TFieldData, TFieldComponents>
  ArrayField: FieldGroupArrayFieldComponent<TFieldData, TFieldComponents>
  Subscribe: FieldGroupSubscribeComponent
}

export type AnyFieldGroupApi = FieldGroupApi<
  any,
  Record<string, FunctionComponent<any>>
>

export type FieldGroupFormState = FormState<unknown, FormErrorTypes>

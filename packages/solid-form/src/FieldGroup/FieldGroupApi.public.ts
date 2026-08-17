import type {
  DeepKeys,
  DeepKeysWhereValueIncludes,
  DeepValue,
  FieldValidators,
  FormApiArrayMethods,
  FormApiFieldMethods,
  FormErrorTypes,
  FormState,
  ValidationIssue,
} from '@tanstack/form-core'
import type { Component, JSX } from 'solid-js'
import type {
  SolidFormFieldProps,
  SolidFormSubscribeProps,
} from '../Components.public'
import type { ReadonlyAtom } from '@tanstack/solid-store'

export interface FieldGroupFieldComponent<
  TFieldData,
  TFieldComponents extends Record<string, Component<any>>,
> {
  <const TFieldName extends DeepKeys<TFieldData>>(
    props: SolidFormFieldProps<
      TFieldData,
      TFieldName,
      DeepValue<TFieldData, TFieldName>,
      FieldValidators<
        TFieldData,
        TFieldName,
        DeepValue<TFieldData, TFieldName>
      >,
      ValidationIssue,
      unknown,
      FormErrorTypes,
      TFieldComponents
    >,
  ): JSX.Element
}

export interface FieldGroupArrayFieldComponent<
  TFieldData,
  TFieldComponents extends Record<string, Component<any>>,
> {
  <const TFieldName extends DeepKeysWhereValueIncludes<TFieldData, Array<any>>>(
    props: SolidFormFieldProps<
      TFieldData,
      TFieldName,
      DeepValue<TFieldData, TFieldName>,
      FieldValidators<
        TFieldData,
        TFieldName,
        DeepValue<TFieldData, TFieldName>
      >,
      ValidationIssue,
      unknown,
      FormErrorTypes,
      TFieldComponents
    >,
  ): JSX.Element
}

export type FieldGroupSubscribeProps<TSelected> = SolidFormSubscribeProps<
  unknown,
  FormErrorTypes,
  TSelected
>

export type FieldGroupSubscribeComponent = <const TSelected>(
  props: FieldGroupSubscribeProps<TSelected>,
) => JSX.Element

export interface FieldGroupApi<
  TFieldData,
  TFieldComponents extends Record<string, Component<any>> = Record<
    never,
    never
  >,
>
  extends FormApiFieldMethods<TFieldData>, FormApiArrayMethods<TFieldData> {
  atom: ReadonlyAtom<TFieldData>
  Field: FieldGroupFieldComponent<TFieldData, TFieldComponents>
  ArrayField: FieldGroupArrayFieldComponent<TFieldData, TFieldComponents>
  Subscribe: FieldGroupSubscribeComponent
}

export type AnyFieldGroupApi = FieldGroupApi<
  any,
  Record<string, Component<any>>
>
export type FieldGroupFormState = FormState<unknown, FormErrorTypes>

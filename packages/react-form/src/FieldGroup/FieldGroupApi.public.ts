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
import type { FunctionComponent, ReactNode } from 'react'
import type {
  ReactFormFieldProps,
  ReactFormSubscribeProps,
} from '../ReactForm/Components.public'
import type { ReadonlyAtom } from '@tanstack/react-store'

export interface FieldGroupFieldComponent<
  in out TFieldData,
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
> {
  <const TFieldName extends DeepKeys<TFieldData>>(
    props: ReactFormFieldProps<
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
  ): ReactNode
}

export interface FieldGroupArrayFieldComponent<
  in out TFieldData,
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
> {
  <const TFieldName extends DeepKeysWhereValueIncludes<TFieldData, Array<any>>>(
    props: ReactFormFieldProps<
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
  ): ReactNode
}

export type FieldGroupSubscribeProps<TSelected> = ReactFormSubscribeProps<
  unknown,
  FormErrorTypes,
  TSelected
>

export type FieldGroupSubscribeComponent = <TSelected>(
  props: FieldGroupSubscribeProps<TSelected>,
) => ReactNode

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

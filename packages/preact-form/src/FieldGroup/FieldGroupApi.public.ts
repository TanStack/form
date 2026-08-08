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
import type { FunctionComponent } from 'preact/compat'
import type { CrossVersionPreactNode } from '../preactTypes.public'
import type {
  PreactFormFieldProps,
  PreactFormSubscribeProps,
} from '../PreactForm/Components.public'
import type { ReadonlyAtom } from '@tanstack/preact-store'

export interface FieldGroupFieldComponent<
  in out TFieldData,
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
> {
  <const TFieldName extends DeepKeys<TFieldData>>(
    props: PreactFormFieldProps<
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
  ): CrossVersionPreactNode
}

export interface FieldGroupArrayFieldComponent<
  in out TFieldData,
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
> {
  <const TFieldName extends DeepKeysWhereValueIncludes<TFieldData, Array<any>>>(
    props: PreactFormFieldProps<
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
  ): CrossVersionPreactNode
}

export type FieldGroupSubscribeProps<TSelected> = PreactFormSubscribeProps<
  unknown,
  FormErrorTypes,
  TSelected
>

export type FieldGroupSubscribeComponent = <TSelected>(
  props: FieldGroupSubscribeProps<TSelected>,
) => CrossVersionPreactNode

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

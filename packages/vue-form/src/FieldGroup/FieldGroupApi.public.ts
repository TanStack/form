import type {
  DeepKeys,
  DeepKeysWhereValueIncludes,
  DeepValue,
  FieldValidators,
  FormApiArrayMethods,
  FormApiFieldMethods,
  FormErrorTypes,
  FormState,
  ToFieldError,
  ValidationIssue,
} from '@tanstack/form-core'
import type { Component, PublicProps } from 'vue'
import type { ReadonlyAtom } from '@tanstack/vue-store'
import type {
  VueFieldApi,
  VueFormFieldProps,
  VueFormSubscribeProps,
} from '../VueForm/Components.public'
import type { VueComponentInstance } from '../vueTypes.lib'

export type FieldGroupFieldComponent<
  in out TFieldData,
  in out TFieldComponents extends Record<string, Component>,
> = new <const TFieldName extends DeepKeys<TFieldData>>(
  props: VueFormFieldProps<
    TFieldData,
    TFieldName,
    DeepValue<TFieldData, TFieldName>,
    FieldValidators<TFieldData, TFieldName, DeepValue<TFieldData, TFieldName>>,
    ValidationIssue,
    unknown,
    FormErrorTypes,
    TFieldComponents
  > &
    PublicProps,
) => VueComponentInstance<
  VueFormFieldProps<
    TFieldData,
    TFieldName,
    DeepValue<TFieldData, TFieldName>,
    FieldValidators<TFieldData, TFieldName, DeepValue<TFieldData, TFieldName>>,
    ValidationIssue,
    unknown,
    FormErrorTypes,
    TFieldComponents
  >,
  {
    default: {
      field: VueFieldApi<
        TFieldName,
        DeepValue<TFieldData, TFieldName>,
        ToFieldError<
          FieldValidators<
            TFieldData,
            TFieldName,
            DeepValue<TFieldData, TFieldName>
          >,
          ValidationIssue,
          FormErrorTypes
        >,
        unknown,
        FormErrorTypes,
        TFieldComponents
      >
    }
  }
>

export type FieldGroupArrayFieldComponent<
  in out TFieldData,
  in out TFieldComponents extends Record<string, Component>,
> = new <
  const TFieldName extends DeepKeysWhereValueIncludes<TFieldData, Array<any>>,
>(
  props: VueFormFieldProps<
    TFieldData,
    TFieldName,
    DeepValue<TFieldData, TFieldName>,
    FieldValidators<TFieldData, TFieldName, DeepValue<TFieldData, TFieldName>>,
    ValidationIssue,
    unknown,
    FormErrorTypes,
    TFieldComponents
  > &
    PublicProps,
) => VueComponentInstance<
  VueFormFieldProps<
    TFieldData,
    TFieldName,
    DeepValue<TFieldData, TFieldName>,
    FieldValidators<TFieldData, TFieldName, DeepValue<TFieldData, TFieldName>>,
    ValidationIssue,
    unknown,
    FormErrorTypes,
    TFieldComponents
  >,
  {
    default: {
      field: VueFieldApi<
        TFieldName,
        DeepValue<TFieldData, TFieldName>,
        ToFieldError<
          FieldValidators<
            TFieldData,
            TFieldName,
            DeepValue<TFieldData, TFieldName>
          >,
          ValidationIssue,
          FormErrorTypes
        >,
        unknown,
        FormErrorTypes,
        TFieldComponents
      >
    }
  }
>

export type FieldGroupSubscribeProps<TSelected> = VueFormSubscribeProps<
  unknown,
  FormErrorTypes,
  TSelected
>

export type FieldGroupSubscribeComponent = new <TSelected>(
  props: FieldGroupSubscribeProps<TSelected> & PublicProps,
) => VueComponentInstance<
  FieldGroupSubscribeProps<TSelected>,
  { default: NoInfer<TSelected> }
>

export interface FieldGroupApi<
  in out TFieldData,
  in out TFieldComponents extends Record<string, Component> = Record<
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

export type AnyFieldGroupApi = FieldGroupApi<any, Record<string, Component>>
export type FieldGroupFormState = FormState<unknown, FormErrorTypes>

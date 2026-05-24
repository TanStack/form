import React, { useMemo } from 'react'
import { concatenateFieldNames } from '@tanstack/form-core-v2/internals'
import { useFormGroup } from './useFormGroup.lib'
import type { InternalFormApi } from '@tanstack/form-core-v2/internals'
import type {
  DeepKeys,
  DeepKeysWhereValueIncludes,
  DeepValue,
  FieldValidators,
  FormApi,
  FormGroupApi,
  FormGroupValidators,
  FormValidators,
} from '@tanstack/form-core-v2'
import type { CrossVersionReactNode } from '../reactTypes.public'
import type {
  ReactFormArrayFieldProps,
  ReactFormFieldProps,
  ReactFormGroupProps,
  ReactTanStackFormComponents,
} from '../ReactForm/Components.public'
import type { FunctionComponent } from 'react'

type PrefixedGroupFieldName<
  TGroupName extends string,
  TFieldName extends string,
> = TFieldName extends `[${string}`
  ? `${TGroupName}${TFieldName}`
  : `${TGroupName}.${TFieldName}`

type GroupFieldName<
  TFormData,
  TGroupName extends string,
  TFieldName extends string,
> = PrefixedGroupFieldName<TGroupName, TFieldName> & DeepKeys<TFormData>

export type ReactFormGroupFieldComponent<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = <
  TFieldName extends DeepKeys<TGroupValue>,
  TFieldValue extends DeepValue<
    TFormData,
    GroupFieldName<TFormData, TGroupName, TFieldName>
  >,
  TFieldValidators extends FieldValidators<
    TFormData,
    GroupFieldName<TFormData, TGroupName, TFieldName>,
    TFieldValue
  >,
>(
  props: Omit<
    ReactFormFieldProps<
      TFormData,
      TFormValidators,
      TSubmitReturn,
      GroupFieldName<TFormData, TGroupName, TFieldName>,
      TFieldValue,
      TFieldValidators,
      TFieldComponents
    >,
    'name'
  > & { name: TFieldName },
) => CrossVersionReactNode

export type ReactFormGroupArrayFieldComponent<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = <
  TFieldName extends DeepKeysWhereValueIncludes<TGroupValue, Array<any>>,
  TFieldValue extends DeepValue<
    TFormData,
    GroupFieldName<TFormData, TGroupName, TFieldName>
  >,
  TFieldValidators extends FieldValidators<
    TFormData,
    GroupFieldName<TFormData, TGroupName, TFieldName>,
    TFieldValue
  >,
>(
  props: Omit<
    ReactFormArrayFieldProps<
      TFormData,
      TFormValidators,
      TSubmitReturn,
      GroupFieldName<TFormData, TGroupName, TFieldName>,
      TFieldValue,
      TFieldValidators,
      TFieldComponents
    >,
    'name'
  > & { name: TFieldName },
) => CrossVersionReactNode

export type ReactFormGroupApi<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  TGroupValidators extends FormGroupValidators<
    TFormData,
    TGroupName,
    TGroupValue
  >,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = FormGroupApi<
  TFormData,
  TFormValidators,
  TSubmitReturn,
  TGroupName,
  TGroupValue,
  TGroupValidators
> & {
  Field: ReactFormGroupFieldComponent<
    TFormData,
    TFormValidators,
    TSubmitReturn,
    TGroupName,
    TGroupValue,
    TFieldComponents
  >
  ArrayField: ReactFormGroupArrayFieldComponent<
    TFormData,
    TFormValidators,
    TSubmitReturn,
    TGroupName,
    TGroupValue,
    TFieldComponents
  >
}

export type FormGroupProps<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  TGroupValidators extends FormGroupValidators<
    TFormData,
    TGroupName,
    TGroupValue
  >,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = Omit<
  ReactFormGroupProps<
    TFormData,
    TFormValidators,
    TSubmitReturn,
    TGroupName,
    TGroupValue,
    TGroupValidators
  >,
  'children'
> & {
  form: FormApi<TFormData, TFormValidators, TSubmitReturn> &
    ReactTanStackFormComponents<
      TFormData,
      TFormValidators,
      TSubmitReturn,
      TFieldComponents
    >
  children: (
    groupApi: ReactFormGroupApi<
      TFormData,
      TFormValidators,
      TSubmitReturn,
      TGroupName,
      TGroupValue,
      TGroupValidators,
      TFieldComponents
    >,
  ) => CrossVersionReactNode
}

export function FormGroup<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  TGroupValidators extends FormGroupValidators<
    TFormData,
    TGroupName,
    TGroupValue
  >,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
>(
  props: FormGroupProps<
    TFormData,
    TFormValidators,
    TSubmitReturn,
    TGroupName,
    TGroupValue,
    TGroupValidators,
    TFieldComponents
  >,
): CrossVersionReactNode {
  const groupApi = useFormGroup({
    form: props.form as unknown as InternalFormApi<any, any, any>,
    name: props.name,
    validators: props.validators,
    onGroupSubmit: props.onGroupSubmit,
    onGroupSubmitInvalid: props.onGroupSubmitInvalid,
  })
  const components = useMemo(
    () => createScopedFieldComponents(props.form, props.name),
    [props.form, props.name],
  )
  const reactGroupApi = useMemo(
    () => Object.assign(groupApi, components),
    [groupApi, components],
  )

  return props.children(reactGroupApi as never)
}

type RuntimeFieldProps = { name: string } & Record<string, any>

function createScopedFieldComponents(
  form: {
    Field: FunctionComponent<any>
    ArrayField: FunctionComponent<any>
  },
  groupName: string,
) {
  const Field = (props: RuntimeFieldProps) => (
    <form.Field
      {...props}
      name={concatenateFieldNames(groupName, props.name)}
    />
  )
  const ArrayField = (props: RuntimeFieldProps) => (
    <form.ArrayField
      {...props}
      name={concatenateFieldNames(groupName, props.name)}
    />
  )

  Field.displayName = 'TanStackForm.FormGroup.Field'
  ArrayField.displayName = 'TanStackForm.FormGroup.ArrayField'

  return { Field, ArrayField }
}

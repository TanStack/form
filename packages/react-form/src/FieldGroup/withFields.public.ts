import {
  defineFieldsRuntime,
  helperRuntime,
  withFieldsRuntime,
} from './withFields.lib'
import type {
  DeepKeys,
  DeepKeysWhereValueIncludes,
  DeepValue,
  FormApi,
} from '@tanstack/form-core-v2'
import type { FunctionComponent } from 'react'
import type { CrossVersionReactNode } from '../reactTypes.public'
import type { ReactTanStackFormComponents } from '../ReactForm/Components.public'
import type { FieldGroupApi } from './FieldGroupApi.public'

declare const fieldGroupFieldSlotValueSymbol: unique symbol
declare const fieldGroupFieldsSymbol: unique symbol

export type FieldGroupFieldSlotMode = 'strict' | 'loose'

export interface FieldGroupFieldSlot<
  out TValue,
  out TMode extends FieldGroupFieldSlotMode = FieldGroupFieldSlotMode,
> {
  readonly mode: TMode
  readonly [fieldGroupFieldSlotValueSymbol]: TValue
}

export type AnyFieldGroupFieldSlot = FieldGroupFieldSlot<any>

export type StrictFieldGroupFieldSlot<TValue> = FieldGroupFieldSlot<
  TValue,
  'strict'
>

export type LooseFieldGroupFieldSlot<TValue> = FieldGroupFieldSlot<
  TValue,
  'loose'
>

export type FieldGroupFieldSlotValue<TSlot> =
  TSlot extends FieldGroupFieldSlot<infer TValue> ? TValue : never

export type FieldGroupFieldSlotModeOf<TSlot> =
  TSlot extends FieldGroupFieldSlot<any, infer TMode> ? TMode : never

type IsSame<TTypeA, TTypeB> = [TTypeA] extends [TTypeB]
  ? [TTypeB] extends [TTypeA]
    ? true
    : false
  : false

export type FieldGroupFieldSlotAllows<TSlot, TValue> =
  TSlot extends FieldGroupFieldSlot<infer TAcceptedValue, infer TMode>
    ? TMode extends 'strict'
      ? IsSame<TValue, TAcceptedValue>
      : [TValue] extends [TAcceptedValue]
        ? true
        : false
    : false

export type FieldGroupFieldNameForSlot<
  TFieldData,
  TSlot extends AnyFieldGroupFieldSlot,
> = {
  [TFieldName in DeepKeys<TFieldData>]: FieldGroupFieldSlotAllows<
    TSlot,
    DeepValue<TFieldData, TFieldName>
  > extends true
    ? TFieldName
    : never
}[DeepKeys<TFieldData>]

export type FieldGroupFields = Record<string, AnyFieldGroupFieldSlot>

export type FieldGroupFieldNames<
  TFieldData,
  TFields extends FieldGroupFields,
> = {
  [TFieldName in keyof TFields]: FieldGroupFieldNameForSlot<
    TFieldData,
    TFields[TFieldName]
  >
}

export type FieldGroupFieldData<TFields extends FieldGroupFields> = {
  [TFieldName in keyof TFields]: TFields[TFieldName] extends FieldGroupFieldSlot<
    infer TValue,
    any
  >
    ? TValue
    : never
}

export type FieldGroupFieldsOf<TFieldGroup> = TFieldGroup extends {
  readonly [fieldGroupFieldsSymbol]: infer TFields
}
  ? TFields
  : never

export type FieldGroupDefinition<
  TFields extends FieldGroupFields,
  TFieldComponents extends Record<string, FunctionComponent<any>> = Record<
    never,
    never
  >,
> = FieldGroupApi<FieldGroupFieldData<TFields>, TFieldComponents> & {
  readonly [fieldGroupFieldsSymbol]: TFields
}

export type FieldGroupFieldComponentsOf<TFieldGroup> =
  TFieldGroup extends FieldGroupDefinition<any, infer TFieldComponents>
    ? TFieldComponents
    : never

export type FieldGroupForm<
  TFieldComponents extends Record<string, FunctionComponent<any>> = Record<
    never,
    never
  >,
  TFormData = any,
> = FormApi<TFormData, any, any> &
  ReactTanStackFormComponents<TFormData, any, any, TFieldComponents>

export type FieldGroupFieldBindingForSlot<
  TFormData,
  TSlot extends AnyFieldGroupFieldSlot,
> =
  TSlot extends FieldGroupFieldSlot<infer TValue, infer TMode>
    ? TMode extends 'strict'
      ? FieldGroupFieldNameForSlot<TFormData, TSlot>
      : DeepKeysWhereValueIncludes<TFormData, TValue>
    : never

export type FieldGroupFieldBindings<
  TFields extends FieldGroupFields,
  TFormData = any,
> = {
  [TFieldName in keyof TFields]: FieldGroupFieldBindingForSlot<
    TFormData,
    TFields[TFieldName]
  >
}

export type FieldGroupFieldBindingsOf<TFieldGroup, TFormData> =
  FieldGroupFieldsOf<TFieldGroup> extends FieldGroupFields
    ? FieldGroupFieldBindings<FieldGroupFieldsOf<TFieldGroup>, TFormData>
    : never

export type FieldGroupFieldsPropName<
  TProps,
  TFieldGroup extends FieldGroupDefinition<any, any>,
> = {
  [TPropName in keyof TProps]-?: IsSame<
    TProps[TPropName],
    TFieldGroup
  > extends true
    ? TPropName
    : never
}[keyof TProps]

export type FieldGroupWithFieldsFn = <
  TFieldGroup extends FieldGroupDefinition<any, any>,
  TProps extends object,
  TFieldsPropName extends FieldGroupFieldsPropName<TProps, TFieldGroup>,
>(
  fields: TFieldGroup,
  Component: (props: TProps) => CrossVersionReactNode,
  fieldsPropName: TFieldsPropName,
) => <TFormData>(
  props: Omit<TProps, TFieldsPropName | 'form'> & {
    form: FieldGroupForm<FieldGroupFieldComponentsOf<TFieldGroup>, TFormData>
  } & {
    [TPropName in TFieldsPropName]: FieldGroupFieldBindingsOf<
      TFieldGroup,
      TFormData
    >
  },
) => CrossVersionReactNode

export interface FieldGroupHelper {
  strict: <TValue>() => StrictFieldGroupFieldSlot<TValue>
  loose: <TValue>() => LooseFieldGroupFieldSlot<TValue>
}

const helper: FieldGroupHelper = helperRuntime as never

export type DefineFieldsFn<
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = <const TFields extends FieldGroupFields>(
  fields: TFields,
) => FieldGroupDefinition<TFields, TFieldComponents>

const defineFields: DefineFieldsFn<Record<never, never>> =
  defineFieldsRuntime as never

const withFields: FieldGroupWithFieldsFn = withFieldsRuntime as never

export interface FieldGroupHelpers<
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> {
  helper: FieldGroupHelper
  defineFields: DefineFieldsFn<TFieldComponents>
  withFields: FieldGroupWithFieldsFn
}

function createFieldGroupHelpers<
  TFieldComponents extends Record<string, FunctionComponent<any>>,
>(): FieldGroupHelpers<TFieldComponents> {
  return {
    helper,
    defineFields: defineFields as never,
    withFields,
  }
}

export function getFieldGroupHelpers(): FieldGroupHelpers<
  Record<never, never>
> {
  return createFieldGroupHelpers()
}

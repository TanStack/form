import { defineFieldGroupRuntime } from './withFields.lib'
import type {
  DeepKeys,
  DeepKeysWhereValueIncludes,
  DeepValue,
  FormApi,
} from '@tanstack/form-core'
import type { Component, JSX } from 'solid-js'
import type { SolidTanStackFormComponents } from '../Components.public'
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
  [
    TFieldName in keyof TFields
  ]: TFields[TFieldName] extends FieldGroupFieldSlot<infer TValue, any>
    ? TValue
    : never
}
export type FieldGroupFieldsOf<TFieldGroup> = TFieldGroup extends {
  readonly [fieldGroupFieldsSymbol]: infer TFields
}
  ? TFields
  : never

export type SolidFieldGroup<
  TFields extends FieldGroupFields,
  TFieldComponents extends Record<string, Component<any>> = Record<
    never,
    never
  >,
> = FieldGroupApi<FieldGroupFieldData<TFields>, TFieldComponents> & {
  readonly [fieldGroupFieldsSymbol]: TFields
}
export type FieldGroupFieldComponentsOf<TFieldGroup> =
  TFieldGroup extends SolidFieldGroup<any, infer TFieldComponents>
    ? TFieldComponents
    : never
export type FieldGroupForm<
  TFieldComponents extends Record<string, Component<any>> = Record<
    never,
    never
  >,
  TFormData = any,
> = FormApi<TFormData, any> &
  SolidTanStackFormComponents<TFormData, any, TFieldComponents>

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
  TFieldGroup extends SolidFieldGroup<any, any>,
> = {
  [TPropName in keyof TProps]-?: IsSame<
    TProps[TPropName],
    TFieldGroup
  > extends true
    ? TPropName
    : never
}[keyof TProps]

export type FieldGroupWithFieldsFn<
  TFieldGroup extends SolidFieldGroup<any, any>,
> = <
  TProps extends object,
  TFieldsPropName extends FieldGroupFieldsPropName<TProps, TFieldGroup>,
>(
  Component: (props: TProps) => JSX.Element,
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
) => JSX.Element

export interface FieldGroupHelper {
  strict: <TValue>() => StrictFieldGroupFieldSlot<TValue>
  loose: <TValue>() => LooseFieldGroupFieldSlot<TValue>
}

export interface FieldGroupDefinition<
  TFields extends FieldGroupFields,
  TFieldComponents extends Record<string, Component<any>>,
> {
  /** The virtual field-group API injected into the bound component. */
  fields: SolidFieldGroup<TFields, TFieldComponents>
  /** Binds a component's virtual field API to concrete paths in a form. */
  bindComponent: FieldGroupWithFieldsFn<
    SolidFieldGroup<TFields, TFieldComponents>
  >
}

/** Signature shared by `defineFieldGroup` and app-form field-group definers. */
export type DefineFieldGroupFn<
  TFieldComponents extends Record<string, Component<any>>,
> = <const TFields extends FieldGroupFields>(
  defineFn: (helper: FieldGroupHelper) => TFields,
) => FieldGroupDefinition<TFields, TFieldComponents>

/** Defines a reusable group of virtual fields. */
export const defineFieldGroup: DefineFieldGroupFn<Record<never, never>> =
  defineFieldGroupRuntime as never

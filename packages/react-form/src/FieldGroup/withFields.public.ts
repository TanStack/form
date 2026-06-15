import React from 'react'
import type {
  DeepKeys,
  DeepKeysWhereValueIncludes,
  DeepValue,
  FormApi,
  FormValidatorMetas,
} from '@tanstack/form-core-v2'
import type { FunctionComponent } from 'react'
import type { CrossVersionReactNode } from '../reactTypes.public'
import type { ReactTanStackFormComponents } from '../ReactForm/Components.public'
import type { AnyFieldGroupApi, FieldGroupApi } from './FieldGroupApi.public'

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
  TFormValidatorMetas extends FormValidatorMetas = FormValidatorMetas,
  TSubmitReturn = any,
> = FormApi<TFormData, TFormValidatorMetas, TSubmitReturn> &
  ReactTanStackFormComponents<
    TFormData,
    TFormValidatorMetas,
    TSubmitReturn,
    TFieldComponents
  >

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
) => <TFormData, TFormValidatorMetas extends FormValidatorMetas, TSubmitReturn>(
  props: Omit<TProps, TFieldsPropName | 'form'> & {
    form: FieldGroupForm<
      FieldGroupFieldComponentsOf<TFieldGroup>,
      TFormData,
      TFormValidatorMetas,
      TSubmitReturn
    >
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

const helper: FieldGroupHelper = {
  strict: () => ({ mode: 'strict' }) as never,
  loose: () => ({ mode: 'loose' }) as never,
}

type FieldBindings = Record<string, string>

interface ResolvedNameCacheEntry {
  binding: string
  name: string
}

type ResolvedNameCache = Map<string, ResolvedNameCacheEntry>

function getRootSegmentEnd(name: string): number {
  const dotIndex = name.indexOf('.')
  const arrayIndex = name.indexOf('[')

  if (dotIndex === -1) return arrayIndex === -1 ? name.length : arrayIndex
  if (arrayIndex === -1) return dotIndex
  return Math.min(dotIndex, arrayIndex)
}

function resolveFieldName(
  bindings: FieldBindings,
  cache: ResolvedNameCache,
  fieldName: string,
): string {
  const rootEnd = getRootSegmentEnd(fieldName)
  const rootName = fieldName.slice(0, rootEnd)
  const binding = bindings[rootName]

  if (binding === undefined) {
    throw new Error(
      `TanStack Form: Missing field group binding for "${rootName}".`,
    )
  }

  const cached = cache.get(fieldName)
  if (cached?.binding === binding) return cached.name

  const resolvedName = `${binding}${fieldName.slice(rootEnd)}`
  cache.set(fieldName, {
    binding,
    name: resolvedName,
  })

  return resolvedName
}

function resolveWatchedFields<TItem extends { watchFields?: Array<string> }>(
  items: ReadonlyArray<TItem> | undefined,
  resolveName: (name: string) => string,
): Array<TItem> | undefined {
  if (!items) return undefined

  return items.map((item) => {
    if (!item.watchFields) return item

    return {
      ...item,
      watchFields: item.watchFields.map(resolveName),
    }
  })
}

function resolveFieldProps<TProps extends { name: string }>(
  props: TProps,
  resolveName: (name: string) => string,
): TProps {
  return {
    ...props,
    name: resolveName(props.name),
    validators: resolveWatchedFields(
      (props as { validators?: Array<{ watchFields?: Array<string> }> })
        .validators,
      resolveName,
    ),
    listeners: resolveWatchedFields(
      (props as { listeners?: Array<{ watchFields?: Array<string> }> })
        .listeners,
      resolveName,
    ),
  }
}

function createFieldGroupApi(
  form: any,
  bindingsRef: React.RefObject<FieldBindings>,
): AnyFieldGroupApi {
  const cache: ResolvedNameCache = new Map()
  const resolveName = (fieldName: string) =>
    resolveFieldName(bindingsRef.current, cache, fieldName)

  const Field: FunctionComponent<any> = (props) => {
    const FormField = form.Field
    return React.createElement(
      FormField as FunctionComponent<any>,
      resolveFieldProps(props, resolveName),
    )
  }
  Field.displayName = 'TanStackForm.FieldGroup.Field'

  const ArrayField: FunctionComponent<any> = (props) => {
    const FormArrayField = form.ArrayField
    return React.createElement(
      FormArrayField as FunctionComponent<any>,
      resolveFieldProps(props, resolveName),
    )
  }
  ArrayField.displayName = 'TanStackForm.FieldGroup.ArrayField'

  const Subscribe: FunctionComponent<any> = (props) => {
    const FormSubscribe = form.Subscribe
    return React.createElement(FormSubscribe as FunctionComponent<any>, props)
  }
  Subscribe.displayName = 'TanStackForm.FieldGroup.Subscribe'

  return {
    Field,
    ArrayField,
    Subscribe,
    getFieldValue: (fieldName: string) =>
      form.getFieldValue(resolveName(fieldName)),
    setFieldValue: (fieldName: string, value: unknown, options?: unknown) =>
      form.setFieldValue(resolveName(fieldName), value, options),
    resetField: (fieldName: string) => form.resetField(resolveName(fieldName)),
    swapFieldValues: (
      fieldName: string,
      indexA: number,
      indexB: number,
      options?: unknown,
    ) => form.swapFieldValues(resolveName(fieldName), indexA, indexB, options),
    pushFieldValue: (fieldName: string, value: unknown, options?: unknown) =>
      form.pushFieldValue(resolveName(fieldName), value, options),
    insertFieldValue: (
      fieldName: string,
      index: number,
      value: unknown,
      options?: unknown,
    ) => form.insertFieldValue(resolveName(fieldName), index, value, options),
    clearFieldValues: (fieldName: string, options?: unknown) =>
      form.clearFieldValues(resolveName(fieldName), options),
    removeFieldValue: (fieldName: string, index: number, options?: unknown) =>
      form.removeFieldValue(resolveName(fieldName), index, options),
    filterFieldValues: (
      fieldName: string,
      predicate: (...args: Array<any>) => boolean,
      options?: unknown,
    ) => form.filterFieldValues(resolveName(fieldName), predicate, options),
  } as never
}

export type DefineFieldsFn<
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = <const TFields extends FieldGroupFields>(
  fields: TFields,
) => FieldGroupDefinition<TFields, TFieldComponents>

const defineFields = (<const TFields extends FieldGroupFields>(
  fields: TFields,
) => {
  return fields as never
}) as DefineFieldsFn<Record<never, never>>

export { defineFields }

export const withFields: FieldGroupWithFieldsFn = ((
  _fields: AnyFieldGroupApi,
  Component: (props: any) => CrossVersionReactNode,
  fieldsPropName: string,
) => {
  const FieldGroupComponent = (props: any) => {
    const { form, ...restProps } = props
    const bindingsRef = React.useRef<FieldBindings>(props[fieldsPropName])

    if (!form) {
      throw new Error('TanStack Form: Field groups must receive a `form` prop.')
    }

    bindingsRef.current = props[fieldsPropName]

    const fieldGroupApi = React.useMemo(
      () => createFieldGroupApi(form as never, bindingsRef),
      [form],
    )

    return Component({
      ...restProps,
      [fieldsPropName]: fieldGroupApi,
    })
  }

  FieldGroupComponent.displayName = 'TanStackForm.FieldGroup'

  return FieldGroupComponent
}) as never

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

export function getAppFieldGroupHelpers<
  const TFieldComponents extends Record<string, FunctionComponent<any>> =
    Record<string, FunctionComponent<any>>,
>(): FieldGroupHelpers<TFieldComponents> {
  return createFieldGroupHelpers()
}

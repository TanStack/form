import { defineFieldGroupRuntime } from './withFields.lib'
import type {
  DeepKeys,
  DeepKeysWhereValueIncludes,
  DeepValue,
  FormApi,
} from '@tanstack/form-core'
import type {
  Component,
  ComponentConstructorOptions,
  SvelteComponent,
} from 'svelte'
import type {
  SvelteTanStackFormComponents,
  WithoutFunction,
} from '../Components.public'
import type { FieldGroupApi } from './FieldGroupApi.public'

declare const fieldGroupFieldSlotValueSymbol: unique symbol
declare const fieldGroupFieldsSymbol: unique symbol
declare const fieldGroupFieldComponentsSymbol: unique symbol
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
type IsSame<TA, TB> = [TA] extends [TB]
  ? [TB] extends [TA]
    ? true
    : false
  : false
export type FieldGroupFieldSlotAllows<TSlot, TValue> =
  TSlot extends FieldGroupFieldSlot<infer TAccepted, infer TMode>
    ? TMode extends 'strict'
      ? IsSame<TValue, TAccepted>
      : [TValue] extends [TAccepted]
        ? true
        : false
    : false
export type FieldGroupFieldNameForSlot<
  TData,
  TSlot extends AnyFieldGroupFieldSlot,
> = {
  [TName in DeepKeys<TData>]: FieldGroupFieldSlotAllows<
    TSlot,
    DeepValue<TData, TName>
  > extends true
    ? TName
    : never
}[DeepKeys<TData>]
export type FieldGroupFields = Record<string, AnyFieldGroupFieldSlot>
export type FieldGroupFieldNames<TData, TFields extends FieldGroupFields> = {
  [TName in keyof TFields]: FieldGroupFieldNameForSlot<TData, TFields[TName]>
}
export type FieldGroupFieldData<TFields extends FieldGroupFields> = {
  [TName in keyof TFields]: TFields[TName] extends FieldGroupFieldSlot<
    infer TValue,
    any
  >
    ? TValue
    : never
}
export type FieldGroupFieldsOf<TGroup> = TGroup extends {
  readonly [fieldGroupFieldsSymbol]: infer TFields
}
  ? TFields
  : never
export type SvelteFieldGroup<
  TFields extends FieldGroupFields,
  TFieldComponents extends Record<string, Component<any>> = Record<
    never,
    never
  >,
> = FieldGroupApi<FieldGroupFieldData<TFields>, TFieldComponents> & {
  readonly [fieldGroupFieldsSymbol]: TFields
  readonly [fieldGroupFieldComponentsSymbol]: TFieldComponents
}
export type FieldGroupFieldComponentsOf<TGroup> = TGroup extends {
  readonly [fieldGroupFieldComponentsSymbol]: infer TComponents extends Record<
    string,
    Component<any>
  >
}
  ? TComponents
  : never
export type FieldGroupForm<
  TFieldComponents extends Record<string, Component<any>> = Record<
    never,
    never
  >,
  TFormData = any,
> = FormApi<TFormData, any> &
  SvelteTanStackFormComponents<TFormData, any, TFieldComponents>
export type FieldGroupFieldBindingForSlot<
  TData,
  TSlot extends AnyFieldGroupFieldSlot,
> =
  TSlot extends FieldGroupFieldSlot<infer TValue, infer TMode>
    ? TMode extends 'strict'
      ? FieldGroupFieldNameForSlot<TData, TSlot>
      : DeepKeysWhereValueIncludes<TData, TValue>
    : never
export type FieldGroupFieldBindings<
  TFields extends FieldGroupFields,
  TData = any,
> = {
  [TName in keyof TFields]: FieldGroupFieldBindingForSlot<TData, TFields[TName]>
}
export type FieldGroupFieldBindingsOf<TGroup, TData> =
  FieldGroupFieldsOf<TGroup> extends FieldGroupFields
    ? FieldGroupFieldBindings<FieldGroupFieldsOf<TGroup>, TData>
    : never
export type FieldGroupFieldsPropName<TProps, TGroup> = {
  [TName in keyof TProps]-?: IsSame<TProps[TName], TGroup> extends true
    ? TName
    : never
}[keyof TProps]

export type FieldGroupWithFieldsFn<
  TGroup extends { readonly [fieldGroupFieldsSymbol]: FieldGroupFields },
> = <
  TProps extends object,
  TPropName extends FieldGroupFieldsPropName<TProps, TGroup>,
>(
  Component: Component<TProps>,
  fieldsPropName: TPropName,
) => (new <TFormData>(
  options: ComponentConstructorOptions<
    Omit<TProps, TPropName | 'form'> & {
      form: FieldGroupForm<FieldGroupFieldComponentsOf<TGroup>, TFormData>
    } & {
      [K in TPropName]: FieldGroupFieldBindingsOf<TGroup, TFormData>
    }
  >,
) => SvelteComponent) &
  Component<any> &
  WithoutFunction<Component>

export interface FieldGroupHelper {
  strict: <TValue>() => StrictFieldGroupFieldSlot<TValue>
  loose: <TValue>() => LooseFieldGroupFieldSlot<TValue>
}

export interface FieldGroupDefinition<
  TFields extends FieldGroupFields,
  TComponents extends Record<string, Component<any>>,
> {
  /** The virtual field-group API injected into the bound component. */
  fields: SvelteFieldGroup<TFields, TComponents>
  /** Binds a component's virtual field API to concrete paths in a form. */
  bindComponent: FieldGroupWithFieldsFn<SvelteFieldGroup<TFields, TComponents>>
}

/** Signature shared by `defineFieldGroup` and app-form field-group definers. */
export type DefineFieldGroupFn<
  TComponents extends Record<string, Component<any>>,
> = <const TFields extends FieldGroupFields>(
  defineFn: (helper: FieldGroupHelper) => TFields,
) => FieldGroupDefinition<TFields, TComponents>

/** Defines a reusable group of virtual fields. */
export const defineFieldGroup: DefineFieldGroupFn<Record<never, never>> =
  defineFieldGroupRuntime as never

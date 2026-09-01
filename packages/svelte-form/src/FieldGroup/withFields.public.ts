import { defineFieldGroupRuntime } from './withFields.lib'
import type {
  FieldGroupFieldBindings,
  FieldGroupFieldBindingsProps,
  FieldGroupFieldData,
  FieldGroupFields,
  FieldGroupFieldsPropName,
  FieldGroupHelper,
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

declare const fieldGroupFieldsSymbol: unique symbol
declare const fieldGroupFieldComponentsSymbol: unique symbol
export type FieldGroupFieldsOf<TGroup> = TGroup extends {
  readonly [fieldGroupFieldsSymbol]: infer TFields extends FieldGroupFields
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
export type FieldGroupFieldBindingsOf<TGroup, TData> =
  FieldGroupFieldsOf<TGroup> extends FieldGroupFields
    ? FieldGroupFieldBindings<FieldGroupFieldsOf<TGroup>, TData>
    : never

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
    } & FieldGroupFieldBindingsProps<
        FieldGroupFieldsOf<TGroup>,
        TFormData,
        TPropName
      >
  >,
) => SvelteComponent) &
  Component<any> &
  WithoutFunction<Component>

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

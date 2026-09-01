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
import type { Component, PublicProps } from 'vue'
import type { VueTanStackFormComponents } from '../VueForm/Components.public'
import type { FieldGroupApi } from './FieldGroupApi.public'
import type { VueComponentInstance } from '../vueTypes.lib'

declare const fieldGroupFieldsSymbol: unique symbol
export type FieldGroupFieldsOf<TFieldGroup> = TFieldGroup extends {
  readonly [fieldGroupFieldsSymbol]: infer TFields extends FieldGroupFields
}
  ? TFields
  : never

export type VueFieldGroup<
  TFields extends FieldGroupFields,
  TFieldComponents extends Record<string, Component> = Record<never, never>,
> = FieldGroupApi<FieldGroupFieldData<TFields>, TFieldComponents> & {
  readonly [fieldGroupFieldsSymbol]: TFields
}
export type FieldGroupFieldComponentsOf<TFieldGroup> =
  TFieldGroup extends VueFieldGroup<any, infer TFieldComponents>
    ? TFieldComponents
    : never
export type FieldGroupForm<
  TFieldComponents extends Record<string, Component> = Record<never, never>,
  TFormData = any,
> = FormApi<TFormData, any> &
  VueTanStackFormComponents<TFormData, any, TFieldComponents>

export type FieldGroupFieldBindingsOf<TFieldGroup, TFormData> =
  FieldGroupFieldsOf<TFieldGroup> extends FieldGroupFields
    ? FieldGroupFieldBindings<FieldGroupFieldsOf<TFieldGroup>, TFormData>
    : never

type FieldsPropsDefinition<
  TFieldGroup extends VueFieldGroup<any, any>,
  TFormData,
  TFieldsPropName extends PropertyKey,
> = {
  [TPropName in TFieldsPropName]: FieldGroupFieldBindingsOf<
    TFieldGroup,
    TFormData
  >
}

type FieldGroupFieldBindingsInstanceProp<
  TFieldGroup extends VueFieldGroup<any, any>,
  TFormData,
  TFieldsPropName extends PropertyKey,
> =
  // The direct branch preserves TFormData inference from Vue component props.
  | FieldsPropsDefinition<TFieldGroup, TFormData, TFieldsPropName>
  | FieldGroupFieldBindingsProps<
      FieldGroupFieldsOf<TFieldGroup>,
      TFormData,
      TFieldsPropName
    >

export type FieldGroupWithFieldsFn<
  TFieldGroup extends VueFieldGroup<any, any>,
> = <TProps extends object, const TFieldsPropName extends PropertyKey>(
  component: Component & (new (props: TProps & PublicProps) => any),
  fieldsPropName: TFieldsPropName &
    FieldGroupFieldsPropName<TProps, TFieldGroup>,
) => new <TFormData>(
  props: Omit<TProps, TFieldsPropName | 'form'> & {
    form: FieldGroupForm<FieldGroupFieldComponentsOf<TFieldGroup>, TFormData>
  } & FieldGroupFieldBindingsProps<
      FieldGroupFieldsOf<TFieldGroup>,
      TFormData,
      TFieldsPropName
    > &
    PublicProps,
) => VueComponentInstance<
  Omit<TProps, TFieldsPropName | 'form'> & {
    form: FieldGroupForm<FieldGroupFieldComponentsOf<TFieldGroup>, TFormData>
  } & FieldGroupFieldBindingsInstanceProp<
      TFieldGroup,
      TFormData,
      TFieldsPropName
    > &
    Record<string, any>,
  {}
>

export interface FieldGroupDefinition<
  TFields extends FieldGroupFields,
  TFieldComponents extends Record<string, Component>,
> {
  /** The virtual field-group API injected into the bound component. */
  fields: VueFieldGroup<TFields, TFieldComponents>
  /** Binds a component's virtual field API to concrete paths in a form. */
  bindComponent: FieldGroupWithFieldsFn<
    VueFieldGroup<TFields, TFieldComponents>
  >
}

/** Signature shared by `defineFieldGroup` and app-form field-group definers. */
export type DefineFieldGroupFn<
  TFieldComponents extends Record<string, Component>,
> = <const TFields extends FieldGroupFields>(
  defineFn: (helper: FieldGroupHelper) => TFields,
) => FieldGroupDefinition<TFields, TFieldComponents>

/** Defines a reusable group of virtual fields. */
export const defineFieldGroup: DefineFieldGroupFn<Record<never, never>> =
  defineFieldGroupRuntime as never

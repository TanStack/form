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
import type { FunctionComponent } from 'preact/compat'
import type { CrossVersionPreactNode } from '../preactTypes.public'
import type { PreactTanStackFormComponents } from '../PreactForm/Components.public'
import type { FieldGroupApi } from './FieldGroupApi.public'

declare const fieldGroupFieldsSymbol: unique symbol

export type FieldGroupFieldsOf<TFieldGroup> = TFieldGroup extends {
  readonly [fieldGroupFieldsSymbol]: infer TFields extends FieldGroupFields
}
  ? TFields
  : never

export type PreactFieldGroup<
  TFields extends FieldGroupFields,
  TFieldComponents extends Record<string, FunctionComponent<any>> = Record<
    never,
    never
  >,
> = FieldGroupApi<FieldGroupFieldData<TFields>, TFieldComponents> & {
  readonly [fieldGroupFieldsSymbol]: TFields
}

export type FieldGroupFieldComponentsOf<TFieldGroup> =
  TFieldGroup extends PreactFieldGroup<any, infer TFieldComponents>
    ? TFieldComponents
    : never

export type FieldGroupForm<
  TFieldComponents extends Record<string, FunctionComponent<any>> = Record<
    never,
    never
  >,
  TFormData = any,
> = FormApi<TFormData, any> &
  PreactTanStackFormComponents<TFormData, any, TFieldComponents>

export type FieldGroupFieldBindingsOf<TFieldGroup, TFormData> =
  FieldGroupFieldsOf<TFieldGroup> extends FieldGroupFields
    ? FieldGroupFieldBindings<FieldGroupFieldsOf<TFieldGroup>, TFormData>
    : never

export type FieldGroupWithFieldsFn<
  TFieldGroup extends PreactFieldGroup<any, any>,
> = <
  TProps extends object,
  TFieldsPropName extends FieldGroupFieldsPropName<TProps, TFieldGroup>,
>(
  Component: (props: TProps) => CrossVersionPreactNode,
  fieldsPropName: TFieldsPropName,
) => <TFormData>(
  props: Omit<TProps, TFieldsPropName | 'form'> & {
    form: FieldGroupForm<FieldGroupFieldComponentsOf<TFieldGroup>, TFormData>
  } & FieldGroupFieldBindingsProps<
      FieldGroupFieldsOf<TFieldGroup>,
      TFormData,
      TFieldsPropName
    >,
) => CrossVersionPreactNode

export interface FieldGroupDefinition<
  TFields extends FieldGroupFields,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> {
  /** The virtual field-group API injected into the bound component. */
  fields: PreactFieldGroup<TFields, TFieldComponents>
  /** Binds a component's virtual field API to concrete paths in a form. */
  bindComponent: FieldGroupWithFieldsFn<
    PreactFieldGroup<TFields, TFieldComponents>
  >
}

/** Signature shared by `defineFieldGroup` and app-form field-group definers. */
export type DefineFieldGroupFn<
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = <const TFields extends FieldGroupFields>(
  defineFn: (helper: FieldGroupHelper) => TFields,
) => FieldGroupDefinition<TFields, TFieldComponents>

/** Defines a reusable group of virtual fields. */
export const defineFieldGroup: DefineFieldGroupFn<Record<never, never>> =
  defineFieldGroupRuntime as never

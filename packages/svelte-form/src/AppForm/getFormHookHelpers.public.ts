import { brandComponentFactory, wrapField } from './fieldComponentHelpers.lib'
import type { Component, ComponentProps } from 'svelte'
import type { FieldWithValue } from '@tanstack/form-core'

type ExactFieldBrand<out TValue> = {
  readonly __tanstackFieldExactType: TValue
}
type AcceptsFieldBrand<out TAcceptedValue> = {
  readonly __tanstackFieldAcceptsType: TAcceptedValue
}
type AnyFieldComponent = Component<any>
type PropsOf<TComponent extends AnyFieldComponent> = ComponentProps<TComponent>
type FieldValuePropKeys<TProps> = {
  [K in keyof TProps]-?: TProps[K] extends FieldWithValue<any> ? K : never
}[keyof TProps]
type FieldValueFromProp<TProp> =
  TProp extends FieldWithValue<infer TValue> ? TValue : never
type PublicPropsReplacingField<
  TProps,
  TFieldPropKey extends keyof TProps,
> = Omit<TProps, TFieldPropKey>

type StrictInjectedFieldComponent<
  TComponent extends AnyFieldComponent,
  TProps = PropsOf<TComponent>,
  TFieldPropKey extends FieldValuePropKeys<TProps> = FieldValuePropKeys<TProps>,
> = Component<PublicPropsReplacingField<TProps, TFieldPropKey>> &
  ExactFieldBrand<FieldValueFromProp<TProps[TFieldPropKey]>>
type LooseInjectedFieldComponent<
  TComponent extends AnyFieldComponent,
  TProps = PropsOf<TComponent>,
  TFieldPropKey extends FieldValuePropKeys<TProps> = FieldValuePropKeys<TProps>,
> = Component<PublicPropsReplacingField<TProps, TFieldPropKey>> &
  AcceptsFieldBrand<FieldValueFromProp<TProps[TFieldPropKey]>>

interface FieldComponentHelper {
  strict: <
    TComponent extends AnyFieldComponent,
    TProps = PropsOf<TComponent>,
    TFieldPropKey extends FieldValuePropKeys<TProps> =
      FieldValuePropKeys<TProps>,
  >(
    Component: TComponent,
    fieldPropKey: TFieldPropKey,
  ) => StrictInjectedFieldComponent<TComponent, TProps, TFieldPropKey>
  loose: <
    TComponent extends AnyFieldComponent,
    TProps = PropsOf<TComponent>,
    TFieldPropKey extends FieldValuePropKeys<TProps> =
      FieldValuePropKeys<TProps>,
  >(
    Component: TComponent,
    fieldPropKey: TFieldPropKey,
  ) => LooseInjectedFieldComponent<TComponent, TProps, TFieldPropKey>
}

interface FieldBrandHelper {
  strict: <TValue>() => <TComponent extends AnyFieldComponent>(
    component: TComponent,
  ) => TComponent & ExactFieldBrand<TValue>
  loose: <TValue>() => <TComponent extends AnyFieldComponent>(
    component: TComponent,
  ) => TComponent & AcceptsFieldBrand<TValue>
}

export interface FormHookHelpers {
  fieldBrand: FieldBrandHelper
  fieldComponent: FieldComponentHelper
}

export function getFormHookHelpers(): FormHookHelpers {
  return {
    fieldComponent: {
      strict: wrapField as FieldComponentHelper['strict'],
      loose: wrapField as FieldComponentHelper['loose'],
    },
    fieldBrand: {
      strict: brandComponentFactory as FieldBrandHelper['strict'],
      loose: brandComponentFactory as FieldBrandHelper['loose'],
    },
  }
}

import { brandComponentFactory, wrapField } from './fieldComponentHelpers.lib'
import type { FieldWithValue } from '@tanstack/form-core'
import type { Component, PublicProps } from 'vue'
import type { VueComponentInstance } from '../vueTypes.lib'

type ExactFieldBrand<out TValue> = {
  readonly __tanstackFieldExactType: TValue
}

type AcceptsFieldBrand<out TAcceptedValue> = {
  readonly __tanstackFieldAcceptsType: TAcceptedValue
}

type AnyFieldComponent = Component
type PropsOf<TComponent> = TComponent extends new (...args: any[]) => {
  $props: infer TProps
}
  ? Omit<TProps, keyof PublicProps>
  : never
type FieldValuePropKeys<TProps> = {
  [K in keyof TProps]-?: TProps[K] extends FieldWithValue<any> ? K : never
}[keyof TProps]
type FieldValueFromProp<TProp> =
  TProp extends FieldWithValue<infer TValue> ? TValue : never
type FieldValueFromComponentProp<
  TProps,
  TFieldPropKey extends keyof TProps,
> = FieldValueFromProp<TProps[TFieldPropKey]>
type PublicPropsReplacingField<
  TProps,
  TFieldPropKey extends keyof TProps,
> = Omit<TProps, TFieldPropKey>

type StrictInjectedFieldComponent<
  TComponent extends AnyFieldComponent,
  TProps = PropsOf<TComponent>,
  TFieldPropKey extends FieldValuePropKeys<TProps> = FieldValuePropKeys<TProps>,
> = (new (
  props: PublicPropsReplacingField<TProps, TFieldPropKey> & PublicProps,
) => VueComponentInstance<
  PublicPropsReplacingField<TProps, TFieldPropKey> & Record<string, any>,
  {}
>) &
  ExactFieldBrand<FieldValueFromComponentProp<TProps, TFieldPropKey>>

type LooseInjectedFieldComponent<
  TComponent extends AnyFieldComponent,
  TProps = PropsOf<TComponent>,
  TFieldPropKey extends FieldValuePropKeys<TProps> = FieldValuePropKeys<TProps>,
> = (new (
  props: PublicPropsReplacingField<TProps, TFieldPropKey> & PublicProps,
) => VueComponentInstance<
  PublicPropsReplacingField<TProps, TFieldPropKey> & Record<string, any>,
  {}
>) &
  AcceptsFieldBrand<FieldValueFromComponentProp<TProps, TFieldPropKey>>

type StrictBrandedFieldComponent<TComponent, TValue> = TComponent &
  ExactFieldBrand<TValue>
type LooseBrandedFieldComponent<TComponent, TValue> = TComponent &
  AcceptsFieldBrand<TValue>

interface FieldComponentHelper {
  strict: <
    TComponent extends AnyFieldComponent,
    TProps = PropsOf<TComponent>,
    TFieldPropKey extends FieldValuePropKeys<TProps> =
      FieldValuePropKeys<TProps>,
  >(
    component: TComponent,
    fieldPropKey: TFieldPropKey,
  ) => StrictInjectedFieldComponent<TComponent, TProps, TFieldPropKey>
  loose: <
    TComponent extends AnyFieldComponent,
    TProps = PropsOf<TComponent>,
    TFieldPropKey extends FieldValuePropKeys<TProps> =
      FieldValuePropKeys<TProps>,
  >(
    component: TComponent,
    fieldPropKey: TFieldPropKey,
  ) => LooseInjectedFieldComponent<TComponent, TProps, TFieldPropKey>
}

interface FieldBrandHelper {
  strict: <TValue>() => <TComponent extends AnyFieldComponent>(
    component: TComponent,
  ) => StrictBrandedFieldComponent<TComponent, TValue>
  loose: <TValue>() => <TComponent extends AnyFieldComponent>(
    component: TComponent,
  ) => LooseBrandedFieldComponent<TComponent, TValue>
}

export interface FormHookHelpers {
  fieldBrand: FieldBrandHelper
  fieldComponent: FieldComponentHelper
}

export function getFormHookHelpers(): FormHookHelpers {
  return {
    fieldComponent: {
      loose: wrapField as FieldComponentHelper['loose'],
      strict: wrapField as FieldComponentHelper['strict'],
    },
    fieldBrand: {
      loose: brandComponentFactory as FieldBrandHelper['loose'],
      strict: brandComponentFactory as FieldBrandHelper['strict'],
    },
  }
}

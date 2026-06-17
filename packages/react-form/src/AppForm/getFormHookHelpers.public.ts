import { brandComponentFactory, wrapField } from './fieldComponentHelpers.lib'
import type { CrossVersionReactNode } from '../reactTypes.public'
import type { FieldWithValue } from '@tanstack/form-core'

type ExactFieldBrand<out TValue> = {
  readonly __tanstackFieldExactType: TValue
}

type AcceptsFieldBrand<out TAcceptedValue> = {
  readonly __tanstackFieldAcceptsType: TAcceptedValue
}

type AnyFieldComponent = (props: any) => CrossVersionReactNode

type PropsOf<TComponent> = TComponent extends (
  props: infer TProps,
) => CrossVersionReactNode
  ? TProps
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
> = ((
  props: PublicPropsReplacingField<TProps, TFieldPropKey>,
) => React.ReactNode) &
  ExactFieldBrand<FieldValueFromComponentProp<TProps, TFieldPropKey>>

type LooseInjectedFieldComponent<
  TComponent extends AnyFieldComponent,
  TProps = PropsOf<TComponent>,
  TFieldPropKey extends FieldValuePropKeys<TProps> = FieldValuePropKeys<TProps>,
> = ((
  props: PublicPropsReplacingField<TProps, TFieldPropKey>,
) => React.ReactNode) &
  AcceptsFieldBrand<FieldValueFromComponentProp<TProps, TFieldPropKey>>

type StrictBrandedFieldComponent<
  TComponent extends AnyFieldComponent,
  TValue,
> = TComponent & ExactFieldBrand<TValue>

type LooseBrandedFieldComponent<
  TComponent extends AnyFieldComponent,
  TAcceptedValue,
> = TComponent & AcceptsFieldBrand<TAcceptedValue>

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
    Component: TComponent,
  ) => StrictBrandedFieldComponent<TComponent, TValue>

  loose: <TValue>() => <TComponent extends AnyFieldComponent>(
    Component: TComponent,
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

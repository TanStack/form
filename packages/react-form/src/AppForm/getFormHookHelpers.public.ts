import { brandComponentFactory, wrapField } from './fieldComponentHelpers.lib'
import type { CrossVersionReactNode } from '../reactTypes.public'
import type { FieldWithValue } from '@tanstack/form-core-v2'

type ExactFieldBrand<TValue> = {
  readonly __tanstackFieldExactType: TValue
}

type AcceptsFieldBrand<TAcceptedValue> = {
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
  TComponent,
  TFieldPropKey extends keyof PropsOf<TComponent>,
> = FieldValueFromProp<PropsOf<TComponent>[TFieldPropKey]>

type PublicPropsReplacingField<
  TComponent,
  TFieldPropKey extends keyof PropsOf<TComponent>,
> = Omit<PropsOf<TComponent>, TFieldPropKey>

type StrictInjectedFieldComponent<
  TComponent extends AnyFieldComponent,
  TFieldPropKey extends FieldValuePropKeys<PropsOf<TComponent>>,
> = ((
  props: PublicPropsReplacingField<TComponent, TFieldPropKey>,
) => React.ReactNode) &
  ExactFieldBrand<FieldValueFromComponentProp<TComponent, TFieldPropKey>>

type LooseInjectedFieldComponent<
  TComponent extends AnyFieldComponent,
  TFieldPropKey extends FieldValuePropKeys<PropsOf<TComponent>>,
> = ((
  props: PublicPropsReplacingField<TComponent, TFieldPropKey>,
) => React.ReactNode) &
  AcceptsFieldBrand<FieldValueFromComponentProp<TComponent, TFieldPropKey>>

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
    TFieldPropKey extends FieldValuePropKeys<PropsOf<TComponent>>,
  >(
    Component: TComponent,
    fieldPropKey: TFieldPropKey,
  ) => StrictInjectedFieldComponent<TComponent, TFieldPropKey>

  loose: <
    TComponent extends AnyFieldComponent,
    TFieldPropKey extends FieldValuePropKeys<PropsOf<TComponent>>,
  >(
    Component: TComponent,
    fieldPropKey: TFieldPropKey,
  ) => LooseInjectedFieldComponent<TComponent, TFieldPropKey>
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

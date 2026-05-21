import React, { useContext } from 'react'
import { FormContext, useFieldContext } from './contexts.lib'
import type { FieldWithValue } from '@tanstack/form-core-v2'
import type { CrossVersionReactNode } from '../types.public'
import type { FunctionComponent } from 'react'
import type { ReactFormApi } from '../ReactForm/useForm.public'

declare const fieldTypeBrand: unique symbol
declare const fieldTypeAcceptsBrand: unique symbol

type AnyComponent = (props: any) => CrossVersionReactNode

type PropsOf<TComponent> = TComponent extends (
  props: infer TProps,
) => CrossVersionReactNode
  ? TProps
  : never

type ExactFieldBrand<TValue> = {
  [fieldTypeBrand]: TValue
}

type AcceptsFieldBrand<TAcceptedValue> = {
  [fieldTypeAcceptsBrand]: TAcceptedValue
}

type IsSame<TTypeA, TTypeB> = [TTypeA] extends [TTypeB]
  ? [TTypeB] extends [TTypeA]
    ? true
    : false
  : false

type ExactBrandValue<T> =
  T extends ExactFieldBrand<infer TValue> ? TValue : never

type AcceptsBrandValue<T> =
  T extends AcceptsFieldBrand<infer TValue> ? TValue : never

type HasExactBrand<T> = T extends ExactFieldBrand<any> ? true : false

type HasAcceptsBrand<T> = T extends AcceptsFieldBrand<any> ? true : false

type CompatibleFieldKey<TKey, TComponent, TTargetValue> =
  HasExactBrand<TComponent> extends true
    ? IsSame<ExactBrandValue<TComponent>, TTargetValue> extends true
      ? TKey
      : never
    : HasAcceptsBrand<TComponent> extends true
      ? [TTargetValue] extends [AcceptsBrandValue<TComponent>]
        ? TKey
        : never
      : TKey

export type FieldComponentsMatchingType<
  TFieldComponents extends Record<string, FunctionComponent<any>>,
  TTargetValue,
> = {
  [K in keyof TFieldComponents as CompatibleFieldKey<
    K,
    TFieldComponents[K],
    TTargetValue
  >]: TFieldComponents[K]
}

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

export type StrictInjectedFieldComponent<
  TComponent extends AnyComponent,
  TFieldPropKey extends FieldValuePropKeys<PropsOf<TComponent>>,
> = ((
  props: PublicPropsReplacingField<TComponent, TFieldPropKey>,
) => React.ReactNode) &
  ExactFieldBrand<FieldValueFromComponentProp<TComponent, TFieldPropKey>>

export type LooseInjectedFieldComponent<
  TComponent extends AnyComponent,
  TFieldPropKey extends FieldValuePropKeys<PropsOf<TComponent>>,
> = ((
  props: PublicPropsReplacingField<TComponent, TFieldPropKey>,
) => React.ReactNode) &
  AcceptsFieldBrand<FieldValueFromComponentProp<TComponent, TFieldPropKey>>

export type StrictBrandedFieldComponent<
  TComponent extends AnyComponent,
  TValue,
> = TComponent & ExactFieldBrand<TValue>

export type LooseBrandedFieldComponent<
  TComponent extends AnyComponent,
  TAcceptedValue,
> = TComponent & AcceptsFieldBrand<TAcceptedValue>

export interface FieldComponentHelper {
  strict: <
    TComponent extends AnyComponent,
    TFieldPropKey extends FieldValuePropKeys<PropsOf<TComponent>>,
  >(
    Component: TComponent,
    fieldPropKey: TFieldPropKey,
  ) => StrictInjectedFieldComponent<TComponent, TFieldPropKey>

  loose: <
    TComponent extends AnyComponent,
    TFieldPropKey extends FieldValuePropKeys<PropsOf<TComponent>>,
  >(
    Component: TComponent,
    fieldPropKey: TFieldPropKey,
  ) => LooseInjectedFieldComponent<TComponent, TFieldPropKey>
}

export interface FieldBrandHelper {
  strict: <TValue>() => <TComponent extends AnyComponent>(
    Component: TComponent,
  ) => StrictBrandedFieldComponent<TComponent, TValue>

  loose: <TValue>() => <TComponent extends AnyComponent>(
    Component: TComponent,
  ) => LooseBrandedFieldComponent<TComponent, TValue>
}

function wrapField(
  Component: AnyComponent,
  fieldPropKey: string,
): AnyComponent {
  const Wrapper: FunctionComponent<any> = function TanStackFormFieldWrapper(
    props,
  ) {
    const field = useFieldContext()

    const newProps = { ...props, [fieldPropKey]: field }

    return <Component {...newProps} />
  }

  Wrapper.displayName = 'TanStackForm.FieldComponent'

  return Wrapper as never
}

function brandComponentFactory(): (component: AnyComponent) => AnyComponent {
  return (component) => component
}

export interface FormHookContexts {
  useFormContext: () => ReactFormApi<
    any,
    any,
    any,
    Record<never, never>,
    Record<never, never>
  >
  fieldBrand: FieldBrandHelper
  fieldComponent: FieldComponentHelper
}

// TODO perhaps this should be returned from a `createHelper` or something similar?
// This can always be imported, but isn't always useful. Maybe that would also help with bundle size.
export function createFormHookContexts(): FormHookContexts {
  function useFormContext() {
    const form = useContext(FormContext)
    if (form === null) {
      throw new Error(
        'TanStack Form: Form components must be used within a `form.AppForm` component.',
      )
    }

    return form
  }

  return {
    useFormContext,
    fieldComponent: {
      loose: wrapField as never,
      strict: wrapField as never,
    },
    fieldBrand: {
      loose: brandComponentFactory as never,
      strict: brandComponentFactory as never,
    },
  }
}

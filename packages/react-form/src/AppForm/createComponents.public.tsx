import { useFieldContext } from './contexts.lib'
import type { FieldWithValue } from '@tanstack/form-core-v2'
import type { CrossVersionReactNode } from '../types.public'
import type { FunctionComponent } from 'react'

declare const fieldTypeBrand: unique symbol
declare const fieldTypeAcceptsBrand: unique symbol

type AnyComponent = (props: any) => CrossVersionReactNode

type PropsOf<TComponent> = TComponent extends (
  props: infer TProps,
) => CrossVersionReactNode
  ? TProps
  : never

type FieldValueFromProps<TComponent> =
  PropsOf<TComponent> extends {
    field: FieldWithValue<infer TValue>
  }
    ? TValue
    : never

type PublicProps<TComponent> =
  PropsOf<TComponent> extends infer TProps
    ? TProps extends { field: FieldWithValue<any> }
      ? Omit<TProps, 'field'>
      : TProps
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

export type StrictFieldComponent<TComponent extends AnyComponent> = ((
  props: PublicProps<TComponent>,
) => React.ReactNode) &
  ExactFieldBrand<FieldValueFromProps<TComponent>>

export function createStrictFieldComponent<TComponent extends AnyComponent>(
  Component: TComponent,
): StrictFieldComponent<TComponent> {
  const Wrapped: FunctionComponent<any> = (props: any) => {
    const field = useFieldContext()

    return Component({
      ...props,
      field,
    })
  }

  Wrapped.displayName = 'TanStackForm.FieldComponent'

  return Wrapped as StrictFieldComponent<TComponent>
}

export type LooseFieldComponent<TComponent extends AnyComponent> = ((
  props: PublicProps<TComponent>,
) => React.ReactNode) &
  AcceptsFieldBrand<FieldValueFromProps<TComponent>>

export function createLooseFieldComponent<TComponent extends AnyComponent>(
  Component: TComponent,
): LooseFieldComponent<TComponent> {
  const Wrapped: FunctionComponent<any> = (props: any) => {
    const field = useFieldContext()

    return Component({
      ...props,
      field,
    })
  }

  Wrapped.displayName = 'TanStackForm.FieldComponent'

  return Wrapped as LooseFieldComponent<TComponent>
}

// TODO test with generic components that DO NOT depend on the field API's value

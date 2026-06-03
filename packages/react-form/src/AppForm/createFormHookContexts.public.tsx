import { useContext } from 'react'
import { FormContext } from './contexts.lib'
import { brandComponentFactory, wrapField } from './fieldComponentHelpers.lib'
import type React from 'react'
import type { FieldWithValue } from '@tanstack/form-core-v2'
import type { DefaultReactFormComponentMap } from './componentMap.public'
import type { ReactFormApi } from '../ReactForm/formApiTypes.public'
import type { CrossVersionReactNode } from '../reactTypes.public'

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

export interface FormHookContexts {
  useFormContext: () => ReactFormApi<
    any,
    any,
    any,
    DefaultReactFormComponentMap
  >
  fieldBrand: FieldBrandHelper
  fieldComponent: FieldComponentHelper
}

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

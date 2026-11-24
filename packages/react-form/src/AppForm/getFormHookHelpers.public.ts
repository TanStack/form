import { fieldComponentFactory } from './fieldComponentHelpers.lib'
import { prepareFormComponent } from './formComponentHelpers.lib'
import { createFormContext } from './formContextHelpers.lib'
import type { FormComponentHelper } from './formComponentHelpers.public'
import type { FormContextHelper } from './formContextHelpers.public'
import type { FieldWithValue } from '@tanstack/form-core'
import type { ReactNode } from 'react'

type ExactFieldBrand<out TValue> = {
  readonly __tanstackFieldExactType: TValue
}

type AcceptsFieldBrand<out TAcceptedValue> = {
  readonly __tanstackFieldAcceptsType: TAcceptedValue
}

type FieldComponentMode = 'strict' | 'loose'

type FieldBrand<
  TMode extends FieldComponentMode,
  TValue,
> = TMode extends 'strict' ? ExactFieldBrand<TValue> : AcceptsFieldBrand<TValue>

type AnyFieldComponent = (props: any) => ReactNode

type PropsOf<TComponent> = TComponent extends (props: infer TProps) => ReactNode
  ? TProps
  : never

type CheckForField<TValue, K> = unknown extends TValue
  ? never
  : NonNullable<TValue> extends FieldWithValue<any>
    ? K
    : never

type FilteredValueProps<TProps> = {
  [K in keyof TProps]-?: CheckForField<TProps[K], K>
}

type FieldValuePropKeys<TProps> = FilteredValueProps<TProps>[keyof TProps]

type FieldValueFromProp<TProp> =
  TProp extends FieldWithValue<infer TValue> ? TValue : never

type InferredFieldValue<TProps> = [FieldValuePropKeys<TProps>] extends [never]
  ? unknown
  : FieldValueFromProp<TProps[FieldValuePropKeys<TProps>]>

type FieldComponentValue<TExplicit, TValue, TInferredValue> =
  TExplicit extends true ? TValue : TInferredValue

type FieldComponentPropValue<TExplicit, TValue, TProp> = FieldComponentValue<
  TExplicit,
  TValue,
  FieldValueFromProp<TProp>
>

// Users might explicitly specify T, or we infer. So
// we intersect with unknown or never to make sure that
// T agrees with the field being specified.
type FieldInjectionConstraint<TExplicit, TValue, TProp> = [
  FieldWithValue<FieldComponentPropValue<TExplicit, TValue, TProp>>,
] extends [NonNullable<TProp>]
  ? unknown
  : never

type InjectableFieldPropKey<
  TProps,
  TFieldPropKey extends keyof TProps,
  TExplicit,
  TValue,
> = TFieldPropKey &
  FieldInjectionConstraint<TExplicit, TValue, TProps[TFieldPropKey]>

type PreservedFieldComponent<
  TMode extends FieldComponentMode,
  TComponent extends AnyFieldComponent,
  TValue,
> = NoInfer<TComponent> & FieldBrand<TMode, TValue>

type InjectedFieldComponent<
  TMode extends FieldComponentMode,
  TProps,
  TFieldPropKey extends keyof TProps,
  TValue,
> = ((props: Omit<TProps, TFieldPropKey>) => ReactNode) &
  FieldBrand<TMode, TValue>

interface FieldComponentPreparer<
  TMode extends FieldComponentMode,
  TValue = never,
  TExplicit extends boolean = false,
> {
  <TComponent extends AnyFieldComponent>(
    Component: TComponent,
  ): PreservedFieldComponent<
    TMode,
    TComponent,
    FieldComponentValue<
      TExplicit,
      TValue,
      InferredFieldValue<PropsOf<TComponent>>
    >
  >

  <
    TComponent extends AnyFieldComponent,
    TFieldPropKey extends FieldValuePropKeys<PropsOf<TComponent>>,
  >(
    Component: TComponent,
    fieldPropKey: InjectableFieldPropKey<
      PropsOf<TComponent>,
      TFieldPropKey,
      TExplicit,
      TValue
    >,
  ): InjectedFieldComponent<
    TMode,
    PropsOf<TComponent>,
    TFieldPropKey,
    FieldComponentPropValue<
      TExplicit,
      TValue,
      PropsOf<TComponent>[TFieldPropKey]
    >
  >
}

interface FieldComponentFactory<TMode extends FieldComponentMode> {
  (): FieldComponentPreparer<TMode>
  <TValue>(): FieldComponentPreparer<TMode, TValue, true>
}

/**
 * Prepares field components for registration with `createFormHook`.
 *
 * The helpers control which field value types expose each registered component
 * in TypeScript. They can also inject the current field API into a component prop.
 */
export interface FieldComponentHelper {
  strict: FieldComponentFactory<'strict'>
  loose: FieldComponentFactory<'loose'>
}

/**
 * Prepares reusable components for registration with `createFormHook`.
 *
 * Obtain these helpers from {@link getFormHookHelpers}.
 */
export interface FormHookHelpers {
  /**
   * Prepares field components with value-type matching and optional field API
   * injection. Register the results in `createFormHook`'s `fieldComponents`.
   */
  fieldComponent: FieldComponentHelper
  formComponent: FormComponentHelper
  formContext: FormContextHelper
}

export function getFormHookHelpers(): FormHookHelpers {
  return {
    formComponent: { create: prepareFormComponent },
    formContext: { create: createFormContext },
    fieldComponent: {
      loose: fieldComponentFactory,
      strict: fieldComponentFactory,
    } as FieldComponentHelper,
  }
}

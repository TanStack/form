import type { FieldWithValue } from '@tanstack/form-core'
import type { ReactNode } from 'react'
import type { AcceptsFieldBrand, ExactFieldBrand } from './fieldComponent.lib'

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
  CheckForField<TProps[TFieldPropKey], TFieldPropKey> &
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
> = ((
  props: TProps extends unknown ? Omit<TProps, TFieldPropKey> : never,
) => ReactNode) &
  FieldBrand<TMode, TValue>

interface FieldComponentWithoutPropOptions<
  TComponent extends AnyFieldComponent,
> {
  component: TComponent
  replaceProperty?: never
}

interface FieldComponentWithPropOptions<
  TComponent extends AnyFieldComponent,
  TFieldPropKey extends keyof PropsOf<TComponent>,
  TValue,
  TExplicit extends boolean,
> {
  component: TComponent
  replaceProperty: InjectableFieldPropKey<
    PropsOf<TComponent>,
    TFieldPropKey,
    TExplicit,
    TValue
  >
}

interface FieldComponentPreparer<
  TMode extends FieldComponentMode,
  TValue = never,
  TExplicit extends boolean = false,
> {
  <
    TComponent extends AnyFieldComponent,
    // The default lets IDEs suggest autocompletes. Once the user picked a value,
    // it'll only evaluate that one. Lets us save lots of type instantiations.
    TFieldPropKey extends keyof PropsOf<TComponent> = FieldValuePropKeys<
      PropsOf<TComponent>
    >,
  >(
    options: FieldComponentWithPropOptions<
      TComponent,
      TFieldPropKey,
      TValue,
      TExplicit
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

  <TComponent extends AnyFieldComponent>(
    options: FieldComponentWithoutPropOptions<TComponent>,
  ): PreservedFieldComponent<
    TMode,
    TComponent,
    FieldComponentValue<
      TExplicit,
      TValue,
      InferredFieldValue<PropsOf<TComponent>>
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

import type { FormApi, ScopedErrorTypes } from '@tanstack/form-core'
import type { ExoticComponent, FunctionComponent, ReactNode } from 'react'
import type {
  ReactComponentTree,
  ReactFormComponentMap,
  ReactFormComponents,
} from '../componentMap.public'
import type { ReactFormApi } from '../../ReactForm/formApiTypes.public'

declare const formComponentSymbol: unique symbol

// Props keep this type-only requirement available through React.memo/lazy.
export type FormComponentProps<TForm> = {
  readonly [formComponentSymbol]?: TForm
}

type GetProps<TComponent extends FunctionComponent<any>> =
  TComponent extends FunctionComponent<infer TProps> ? TProps : never

// Small example for why the double symbol guard is needed: Record<symbol, unknown>
type HasFormComponentProps<TProps> = symbol extends keyof TProps
  ? false
  : typeof formComponentSymbol extends keyof TProps
    ? unknown extends TProps[typeof formComponentSymbol]
      ? false
      : true
    : false

type BoundFormComponent<TComponent> =
  TComponent extends FunctionComponent<infer TProps>
    ? HasFormComponentProps<TProps> extends true
      ? (props: Omit<TProps, typeof formComponentSymbol>) => ReactNode
      : TComponent extends ExoticComponent<any>
        ? (props: TProps) => ReactNode
        : TComponent
    : never

export type BoundFormComponents<TComponents extends ReactFormComponents> = {
  [K in keyof TComponents]: BoundFormComponent<TComponents[K]>
}

type AcceptsRegisteredForm<
  TForm,
  TFormComponents extends ReactFormComponents,
  TFieldComponents extends ReactComponentTree,
> =
  ReactFormApi<
    any,
    any,
    ReactFormComponentMap<
      BoundFormComponents<TFormComponents>,
      TFieldComponents
    >
  > extends NonNullable<TForm>
    ? true
    : false

type CompatibleFormComponent<
  TComponent,
  TFormComponents extends ReactFormComponents,
  TFieldComponents extends ReactComponentTree,
> =
  TComponent extends FunctionComponent<infer TProps>
    ? HasFormComponentProps<TProps> extends true
      ? AcceptsRegisteredForm<
          TProps[typeof formComponentSymbol & keyof TProps],
          TFormComponents,
          TFieldComponents
        > extends true
        ? TComponent
        : never
      : TComponent
    : never

export type CompatibleFormComponents<
  TComponents,
  TFormComponents extends ReactFormComponents,
  TFieldComponents extends ReactComponentTree,
> = {
  [K in keyof TComponents]: CompatibleFormComponent<
    TComponents[K],
    TFormComponents,
    TFieldComponents
  >
}

type AcceptsAnyForm<T> = unknown extends T
  ? false
  : [NonNullable<T>] extends [FormApi<infer TFormData, infer TFormError>]
    ? unknown extends TFormData
      ? ScopedErrorTypes extends TFormError
        ? true
        : false
      : false
    : false

type FormPropKey<TProp, TKey> =
  AcceptsAnyForm<TProp> extends true ? TKey & string : never

type FilteredFormProps<TProps> = {
  [K in keyof TProps]-?: FormPropKey<TProps[K], K>
}

type FormPropKeys<TProps> = unknown extends TProps
  ? keyof TProps & string
  : FilteredFormProps<TProps>[keyof TProps]

type RegisteredComponentProps<
  TComponent extends FunctionComponent<any>,
  TPropKey extends keyof GetProps<TComponent> & string,
> = Omit<GetProps<TComponent>, TPropKey> &
  FormComponentProps<NonNullable<GetProps<TComponent>[TPropKey]>>

/**
 * A component prepared by `formComponent.create()` to receive a form API through a
 * selected prop.
 *
 * Register the component in `createFormHook`'s `formComponents` to expose it on
 * each form API. Callers supply the remaining props.
 *
 * @remarks
 * **Important:** Render the component as a registered form component, such as
 * `<form.Save />`, or inside one. Rendering outside that form context throws an
 * error, even if a form prop is supplied.
 *
 * @typeParam TComponent - Library-managed. Do not specify explicitly.
 * @typeParam TPropKey - Library-managed. Do not specify explicitly.
 *
 * @example
 * ```tsx
 * const { formComponent } = getFormHookHelpers()
 *
 * function SaveButton({ owner, label }: { owner: AnyReactFormApi; label: string }) {
 *   return (
 *     <button type="button" onClick={() => void owner.handleSubmit()}>
 *       {label}
 *     </button>
 *   )
 * }
 *
 * const Save = formComponent.create(SaveButton, 'owner')
 *
 * const { useAppForm } = createFormHook({
 *   fieldComponents: {},
 *   formComponents: { Save },
 * })
 *
 * function Profile() {
 *   const form = useAppForm({ defaultValues: { name: '' } })
 *   // The form supplies `owner`. Callers supply `label`.
 *   return <form.Save label="Save profile" />
 * }
 * ```
 */
export interface FormComponentRegistration<
  TComponent extends FunctionComponent<any>,
  TPropKey extends keyof GetProps<TComponent> & string,
> extends FunctionComponent<RegisteredComponentProps<TComponent, TPropKey>> {}

/**
 * Prepares reusable components to receive the form API from a registered form
 * component.
 *
 * Obtain this helper from `getFormHookHelpers().formComponent`.
 */
export interface FormComponentHelper {
  /**
   * Injects the nearest registered form component's form API into the selected prop.
   *
   * The prop must accept any form values and errors, such as `AnyReactFormApi`.
   * Register the result in `createFormHook`'s `formComponents`.
   * Callers supply only the remaining props.
   *
   * @remarks
   * **Important:** Render the result as a registered form component or inside one.
   * Rendering outside that context throws an error.
   *
   * @typeParam TComponent - Library-managed. Do not specify explicitly.
   * @typeParam TPropKey - Library-managed. Do not specify explicitly.
   *
   * @example
   * ```tsx
   * function ResetButtonComponent({ form }: { form: AnyReactFormApi }) {
   *   return <button type="button" onClick={() => form.reset()}>Reset</button>
   * }
   *
   * const { formComponent } = getFormHookHelpers()
   *
   * const ResetButton = formComponent.create(ResetButtonComponent, 'form')
   *
   *
   * const { useAppForm } = createFormHook({
   *   fieldComponents: {},
   *   formComponents: {
   *     ResetButton
   *   },
   * })
   * ```
   */
  create<
    TComponent extends FunctionComponent<any>,
    TPropKey extends FormPropKeys<GetProps<TComponent>>,
  >(
    Component: TComponent,
    formPropKey: TPropKey,
  ): FormComponentRegistration<TComponent, TPropKey>
}

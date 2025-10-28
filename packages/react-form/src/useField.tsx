import React, { useMemo, useState } from 'react'
import { useStore } from '@tanstack/react-store'
import { FieldApi, functionalUpdate } from '@tanstack/form-core'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'
import type {
  DeepKeys,
  DeepValue,
  FieldAsyncValidateOrFn,
  FieldValidateOrFn,
  FieldValidators,
  FormAsyncValidateOrFn,
  FormValidateOrFn,
} from '@tanstack/form-core'
import type { FunctionComponent, ReactNode } from 'react'
import type { UseFieldOptions, UseFieldOptionsBound } from './types'

interface ReactFieldApi<
  TParentData,
  TFormOnMount extends undefined | FormValidateOrFn<TParentData>,
  TFormOnChange extends undefined | FormValidateOrFn<TParentData>,
  TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnBlur extends undefined | FormValidateOrFn<TParentData>,
  TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnSubmit extends undefined | FormValidateOrFn<TParentData>,
  TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnDynamic extends undefined | FormValidateOrFn<TParentData>,
  TFormOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnServer extends undefined | FormAsyncValidateOrFn<TParentData>,
  TPatentSubmitMeta,
> {
  /**
   * A pre-bound and type-safe sub-field component using this field as a root.
   */
  Field: FieldComponent<
    TParentData,
    TFormOnMount,
    TFormOnChange,
    TFormOnChangeAsync,
    TFormOnBlur,
    TFormOnBlurAsync,
    TFormOnSubmit,
    TFormOnSubmitAsync,
    TFormOnDynamic,
    TFormOnDynamicAsync,
    TFormOnServer,
    TPatentSubmitMeta
  >
}

/**
 * A type representing a hook for using a field in a form with the given form data type.
 *
 * A function that takes an optional object with a `name` property and field options, and returns a `FieldApi` instance for the specified field.
 */
export type UseField<
  TParentData,
  TFormOnMount extends undefined | FormValidateOrFn<TParentData>,
  TFormOnChange extends undefined | FormValidateOrFn<TParentData>,
  TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnBlur extends undefined | FormValidateOrFn<TParentData>,
  TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnSubmit extends undefined | FormValidateOrFn<TParentData>,
  TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnDynamic extends undefined | FormValidateOrFn<TParentData>,
  TFormOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnServer extends undefined | FormAsyncValidateOrFn<TParentData>,
  TPatentSubmitMeta,
> = <
  TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName>,
  TOnMount extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnChange extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnChangeAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnBlur extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnBlurAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnSubmit extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnSubmitAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnDynamic extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnDynamicAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
>(
  opts: UseFieldOptionsBound<
    TParentData,
    TName,
    TData,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnDynamic,
    TOnDynamicAsync
  >,
) => FieldApi<
  TParentData,
  TName,
  TData,
  TOnMount,
  TOnChange,
  TOnChangeAsync,
  TOnBlur,
  TOnBlurAsync,
  TOnSubmit,
  TOnSubmitAsync,
  TOnDynamic,
  TOnDynamicAsync,
  TFormOnMount,
  TFormOnChange,
  TFormOnChangeAsync,
  TFormOnBlur,
  TFormOnBlurAsync,
  TFormOnSubmit,
  TFormOnSubmitAsync,
  TFormOnDynamic,
  TFormOnDynamicAsync,
  TFormOnServer,
  TPatentSubmitMeta
>

/**
 * A hook for managing a field in a form.
 * @param opts An object with field options.
 *
 * @returns The `FieldApi` instance for the specified field.
 */
export function useField<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName>,
  TOnMount extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnChange extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnChangeAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnBlur extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnBlurAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnSubmit extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnSubmitAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnDynamic extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnDynamicAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TFormOnMount extends undefined | FormValidateOrFn<TParentData>,
  TFormOnChange extends undefined | FormValidateOrFn<TParentData>,
  TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnBlur extends undefined | FormValidateOrFn<TParentData>,
  TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnSubmit extends undefined | FormValidateOrFn<TParentData>,
  TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnDynamic extends undefined | FormValidateOrFn<TParentData>,
  TFormOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnServer extends undefined | FormAsyncValidateOrFn<TParentData>,
  TPatentSubmitMeta,
>(
  opts: UseFieldOptions<
    TParentData,
    TName,
    TData,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnDynamic,
    TOnDynamicAsync,
    TFormOnMount,
    TFormOnChange,
    TFormOnChangeAsync,
    TFormOnBlur,
    TFormOnBlurAsync,
    TFormOnSubmit,
    TFormOnSubmitAsync,
    TFormOnDynamic,
    TFormOnDynamicAsync,
    TFormOnServer,
    TPatentSubmitMeta
  >,
) {
  const [fieldApi] = useState(() => {
    const api = new FieldApi({
      ...opts,
      form: opts.form,
      name: opts.name,
    })

    const extendedApi: typeof api &
      ReactFieldApi<
        TParentData,
        TFormOnMount,
        TFormOnChange,
        TFormOnChangeAsync,
        TFormOnBlur,
        TFormOnBlurAsync,
        TFormOnSubmit,
        TFormOnSubmitAsync,
        TFormOnDynamic,
        TFormOnDynamicAsync,
        TFormOnServer,
        TPatentSubmitMeta
      > = api as never

    extendedApi.Field = Field as never

    return extendedApi
  })

  useIsomorphicLayoutEffect(fieldApi.mount, [fieldApi])

  /**
   * fieldApi.update should not have any side effects. Think of it like a `useRef`
   * that we need to keep updated every render with the most up-to-date information.
   */
  useIsomorphicLayoutEffect(() => {
    fieldApi.update(opts)
  })

  useStore(
    fieldApi.store,
    opts.mode === 'array'
      ? (state) => {
          return [
            state.meta,
            Object.keys((state.value as unknown) ?? []).length,
          ]
        }
      : undefined,
  )

  return fieldApi
}

/**
 * @param children A render function that takes a field API instance and returns a React element.
 */
interface FieldComponentProps<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName>,
  TOnMount extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnChange extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnChangeAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnBlur extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnBlurAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnSubmit extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnSubmitAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnDynamic extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnDynamicAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TFormOnMount extends undefined | FormValidateOrFn<TParentData>,
  TFormOnChange extends undefined | FormValidateOrFn<TParentData>,
  TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnBlur extends undefined | FormValidateOrFn<TParentData>,
  TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnSubmit extends undefined | FormValidateOrFn<TParentData>,
  TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnDynamic extends undefined | FormValidateOrFn<TParentData>,
  TFormOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnServer extends undefined | FormAsyncValidateOrFn<TParentData>,
  TPatentSubmitMeta,
  ExtendedApi = {},
> extends UseFieldOptions<
    TParentData,
    TName,
    TData,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnDynamic,
    TOnDynamicAsync,
    TFormOnMount,
    TFormOnChange,
    TFormOnChangeAsync,
    TFormOnBlur,
    TFormOnBlurAsync,
    TFormOnSubmit,
    TFormOnSubmitAsync,
    TFormOnDynamic,
    TFormOnDynamicAsync,
    TFormOnServer,
    TPatentSubmitMeta
  > {
  children: (
    fieldApi: FieldApi<
      TParentData,
      TName,
      TData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnDynamic,
      TOnDynamicAsync,
      TFormOnMount,
      TFormOnChange,
      TFormOnChangeAsync,
      TFormOnBlur,
      TFormOnBlurAsync,
      TFormOnSubmit,
      TFormOnSubmitAsync,
      TFormOnDynamic,
      TFormOnDynamicAsync,
      TFormOnServer,
      TPatentSubmitMeta
    > &
      ExtendedApi,
  ) => ReactNode
}

interface FieldComponentBoundProps<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName>,
  TOnMount extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnChange extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnChangeAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnBlur extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnBlurAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnSubmit extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnSubmitAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnDynamic extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnDynamicAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TFormOnMount extends undefined | FormValidateOrFn<TParentData>,
  TFormOnChange extends undefined | FormValidateOrFn<TParentData>,
  TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnBlur extends undefined | FormValidateOrFn<TParentData>,
  TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnSubmit extends undefined | FormValidateOrFn<TParentData>,
  TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnDynamic extends undefined | FormValidateOrFn<TParentData>,
  TFormOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnServer extends undefined | FormAsyncValidateOrFn<TParentData>,
  TPatentSubmitMeta,
  ExtendedApi = {},
> extends UseFieldOptionsBound<
    TParentData,
    TName,
    TData,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnDynamic,
    TOnDynamicAsync
  > {
  children: (
    fieldApi: FieldApi<
      TParentData,
      TName,
      TData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnDynamic,
      TOnDynamicAsync,
      TFormOnMount,
      TFormOnChange,
      TFormOnChangeAsync,
      TFormOnBlur,
      TFormOnBlurAsync,
      TFormOnSubmit,
      TFormOnSubmitAsync,
      TFormOnDynamic,
      TFormOnDynamicAsync,
      TFormOnServer,
      TPatentSubmitMeta
    > &
      ExtendedApi,
  ) => ReactNode
}

/**
 * A type alias representing a field component for a specific form data type.
 */
export type FieldComponent<
  in out TParentData,
  in out TFormOnMount extends undefined | FormValidateOrFn<TParentData>,
  in out TFormOnChange extends undefined | FormValidateOrFn<TParentData>,
  in out TFormOnChangeAsync extends
    | undefined
    | FormAsyncValidateOrFn<TParentData>,
  in out TFormOnBlur extends undefined | FormValidateOrFn<TParentData>,
  in out TFormOnBlurAsync extends
    | undefined
    | FormAsyncValidateOrFn<TParentData>,
  in out TFormOnSubmit extends undefined | FormValidateOrFn<TParentData>,
  in out TFormOnSubmitAsync extends
    | undefined
    | FormAsyncValidateOrFn<TParentData>,
  in out TFormOnDynamic extends undefined | FormValidateOrFn<TParentData>,
  in out TFormOnDynamicAsync extends
    | undefined
    | FormAsyncValidateOrFn<TParentData>,
  in out TFormOnServer extends undefined | FormAsyncValidateOrFn<TParentData>,
  in out TPatentSubmitMeta,
  in out ExtendedApi = {},
> = <
  const TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName>,
  TOnMount extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnChange extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnChangeAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnBlur extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnBlurAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnSubmit extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnSubmitAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnDynamic extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnDynamicAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
>({
  children,
  ...fieldOptions
}: FieldComponentBoundProps<
  TParentData,
  TName,
  TData,
  TOnMount,
  TOnChange,
  TOnChangeAsync,
  TOnBlur,
  TOnBlurAsync,
  TOnSubmit,
  TOnSubmitAsync,
  TOnDynamic,
  TOnDynamicAsync,
  TFormOnMount,
  TFormOnChange,
  TFormOnChangeAsync,
  TFormOnBlur,
  TFormOnBlurAsync,
  TFormOnSubmit,
  TFormOnSubmitAsync,
  TFormOnDynamic,
  TFormOnDynamicAsync,
  TFormOnServer,
  TPatentSubmitMeta,
  ExtendedApi
>) => ReactNode

/**
 * A type alias representing a field component for a form lens data type.
 */
export type LensFieldComponent<
  in out TLensData,
  in out TParentSubmitMeta,
  in out ExtendedApi = {},
> = <
  const TName extends DeepKeys<TLensData>,
  TData extends DeepValue<TLensData, TName>,
  TOnMount extends undefined | FieldValidateOrFn<unknown, string, TData>,
  TOnChange extends undefined | FieldValidateOrFn<unknown, string, TData>,
  TOnChangeAsync extends
    | undefined
    | FieldAsyncValidateOrFn<unknown, string, TData>,
  TOnBlur extends undefined | FieldValidateOrFn<unknown, string, TData>,
  TOnBlurAsync extends
    | undefined
    | FieldAsyncValidateOrFn<unknown, string, TData>,
  TOnSubmit extends undefined | FieldValidateOrFn<unknown, string, TData>,
  TOnSubmitAsync extends
    | undefined
    | FieldAsyncValidateOrFn<unknown, string, TData>,
  TOnDynamic extends undefined | FieldValidateOrFn<unknown, string, TData>,
  TOnDynamicAsync extends
    | undefined
    | FieldAsyncValidateOrFn<unknown, string, TData>,
>({
  children,
  ...fieldOptions
}: Omit<
  FieldComponentBoundProps<
    unknown,
    string,
    TData,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnDynamic,
    TOnDynamicAsync,
    undefined | FormValidateOrFn<unknown>,
    undefined | FormValidateOrFn<unknown>,
    undefined | FormAsyncValidateOrFn<unknown>,
    undefined | FormValidateOrFn<unknown>,
    undefined | FormAsyncValidateOrFn<unknown>,
    undefined | FormValidateOrFn<unknown>,
    undefined | FormAsyncValidateOrFn<unknown>,
    undefined | FormValidateOrFn<unknown>,
    undefined | FormAsyncValidateOrFn<unknown>,
    undefined | FormAsyncValidateOrFn<unknown>,
    TParentSubmitMeta,
    ExtendedApi
  >,
  'name' | 'validators'
> & {
  name: TName
  validators?: Omit<
    FieldValidators<
      unknown,
      string,
      TData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnDynamic,
      TOnDynamicAsync
    >,
    'onChangeListenTo' | 'onBlurListenTo'
  > & {
    /**
     * An optional list of field names that should trigger this field's `onChange` and `onChangeAsync` events when its value changes
     */
    onChangeListenTo?: DeepKeys<TLensData>[]
    /**
     * An optional list of field names that should trigger this field's `onBlur` and `onBlurAsync` events when its value changes
     */
    onBlurListenTo?: DeepKeys<TLensData>[]
  }
}) => ReactNode

/**
 * A function component that takes field options and a render function as children and returns a React component.
 *
 * The `Field` component uses the `useField` hook internally to manage the field instance.
 */
export const Field = (<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName>,
  TOnMount extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnChange extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnChangeAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnBlur extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnBlurAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnSubmit extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnSubmitAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TOnDynamic extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
  TOnDynamicAsync extends
    | undefined
    | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  TFormOnMount extends undefined | FormValidateOrFn<TParentData>,
  TFormOnChange extends undefined | FormValidateOrFn<TParentData>,
  TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnBlur extends undefined | FormValidateOrFn<TParentData>,
  TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnSubmit extends undefined | FormValidateOrFn<TParentData>,
  TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnDynamic extends undefined | FormValidateOrFn<TParentData>,
  TFormOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnServer extends undefined | FormAsyncValidateOrFn<TParentData>,
  TPatentSubmitMeta,
>({
  children,
  ...fieldOptions
}: FieldComponentProps<
  TParentData,
  TName,
  TData,
  TOnMount,
  TOnChange,
  TOnChangeAsync,
  TOnBlur,
  TOnBlurAsync,
  TOnSubmit,
  TOnSubmitAsync,
  TOnDynamic,
  TOnDynamicAsync,
  TFormOnMount,
  TFormOnChange,
  TFormOnChangeAsync,
  TFormOnBlur,
  TFormOnBlurAsync,
  TFormOnSubmit,
  TFormOnSubmitAsync,
  TFormOnDynamic,
  TFormOnDynamicAsync,
  TFormOnServer,
  TPatentSubmitMeta
>): ReactNode => {
  const fieldApi = useField(fieldOptions as any)

  const jsxToDisplay = useMemo(
    () => functionalUpdate(children, fieldApi as any),
    /**
     * The reason this exists is to fix an issue with the React Compiler.
     * Namely, functionalUpdate is memoized where it checks for `fieldApi`, which is a static type.
     * This means that when `state.value` changes, it does not trigger a re-render. The useMemo explicitly fixes this problem
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [children, fieldApi, fieldApi.state.value, fieldApi.state.meta],
  )
  return (<>{jsxToDisplay}</>) as never
}) satisfies FunctionComponent<
  FieldComponentProps<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >
>

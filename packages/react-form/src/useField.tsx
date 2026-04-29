'use client'

import { useMemo, useRef, useState } from 'react'
import { useStore } from '@tanstack/react-store'
import { FieldApi, functionalUpdate } from '@tanstack/form-core'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'
import type {
  AnyFieldApi,
  AnyFieldMeta,
  AnyFieldMetaBase,
  DeepKeys,
  DeepValue,
  FieldAsyncValidateOrFn,
  FieldListeners,
  FieldValidateOrFn,
  FieldValidators,
  FormAsyncValidateOrFn,
  FormValidateOrFn,
  StandardSchemaV1,
  Updater,
} from '@tanstack/form-core'
import type { FunctionComponent, ReactElement, ReactNode } from 'react'
import type { UseFieldOptions, UseFieldOptionsBound } from './types'

type WidenMeta<TMeta> = {
  [TKey in keyof TMeta]: TMeta[TKey] extends boolean
    ? boolean
    : TMeta[TKey] extends number
      ? number
      : TMeta[TKey] extends string
        ? string
        : TMeta[TKey]
}

type MergeMeta<TFormMeta, TFieldMeta> = Omit<TFormMeta, keyof TFieldMeta> &
  TFieldMeta

type FieldApiWithCustomMeta<TFieldApi, TCustomMeta> = {
  readonly state: TFieldApi extends { readonly state: infer TState }
    ? TState extends { meta: infer TMeta }
      ? Omit<TState, 'meta'> & { meta: TMeta & WidenMeta<TCustomMeta> }
      : TState
    : never
  getMeta: () => TFieldApi extends { getMeta: () => infer TMeta }
    ? TMeta & WidenMeta<TCustomMeta>
    : AnyFieldMeta & WidenMeta<TCustomMeta>
  setMeta: (updater: Updater<AnyFieldMetaBase & WidenMeta<TCustomMeta>>) => void
} & TFieldApi

type FieldValidatorApiWithCustomMeta<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName>,
  TCustomMeta,
> = FieldApiWithCustomMeta<
  FieldApi<
    TParentData,
    TName,
    TData,
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
  >,
  TCustomMeta
>

type FieldValidateFnWithCustomMeta<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName>,
  TCustomMeta,
> = (props: {
  value: TData
  fieldApi: FieldValidatorApiWithCustomMeta<
    TParentData,
    TName,
    TData,
    TCustomMeta
  >
}) => unknown

type FieldAsyncValidateFnWithCustomMeta<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName>,
  TCustomMeta,
> = (props: {
  value: TData
  fieldApi: FieldValidatorApiWithCustomMeta<
    TParentData,
    TName,
    TData,
    TCustomMeta
  >
  signal: AbortSignal
}) => unknown | Promise<unknown>

type FieldValidateOrFnWithCustomMeta<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName>,
  TCustomMeta,
> =
  | FieldValidateFnWithCustomMeta<TParentData, TName, TData, TCustomMeta>
  | StandardSchemaV1<TData, unknown>

type FieldAsyncValidateOrFnWithCustomMeta<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName>,
  TCustomMeta,
> =
  | FieldAsyncValidateFnWithCustomMeta<TParentData, TName, TData, TCustomMeta>
  | StandardSchemaV1<TData, unknown>

type CoreFieldValidateOrFn<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName>,
  TValidator,
> = TValidator extends undefined
  ? undefined
  : TValidator extends StandardSchemaV1<TData, unknown>
    ? TValidator
    : TValidator extends (...args: any) => infer TReturn
      ? (props: { value: TData; fieldApi: any }) => TReturn
      : never

type CoreFieldAsyncValidateOrFn<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName>,
  TValidator,
> = TValidator extends undefined
  ? undefined
  : TValidator extends StandardSchemaV1<TData, unknown>
    ? TValidator
    : TValidator extends (...args: any) => infer TReturn
      ? (props: { value: TData; fieldApi: any; signal: AbortSignal }) => TReturn
      : never

type FieldValidatorsWithCustomMeta<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName>,
  TCustomMeta,
  TOnMount extends
    | undefined
    | FieldValidateOrFnWithCustomMeta<TParentData, TName, TData, TCustomMeta>,
  TOnChange extends
    | undefined
    | FieldValidateOrFnWithCustomMeta<TParentData, TName, TData, TCustomMeta>,
  TOnChangeAsync extends
    | undefined
    | FieldAsyncValidateOrFnWithCustomMeta<
        TParentData,
        TName,
        TData,
        TCustomMeta
      >,
  TOnBlur extends
    | undefined
    | FieldValidateOrFnWithCustomMeta<TParentData, TName, TData, TCustomMeta>,
  TOnBlurAsync extends
    | undefined
    | FieldAsyncValidateOrFnWithCustomMeta<
        TParentData,
        TName,
        TData,
        TCustomMeta
      >,
  TOnSubmit extends
    | undefined
    | FieldValidateOrFnWithCustomMeta<TParentData, TName, TData, TCustomMeta>,
  TOnSubmitAsync extends
    | undefined
    | FieldAsyncValidateOrFnWithCustomMeta<
        TParentData,
        TName,
        TData,
        TCustomMeta
      >,
  TOnDynamic extends
    | undefined
    | FieldValidateOrFnWithCustomMeta<TParentData, TName, TData, TCustomMeta>,
  TOnDynamicAsync extends
    | undefined
    | FieldAsyncValidateOrFnWithCustomMeta<
        TParentData,
        TName,
        TData,
        TCustomMeta
      >,
> = Omit<
  FieldValidators<
    TParentData,
    TName,
    TData,
    CoreFieldValidateOrFn<TParentData, TName, TData, TOnMount>,
    CoreFieldValidateOrFn<TParentData, TName, TData, TOnChange>,
    CoreFieldAsyncValidateOrFn<TParentData, TName, TData, TOnChangeAsync>,
    CoreFieldValidateOrFn<TParentData, TName, TData, TOnBlur>,
    CoreFieldAsyncValidateOrFn<TParentData, TName, TData, TOnBlurAsync>,
    CoreFieldValidateOrFn<TParentData, TName, TData, TOnSubmit>,
    CoreFieldAsyncValidateOrFn<TParentData, TName, TData, TOnSubmitAsync>,
    CoreFieldValidateOrFn<TParentData, TName, TData, TOnDynamic>,
    CoreFieldAsyncValidateOrFn<TParentData, TName, TData, TOnDynamicAsync>
  >,
  | 'onMount'
  | 'onChange'
  | 'onChangeAsync'
  | 'onBlur'
  | 'onBlurAsync'
  | 'onSubmit'
  | 'onSubmitAsync'
  | 'onDynamic'
  | 'onDynamicAsync'
> & {
  onMount?: TOnMount
  onChange?: TOnChange
  onChangeAsync?: TOnChangeAsync
  onBlur?: TOnBlur
  onBlurAsync?: TOnBlurAsync
  onSubmit?: TOnSubmit
  onSubmitAsync?: TOnSubmitAsync
  onDynamic?: TOnDynamic
  onDynamicAsync?: TOnDynamicAsync
}

type FieldListenersWithCustomMeta<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName>,
  TCustomMeta,
> = Omit<
  FieldListeners<TParentData, TName, TData>,
  'onChange' | 'onBlur' | 'onMount' | 'onUnmount' | 'onSubmit'
> & {
  onChange?: FieldListenerFnWithCustomMeta<
    TParentData,
    TName,
    TData,
    TCustomMeta
  >
  onBlur?: FieldListenerFnWithCustomMeta<TParentData, TName, TData, TCustomMeta>
  onMount?: FieldListenerFnWithCustomMeta<
    TParentData,
    TName,
    TData,
    TCustomMeta
  >
  onUnmount?: FieldListenerFnWithCustomMeta<
    TParentData,
    TName,
    TData,
    TCustomMeta
  >
  onSubmit?: FieldListenerFnWithCustomMeta<
    TParentData,
    TName,
    TData,
    TCustomMeta
  >
}

type FieldListenerFnWithCustomMeta<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName>,
  TCustomMeta,
> = (props: {
  value: TData
  fieldApi: FieldValidatorApiWithCustomMeta<
    TParentData,
    TName,
    TData,
    TCustomMeta
  >
}) => void

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
  // Keep a snapshot of options so that React Compiler doesn't
  // wrongly optimize fieldApi.
  const [prevOptions, setPrevOptions] = useState(() => ({
    form: opts.form,
    name: opts.name,
  }))

  const [fieldApi, setFieldApi] = useState(() => {
    return new FieldApi({
      ...opts,
    })
  })

  // We only want to
  // update on name changes since those are at risk of becoming stale. The field
  // state must be up to date for the internal JSX render.
  // The other options can freely be in `fieldApi.update`
  if (prevOptions.form !== opts.form || prevOptions.name !== opts.name) {
    setFieldApi(
      new FieldApi({
        ...opts,
      }),
    )
    setPrevOptions({ form: opts.form, name: opts.name })
  }

  // For array mode, only track length changes to avoid re-renders when child properties change
  // See: https://github.com/TanStack/form/issues/1925
  const reactiveStateValue = useStore(
    fieldApi.store,
    (opts.mode === 'array'
      ? (state) => Object.keys((state.value as unknown) ?? []).length
      : (state) => state.value) as (
      state: typeof fieldApi.state,
    ) => TData | number,
  )

  const reactiveMeta = useStore(fieldApi.store, (state) => state.meta)

  // This makes me sad, but if I understand correctly, this is what we have to do for reactivity to work properly with React compiler.
  const extendedFieldApi = useMemo(() => {
    const reactiveFieldApi = {
      ...fieldApi,
      get state() {
        return {
          // For array mode, reactiveStateValue is the length (for reactivity tracking),
          // so we need to get the actual value from fieldApi
          value:
            opts.mode === 'array' ? fieldApi.state.value : reactiveStateValue,
          meta: reactiveMeta,
        } satisfies AnyFieldApi['state']
      },
    }

    const extendedApi: FieldApi<
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
      > = reactiveFieldApi as never

    extendedApi.Field = Field as never

    return extendedApi
  }, [fieldApi, opts.mode, reactiveStateValue, reactiveMeta])

  useIsomorphicLayoutEffect(fieldApi.mount, [fieldApi])

  /**
   * fieldApi.update should not have any side effects. Think of it like a `useRef`
   * that we need to keep updated every render with the most up-to-date information.
   */
  useIsomorphicLayoutEffect(() => {
    fieldApi.update(opts)
  })

  return extendedFieldApi
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
  in out TFormMeta = {},
> = <
  const TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName>,
  const TFieldMeta extends object,
  TOnMount extends
    | undefined
    | FieldValidateOrFnWithCustomMeta<
        TParentData,
        TName,
        TData,
        MergeMeta<TFormMeta, TFieldMeta>
      >,
  TOnChange extends
    | undefined
    | FieldValidateOrFnWithCustomMeta<
        TParentData,
        TName,
        TData,
        MergeMeta<TFormMeta, TFieldMeta>
      >,
  TOnChangeAsync extends
    | undefined
    | FieldAsyncValidateOrFnWithCustomMeta<
        TParentData,
        TName,
        TData,
        MergeMeta<TFormMeta, TFieldMeta>
      >,
  TOnBlur extends
    | undefined
    | FieldValidateOrFnWithCustomMeta<
        TParentData,
        TName,
        TData,
        MergeMeta<TFormMeta, TFieldMeta>
      >,
  TOnBlurAsync extends
    | undefined
    | FieldAsyncValidateOrFnWithCustomMeta<
        TParentData,
        TName,
        TData,
        MergeMeta<TFormMeta, TFieldMeta>
      >,
  TOnSubmit extends
    | undefined
    | FieldValidateOrFnWithCustomMeta<
        TParentData,
        TName,
        TData,
        MergeMeta<TFormMeta, TFieldMeta>
      >,
  TOnSubmitAsync extends
    | undefined
    | FieldAsyncValidateOrFnWithCustomMeta<
        TParentData,
        TName,
        TData,
        MergeMeta<TFormMeta, TFieldMeta>
      >,
  TOnDynamic extends
    | undefined
    | FieldValidateOrFnWithCustomMeta<
        TParentData,
        TName,
        TData,
        MergeMeta<TFormMeta, TFieldMeta>
      >,
  TOnDynamicAsync extends
    | undefined
    | FieldAsyncValidateOrFnWithCustomMeta<
        TParentData,
        TName,
        TData,
        MergeMeta<TFormMeta, TFieldMeta>
      >,
>({
  children,
  ...fieldOptions
}: Omit<
  FieldComponentBoundProps<
    TParentData,
    TName,
    TData,
    CoreFieldValidateOrFn<TParentData, TName, TData, TOnMount>,
    CoreFieldValidateOrFn<TParentData, TName, TData, TOnChange>,
    CoreFieldAsyncValidateOrFn<TParentData, TName, TData, TOnChangeAsync>,
    CoreFieldValidateOrFn<TParentData, TName, TData, TOnBlur>,
    CoreFieldAsyncValidateOrFn<TParentData, TName, TData, TOnBlurAsync>,
    CoreFieldValidateOrFn<TParentData, TName, TData, TOnSubmit>,
    CoreFieldAsyncValidateOrFn<TParentData, TName, TData, TOnSubmitAsync>,
    CoreFieldValidateOrFn<TParentData, TName, TData, TOnDynamic>,
    CoreFieldAsyncValidateOrFn<TParentData, TName, TData, TOnDynamicAsync>,
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
  >,
  'children' | 'defaultMeta' | 'validators' | 'listeners'
> & {
  defaultMeta?: TFieldMeta
  validators?: FieldValidatorsWithCustomMeta<
    TParentData,
    TName,
    TData,
    MergeMeta<TFormMeta, TFieldMeta>,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnDynamic,
    TOnDynamicAsync
  >
  listeners?: FieldListenersWithCustomMeta<
    TParentData,
    TName,
    TData,
    MergeMeta<TFormMeta, TFieldMeta>
  >
  children: (
    fieldApi: FieldApiWithCustomMeta<
      FieldApi<
        TParentData,
        TName,
        TData,
        CoreFieldValidateOrFn<TParentData, TName, TData, TOnMount>,
        CoreFieldValidateOrFn<TParentData, TName, TData, TOnChange>,
        CoreFieldAsyncValidateOrFn<TParentData, TName, TData, TOnChangeAsync>,
        CoreFieldValidateOrFn<TParentData, TName, TData, TOnBlur>,
        CoreFieldAsyncValidateOrFn<TParentData, TName, TData, TOnBlurAsync>,
        CoreFieldValidateOrFn<TParentData, TName, TData, TOnSubmit>,
        CoreFieldAsyncValidateOrFn<TParentData, TName, TData, TOnSubmitAsync>,
        CoreFieldValidateOrFn<TParentData, TName, TData, TOnDynamic>,
        CoreFieldAsyncValidateOrFn<TParentData, TName, TData, TOnDynamicAsync>,
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
      MergeMeta<TFormMeta, TFieldMeta>
    >,
  ) => ReactNode
}) => ReturnType<FunctionComponent>

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
}) => ReturnType<FunctionComponent>

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
>): ReturnType<FunctionComponent> => {
  const fieldApi = useField(fieldOptions as any)

  const jsxToDisplay = useMemo(
    () => functionalUpdate(children, fieldApi as any),
    [children, fieldApi],
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

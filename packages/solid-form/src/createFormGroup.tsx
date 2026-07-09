import { FormGroupApi, functionalUpdate } from '@tanstack/form-core'
import {
  createComponent,
  createMemo,
  createRenderEffect,
  onSettled,
} from 'solid-js'
import { useStore } from '@tanstack/solid-store'
import type {
  DeepKeys,
  DeepValue,
  FormAsyncValidateOrFn,
  FormGroupApiOptions,
  FormGroupAsyncValidateOrFn,
  FormGroupOptions,
  FormGroupValidateOrFn,
  FormValidateOrFn,
} from '@tanstack/form-core'
import type { Accessor } from 'solid-js'
import type { JSX } from '@solidjs/web'

// ugly way to trick solid into triggering updates for changes on the formGroupApi
function makeFormGroupReactive<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName>,
  TOnMount extends undefined | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnChange extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnChangeAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  TOnBlur extends undefined | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnBlurAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  TOnSubmit extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnSubmitAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  TOnDynamic extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnDynamicAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  TSubmitMeta,
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
  TParentSubmitMeta,
>(
  formGroupApi: FormGroupApi<
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
    TSubmitMeta,
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
    TParentSubmitMeta
  >,
): () => FormGroupApi<
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
  TSubmitMeta,
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
  TParentSubmitMeta
> {
  // Handle shallow comparison to make sure that Derived doesn't create a new setGroup call every time
  const store = useStore(formGroupApi.store, (store) => store)
  return createMemo(
    () => {
      // Use the store to track dependencies
      store()
      return formGroupApi
    },
    { equals: false },
  )
}

export function createFormGroup<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName>,
  TOnMount extends undefined | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnChange extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnChangeAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  TOnBlur extends undefined | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnBlurAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  TOnSubmit extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnSubmitAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  TOnDynamic extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnDynamicAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  TSubmitMeta,
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
  TParentSubmitMeta,
>(
  opts: () => FormGroupApiOptions<
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
    TSubmitMeta,
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
    TParentSubmitMeta
  >,
) {
  const options = opts()

  const api = new FormGroupApi(options)

  let mounted = false
  // Instantiates form group meta and removes it when unrendered
  onSettled(() => {
    const cleanupFn = api.mount()
    mounted = true
    return () => {
      cleanupFn()
      mounted = false
    }
  })

  /**
   * formGroupApi.update should not have any side effects. Think of it like a `useRef`
   * that we need to keep updated every render with the most up-to-date information.
   *
   * createRenderEffect to make sure this effect runs before render effects
   */
  createRenderEffect(
    () => opts(),
    (options) => {
      if (!mounted) return undefined
      api.update(options)
      return undefined
    },
  )

  return makeFormGroupReactive<
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
    TSubmitMeta,
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
    TParentSubmitMeta
  >(api)
}

interface FormGroupComponentBoundProps<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName>,
  TOnMount extends undefined | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnChange extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnChangeAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  TOnBlur extends undefined | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnBlurAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  TOnSubmit extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnSubmitAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  TOnDynamic extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnDynamicAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  TSubmitMeta,
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
  TParentSubmitMeta,
  ExtendedApi = {},
> extends FormGroupOptions<
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
  TSubmitMeta,
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
  TParentSubmitMeta
> {
  children: (
    formGroupApi: Accessor<
      FormGroupApi<
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
        TSubmitMeta,
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
        TParentSubmitMeta
      >
    > &
      ExtendedApi,
  ) => JSX.Element
}

/**
 * A type alias representing a form group component for a specific form data type.
 */
export type FormGroupComponent<
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
  in out TParentSubmitMeta,
  in out ExtendedApi = {},
> = <
  const TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName>,
  TOnMount extends undefined | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnChange extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnChangeAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  TOnBlur extends undefined | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnBlurAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  TOnSubmit extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnSubmitAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  TOnDynamic extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnDynamicAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  TSubmitMeta,
>(
  props: FormGroupComponentBoundProps<
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
    TSubmitMeta,
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
    TParentSubmitMeta,
    ExtendedApi
  >,
) => JSX.Element

interface FormGroupComponentProps<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName>,
  TOnMount extends undefined | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnChange extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnChangeAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  TOnBlur extends undefined | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnBlurAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  TOnSubmit extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnSubmitAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  TOnDynamic extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnDynamicAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  TSubmitMeta,
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
  TParentSubmitMeta,
> extends FormGroupApiOptions<
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
  TSubmitMeta,
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
  TParentSubmitMeta
> {
  children: (
    formGroupApi: () => FormGroupApi<
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
      TSubmitMeta,
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
      TParentSubmitMeta
    >,
  ) => JSX.Element
}

export function FormGroup<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName>,
  TOnMount extends undefined | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnChange extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnChangeAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  TOnBlur extends undefined | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnBlurAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  TOnSubmit extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnSubmitAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  TOnDynamic extends
    | undefined
    | FormGroupValidateOrFn<TParentData, TName, TData>,
  TOnDynamicAsync extends
    | undefined
    | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
  TSubmitMeta,
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
  TParentSubmitMeta,
>(
  props: FormGroupComponentProps<
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
    TSubmitMeta,
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
    TParentSubmitMeta
  >,
) {
  const formGroupApi = createFormGroup<
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
    TSubmitMeta,
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
    TParentSubmitMeta
  >(() => {
    const { children, ...formGroupOptions } = props
    return formGroupOptions
  })

  return <>{createComponent(() => props.children(formGroupApi), {})}</>
}

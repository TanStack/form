<script module lang="ts">
  import {
    type DeepKeys,
    type DeepValue,
    FieldApi,
    type FieldAsyncValidateOrFn,
    type FieldValidateOrFn,
    type FormAsyncValidateOrFn,
    type FormValidateOrFn,
  } from '@tanstack/form-core'
  import { useStore } from '@tanstack/svelte-store'
  import { onMount, type Snippet } from 'svelte'
  import type { CreateFieldOptions } from './types.js'

  export function createField<
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
    TParentSubmitMeta,
  >(
    opts: () => CreateFieldOptions<
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
      TParentSubmitMeta
    >,
  ) {
    const options = opts()

    const api = new FieldApi(options)

    const extendedApi: typeof api = api as never

    let mounted = false
    // Instantiates field meta and removes it when unrendered
    onMount(() => {
      const cleanupFn = api.mount()
      mounted = true
      return () => {
        cleanupFn()
        mounted = false
      }
    })

    $effect.pre(() => {
      // Invoke options function before mounted check, else it wouldn't rerun on changes to options.
      // Changes to options are seen by the effect because signals inside them are picked up.
      const current = opts()
      if (!mounted) return
      api.update(current)
    })

    const storeSub = useStore(api.store, (state) =>
      options.mode === 'array'
        ? state.meta._arrayVersion || 0
        : state.value,
    )
    const metaIsTouchedSub = useStore(
      api.store,
      (state) => state.meta.isTouched,
    )
    const metaIsBlurredSub = useStore(
      api.store,
      (state) => state.meta.isBlurred,
    )
    const metaIsDirtySub = useStore(api.store, (state) => state.meta.isDirty)
    const metaErrorMapSub = useStore(api.store, (state) => state.meta.errorMap)
    const metaErrorSourceMapSub = useStore(
      api.store,
      (state) => state.meta.errorSourceMap,
    )
    const metaIsValidatingSub = useStore(
      api.store,
      (state) => state.meta.isValidating,
    )
    Object.defineProperty(extendedApi, 'state', {
      get() {
        // Read all reactive sources to track them as dependencies. For array
        // mode, `storeSub.current` is the array length so we still pull the
        // actual value from the underlying api state.
        // See: https://github.com/TanStack/form/issues/1961
        // Note: we read from `api.store.state` (not `api.state`) to avoid
        // infinite recursion since this getter shadows the prototype's `state`
        // getter on the same object.
        const trackedValue = storeSub.current
        const isTouched = metaIsTouchedSub.current
        const isBlurred = metaIsBlurredSub.current
        const isDirty = metaIsDirtySub.current
        const errorMap = metaErrorMapSub.current
        const errorSourceMap = metaErrorSourceMapSub.current
        const isValidating = metaIsValidatingSub.current
        const baseState = api.store.state
        return {
          ...baseState,
          value: options.mode === 'array' ? baseState.value : trackedValue,
          meta: {
            ...baseState.meta,
            isTouched,
            isBlurred,
            isDirty,
            errorMap,
            errorSourceMap,
            isValidating,
          },
        }
      },
    })

    return extendedApi
  }
</script>

<script
  lang="ts"
  generics="
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
    TParentSubmitMeta,
"
>
  type Props<
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
    TParentSubmitMeta,
  > = {
    children: Snippet<
      [
        FieldApi<
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
          TParentSubmitMeta
        >,
      ]
    >
  } & CreateFieldOptions<
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
    TParentSubmitMeta
  >

  let {
    children,
    ...fieldOptions
  }: Props<
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
    TParentSubmitMeta
  > = $props()

  const fieldApi = createField<
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
    TParentSubmitMeta
  >(() => {
    return fieldOptions
  })
</script>

{@render children(fieldApi)}

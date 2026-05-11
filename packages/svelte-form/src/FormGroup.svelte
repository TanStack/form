<script module lang="ts">
  import {
    type DeepKeys,
    type DeepValue,
    FormGroupApi,
    type FormGroupApiOptions,
    type FormGroupAsyncValidateOrFn,
    type FormGroupValidateOrFn,
    type FormAsyncValidateOrFn,
    type FormValidateOrFn,
  } from '@tanstack/form-core'
  import { useStore } from '@tanstack/svelte-store'
  import { onMount, type Snippet } from 'svelte'

  export function createFormGroup<
    TParentData,
    TName extends DeepKeys<TParentData>,
    TData extends DeepValue<TParentData, TName>,
    TOnMount extends
      | undefined
      | FormGroupValidateOrFn<TParentData, TName, TData>,
    TOnChange extends
      | undefined
      | FormGroupValidateOrFn<TParentData, TName, TData>,
    TOnChangeAsync extends
      | undefined
      | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
    TOnBlur extends
      | undefined
      | FormGroupValidateOrFn<TParentData, TName, TData>,
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

    const extendedApi: typeof api = api as never

    let mounted = false
    // Instantiates form group meta and removes it when unrendered
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

    const storeSub = useStore(api.store)
    Object.defineProperty(extendedApi, 'state', {
      get() {
        return storeSub.current
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
    TOnMount extends undefined | FormGroupValidateOrFn<TParentData, TName, TData>,
    TOnChange extends undefined | FormGroupValidateOrFn<TParentData, TName, TData>,
    TOnChangeAsync extends
      | undefined
      | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
    TOnBlur extends undefined | FormGroupValidateOrFn<TParentData, TName, TData>,
    TOnBlurAsync extends
      | undefined
      | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
    TOnSubmit extends undefined | FormGroupValidateOrFn<TParentData, TName, TData>,
    TOnSubmitAsync extends
      | undefined
      | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
    TOnDynamic extends undefined | FormGroupValidateOrFn<TParentData, TName, TData>,
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
"
>
  import type { FormGroupApi as FormGroupApiType } from '@tanstack/form-core'

  type Props<
    TParentData,
    TName extends DeepKeys<TParentData>,
    TData extends DeepValue<TParentData, TName>,
    TOnMount extends
      | undefined
      | FormGroupValidateOrFn<TParentData, TName, TData>,
    TOnChange extends
      | undefined
      | FormGroupValidateOrFn<TParentData, TName, TData>,
    TOnChangeAsync extends
      | undefined
      | FormGroupAsyncValidateOrFn<TParentData, TName, TData>,
    TOnBlur extends
      | undefined
      | FormGroupValidateOrFn<TParentData, TName, TData>,
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
  > = {
    children: Snippet<
      [
        FormGroupApiType<
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
      ]
    >
  } & FormGroupApiOptions<
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

  let {
    children,
    ...formGroupOptions
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
  > = $props()

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
    return formGroupOptions
  })
</script>

{@render children(formGroupApi)}

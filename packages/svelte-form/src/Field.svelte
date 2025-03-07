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
  import Field from './Field.svelte'
  import type { CreateFieldOptions, SvelteFieldApi } from './types.js'

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
    TFormOnMount extends undefined | FormValidateOrFn<TParentData>,
    TFormOnChange extends undefined | FormValidateOrFn<TParentData>,
    TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
    TFormOnBlur extends undefined | FormValidateOrFn<TParentData>,
    TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
    TFormOnSubmit extends undefined | FormValidateOrFn<TParentData>,
    TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
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
      TFormOnMount,
      TFormOnChange,
      TFormOnChangeAsync,
      TFormOnBlur,
      TFormOnBlurAsync,
      TFormOnSubmit,
      TFormOnSubmitAsync,
      TFormOnServer,
      TParentSubmitMeta
    >,
  ) {
    const options = opts()

    const api = new FieldApi(options)

    const extendedApi: typeof api &
      SvelteFieldApi<
        TParentData,
        TFormOnMount,
        TFormOnChange,
        TFormOnChangeAsync,
        TFormOnBlur,
        TFormOnBlurAsync,
        TFormOnSubmit,
        TFormOnSubmitAsync,
        TFormOnServer,
        TParentSubmitMeta
      > = api as never

    extendedApi.Field = Field as never

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

    // TODO (43081j): does this do what i think? we don't access anything
    // svelte is aware of, so maybe it'll never call this?
    $effect.pre(() => {
      const current = opts()
      Object.values(current) // make sure we're watching all the things
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
    TFormOnMount extends undefined | FormValidateOrFn<TParentData>,
    TFormOnChange extends undefined | FormValidateOrFn<TParentData>,
    TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
    TFormOnBlur extends undefined | FormValidateOrFn<TParentData>,
    TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
    TFormOnSubmit extends undefined | FormValidateOrFn<TParentData>,
    TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
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
    TFormOnMount extends undefined | FormValidateOrFn<TParentData>,
    TFormOnChange extends undefined | FormValidateOrFn<TParentData>,
    TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
    TFormOnBlur extends undefined | FormValidateOrFn<TParentData>,
    TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
    TFormOnSubmit extends undefined | FormValidateOrFn<TParentData>,
    TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
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
          TFormOnMount,
          TFormOnChange,
          TFormOnChangeAsync,
          TFormOnBlur,
          TFormOnBlurAsync,
          TFormOnSubmit,
          TFormOnSubmitAsync,
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
    TFormOnMount,
    TFormOnChange,
    TFormOnChangeAsync,
    TFormOnBlur,
    TFormOnBlurAsync,
    TFormOnSubmit,
    TFormOnSubmitAsync,
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
    TFormOnMount,
    TFormOnChange,
    TFormOnChangeAsync,
    TFormOnBlur,
    TFormOnBlurAsync,
    TFormOnSubmit,
    TFormOnSubmitAsync,
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
    TFormOnMount,
    TFormOnChange,
    TFormOnChangeAsync,
    TFormOnBlur,
    TFormOnBlurAsync,
    TFormOnSubmit,
    TFormOnSubmitAsync,
    TFormOnServer,
    TParentSubmitMeta
  >(() => {
    return fieldOptions
  })
</script>

{@render children(fieldApi)}

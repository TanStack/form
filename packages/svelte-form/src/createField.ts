import { FieldApi } from '@tanstack/form-core'
import { onDestroy, onMount } from 'svelte'
import Field from './Field.svelte'

import type {
  DeepKeys,
  DeepValue,
  FieldApiOptions,
  Narrow,
  Validator,
} from '@tanstack/form-core'

interface SvelteFieldApi<
  TParentData,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
> {
  Field: Field<TParentData, TFormValidator>
}

export type CreateField<
  TParentData,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
> = <
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
>(
  opts: () => { name: Narrow<TName> } & Omit<
    FieldApiOptions<
      TParentData,
      TName,
      TFieldValidator,
      TFormValidator,
      TData
    >,
    'form'
  >,
) => () => FieldApi<
  TParentData,
  TName,
  TFieldValidator,
  TFormValidator,
  TData
> &
  SvelteFieldApi<TParentData, TFormValidator>

export function createField<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
>(
  opts: () => FieldApiOptions<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  >,
) {
  const options = opts()

  const api = new FieldApi(options)

  const extendedApi: typeof api & SvelteFieldApi<TParentData, TFormValidator> =
    api as never

  extendedApi.Field = Field as never

  let mounted = false
  // Instantiates field meta and removes it when unrendered
  onMount(() => {
    const cleanupFn = api.mount()
    mounted = true
    onDestroy(() => {
      cleanupFn()
      mounted = false
    })
  })

  // TODO (43081j): does this do what i think? we don't access anything
  // svelte is aware of, so maybe it'll never call this?
  $effect(() => {
    if (!mounted) return
    api.update(opts())
  })

  return () => extendedApi
}

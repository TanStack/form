import { FormApi } from '@tanstack/form-core'
import { onMount } from 'svelte'
import { createField } from './createField.js'
import Field from './Field.svelte';
import type { FormOptions, Validator } from '@tanstack/form-core'
import type { CreateField } from './createField.js';

export interface SvelteFormApi<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
> {
  Field: Field<TFormData, TFormValidator>
  createField: CreateField<TFormData, TFormValidator>
}

export function createForm<
  TParentData,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
>(opts?: () => FormOptions<TParentData, TFormValidator>) {
  const options = opts?.()
  const api = new FormApi<TParentData, TFormValidator>(options)
  const extendedApi: typeof api & SvelteFormApi<TParentData, TFormValidator> =
    api as never

  // TODO (43081j): somehow this needs to actually be
  // `<Field ...props form={api}>`.
  // No clue right now how we do that
  extendedApi.Field = Field
  extendedApi.createField = (props) =>
    createField(() => {
      return { ...props(), form: api }
    })

  onMount(api.mount)

  // TODO (43081j): does this actually work? we don't use any observed
  // data, so maybe svelte won't re-run this effect?
  $effect(() => api.update(opts?.()))

  return extendedApi
}

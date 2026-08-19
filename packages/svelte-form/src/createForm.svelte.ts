import { InternalFormApi } from '@tanstack/form-core/internals'
import { useSelector } from '@tanstack/svelte-store'
import { onMount } from 'svelte'
import Field from './Field.svelte'
import FormGroup from './FormGroup.svelte'
import Subscribe from './Subscribe.svelte'
import { withComponentProps } from './utils.lib.js'
import type { FormOptions } from '@tanstack/form-core'
import type { Component } from 'svelte'
import type { AnyInternalFormApi } from '@tanstack/form-core/internals'
import type { SvelteTanStackFormComponents } from './Components.public'

export interface InternalSvelteFormApi
  extends AnyInternalFormApi, SvelteTanStackFormComponents<any, any, any> {
  _Subscribe: Component<any>
  useSelector: <TSelected = any>(
    selector?: (state: any) => TSelected,
  ) => { readonly current: TSelected }
}

export function attachSvelteFormComponents(
  form: AnyInternalFormApi,
  fieldComponents: Record<string, Component<any>> | null,
): InternalSvelteFormApi {
  const result = form as InternalSvelteFormApi

  result.Field = ((internals: any, props: any) =>
    Field(
      internals,
      withComponentProps(props, {
        form,
        fieldComponents: fieldComponents ?? {},
      }),
    )) as never
  result.ArrayField = ((internals: any, props: any) =>
    Field(
      internals,
      withComponentProps(props, {
        form,
        array: true,
        fieldComponents: fieldComponents ?? {},
      }),
    )) as never
  result._Subscribe = (internals, props) => Subscribe(internals, props)
  result.Subscribe = ((internals: any, props: any) =>
    Subscribe(
      internals,
      withComponentProps(props, { source: form.atom }),
    )) as never
  result.FormGroup = ((internals: any, props: any) =>
    FormGroup(internals, withComponentProps(props, { form }))) as never
  result.useSelector = ((selector?: (state: any) => any) =>
    useSelector(form.atom, selector)) as never

  return result
}

export function initializeForm(
  options: FormOptions<any, any, any, unknown>,
): InternalSvelteFormApi {
  return attachSvelteFormComponents(new InternalFormApi(options), null)
}

export function createInternalForm(
  options: () => FormOptions<any, any, any, unknown>,
  initialize: (
    options: FormOptions<any, any, any, unknown>,
  ) => InternalSvelteFormApi,
): InternalSvelteFormApi {
  const form = initialize(options())

  $effect.pre(() => {
    form._update(options())
  })
  onMount(() => form.mount())

  return form
}
